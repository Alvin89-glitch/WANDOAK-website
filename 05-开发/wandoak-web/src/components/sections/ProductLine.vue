<script setup>
import { useI18n } from 'vue-i18n'
import { productLine } from '@/data/site'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="line section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header class="sec-head">
        <p v-if="eyebrow" class="sec-head__eyebrow t-micro">{{ eyebrow }}</p>
        <h2 v-if="title" class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="grid grid-5 line__grid">
        <li v-for="piece in productLine" :key="piece.id" class="line__item">
          <!-- The studio cut-outs are shot on white; a tinted plate keeps them
               from floating on the page ground with no edge of their own. -->
          <div class="line__media">
            <AppPicture
              :id="piece.image"
              sizes="(max-width: 575px) 100vw, (max-width: 1199px) 33vw, 18vw"
            />
          </div>
          <h3 class="line__title t-h6">{{ t(piece.titleKey) }}</h3>
          <p class="line__desc t-sm">{{ t(piece.descKey) }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.line__item { display: flex; flex-direction: column; }

.line__media {
  overflow: hidden;
  background: var(--wash-band);
}

/* Titles run one or two lines depending on the name; without a floor the
   descriptions start at five different heights across the row. */
.line__title { margin-top: var(--sp-md); min-height: calc(var(--t-h6-lh) * 2); }
.line__desc { margin-top: var(--sp-sm); color: var(--ink-60); }

@media (max-width: 575.98px) {
  .line__title { min-height: 0; }
}
</style>
