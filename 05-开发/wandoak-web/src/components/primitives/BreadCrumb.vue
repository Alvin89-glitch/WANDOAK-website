<script setup>
defineProps({
  /** [{ label, to }] — the last entry is the current page and carries no link */
  trail: { type: Array, required: true },
})
</script>

<template>
  <nav class="crumb" :aria-label="trail[0]?.label">
    <ol class="crumb__list">
      <li v-for="(step, i) in trail" :key="i" class="crumb__item t-micro">
        <RouterLink v-if="step.to && i < trail.length - 1" :to="step.to" class="crumb__link">
          {{ step.label }}
        </RouterLink>
        <span v-else aria-current="page">{{ step.label }}</span>
        <span v-if="i < trail.length - 1" class="crumb__sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.crumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-sm);
}

.crumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-sm);
  color: var(--ink-60);
}

.crumb__link { color: var(--ink-60); transition: color var(--dur-ui); }
.crumb__link:hover { color: var(--brand-ink); }
.crumb__sep { color: var(--ink-40); }
</style>
