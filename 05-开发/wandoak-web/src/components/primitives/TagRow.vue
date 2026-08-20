<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** a middot-joined list, the shape the copy deck ships these in */
  value: { type: String, required: true },
})

const tags = computed(() =>
  props.value.split('·').map((part) => part.trim()).filter(Boolean),
)
</script>

<template>
  <ul class="tags">
    <li v-for="tag in tags" :key="tag" class="tags__item t-sm">{{ tag }}</li>
  </ul>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: var(--sp-sm); }
.tags__item {
  padding: var(--sp-sm) var(--sp-md);
  border: 1px solid var(--line);
  color: var(--ink-75);
}
</style>
