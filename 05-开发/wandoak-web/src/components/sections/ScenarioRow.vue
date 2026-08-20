<script setup>
import { useI18n } from 'vue-i18n'
import { scenarios } from '@/data/site'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="scen section band reveal" :class="{ 'is-in': shown }">
    <div class="container-b">
      <header class="sec-head sec-head--center">
        <h2 v-if="title" class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="grid grid-4b">
        <li v-for="s in scenarios" :key="s.id">
          <RouterLink :to="{ name: 'products' }" class="scen__card">
            <div class="scen__media">
              <AppPicture
                :id="s.image"
                sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 24vw"
              />
            </div>
            <h3 class="scen__label t-h6">{{ t(s.labelKey) }}</h3>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* ALO runs this row as a 6-up inside Container B on a #f0f0f0 ground.
   There are only four scenarios, so the track count drops and each card
   widens to (1408 − 12×3) / 4 = 343. */
.scen { padding-block: 57.59px; }

.scen__card { display: flex; flex-direction: column; }
.scen__media { overflow: hidden; }
.scen__media :deep(img) { transition: transform var(--dur-hover) var(--ease-out); }
.scen__card:hover .scen__media :deep(img) { transform: scale(1.03); }

.scen__label { margin-top: 12px; text-align: center; }
.scen__card:hover .scen__label { color: var(--brand-ink); }

@media (max-width: 767.98px) {
  .scen { padding-block: var(--sp-2xl); }
}

@media (prefers-reduced-motion: reduce) {
  .scen__media :deep(img) { transition: none; }
  .scen__card:hover .scen__media :deep(img) { transform: none; }
}
</style>
