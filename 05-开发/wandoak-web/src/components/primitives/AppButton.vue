<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  /** solid = black on white ground · invert = white on imagery · outline = hairline */
  variant: { type: String, default: 'solid' },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="tag"
    class="btn t-btn"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
    v-bind="to ? { to } : href ? { href } : { type, disabled }"
  >
    <slot />
  </component>
</template>

<style scoped>
/* Geometry from ALO: .hero-button padding 15/30, height 48;
   the CTA button measures 200×51.5 with padding 14/32. */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-msm);
  min-height: 48px;
  padding: 14px 32px;
  text-align: center;
  border: 1px solid transparent;
  transition: background-color var(--dur-ui), color var(--dur-ui),
    border-color var(--dur-ui);
  cursor: pointer;
}

.btn--solid {
  background: var(--ink);
  color: var(--paper);
}
.btn--solid:hover { background: var(--brand); }

.btn--invert {
  background: var(--paper);
  color: var(--ink);
  border-color: var(--paper);
}
.btn--invert:hover { background: var(--brand); color: var(--paper); border-color: var(--brand); }

.btn--outline {
  background: transparent;
  color: var(--ink);
  border-color: var(--ink);
}
.btn--outline:hover { background: var(--ink); color: var(--paper); }

.btn--outline-invert {
  background: transparent;
  color: var(--paper);
  border-color: var(--paper);
}
.btn--outline-invert:hover { background: var(--paper); color: var(--ink); }

.btn--block { display: flex; width: 100%; }

.btn:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
