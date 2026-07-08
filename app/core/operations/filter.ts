import type { IImageOperation, TFilterName } from '~/types/editor'
import { registry } from '~/core/registry'

/** Maps filter names to their CSS filter function equivalents */
const FILTER_MAP: Record<Exclude<TFilterName, 'none'>, (intensity: number) => string> = {
  grayscale: (i) => `grayscale(${i}%)`,
  sepia: (i) => `sepia(${i}%)`,
  invert: (i) => `invert(${i}%)`,
}

/** Filter operation — applies named CSS-style filters (grayscale, sepia, invert) */
const filterOperation: IImageOperation = {
  type: 'filter',

  apply(ctx, canvas, params) {
    const name = (params.name as TFilterName) ?? 'none'
    const intensity = (params.intensity as number) ?? 100

    if (name === 'none') return

    const filterFn = FILTER_MAP[name]
    if (!filterFn) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.putImageData(imageData, 0, 0)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = filterFn(intensity)
    ctx.drawImage(tempCanvas, 0, 0)
    ctx.filter = 'none'
  },
}

registry.register(filterOperation)
export default filterOperation
