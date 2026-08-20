<script setup>
import { useI18n } from 'vue-i18n'
import { footerColumns, allPages } from '@/data/site'
import BrandMark from '@/components/primitives/BrandMark.vue'

const { t } = useI18n()
const label = (name) => t(allPages.find((p) => p.name === name)?.key ?? name)
</script>

<template>
  <footer class="foot">
    <div class="container-a">
      <p class="foot__tagline t-micro">{{ t('footer.tagline') }}</p>

      <div class="foot__grid">
        <div class="foot__brand">
          <BrandMark id="mark-wandoak" tint="light" :height="26" :alt="t('site.name')" />
          <p class="foot__line t-sm">{{ t('footer.brandLine') }}</p>
        </div>

        <nav
          v-for="col in footerColumns"
          :key="col.titleKey"
          class="foot__col"
          :aria-label="t(col.titleKey)"
        >
          <h2 class="foot__title t-body-semi">{{ t(col.titleKey) }}</h2>
          <ul class="foot__list">
            <li v-for="name in col.links" :key="name">
              <RouterLink :to="{ name }" class="foot__link t-body">{{ label(name) }}</RouterLink>
            </li>
          </ul>
        </nav>

        <address class="foot__contact">
          <h2 class="foot__title t-body-semi">{{ t('contact.h1') }}</h2>
          <p class="t-body">{{ t('contact.addressValue') }}</p>
          <p class="t-body">
            <a class="foot__link" :href="`tel:${t('contact.phoneValue').split(' / ')[0].replace(/\s/g, '')}`">
              {{ t('contact.phoneValue') }}
            </a>
          </p>
          <p class="t-body">
            <a class="foot__link" href="mailto:ken@chinaqs.com">ken@chinaqs.com</a>
          </p>
        </address>
      </div>

      <div class="foot__base">
        <div class="foot__parent">
          <BrandMark id="mark-kna" tint="light" :height="18" :alt="t('site.company')" />
          <p class="t-micro">{{ t('site.company') }}</p>
        </div>
        <p class="foot__copy t-micro">{{ t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ALO's footer: #000, padding-top 28, padding-bottom 64, link rows 22.4px
   tall with 9px between them, column titles at body-semibold. */
.foot {
  background: var(--ink);
  color: var(--paper);
  padding-top: 28px;
  padding-bottom: 64px;
}

.foot__tagline {
  color: rgba(255, 255, 255, 0.55);
  padding-bottom: var(--sp-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  margin-bottom: var(--sp-3xl);
}

.foot__grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 0.85fr) 1.5fr;
  gap: var(--sp-2xl) var(--gutter-4);
  margin-bottom: var(--sp-5xl);
}

.foot__line { color: rgba(255, 255, 255, 0.6); margin-top: var(--sp-md); }

.foot__title { margin-bottom: var(--sp-mlg); }

.foot__list { display: flex; flex-direction: column; gap: 9px; }

.foot__link {
  color: rgba(255, 255, 255, 0.78);
  transition: color var(--dur-ui);
}
.foot__link:hover { color: var(--paper); }

.foot__contact { font-style: normal; display: flex; flex-direction: column; gap: 9px; }
.foot__contact p { color: rgba(255, 255, 255, 0.78); }

.foot__base {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-lg);
  padding-top: var(--sp-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

/* The only place the parent company's red mark appears is here, and it is
   shown in white so it reads as a lockup rather than a second brand. */
.foot__parent {
  display: flex;
  align-items: center;
  gap: var(--sp-md);
  color: rgba(255, 255, 255, 0.55);
}

.foot__copy { color: rgba(255, 255, 255, 0.45); }

@media (max-width: 991.98px) {
  .foot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .foot__brand, .foot__contact { grid-column: 1 / -1; }
}

@media (max-width: 575.98px) {
  .foot__grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-xl); }
}
</style>
