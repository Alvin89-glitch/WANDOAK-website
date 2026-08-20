<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  center: { type: Boolean, default: false },
  /** editorial = 32/35.2 regular, the softer of ALO's two heading voices */
  variant: { type: String, default: 'h2' },
  invert: { type: Boolean, default: false },
})
</script>

<template>
  <header class="sec-head" :class="{ 'sec-head--center': center, 'sec-head--invert': invert }">
    <p v-if="eyebrow" class="sec-head__eyebrow t-micro">{{ eyebrow }}</p>
    <h2 v-if="title" :class="variant === 'editorial' ? 't-editorial' : 't-h2'" class="u-balance">
      {{ title }}
    </h2>
    <p v-if="lead" class="sec-head__lead t-lead u-prewrap">{{ lead }}</p>
    <slot />
  </header>
</template>

<style scoped>
.sec-head--invert :deep(.sec-head__eyebrow),
.sec-head--invert .sec-head__eyebrow,
.sec-head--invert .sec-head__lead { color: rgba(255, 255, 255, 0.72); }
.sec-head--invert h2 { color: var(--paper); }
</style>
