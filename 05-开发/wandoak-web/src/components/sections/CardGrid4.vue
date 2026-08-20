<script setup>
import { useI18n } from 'vue-i18n'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  items: { type: Array, required: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  to: { type: String, default: 'products' },
})

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="cards section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header v-if="title" class="sec-head">
        <p v-if="eyebrow" class="sec-head__eyebrow t-micro">{{ eyebrow }}</p>
        <h2 class="t-h2 u-balance">{{ title }}</h2>
      </header>

      <ul class="grid grid-4">
        <li v-for="item in items" :key="item.id">
          <RouterLink :to="{ name: to }" class="card">
            <div class="card__media">
              <AppPicture
                :id="item.image"
                sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 23vw"
              />
            </div>
            <h3 class="card__title t-h6">{{ t(item.titleKey) }}</h3>
            <p class="card__desc t-sm">{{ t(item.descKey) }}</p>
          </RouterLink>
        </li>
      </ul>

      <div v-if="$slots.actions" class="cards__actions"><slot name="actions" /></div>
    </div>
  </section>
</template>

<style scoped>
/* Container A, 4-up: (1350 − 32×3) / 4 = 313.5 — the measured ALO value.
   Card image runs 313.5×410 (≈1:1.308); the title sits 20px below it. */
.card { display: flex; flex-direction: column; }
.card__media { overflow: hidden; }
.card__media :deep(img) { transition: transform var(--dur-hover) var(--ease-out); }
.card:hover .card__media :deep(img) { transform: scale(1.03); }

.card__title { margin-top: var(--sp-mlg); text-align: center; }
.card__desc { margin-top: var(--sp-sm); color: var(--ink-60); text-align: center; }

.card:hover .card__title { color: var(--brand-ink); }

.cards__actions { margin-top: var(--sp-xl); display: flex; justify-content: center; }

@media (prefers-reduced-motion: reduce) {
  .card__media :deep(img) { transition: none; }
  .card:hover .card__media :deep(img) { transform: none; }
}
</style>
