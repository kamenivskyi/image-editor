import { useEditorStore } from '~/stores/editor'
import { applyPipeline } from '~/core/pipeline'
import type { IExportPayload } from '~/types/editor'

/**
 * Composable for exporting the edited image and operations JSON.
 */
export function useImageExport() {
  const store = useEditorStore()

  /** Trigger a browser file download */
  function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /** Export the edited image as PNG */
  async function exportImage() {
    if (!store.originalImage) return

    const canvas = await applyPipeline(store.originalImage, store.operations)

    canvas.toBlob((blob) => {
      if (!blob) return
      const baseName = store.originalFileName.replace(/\.[^.]+$/, '')
      downloadBlob(blob, `${baseName}_edited.png`)
    }, 'image/png')
  }

  /** Export the operations pipeline as JSON */
  function exportOperationsJSON() {
    const payload: IExportPayload = {
      version: 1,
      originalFileName: store.originalFileName,
      operations: store.operations,
    }

    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const baseName = store.originalFileName.replace(/\.[^.]+$/, '')
    downloadBlob(blob, `${baseName}_operations.json`)
  }

  return {
    exportImage,
    exportOperationsJSON,
  }
}
