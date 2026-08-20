<script setup>
import { useI18n } from 'vue-i18n'

import InnerHero from '@/components/sections/InnerHero.vue'
import OfferCards from '@/components/sections/OfferCards.vue'
import ProcessSteps from '@/components/sections/ProcessSteps.vue'
import StatsBar from '@/components/sections/StatsBar.vue'
import EditorialTwoUp from '@/components/sections/EditorialTwoUp.vue'
import EnquiryForm from '@/components/sections/EnquiryForm.vue'
import AppButton from '@/components/primitives/AppButton.vue'

const { t } = useI18n()
</script>

<template>
  <div class="partner">
    <InnerHero
      image="hero-partner"
      :eyebrow="t('nav.partner')"
      :title="t('partner.heroH1')"
      :lead="t('factory.heroSub')"
      position="center 40%"
    >
      <template #actions>
        <AppButton href="#enquire" variant="invert">{{ t('btn.sendEnquiry') }}</AppButton>
      </template>
    </InnerHero>

    <OfferCards :title="t('partner.offersH2')" />

    <ProcessSteps :title="t('partner.processH2')" />

    <StatsBar />

    <EditorialTwoUp
      image="ed-clients"
      :title="t('partner.clientsH2')"
      :body="`${t('partner.clientsBody')}\n\n${t('factory.rdBody1')}\n\n${t('factory.rdBody2')}`"
      :tag="t('footer.creed')"
      flip
    />

    <EnquiryForm />
  </div>
</template>
