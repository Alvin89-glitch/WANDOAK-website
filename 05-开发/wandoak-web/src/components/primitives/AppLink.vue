<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  invert: { type: Boolean, default: false },
})
const tag = computed(() => (props.to ? RouterLink : 'a'))
</script>

<template>
  <component
    :is="tag"
    class="tlink t-body"
    :class="{ 'tlink--invert': invert }"
    v-bind="to ? { to } : { href }"
  >
    <span class="tlink__label"><slot /></span>
    <svg class="tlink__arrow" width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4" />
    </svg>
  </component>
</template>

<style scoped>
/* ALO's text links are plain body copy with a rule that appears on hover.
   The arrow is ours — it makes the affordance readable at a glance on a
   page with no buttons in sight. */
.tlink {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-sm);
  color: var(--ink);
  transition: color var(--dur-ui);
}
.tlink--invert { color: var(--paper); }

.tlink__label {
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}

.tlink__arrow {
  transition: transform var(--dur-ui) var(--ease-out);
  flex: none;
}

.tlink:hover { color: var(--brand-ink); }
.tlink--invert:hover { color: var(--paper); opacity: 0.75; }
.tlink:hover .tlink__arrow { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .tlink__arrow { transition: none; }
  .tlink:hover .tlink__arrow { transform: none; }
}
</style>
