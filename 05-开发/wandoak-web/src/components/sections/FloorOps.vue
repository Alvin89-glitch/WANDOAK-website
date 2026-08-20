<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { floorStations, floorPillars } from '@/data/site'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

const { t } = useI18n()
const { el, shown } = useReveal()

/* opsItems ships as one middot-joined string in both locales. */
const items = computed(() =>
  t('factory.opsItems').split('·').map((part) => part.trim()).filter(Boolean),
)

/* opsWarehouse is "<heading> — <comma list>"; EN uses an em dash, the
   Chinese copy a doubled one, so match one-or-more. */
const warehouse = computed(() => {
  const parts = t('factory.opsWarehouse').split(/\s*—+\s*/)
  return { head: parts[0], detail: parts.slice(1).join(' ') }
})
</script>

<template>
  <section ref="el" class="ops section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header class="sec-head">
        <h2 class="t-h2 u-balance">{{ t('factory.opsH2') }}</h2>
        <p class="sec-head__lead t-lead">{{ t('factory.opsEquipBody') }}</p>
      </header>

      <ul class="grid grid-4 ops__strip">
        <li v-for="station in floorStations" :key="station.id" class="ops__station">
          <div class="ops__media">
            <AppPicture
              :id="station.image"
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 23vw"
            />
          </div>
          <p class="ops__caption t-smcaps">{{ t(station.labelKey) }}</p>
        </li>
      </ul>

      <ul class="ops__tags">
        <li v-for="item in items" :key="item" class="ops__tag t-sm">{{ item }}</li>
      </ul>

      <div class="ops__pillars grid grid-3">
        <div v-for="pillar in floorPillars" :key="pillar.id" class="ops__pillar">
          <h3 class="t-h6">{{ t(pillar.titleKey) }}</h3>
          <p class="t-body">{{ t(pillar.descKey) }}</p>
        </div>
        <div class="ops__pillar">
          <h3 class="t-h6">{{ warehouse.head }}</h3>
          <p class="t-body">{{ warehouse.detail }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ops__station { display: flex; flex-direction: column; }
.ops__media { overflow: hidden; }
.ops__caption { margin-top: var(--sp-msm); color: var(--ink-60); }

.ops__tags {
  margin-top: var(--sp-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-sm);
}
.ops__tag {
  padding: var(--sp-sm) var(--sp-md);
  background: var(--wash-band);
  color: var(--ink-75);
}

.ops__pillars { margin-top: var(--sp-xl); }

.ops__pillar {
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
  padding-top: var(--sp-md);
  border-top: 2px solid var(--ink);
}
.ops__pillar p { color: var(--ink-60); }
</style>
