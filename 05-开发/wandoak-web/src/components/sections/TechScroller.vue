<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { technologies } from '@/data/site'
import AppPicture from '@/components/primitives/AppPicture.vue'
import ScrollerArrows from '@/components/primitives/ScrollerArrows.vue'
import AppLink from '@/components/primitives/AppLink.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  title: { type: String, default: '' },
  cta: { type: String, default: '' },
  ctaTo: { type: String, default: '' },
})

const { t } = useI18n()
const { el, shown } = useReveal()

const track = ref(null)
const scrollLeft = ref(0)
const maxScroll = ref(0)

const atStart = computed(() => scrollLeft.value <= 2)
const atEnd = computed(() => scrollLeft.value >= maxScroll.value - 2)

function measure() {
  const n = track.value
  if (!n) return
  scrollLeft.value = n.scrollLeft
  maxScroll.value = Math.max(0, n.scrollWidth - n.clientWidth)
}

function page(dir) {
  const n = track.value
  if (!n) return
  const card = n.querySelector('li')
  const step = card ? card.getBoundingClientRect().width + 12 : n.clientWidth * 0.8
  n.scrollBy({ left: dir * step * 2, behavior: 'smooth' })
}

let ro = null
onMounted(() => {
  measure()
  track.value?.addEventListener('scroll', measure, { passive: true })
  ro = new ResizeObserver(measure)
  if (track.value) ro.observe(track.value)
})
onBeforeUnmount(() => {
  track.value?.removeEventListener('scroll', measure)
  ro?.disconnect()
})
</script>

<template>
  <section ref="el" class="tech section reveal" :class="{ 'is-in': shown }">
    <div class="container-b">
      <!-- ALO's carousel header: heading left, a text link right, arrows
           beside it. No lead paragraph. -->
      <header class="tech__head">
        <h2 v-if="title" class="t-h2 u-balance">{{ title }}</h2>
        <div class="tech__head-end">
          <AppLink v-if="cta && ctaTo" :to="{ name: ctaTo }" class="tech__cta">{{ cta }}</AppLink>
          <ScrollerArrows
          :at-start="atStart"
          :at-end="atEnd"
          :prev-label="t('ui.prev')"
          :next-label="t('ui.next')"
            @prev="page(-1)"
            @next="page(1)"
          />
        </div>
      </header>

      <ul ref="track" class="hscroll tech__track">
        <li v-for="tech in technologies" :key="tech.id" class="tech__card">
          <div class="tech__media">
            <AppPicture :id="tech.image" sizes="(max-width: 575px) 78vw, 272px" />
          </div>
          <h3 class="tech__name t-h6">{{ t(tech.nameKey) }}</h3>
          <p class="tech__desc t-sm">{{ t(tech.descKey) }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Mirrors ALO's "Shop by Color" rail: Container B, 272×408 cards, 12px gap,
   32px of padding below the track. */
.tech__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-xl);
  margin-bottom: var(--sp-mlg);
}

.tech__head-end { display: flex; align-items: center; gap: var(--sp-lg); }

@media (max-width: 575.98px) {
  .tech__head { align-items: flex-start; flex-direction: column; gap: var(--sp-md); }
}

.tech__media { overflow: hidden; }
.tech__media :deep(img) { transition: transform var(--dur-hover) var(--ease-out); }
.tech__card:hover .tech__media :deep(img) { transform: scale(1.03); }

.tech__name { margin-top: var(--sp-md); }
.tech__desc { margin-top: var(--sp-xs); color: var(--ink-60); }

@media (prefers-reduced-motion: reduce) {
  .tech__media :deep(img) { transition: none; }
  .tech__card:hover .tech__media :deep(img) { transform: none; }
}
</style>
