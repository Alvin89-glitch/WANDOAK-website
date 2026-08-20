<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('design.s1H2'), t('design.s2H2'), t('design.s3H2'), t('design.s4H2'), t('design.principlesH2')])
</script>

<template>
  <div>
    <InnerHero
      image="ed-transthermal"
      :eyebrow="t('nav.design')"
      :title="t('design.heroH1')"
      :lead="t('design.heroSub')"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
