<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { categories, categoryBySlug } from '@/data/site'
import { stylesForCategory } from '@/data/products'

import InnerHero from '@/components/sections/InnerHero.vue'
import PlaceholderNotice from '@/components/sections/PlaceholderNotice.vue'
import SkuGrid from '@/components/sections/SkuGrid.vue'
import CardGrid4 from '@/components/sections/CardGrid4.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import AppButton from '@/components/primitives/AppButton.vue'
import BreadCrumb from '@/components/primitives/BreadCrumb.vue'

const { t } = useI18n()
const route = useRoute()

/* The router's beforeEnter turns an unknown slug into a 404, so by the time
   this renders the category exists. */
const category = computed(() => categoryBySlug(route.params.category))
const styles = computed(() => stylesForCategory(route.params.category))

/* The other three, so a visitor can move sideways without going back up. */
const siblings = computed(() => categories.filter((c) => c.slug !== route.params.category))

const trail = computed(() => [
  { label: t('nav.products'), to: { name: 'products' } },
  { label: t(category.value.titleKey) },
])
</script>

<template>
  <div v-if="category" class="cat">
    <InnerHero
      :image="category.hero"
      :title="t(category.titleKey)"
      :lead="t(category.descKey)"
    >
      <template #top>
        <BreadCrumb :trail="trail" />
      </template>
      <template #actions>
        <AppButton :to="{ name: 'partner' }" variant="invert">{{ t('btn.enquire') }}</AppButton>
      </template>
    </InnerHero>

    <PlaceholderNotice />

    <SkuGrid
      :items="styles"
      :title="t('products.cat.stylesH2')"
      :lead="t('products.cat.stylesLead')"
    />

    <CardGrid4
      :items="siblings"
      :columns="3"
      :eyebrow="t('products.cat.backToHub')"
      :title="t('products.cat.hubH2')"
    />

    <CtaBanner
      image="cta-lounge"
      :eyebrow="t('nav.partner')"
      :title="t('products.ctaH2')"
      :lead="t('factory.heroSub')"
      position="center 40%"
    >
      <template #actions>
        <AppButton :to="{ name: 'partner' }" variant="invert">{{ t('btn.enquire') }}</AppButton>
        <AppButton :to="{ name: 'factory' }" variant="outline-invert">{{ t('btn.tourFactory') }}</AppButton>
      </template>
    </CtaBanner>
  </div>
</template>
