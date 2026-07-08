import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IOperationDescriptor, TEditorMode, ICropParams, IAdjustmentParams, IFilterParams } from '~/types/editor'
import { applyPipelineToDataUrl } from '~/core/pipeline'

export const useEditorStore = defineStore('editor', () => {
  // --- State ---
  const originalImage = ref<string | null>(null)
  const originalFileName = ref('')
  const operations = ref<IOperationDescriptor[]>([])
  const previewUrl = ref<string | null>(null)
  const activeMode = ref<TEditorMode>('adjust')
  const isRendering = ref(false)

  // --- Getters ---
  const hasImage = computed(() => !!originalImage.value)
  const hasEdits = computed(() => operations.value.length > 0)

  const currentAdjustments = computed<IAdjustmentParams>(() => {
    const brightness = operations.value.find((o) => o.type === 'brightness')
    const saturation = operations.value.find((o) => o.type === 'saturation')
    return {
      brightness: (brightness?.params.value as number) ?? 0,
      saturation: (saturation?.params.value as number) ?? 0,
    }
  })

  const currentFilter = computed<IFilterParams>(() => {
    const filter = operations.value.find((o) => o.type === 'filter')
    return {
      name: (filter?.params.name as IFilterParams['name']) ?? 'none',
      intensity: (filter?.params.intensity as number) ?? 100,
    }
  })

  const currentCrop = computed<ICropParams | null>(() => {
    const crop = operations.value.find((o) => o.type === 'crop')
    if (!crop) return null
    return crop.params as unknown as ICropParams
  })

  // --- Actions ---
  function loadImage(dataUrl: string, fileName: string) {
    originalImage.value = dataUrl
    originalFileName.value = fileName
    operations.value = []
    previewUrl.value = dataUrl
    activeMode.value = 'adjust'
  }

  function upsertOperation(type: string, params: Record<string, unknown>) {
    const idx = operations.value.findIndex((o) => o.type === type)
    if (idx >= 0) {
      operations.value[idx] = { type, params }
    } else {
      operations.value.push({ type, params })
    }
  }

  function removeOperation(type: string) {
    operations.value = operations.value.filter((o) => o.type !== type)
  }

  function resetAll() {
    operations.value = []
    previewUrl.value = originalImage.value
  }

  function setMode(mode: TEditorMode) {
    activeMode.value = mode
  }

  let renderCounter = 0

  async function renderPreview() {
    if (!originalImage.value) return

    const currentRender = ++renderCounter
    isRendering.value = true

    try {
      const result = await applyPipelineToDataUrl(originalImage.value, operations.value)
      // Only apply if this is still the latest render request
      if (currentRender === renderCounter) {
        previewUrl.value = result
      }
    } finally {
      if (currentRender === renderCounter) {
        isRendering.value = false
      }
    }
  }

  return {
    // State
    originalImage,
    originalFileName,
    operations,
    previewUrl,
    activeMode,
    isRendering,
    // Getters
    hasImage,
    hasEdits,
    currentAdjustments,
    currentFilter,
    currentCrop,
    // Actions
    loadImage,
    upsertOperation,
    removeOperation,
    resetAll,
    setMode,
    renderPreview,
  }
})
