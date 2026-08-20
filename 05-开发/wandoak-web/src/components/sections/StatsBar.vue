<script setup>
import { useI18n } from 'vue-i18n'
import { stats } from '@/data/site'
import { useReveal } from '@/composables/useReveal'
import { useCountUp } from '@/composables/useCountUp'

const { t, locale } = useI18n()
const { el, shown } = useReveal({ threshold: 0.3 })

/* Each stat's display string comes from the locale file; the count-up
   rebuilds it from the numeric target so the separators stay correct
   in both languages. */
const counts = stats.map((s) => useCountUp(s.to, shown))
const format = (n) => new Intl.NumberFormat(locale.value === 'zh' ? 'zh-CN' : 'en-GB').format(n)

function display(stat, i) {
  const raw = t(stat.valueKey)
  if (!shown.value) return raw.replace(/[\d,]+/, format(0))
  return raw.replace(/[\d,]+/, format(counts[i].value))
}
</script>

<template>
  <section ref="el" class="stats section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <dl class="stats__grid grid grid-3">
        <div v-for="(stat, i) in stats" :key="stat.labelKey" class="stats__item">
          <dt class="stats__value u-tnum">{{ display(stat, i) }}</dt>
          <dd class="stats__label t-h6">{{ t(stat.labelKey) }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
/* Container A, 3-up: (1350 − 32×2) / 3 = 428.67 per cell.
   The value uses display weight at a step below the 60px reserved for the
   single CTA headline — the rule that only one 60px exists per page holds. */
.stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--sp-msm);
  padding-top: var(--sp-lg);
  border-top: 2px solid var(--ink);
}

.stats__value {
  font-size: var(--t-dsm-size);
  line-height: var(--t-dsm-lh);
  letter-spacing: var(--t-dsm-ls);
  font-weight: var(--t-dsm-w);
}

.stats__label { color: var(--ink-60); }

@media (max-width: 767.98px) {
  .stats__value { font-size: 32px; line-height: 36px; letter-spacing: -0.8px; }
}
</style>
