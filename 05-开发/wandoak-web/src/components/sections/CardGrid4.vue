<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

const props = defineProps({
  items: { type: Array, required: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  to: { type: String, default: 'products' },
  /* 4 is the ALO four-up this component is named for and the only value the
     A3 geometry assertion measures; 3 is for the sibling row on a category
     page, where one of the four is the page you are already on. */
  columns: { type: Number, default: 4 },
})

const { t } = useI18n()
const { el, shown } = useReveal()

/* `sizes` has to follow the track count or the browser picks off the wrong
   rung of the ladder: a fixed 23vw hint (correct for the four-up) made a
   three-up serve a 331px bitmap into a 428.7px slot. Container A is 1350 wide
   at the 1440 layout, so one track is (1350 − 32×(n−1)) / n. */
const sizes = computed(() => {
  const track = (1350 - 32 * (props.columns - 1)) / props.columns
  return `(max-width: 575px) 100vw, (max-width: 991px) 50vw, ${Math.ceil((track / 1440) * 100)}vw`
})
</script>

<template>
  <section ref="el" class="cards section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header v-if="title" class="sec-head">
        <p v-if="eyebrow" class="sec-head__eyebrow t-micro">{{ eyebrow }}</p>
        <h2 class="t-h2 u-balance">{{ title }}</h2>
      </header>

      <ul class="grid" :class="`grid-${columns}`">
        <li v-for="item in items" :key="item.id">
          <!-- An item may name its own destination; `to` stays the fallback
               for grids whose cards all land in the same place. -->
          <RouterLink :to="item.to ?? { name: to }" class="card">
            <div class="card__media">
              <AppPicture :id="item.image" :sizes="sizes" />
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
