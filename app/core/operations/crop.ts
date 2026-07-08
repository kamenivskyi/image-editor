import type { IImageOperation } from '~/types/editor'
import { registry } from '~/core/registry'

/** Crop operation — extracts a rectangular region from the canvas */
const cropOperation: IImageOperation = {
  type: 'crop',

  apply(ctx, canvas, params) {
    const x = (params.x as number) ?? 0
    const y = (params.y as number) ?? 0
    const width = (params.width as number) ?? canvas.width
    const height = (params.height as number) ?? canvas.height

    const imageData = ctx.getImageData(x, y, width, height)

    canvas.width = width
    canvas.height = height
    ctx.putImageData(imageData, 0, 0)
  },
}

registry.register(cropOperation)
export default cropOperation
