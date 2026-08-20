<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('products.catBra'), t('products.catBottoms'), t('products.catTops'), t('products.catOuter'), t('products.scenariosH2'), t('products.compressionH3')])
</script>

<template>
  <div>
    <InnerHero
      image="hero-design"
      :eyebrow="t('nav.products')"
      :title="t('products.heroH1')"
      :lead="t('products.heroLead')"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
