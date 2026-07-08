import { useEditorStore } from '~/stores/editor'
import type { TEditorMode, TFilterName } from '~/types/editor'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']

/**
 * Mediator composable — bridges UI components with the editor store.
 * Handles file loading, validation, debounced updates.
 */
export function useEditor() {
  const store = useEditorStore()

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function debouncedRender(delay = 100) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => store.renderPreview(), delay)
  }

  /** Read a File into a data URL and load it into the store */
  async function handleFileUpload(file: File): Promise<{ success: boolean; error?: string }> {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return { success: false, error: 'Unsupported file type. Use JPEG, PNG, WebP, or BMP.' }
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File is too large. Maximum size is 10 MB.' }
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        store.loadImage(reader.result as string, file.name)
        resolve({ success: true })
      }
      reader.onerror = () => resolve({ success: false, error: 'Failed to read file.' })
      reader.readAsDataURL(file)
    })
  }

  /** Update brightness and re-render preview */
  function setBrightness(value: number) {
    if (value === 0) {
      store.removeOperation('brightness')
    } else {
      store.upsertOperation('brightness', { value })
    }
    debouncedRender()
  }

  /** Update saturation and re-render preview */
  function setSaturation(value: number) {
    if (value === 0) {
      store.removeOperation('saturation')
    } else {
      store.upsertOperation('saturation', { value })
    }
    debouncedRender()
  }

  /** Apply a crop and re-render preview */
  function applyCrop(x: number, y: number, width: number, height: number) {
    store.upsertOperation('crop', { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) })
    store.renderPreview()
  }

  /** Remove existing crop */
  function removeCrop() {
    store.removeOperation('crop')
    store.renderPreview()
  }

  /** Set filter and re-render */
  function setFilter(name: TFilterName, intensity = 100) {
    if (name === 'none') {
      store.removeOperation('filter')
    } else {
      store.upsertOperation('filter', { name, intensity })
    }
    debouncedRender()
  }

  /** Reset all edits */
  function resetAll() {
    store.resetAll()
  }

  /** Switch editor mode */
  function setMode(mode: TEditorMode) {
    store.setMode(mode)
  }

  return {
    handleFileUpload,
    setBrightness,
    setSaturation,
    applyCrop,
    removeCrop,
    setFilter,
    resetAll,
    setMode,
  }
}
