<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InnerHero from '@/components/sections/InnerHero.vue'
import ComingSoon from '@/components/sections/ComingSoon.vue'

const { t } = useI18n()
const outline = computed(() => [t('contact.addressValue'), t('contact.phoneValue'), t('contact.exportValue'), t('contact.teamValue'), t('contact.channelsValue')])
</script>

<template>
  <div>
    <InnerHero
      image="hero-partner"
      :eyebrow="t('nav.contact')"
      :title="t('contact.h1')"
      :lead="t('contact.companyEn')"
    />
    <ComingSoon :outline="outline" />
  </div>
</template>
