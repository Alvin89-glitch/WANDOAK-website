<script setup>
import { useI18n } from 'vue-i18n'
import { processSteps } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

defineProps({ title: { type: String, default: '' } })

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="steps section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header v-if="title" class="sec-head">
        <h2 class="t-h2 u-balance">{{ title }}</h2>
      </header>

      <ol class="steps__grid grid grid-5">
        <li v-for="step in processSteps" :key="step.n" class="steps__item">
          <span class="steps__n t-micro u-tnum">{{ String(step.n).padStart(2, '0') }}</span>
          <p class="steps__label t-body-semi">{{ t(step.key) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Container A, 5-up: (1350 − 12×4) / 5 = 260.4.
   The rule runs through the dots, so the sequence reads as one line. */
.steps__grid { counter-reset: step; }

.steps__item {
  position: relative;
  padding-top: var(--sp-lg);
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
}

.steps__item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: calc(var(--gutter-6) * -1);
  height: 1px;
  background: var(--line);
}
.steps__item:last-child::before { right: 0; }

.steps__item::after {
  content: "";
  position: absolute;
  top: -3.5px;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand);
}

.steps__n { color: var(--ink-40); }
.steps__label { color: var(--ink); }

@media (max-width: 1199.98px) {
  .steps__item::before { right: 0; }
}
</style>
