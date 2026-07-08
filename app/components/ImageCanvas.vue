<template>
  <div class="canvas__wrapper">
    <img
      v-if="store.previewUrl"
      ref="imageEl"
      :src="store.previewUrl"
      alt="Preview"
      class="canvas__image"
    />

    <div v-if="store.isRendering" class="canvas__loading">
      <v-progress-circular indeterminate color="success" size="40" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '~/stores/editor'

const store = useEditorStore()
const imageEl = ref<HTMLImageElement | null>(null)

defineExpose({ imageEl })
</script>
