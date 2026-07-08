<template>
  <v-app>
    <ImageUpload v-if="!store.hasImage" />

    <div v-else class="editor">
      <EditorToolbar />

      <div class="editor__canvas-area">
        <ImageCanvas ref="canvasRef" />
      </div>

      <div class="editor__sidebar">
        <CropPanel
          v-if="store.activeMode === 'crop'"
          @cropper-active="isCropperActive = $event"
        />
        <AdjustmentPanel v-if="store.activeMode === 'adjust'" />
        <FilterPanel v-if="store.activeMode === 'filters'" />

        <v-divider class="my-2" />

        <div style="font-size: 0.75rem; color: #64748b;">
          <div>File: {{ store.originalFileName }}</div>
          <div>Operations: {{ store.operations.length }}</div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '~/stores/editor'

const store = useEditorStore()
const canvasRef = ref()
const isCropperActive = ref(false)
</script>