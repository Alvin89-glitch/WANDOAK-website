<script setup>
import { useI18n } from 'vue-i18n'

import InnerHero from '@/components/sections/InnerHero.vue'
import SpecSheet from '@/components/sections/SpecSheet.vue'
import MethodPair from '@/components/sections/MethodPair.vue'
import EditorialTwoUp from '@/components/sections/EditorialTwoUp.vue'
import FloorOps from '@/components/sections/FloorOps.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import AppButton from '@/components/primitives/AppButton.vue'
import TagRow from '@/components/primitives/TagRow.vue'

const { t } = useI18n()
</script>

<template>
  <div class="factory">
    <InnerHero
      image="hero-factory"
      :eyebrow="t('nav.factory')"
      :title="t('factory.heroH1')"
      :lead="t('factory.heroSub')"
      position="center 40%"
    />

    <!-- The full spec sheet. StatsBar animates three of these figures on the
         home page; a sourcing buyer landing here also needs the address and
         the machine split, so this page carries the sheet, not the counters. -->
    <SpecSheet
      :title="t('factory.companyH2')"
      :name="t('factory.companyName')"
      :body="t('factory.companyBody')"
      :creed="t('factory.companyCreed')"
    />

    <MethodPair
      :title="t('factory.capabilityH2')"
      :note="t('factory.capabilityNote')"
    />

    <!-- Development and sourcing live here rather than on the partner page:
         this is the page with the floor to back the claim up. -->
    <EditorialTwoUp
      image="fac-team"
      :title="t('factory.rdH2')"
      :body="`${t('factory.rdBody1')}\n\n${t('factory.rdBody2')}`"
      :tag="t('nav.design')"
    />

    <EditorialTwoUp
      image="ed-sourcing"
      :title="t('factory.fabricH2')"
      :body="t('factory.fabricBody')"
      flip
    >
      <template #actions>
        <TagRow :value="t('factory.fabricTags')" />
      </template>
    </EditorialTwoUp>

    <FloorOps />

    <CtaBanner
      image="hero-partner"
      :eyebrow="t('nav.partner')"
      :title="t('factory.ctaH2')"
      :lead="t('partner.formLead')"
      position="center 45%"
    >
      <template #actions>
        <AppButton :to="{ name: 'partner' }" variant="invert">{{ t('btn.enquire') }}</AppButton>
      </template>
    </CtaBanner>
  </div>
</template>
