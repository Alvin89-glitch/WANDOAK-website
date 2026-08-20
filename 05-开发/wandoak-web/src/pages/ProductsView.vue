<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { categories } from '@/data/site'
import InnerHero from '@/components/sections/InnerHero.vue'
import CardGrid4 from '@/components/sections/CardGrid4.vue'
import ProductLine from '@/components/sections/ProductLine.vue'
import EditorialTwoUp from '@/components/sections/EditorialTwoUp.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import AppButton from '@/components/primitives/AppButton.vue'
import TagRow from '@/components/primitives/TagRow.vue'

const { t } = useI18n()

/* Still a plain row of names in the fabric block — the four-up below is the
   navigation, this is just a list of what the range covers. */
const categoryNames = computed(() => categories.map((c) => t(c.nameKey)).join(' · '))
</script>

<template>
  <div class="products">
    <InnerHero
      image="hero-products"
      :eyebrow="t('nav.products')"
      :title="t('products.heroH1')"
      :lead="t('products.heroLead')"
      position="center 45%"
    />

    <!-- The hub. These four cards are the way into the second level, which is
         a different job from the home page's four-up even though it is the
         same four photographs. -->
    <CardGrid4
      :items="categories"
      :eyebrow="t('home.products.h2')"
      :title="t('products.cat.hubH2')"
    />

    <ProductLine
      :title="t('products.line.h2')"
      :lead="t('products.line.lead')"
    />

    <EditorialTwoUp
      image="ed-handfeel"
      :title="t('products.handfeelH3')"
      :body="t('products.handfeelBody')"
      :tag="t('nav.design')"
    >
      <template #actions>
        <TagRow :value="categoryNames" />
      </template>
    </EditorialTwoUp>

    <EditorialTwoUp
      image="ed-compression"
      :title="t('products.compressionH3')"
      :body="t('products.compressionBody')"
      :tag="t('products.catBottoms')"
      position="center 35%"
      flip
    />

    <CtaBanner
      image="cta-lounge"
      :eyebrow="t('nav.factory')"
      :title="t('products.ctaH2')"
      :lead="t('factory.heroSub')"
      position="center 40%"
    >
      <template #actions>
        <AppButton :to="{ name: 'factory' }" variant="invert">{{ t('btn.tourFactory') }}</AppButton>
        <AppButton :to="{ name: 'partner' }" variant="outline-invert">{{ t('btn.enquire') }}</AppButton>
      </template>
    </CtaBanner>
  </div>
</template>
