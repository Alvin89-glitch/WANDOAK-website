<script setup>
import { useI18n } from 'vue-i18n'
import { offers } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

defineProps({
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="offers section reveal" :class="{ 'is-in': shown }">
    <div class="container-c">
      <header v-if="title" class="sec-head">
        <h2 class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="grid grid-3 offers__grid">
        <li v-for="(offer, i) in offers" :key="offer.id" class="offers__card">
          <p class="offers__index t-micro u-tnum">{{ String(i + 1).padStart(2, '0') }}</p>
          <h3 class="offers__title t-h6">{{ t(offer.titleKey) }}</h3>
          <p class="offers__body t-body">{{ t(offer.bodyKey) }}</p>
          <p v-if="offer.kickerKey" class="offers__kicker t-body-semi">{{ t(offer.kickerKey) }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Numbered because a visitor picks exactly one of these three routes;
   the index makes them countable at a glance, not decorative. */
.offers__card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-msm);
  height: 100%;
  padding-top: var(--sp-mlg);
  border-top: 2px solid var(--ink);
}

.offers__index { color: var(--brand-ink); }
.offers__body { color: var(--ink-60); }
.offers__kicker { margin-top: auto; padding-top: var(--sp-md); color: var(--ink); }
</style>
