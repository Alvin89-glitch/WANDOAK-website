<script setup>
import { useI18n } from 'vue-i18n'
import { styleSpecFields } from '@/data/products'
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

const props = defineProps({
  /** rows from src/data/products.js */
  items: { type: Array, required: true },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
})

const { t, te } = useI18n()
const { el, shown } = useReveal()

const copy = (style, field) => {
  const key = `products.styles.${style.code}.${field}`
  return te(key) ? t(key) : ''
}

/* A spec cell reads from the copy deck, from the data file, or is one of the
   two the range sheet still owes us. */
function value(style, field) {
  if (field.pending) return { text: t('products.cat.pending'), pending: true }
  if (field.from === 'data') return { text: style[field.id] ?? '', pending: false }
  return { text: copy(style, field.id), pending: false }
}

/* Badges are facts from the sheet, not decoration: who it is cut for, what it
   is used for, and the two properties a buyer scans for. */
function badges(style) {
  const out = [t(`products.cat.gender${style.gender === 'men' ? 'Men' : 'Women'}`)]
  if (style.use) out.push(t(`products.cat.use${style.use[0].toUpperCase()}${style.use.slice(1)}`))
  if (style.patented) out.push(t('products.cat.patented'))
  if (style.recycled) out.push(t('products.cat.recycled'))
  return out
}

/* Always three tracks, even for a category holding one style: a lone card
   at half the row width reads as a layout fault rather than a short range. */
const COLUMNS = 3
const columns = () => COLUMNS
</script>

<template>
  <section ref="el" class="sku section reveal" :class="{ 'is-in': shown }">
    <div class="container-a">
      <header v-if="title" class="sec-head">
        <h2 class="t-h2 u-balance">{{ title }}</h2>
        <p v-if="lead" class="sec-head__lead t-lead">{{ lead }}</p>
      </header>

      <ul class="grid sku__grid" :class="`grid-${columns()}`">
        <li v-for="style in items" :key="style.code" class="sku__card">
          <div class="sku__media">
            <AppPicture
              :id="style.image"
              :sizes="`(max-width: 575px) 100vw, (max-width: 991px) 50vw, ${Math.ceil(((1350 - 32 * (columns() - 1)) / columns() / 1440) * 100)}vw`"
            />
          </div>

          <p class="sku__code t-micro u-tnum">{{ style.code }}</p>
          <h3 class="sku__name t-h6">{{ copy(style, 'name') }}</h3>

          <ul class="sku__badges">
            <li v-for="badge in badges(style)" :key="badge" class="sku__badge t-micro">{{ badge }}</li>
          </ul>

          <p v-if="style.desc !== false" class="sku__desc t-sm">{{ copy(style, 'desc') }}</p>

          <dl class="sku__specs">
            <div v-for="field in styleSpecFields" :key="field.id" class="sku__row">
              <dt class="sku__label t-sm">{{ t(field.labelKey) }}</dt>
              <dd
                class="sku__value t-sm"
                :class="{ 'sku__value--pending': value(style, field).pending }"
              >{{ value(style, field).text }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sku__card {
  display: flex;
  flex-direction: column;
  border-top: 2px solid var(--ink);
  padding-top: var(--sp-md);
}

.sku__media { overflow: hidden; }

.sku__code { margin-top: var(--sp-md); color: var(--ink-60); }
.sku__name { margin-top: var(--sp-xs); }

.sku__badges {
  margin-top: var(--sp-msm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-xs);
}
.sku__badge {
  padding: 2px var(--sp-sm);
  background: var(--wash-band);
  color: var(--ink-75);
}

.sku__desc { margin-top: var(--sp-msm); color: var(--ink-60); }

/* Pushed to the foot of the card so the spec tables line up across the row
   however long the descriptions run. */
.sku__specs { margin-top: auto; padding-top: var(--sp-md); }

.sku__row {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: var(--sp-sm);
  padding: var(--sp-sm) 0;
  border-bottom: 1px solid var(--line-soft);
}
.sku__row:last-child { border-bottom: 0; }

.sku__label { color: var(--ink-60); }
.sku__value { color: var(--ink); }
.sku__value--pending { color: var(--ink-40); font-style: italic; }
</style>
