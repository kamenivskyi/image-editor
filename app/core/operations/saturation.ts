import type { IImageOperation } from '~/types/editor'
import { registry } from '~/core/registry'

/** Saturation operation — adjusts color saturation via CSS filter */
const saturationOperation: IImageOperation = {
  type: 'saturation',

  apply(ctx, canvas, params) {
    const value = (params.value as number) ?? 0
    // CSS filter saturate: 1 = normal, 0 = desaturated, 2 = double
    // Map our -100..+100 range to 0..2
    const filterValue = 1 + value / 100

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.putImageData(imageData, 0, 0)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = `saturate(${filterValue})`
    ctx.drawImage(tempCanvas, 0, 0)
    ctx.filter = 'none'
  },
}

registry.register(saturationOperation)
export default saturationOperation
