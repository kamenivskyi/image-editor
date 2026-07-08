<template>
  <div class="upload">
    <div
      class="upload__card"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <v-icon class="upload__icon" size="48">mdi-image-edit-outline</v-icon>
      <h1 class="upload__title">Image Editor</h1>
      <p class="upload__subtitle">Upload an image to start editing</p>

      <div
        :class="['upload__dropzone', { 'upload__dropzone--active': isDragging }]"
        @click="triggerInput"
      >
        <v-icon size="36" :color="isDragging ? 'success' : 'grey'">
          {{ isDragging ? 'mdi-upload' : 'mdi-cloud-upload-outline' }}
        </v-icon>
        <span>Drop your image here or <strong>click to browse</strong></span>
        <span class="upload__formats">JPEG, PNG, WebP, BMP • Max 10 MB</span>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/bmp"
        hidden
        @change="onFileSelect"
      />

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        closable
        class="mt-2"
        style="width: 100%"
        @click:close="error = ''"
      >
        {{ error }}
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditor } from '~/composables/useEditor'

const { handleFileUpload } = useEditor()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const error = ref('')

function triggerInput() {
  fileInput.value?.click()
}

async function processFile(file: File) {
  error.value = ''
  const result = await handleFileUpload(file)
  if (!result.success) {
    error.value = result.error ?? 'Unknown error'
  }
}

async function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    await processFile(input.files[0])
  }
}

async function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    await processFile(file)
  }
}
</script>
