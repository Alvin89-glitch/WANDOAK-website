<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('quality.processH2'), t('quality.braH2'), t('quality.certsH2')])
</script>

<template>
  <div>
    <InnerHero
      image="ed-quality"
      :eyebrow="t('nav.quality')"
      :title="t('quality.heroH1')"
      :lead="t('quality.processGerman')"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
