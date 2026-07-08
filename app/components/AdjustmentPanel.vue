<template>
  <div>
    <div class="panel__header">
      <h2 class="panel__title">Adjustments</h2>
      <v-btn
        variant="text"
        size="x-small"
        color="success"
        :disabled="!hasAdjustments"
        @click="resetAdjustments"
      >
        Reset
      </v-btn>
    </div>

    <div class="panel__group">
      <div class="panel__label">
        <span>Brightness</span>
        <span class="panel__value">{{ brightness }}</span>
      </div>
      <v-slider
        v-model="brightness"
        :min="-100"
        :max="100"
        :step="1"
        color="success"
        track-color="grey-darken-3"
        hide-details
        @update:model-value="editor.setBrightness($event as number)"
      />
    </div>

    <div class="panel__group">
      <div class="panel__label">
        <span>Saturation</span>
        <span class="panel__value">{{ saturation }}</span>
      </div>
      <v-slider
        v-model="saturation"
        :min="-100"
        :max="100"
        :step="1"
        color="success"
        track-color="grey-darken-3"
        hide-details
        @update:model-value="editor.setSaturation($event as number)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'

const store = useEditorStore()
const editor = useEditor()

const brightness = ref(store.currentAdjustments.brightness)
const saturation = ref(store.currentAdjustments.saturation)

const hasAdjustments = computed(() => brightness.value !== 0 || saturation.value !== 0)

// Sync local state when store resets
watch(() => store.currentAdjustments, (val) => {
  brightness.value = val.brightness
  saturation.value = val.saturation
})

function resetAdjustments() {
  brightness.value = 0
  saturation.value = 0
  editor.setBrightness(0)
  editor.setSaturation(0)
}
</script>
