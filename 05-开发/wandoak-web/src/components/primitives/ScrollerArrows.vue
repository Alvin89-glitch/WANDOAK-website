<script setup>
defineProps({
  atStart: { type: Boolean, default: true },
  atEnd: { type: Boolean, default: false },
  prevLabel: { type: String, default: 'Previous' },
  nextLabel: { type: String, default: 'Next' },
})
defineEmits(['prev', 'next'])
</script>

<template>
  <div class="arrows">
    <button class="arrows__btn" type="button" :disabled="atStart" :aria-label="prevLabel" @click="$emit('prev')">
      <svg width="11" height="18" viewBox="0 0 11 18" aria-hidden="true">
        <path d="M10 1 2 9l8 8" fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
    </button>
    <button class="arrows__btn" type="button" :disabled="atEnd" :aria-label="nextLabel" @click="$emit('next')">
      <svg width="11" height="18" viewBox="0 0 11 18" aria-hidden="true">
        <path d="m1 1 8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* ALO's Swiper arrows measure 27×44 on a #e1e1e1 ground. */
.arrows { display: flex; gap: var(--sp-sm); }

.arrows__btn {
  width: 27px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--line-soft);
  color: var(--ink);
  transition: background-color var(--dur-ui), opacity var(--dur-ui);
}
.arrows__btn:hover:not(:disabled) { background: var(--ink); color: var(--paper); }
.arrows__btn:disabled { opacity: 0.3; cursor: default; }

@media (max-width: 767.98px) { .arrows { display: none; } }
</style>
