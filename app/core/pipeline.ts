import type { IOperationDescriptor } from '~/types/editor'
import { registry } from '~/core/registry'

// Ensure all operations are registered
import '~/core/operations/brightness'
import '~/core/operations/saturation'
import '~/core/operations/crop'
import '~/core/operations/filter'

/**
 * Loads an image element from a data URL.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Applies a pipeline of operations to the original image, producing a result canvas.
 * Each operation is fetched from the registry and applied in order.
 */
export async function applyPipeline(
  originalDataUrl: string,
  operations: IOperationDescriptor[],
): Promise<HTMLCanvasElement> {
  const img = await loadImage(originalDataUrl)

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  for (const op of operations) {
    const strategy = registry.getOrThrow(op.type)
    strategy.apply(ctx, canvas, op.params)
  }

  return canvas
}

/**
 * Convenience: runs pipeline and returns a data URL string.
 */
export async function applyPipelineToDataUrl(
  originalDataUrl: string,
  operations: IOperationDescriptor[],
  mimeType = 'image/png',
): Promise<string> {
  const canvas = await applyPipeline(originalDataUrl, operations)
  return canvas.toDataURL(mimeType)
}
