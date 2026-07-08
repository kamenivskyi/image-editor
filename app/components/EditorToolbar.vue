<template>
  <div class="editor__toolbar">
    <div class="toolbar__brand">
      <v-icon class="toolbar__logo" size="28">mdi-image-edit</v-icon>
      <span class="toolbar__name">Image<span>Editor</span></span>
    </div>

    <div class="toolbar__modes">
      <v-btn-toggle
        :model-value="store.activeMode"
        mandatory
        density="compact"
        color="success"
        variant="outlined"
        divided
        @update:model-value="editor.setMode($event as TEditorMode)"
      >
        <v-btn value="crop" size="small" prepend-icon="mdi-crop">
          Crop
        </v-btn>
        <v-btn value="adjust" size="small" prepend-icon="mdi-tune-variant">
          Adjust
        </v-btn>
        <v-btn value="filters" size="small" prepend-icon="mdi-palette-outline">
          Filters
        </v-btn>
      </v-btn-toggle>
    </div>

    <div class="toolbar__actions">
      <v-tooltip text="Upload new image" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-folder-open-outline"
            variant="text"
            size="small"
            @click="triggerUpload"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Reset all edits" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-restore"
            variant="text"
            size="small"
            :disabled="!store.hasEdits"
            @click="editor.resetAll()"
          />
        </template>
      </v-tooltip>

      <v-divider vertical class="mx-1" />

      <v-btn
        color="success"
        variant="tonal"
        size="small"
        prepend-icon="mdi-download"
        class="toolbar__export"
        @click="imageExport.exportImage()"
      >
        Export
      </v-btn>

      <v-tooltip text="Export operations as JSON" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-code-json"
            variant="text"
            size="small"
            :disabled="!store.hasEdits"
            @click="imageExport.exportOperationsJSON()"
          />
        </template>
      </v-tooltip>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/bmp"
      hidden
      @change="onFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useImageExport } from '~/composables/useImageExport'
import type { TEditorMode } from '~/types/editor'

const store = useEditorStore()
const editor = useEditor()
const imageExport = useImageExport()
const fileInput = ref<HTMLInputElement | null>(null)

function triggerUpload() {
  fileInput.value?.click()
}

async function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    await editor.handleFileUpload(input.files[0])
  }
}
</script>
