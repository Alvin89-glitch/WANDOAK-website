<script setup>
import { useI18n } from 'vue-i18n'
import { allPages, skeletonFallbacks } from '@/data/site'
import AppLink from '@/components/primitives/AppLink.vue'

defineProps({
  /** short summary of what this page will carry, drawn from the copy deck */
  outline: { type: Array, default: () => [] },
})

const { t } = useI18n()
const label = (name) => t(allPages.find((p) => p.name === name)?.key ?? name)
</script>

<template>
  <section class="soon section">
    <div class="container-c">
      <div class="soon__grid">
        <div>
          <p class="soon__badge t-micro">{{ t('ui.comingSoon') }}</p>
          <p class="soon__body t-lead">{{ t('ui.comingSoonBody') }}</p>
          <ul class="soon__links">
            <li v-for="name in skeletonFallbacks" :key="name">
              <AppLink :to="{ name }">{{ label(name) }}</AppLink>
            </li>
          </ul>
        </div>

        <div v-if="outline.length" class="soon__outline">
          <h2 class="t-h6">{{ t('ui.menu') }}</h2>
          <ul>
            <li v-for="(line, i) in outline" :key="i" class="t-body">{{ line }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.soon__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--sp-5xl);
  align-items: start;
}

.soon__badge {
  display: inline-block;
  background: var(--wash-band);
  color: var(--ink-60);
  padding: 4px 10px;
  margin-bottom: var(--sp-md);
}

.soon__body { color: var(--ink-60); max-width: 56ch; }

.soon__links {
  margin-top: var(--sp-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-lg) var(--sp-xl);
}

.soon__outline {
  border-top: 2px solid var(--ink);
  padding-top: var(--sp-mlg);
}
.soon__outline ul {
  margin-top: var(--sp-md);
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
  color: var(--ink-60);
}
.soon__outline li { padding-left: var(--sp-md); position: relative; }
.soon__outline li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 1px;
  background: var(--brand);
}

@media (max-width: 991.98px) {
  .soon__grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-2xl); }
}
</style>
