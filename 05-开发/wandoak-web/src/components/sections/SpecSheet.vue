<script setup>
import { useI18n } from 'vue-i18n'
import { factorySpecs } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  body: { type: String, default: '' },
  creed: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="spec section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <div class="spec__grid">
        <div class="spec__intro">
          <p v-if="eyebrow" class="sec-head__eyebrow t-micro">{{ eyebrow }}</p>
          <h2 v-if="title" class="t-h2 u-balance">{{ title }}</h2>
          <p v-if="name" class="spec__name t-h6">{{ name }}</p>
          <p v-if="body" class="spec__body t-body">{{ body }}</p>
          <p v-if="creed" class="spec__creed t-body-semi">{{ creed }}</p>
        </div>

        <!-- A definition list, not a table: each row is one label and one
             value, and it has to collapse to a stack on a phone. -->
        <dl class="spec__list">
          <div v-for="row in factorySpecs" :key="row.id" class="spec__row">
            <dt class="spec__label t-smcaps">{{ t(row.labelKey) }}</dt>
            <dd class="spec__value t-body u-tnum">{{ t(row.valueKey) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.spec__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--sp-xl) var(--gutter-4);
  align-items: start;
}

.spec__name { margin-top: var(--sp-mlg); }
.spec__body { margin-top: var(--sp-msm); color: var(--ink-60); max-width: 54ch; }
.spec__creed { margin-top: var(--sp-mlg); color: var(--ink); max-width: 54ch; }

.spec__list { border-top: 2px solid var(--ink); }

.spec__row {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: var(--sp-md);
  padding: var(--sp-md) 0;
  border-bottom: 1px solid var(--line-soft);
}

.spec__label { color: var(--ink-60); }
.spec__value { color: var(--ink); }

@media (max-width: 991.98px) {
  .spec__grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-2xl); }
}
@media (max-width: 575.98px) {
  .spec__row { grid-template-columns: minmax(0, 1fr); gap: var(--sp-xs); }
}
</style>
