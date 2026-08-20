<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { primaryNav } from '@/data/site'
import { useLocale } from '@/composables/useLocale'
import AppButton from '@/components/primitives/AppButton.vue'
import BrandMark from '@/components/primitives/BrandMark.vue'

const { t } = useI18n()
const route = useRoute()
const { current, other, set } = useLocale()

const narrow = ref(false)
let mq = null
const onMq = (e) => { narrow.value = e.matches }
onMounted(() => {
  mq = window.matchMedia('(max-width: 991.98px)')
  narrow.value = mq.matches
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => mq?.removeEventListener('change', onMq))

/* ALO's mark is 48px tall in an 83.5px bar; scaled to this wordmark's
   proportions that reads as ~22px of cap height. */
const markH = computed(() => (narrow.value ? 17 : 22))

/* A second-level page such as /products/bra is its own route record, so
   router-link-active never fires on the /products link. Routes declare their
   owner in meta.navName instead. */
const isCurrent = (name) => route.name === name || route.meta?.navName === name

const open = ref(false)
watch(() => route.fullPath, () => { open.value = false })
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <header class="nav">
    <div class="nav__bar container-a">
      <RouterLink :to="{ name: 'home' }" class="nav__logo">
        <BrandMark id="mark-wandoak" tint="brand" :height="markH" :alt="t('site.name')" />
      </RouterLink>

      <nav class="nav__menu" :aria-label="t('ui.menu')">
        <ul class="nav__list">
          <li v-for="item in primaryNav" :key="item.name">
            <RouterLink
              :to="{ name: item.name }"
              class="nav__item t-micro"
              active-class="is-active"
              :class="{ 'is-active': isCurrent(item.name) }"
              :aria-current="isCurrent(item.name) ? 'page' : undefined"
            >{{ t(item.key) }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="nav__end">
        <button
          class="nav__lang t-micro"
          type="button"
          :aria-label="`${t('ui.language')}: ${other.label}`"
          @click="set(other.code)"
        >
          <span class="is-on">{{ current.short }}</span>
          <span aria-hidden="true" class="nav__slash">/</span>
          <span class="is-off">{{ other.short }}</span>
        </button>

        <AppButton :to="{ name: 'partner' }" class="nav__cta">{{ t('nav.cta') }}</AppButton>

        <button
          class="nav__burger"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? t('ui.close') : t('ui.openMenu')"
          @click="open = !open"
        >
          <span class="nav__burger-box" :class="{ 'is-open': open }">
            <i></i><i></i>
          </span>
        </button>
      </div>
    </div>

    <div id="mobile-nav" class="drawer" :class="{ 'is-open': open }" :inert="!open">
      <nav class="container-a" :aria-label="t('ui.menu')">
        <ul class="drawer__list">
          <li v-for="item in primaryNav" :key="item.name">
            <RouterLink
              :to="{ name: item.name }"
              class="drawer__item t-h2"
              active-class="is-active"
              :class="{ 'is-active': isCurrent(item.name) }"
            >
              {{ t(item.key) }}
            </RouterLink>
          </li>
        </ul>
        <AppButton :to="{ name: 'partner' }" block class="drawer__cta">{{ t('nav.cta') }}</AppButton>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Measured on ALO: sticky, top 0, z-index 200, 1440×83.5, white ground,
   logo at x=45 (= container-a padding), 71px wide. */
.nav {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--paper);
}

/* The hairline lives inside the bar, not on the sticky wrapper: ALO's
   83.5px nav is an 82.5px row plus a 1px rule, and putting the border on
   the outer element would make the whole header 84.5px. */
.nav__bar {
  height: var(--nav-h);
  border-bottom: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav__logo { flex: none; display: flex; align-items: center; }

.nav__menu { flex: 1 1 auto; min-width: 0; }
.nav__list { display: flex; align-items: center; gap: 30px; }

.nav__item {
  position: relative;
  display: block;
  padding-block: 6px;
  color: var(--ink);
  white-space: nowrap;
  transition: color var(--dur-ui);
}
.nav__item::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-ui) var(--ease-out);
}
.nav__item:hover { color: var(--brand-ink); }
.nav__item:hover::after,
.nav__item.is-active::after { transform: scaleX(1); }

.nav__end {
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--sp-mlg);
  margin-left: auto;
}

.nav__lang {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-60);
  transition: color var(--dur-ui);
}
.nav__lang .is-on { color: var(--ink); font-weight: 600; }
.nav__lang:hover { color: var(--brand-ink); }
.nav__slash { color: var(--line); }

.nav__cta { min-height: 40px; padding: 10px 22px; }

/* ---------- mobile ---------- */
.nav__burger { display: none; width: 28px; height: 28px; place-items: center; }
.nav__burger-box { display: block; width: 22px; height: 12px; position: relative; }
.nav__burger-box i {
  position: absolute;
  left: 0;
  width: 22px;
  height: 1.5px;
  background: var(--ink);
  transition: transform var(--dur-ui) var(--ease-out), opacity var(--dur-ui);
}
.nav__burger-box i:nth-child(1) { top: 0; }
.nav__burger-box i:nth-child(2) { bottom: 0; }
.nav__burger-box.is-open i:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.nav__burger-box.is-open i:nth-child(2) { transform: translateY(-5px) rotate(-45deg); }

.drawer {
  position: fixed;
  inset: var(--nav-h) 0 0;
  background: var(--paper);
  transform: translateY(-8px);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity var(--dur-ui) var(--ease-out),
    transform var(--dur-ui) var(--ease-out), visibility var(--dur-ui);
  overflow-y: auto;
  padding-block: var(--sp-2xl) var(--sp-5xl);
}
.drawer.is-open {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  visibility: visible;
}

.drawer__list { display: flex; flex-direction: column; gap: var(--sp-lg); margin-bottom: var(--sp-3xl); }
.drawer__item { color: var(--ink); }
.drawer__item.is-active { color: var(--brand-ink); }

@media (max-width: 991.98px) {
  .nav__menu { display: none; }
  .nav__burger { display: grid; }
  .nav__cta { display: none; }
}

@media (min-width: 992px) {
  .drawer { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nav__item::after,
  .drawer,
  .nav__burger-box i { transition: none; }
}
</style>
