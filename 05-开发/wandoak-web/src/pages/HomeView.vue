<script setup>
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/site'

import HeroFull from '@/components/sections/HeroFull.vue'
import StatsBar from '@/components/sections/StatsBar.vue'
import EditorialTwoUp from '@/components/sections/EditorialTwoUp.vue'
import CardGrid4 from '@/components/sections/CardGrid4.vue'
import ScenarioRow from '@/components/sections/ScenarioRow.vue'
import TechScroller from '@/components/sections/TechScroller.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import CertGrid from '@/components/sections/CertGrid.vue'
import AppButton from '@/components/primitives/AppButton.vue'
import AppLink from '@/components/primitives/AppLink.vue'

const { t } = useI18n()
</script>

<template>
  <!--
    Eleven slots, mapped one-to-one onto ALO's measured home page.
    See SPEC §4.1 for the correspondence table.
  -->
  <div class="home">
    <!-- 1 · Hero A (575.25 full-bleed) -->
    <HeroFull
      image="hero-home"
      image-mobile="hero-home-sq"
      :title="t('home.hero.h1')"
      :sub1="t('home.hero.sub1')"
      :sub2="t('home.hero.sub2')"
      align="left"
      tone="light"
      eager
      position="center 35%"
    >
      <template #actions>
        <AppButton :to="{ name: 'partner' }" variant="invert">{{ t('btn.enquire') }}</AppButton>
        <AppButton :to="{ name: 'products' }" variant="outline-invert">{{ t('btn.exploreRange') }}</AppButton>
      </template>
    </HeroFull>

    <!-- 2 · Stats (new — the fastest trust signal at a trade show) -->
    <StatsBar />

    <!-- 3 · Who we are (ALO's product carousel slot) -->
    <EditorialTwoUp
      image="ed-who"
      :eyebrow="t('home.who.eyebrow')"
      :title="t('home.who.h2')"
      :body="t('home.who.body')"
      :tag="t('home.who.tag')"
      position="center 22%"
    />

    <!-- 4 · Category grid (ALO's Trending Now four-up) -->
    <CardGrid4 :items="categories" :title="t('home.products.h2')">
      <template #actions>
        <AppLink :to="{ name: 'products' }">{{ t('btn.allProducts') }}</AppLink>
      </template>
    </CardGrid4>

    <!-- 5 · Hero B — design philosophy -->
    <HeroFull
      image="hero-design"
      image-mobile="hero-design-sq"
      :eyebrow="t('home.design.eyebrow')"
      :title="t('home.design.h2')"
      :sub2="t('home.design.body')"
      align="left"
      tone="light"
      position="center 40%"
    >
      <template #actions>
        <AppButton :to="{ name: 'design' }" variant="invert">{{ t('btn.seeDesign') }}</AppButton>
      </template>
    </HeroFull>

    <!-- 6 · Scenarios on the tinted band (ALO's Shop By Activity) -->
    <!-- The lead that used to sit here is the products page's hero lead;
         it reads once, on that page. -->
    <ScenarioRow :title="t('products.scenariosH2')" />

    <!-- 7 · Two editorial blocks (ALO's 2-up editorial) -->
    <EditorialTwoUp
      image="ed-fit"
      :eyebrow="t('nav.design')"
      :title="t('design.s2H2')"
      :body="t('design.s2Body')"
      :tag="t('design.s4H2')"
      flip
    >
      <template #actions>
        <AppLink :to="{ name: 'design' }">{{ t('btn.seeDesign') }}</AppLink>
      </template>
    </EditorialTwoUp>

    <EditorialTwoUp
      image="ed-quality"
      :eyebrow="t('nav.quality')"
      :title="t('quality.braH2')"
      :body="`${t('quality.braStat1Value')} — ${t('quality.braStat1Label')}\n\n${t('quality.braStat2Value')} — ${t('quality.braStat2Label')}\n\n${t('quality.braStat3Value')} — ${t('quality.braStat3Label')}`"
      :tag="t('quality.processAqlTitle')"
    >
      <template #actions>
        <AppLink :to="{ name: 'quality' }">{{ t('quality.processH2') }}</AppLink>
      </template>
    </EditorialTwoUp>

    <!-- 8 · Full-width CTA — the page's only 60px headline -->
    <CtaBanner
      image="cta-floor"
      :eyebrow="t('nav.factory')"
      :title="t('home.capability.h2')"
      :lead="t('factory.heroSub')"
    >
      <template #actions>
        <AppButton :to="{ name: 'factory' }" variant="invert">{{ t('btn.tourFactory') }}</AppButton>
      </template>
    </CtaBanner>

    <!-- 9 · Technology rail (ALO's Shop by Color) -->
    <TechScroller :title="t('design.s4H2')" :cta="t('btn.seeDesign')" cta-to="design" />

    <!-- 10 · Certifications on the tinted band (ALO's UGC feed) -->
    <CertGrid
      :title="t('quality.certsH2')"
      :lead="t('quality.processGerman')"
      :note="t('quality.certsCommitment')"
    />
  </div>
</template>
