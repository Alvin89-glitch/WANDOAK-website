<script setup>
import { useI18n } from 'vue-i18n'
import { makeMethods } from '@/data/site'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  note: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()

/* The "covers" strings are middot-joined lists in both locales — split so
   they set as a proper list instead of one long run-on line. */
const split = (s) => s.split('·').map((part) => part.trim()).filter(Boolean)
</script>

<template>
  <section ref="el" class="method section reveal" :class="{ 'is-in': shown }">
    <div class="container-c">
      <header v-if="title" class="sec-head">
        <h2 class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="grid grid-2 method__grid">
        <li v-for="m in makeMethods" :key="m.id" class="method__card">
          <div class="method__media">
            <!-- Container C two-up: (1300 − 15) / 2 = 642.5, which is 44.6vw of
                 the 1440 layout. 43vw rounded the wrong way and served a
                 619px bitmap into a 643px box. -->
            <AppPicture :id="m.image" sizes="(max-width: 991px) 100vw, 45vw" />
          </div>
          <h3 class="method__title t-h6">{{ t(m.titleKey) }}</h3>
          <p class="method__desc t-body">{{ t(m.descKey) }}</p>
          <ul class="method__covers">
            <li v-for="item in split(t(m.coversKey))" :key="item" class="t-sm">{{ item }}</li>
          </ul>
        </li>
      </ul>

      <p v-if="note" class="method__note t-body">{{ note }}</p>
    </div>
  </section>
</template>

<style scoped>
.method__card { display: flex; flex-direction: column; }
.method__media { overflow: hidden; }

.method__title { margin-top: var(--sp-mlg); }
.method__desc { margin-top: var(--sp-sm); color: var(--ink-60); }

.method__covers {
  margin-top: var(--sp-md);
  padding-top: var(--sp-md);
  border-top: 1px solid var(--line-soft);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-sm) var(--sp-md);
}
.method__covers li { color: var(--ink-75); }

.method__note {
  margin-top: var(--sp-xl);
  padding-top: var(--sp-md);
  border-top: 2px solid var(--ink);
  color: var(--ink-60);
}
</style>
