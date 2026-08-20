<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('about.originH2'), t('about.nameH2'), t('about.believeH2'), t('about.audienceH2')])
</script>

<template>
  <div>
    <InnerHero
      image="ed-who"
      :eyebrow="t('nav.about')"
      :title="t('about.heroH1')"
      :lead="t('about.believeQuote').split('\n')[0]"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
