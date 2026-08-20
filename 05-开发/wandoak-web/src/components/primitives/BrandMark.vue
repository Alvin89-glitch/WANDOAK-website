<script setup>
import { computed } from 'vue'
import manifest from '@/data/images.json'

const props = defineProps({
  /** mark-wandoak | mark-kna */
  id: { type: String, default: 'mark-wandoak' },
  /** brand | parent | light */
  tint: { type: String, default: 'brand' },
  /** rendered height in px; width follows the mark's own ratio */
  height: { type: Number, default: 22 },
  alt: { type: String, default: '' },
})

const asset = computed(() => manifest[props.id] ?? null)
const src = computed(() => asset.value?.tints?.[props.tint] ?? '')
const width = computed(() => Math.round(props.height * (asset.value?.ratio ?? 4)))
</script>

<template>
  <img
    v-if="src"
    class="mark"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :style="{ height: `${height}px`, width: `${width}px` }"
    decoding="async"
  />
</template>

<style scoped>
.mark { display: block; object-fit: contain; }
</style>
