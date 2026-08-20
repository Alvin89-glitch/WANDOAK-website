<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('factory.companyH2'), t('factory.capabilityH2'), t('factory.rdH2'), t('factory.fabricH2'), t('factory.opsH2')])
</script>

<template>
  <div>
    <InnerHero
      image="cta-floor"
      :eyebrow="t('nav.factory')"
      :title="t('factory.heroH1')"
      :lead="t('factory.heroSub')"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
