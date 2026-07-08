<template>
  <div>
    <div class="panel__header">
      <h2 class="panel__title">Crop</h2>
      <v-btn
        v-if="store.currentCrop"
        variant="text"
        size="x-small"
        color="error"
        @click="onRemoveCrop"
      >
        Remove Crop
      </v-btn>
    </div>

    <p v-if="!isCropping" class="text-secondary mb-3" style="font-size: 0.875rem;">
      {{ store.currentCrop ? 'Image has been cropped. Start a new crop or remove the existing one.' : 'Click the button below to start cropping your image.' }}
    </p>

    <div v-if="isCropping" class="panel__group">
      <p class="text-secondary mb-2" style="font-size: 0.875rem;">
        Drag to select the crop area on the image, then apply.
      </p>
    </div>

    <div class="crop-panel__presets" v-if="isCropping">
      <v-btn
        v-for="preset in PRESETS"
        :key="preset.label"
        :variant="selectedPreset === preset.label ? 'flat' : 'outlined'"
        :color="selectedPreset === preset.label ? 'success' : undefined"
        size="small"
        @click="selectPreset(preset)"
      >
        {{ preset.label }}
      </v-btn>
    </div>

    <div class="crop-panel__actions">
      <template v-if="isCropping">
        <v-btn
          color="success"
          variant="flat"
          size="small"
          block
          prepend-icon="mdi-check"
          @click="onApply"
        >
          Apply Crop
        </v-btn>
        <v-btn
          variant="outlined"
          size="small"
          block
          prepend-icon="mdi-close"
          @click="onCancel"
        >
          Cancel
        </v-btn>
      </template>
      <v-btn
        v-else
        color="success"
        variant="tonal"
        size="small"
        block
        prepend-icon="mdi-crop"
        @click="startCropping"
      >
        Start Crop
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import type CropperType from 'cropperjs'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'

interface ICropPreset {
  label: string
  ratio: number | typeof NaN
}

const PRESETS: ICropPreset[] = [
  { label: 'Free', ratio: NaN },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '16:9', ratio: 16 / 9 },
]

const store = useEditorStore()
const editor = useEditor()

const isCropping = ref(false)
const selectedPreset = ref('Free')
let cropper: CropperType | null = null
let CropperCtor: typeof CropperType | null = null

onMounted(async () => {
  const mod = await import('cropperjs')
  CropperCtor = mod.default
})

const emit = defineEmits<{
  (e: 'cropper-active', value: boolean): void
}>()

function findImageElement(): HTMLImageElement | null {
  return document.querySelector('.canvas__image')
}

function startCropping() {
  const img = findImageElement()
  if (!img || !CropperCtor) return

  isCropping.value = true
  emit('cropper-active', true)

  cropper = new CropperCtor(img, {
    viewMode: 1,
    autoCropArea: 0.8,
    responsive: true,
    background: false,
  })
}

function selectPreset(preset: CropPreset) {
  selectedPreset.value = preset.label
  if (cropper) {
    cropper.setAspectRatio(preset.ratio)
  }
}

function onApply() {
  if (!cropper) return

  const data = cropper.getData(true) // rounded to integers
  editor.applyCrop(data.x, data.y, data.width, data.height)

  destroyCropper()
}

function onCancel() {
  destroyCropper()
}

function onRemoveCrop() {
  editor.removeCrop()
}

function destroyCropper() {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
  isCropping.value = false
  selectedPreset.value = 'Free'
  emit('cropper-active', false)
}

onBeforeUnmount(() => {
  destroyCropper()
})
</script>
