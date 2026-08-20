<script setup>
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteNav from '@/components/layout/SiteNav.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { applyLocale } from '@/i18n'

const { t, locale } = useI18n()
const route = useRoute()

function syncHead() {
  // A dynamic route resolves its own key from the params.
  const metaKey = route.meta?.titleKey
  const key = typeof metaKey === 'function' ? metaKey(route) : metaKey
  const name = t('site.name')
  const title = route.meta?.bare
    ? t('site.metaTitle')
    : key
      ? `${t(key)} — ${name}`
      : name
  // Several headlines carry explicit newlines for the layout; a <title> that
  // contains them renders with the breaks intact in the tab and in search.
  document.title = title.replace(/\s+/g, ' ').trim()

  let desc = document.querySelector('meta[name="description"]')
  if (!desc) {
    desc = document.createElement('meta')
    desc.setAttribute('name', 'description')
    document.head.appendChild(desc)
  }
  desc.setAttribute('content', t('site.metaDescription'))
}

onMounted(() => {
  applyLocale(locale.value)
  syncHead()
})
watch([() => route.fullPath, locale], syncHead)
</script>

<template>
  <a class="skip-link t-body" href="#main">{{ t('ui.skipToContent') }}</a>
  <SiteNav />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="route.path" />
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style scoped>
main { display: block; }
main:focus { outline: none; }
</style>
