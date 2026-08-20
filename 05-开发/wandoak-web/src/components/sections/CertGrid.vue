<script setup>
import { useI18n } from 'vue-i18n'
import { certifications } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

defineProps({
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  note: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()

/* The abbreviation already reads as the mark; strip it from the full name
   so the card does not print "GRS" twice. */
const expansion = (cert) => {
  const full = t(cert.nameKey)
  const esc = cert.abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return full.replace(new RegExp(`^${esc}\\s*[—\\-–]?\\s*`), '').trim()
}
</script>

<template>
  <section ref="el" class="certs section band reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header class="sec-head sec-head--center">
        <h2 v-if="title" class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="certs__grid">
        <li v-for="cert in certifications" :key="cert.id" class="certs__card">
          <p class="certs__abbr">{{ cert.abbr }}</p>
          <h3 v-if="expansion(cert)" class="certs__name t-body-semi">{{ expansion(cert) }}</h3>
          <p class="certs__desc t-sm">{{ t(cert.descKey) }}</p>
        </li>
      </ul>

      <p v-if="note" class="certs__note t-body">{{ note }}</p>
    </div>
  </section>
</template>

<style scoped>
/* ALO's UGC band: #f0f0f0 full-bleed, 70px top padding, 50px bottom,
   centred h2 with a lead beneath. The marks themselves have not been
   supplied, so each certification is rendered as a type card. */
.certs { padding-block: 70px 50px; }

.certs__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--gutter-6);
}

.certs__card {
  background: var(--paper);
  padding: var(--sp-lg);
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
  border-top: 2px solid var(--ink);
}

.certs__abbr {
  font-size: 18px;
  line-height: 22px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: var(--brand-ink);
}

.certs__desc { color: var(--ink-60); }

.certs__note {
  margin-top: var(--sp-xl);
  text-align: center;
  color: var(--ink-60);
  max-width: 76ch;
  margin-inline: auto;
}

@media (max-width: 1199.98px) { .certs__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767.98px)  { .certs__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .certs { padding-block: var(--sp-2xl); } }
@media (max-width: 479.98px)  { .certs__grid { grid-template-columns: minmax(0, 1fr); } }
</style>
