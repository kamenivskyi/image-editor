<template>
  <div>
    <div class="panel__header">
      <h2 class="panel__title">Filters</h2>
      <v-btn
        variant="text"
        size="x-small"
        color="success"
        :disabled="activeFilter === 'none'"
        @click="clearFilter"
      >
        Clear
      </v-btn>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
      <div
        v-for="filter in FILTERS"
        :key="filter.name"
        :class="['filter-card', { 'filter-card--active': activeFilter === filter.name }]"
        @click="selectFilter(filter.name)"
      >
        <div
          class="filter-card__preview"
          :style="{
            background: `linear-gradient(135deg, ${filter.color1}, ${filter.color2})`,
          }"
        />
        <span class="filter-card__name">{{ filter.label }}</span>
      </div>
    </div>

    <div v-if="activeFilter !== 'none'" class="panel__group">
      <div class="panel__label">
        <span>Intensity</span>
        <span class="panel__value">{{ intensity }}%</span>
      </div>
      <v-slider
        v-model="intensity"
        :min="0"
        :max="100"
        :step="1"
        color="success"
        track-color="grey-darken-3"
        hide-details
        @update:model-value="onIntensityChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import type { TFilterName } from '~/types/editor'

const FILTERS = [
  { name: 'none' as const, label: 'None', color1: '#334155', color2: '#475569' },
  { name: 'grayscale' as const, label: 'Grayscale', color1: '#6b7280', color2: '#374151' },
  { name: 'sepia' as const, label: 'Sepia', color1: '#92400e', color2: '#78350f' },
  { name: 'invert' as const, label: 'Invert', color1: '#1e293b', color2: '#f8fafc' },
]

const store = useEditorStore()
const editor = useEditor()

const activeFilter = ref<TFilterName>(store.currentFilter.name)
const intensity = ref(store.currentFilter.intensity)

watch(() => store.currentFilter, (val) => {
  activeFilter.value = val.name
  intensity.value = val.intensity
})

function selectFilter(name: TFilterName) {
  activeFilter.value = name
  intensity.value = 100
  editor.setFilter(name, 100)
}

function clearFilter() {
  activeFilter.value = 'none'
  intensity.value = 100
  editor.setFilter('none')
}

function onIntensityChange(value: number) {
  editor.setFilter(activeFilter.value, value)
}
</script>
