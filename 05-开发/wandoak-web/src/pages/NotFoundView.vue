<script setup>
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/primitives/AppButton.vue'

const { t } = useI18n()
</script>

<template>
  <section class="nf section">
    <div class="container-c">
      <p class="nf__code t-micro">404</p>
      <h1 class="t-h2 u-balance">{{ t('ui.notFoundTitle') }}</h1>
      <p class="nf__body t-lead">{{ t('ui.notFoundBody') }}</p>
      <AppButton :to="{ name: 'home' }" class="nf__cta">{{ t('ui.goHome') }}</AppButton>
    </div>
  </section>
</template>

<style scoped>
.nf { padding-block: var(--sp-9xl); }
.nf__code { color: var(--brand-ink); margin-bottom: var(--sp-md); }
.nf__body { color: var(--ink-60); margin-top: var(--sp-md); max-width: 48ch; }
.nf__cta { margin-top: var(--sp-xl); }
</style>
