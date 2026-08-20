<script setup>
import AppPicture from '@/components/primitives/AppPicture.vue'

defineProps({
  image: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  position: { type: String, default: 'center' },
})
</script>

<template>
  <section class="ih section">
    <div class="container-c">
      <div class="ih__frame" :class="{ 'ih__frame--plain': !image }">
        <AppPicture v-if="image" :id="image" :position="position" eager sizes="(max-width: 767px) 100vw, 1300px" />
        <div class="ih__overlay">
          <div class="ih__inner">
            <p v-if="eyebrow" class="ih__eyebrow t-micro">{{ eyebrow }}</p>
            <h1 class="ih__title u-prewrap u-balance">{{ title }}</h1>
            <p v-if="lead" class="ih__lead t-lead">{{ lead }}</p>
            <div v-if="$slots.actions" class="ih__actions"><slot name="actions" /></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Borrows the full-width CTA's geometry (Container C, 1300×445.9) so inner
   pages open on the same measure as the home page's strongest block. */
.ih__frame { position: relative; overflow: hidden; background: var(--ink); }

.ih__frame--plain {
  background: var(--wash-band);
  min-height: 320px;
}

.ih__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: var(--sp-3xl);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.28) 48%,
    rgba(0, 0, 0, 0.06) 100%
  );
}

.ih__frame--plain .ih__overlay { position: static; background: none; }

.ih__inner { max-width: 800px; color: var(--paper); display: flex; flex-direction: column; gap: var(--sp-msm); }
.ih__frame--plain .ih__inner { color: var(--ink); }

/* --t-display-sm: the single step below the 60px reserved for the home
   page's CTA. Shared with StatsBar so the scale stays at seven sizes. */
.ih__title { font-size: 44px; line-height: 52px; letter-spacing: -1.2px; font-weight: 700; text-transform: uppercase; }
:global(:lang(zh)) .ih__title { text-transform: none; letter-spacing: 0; }

.ih__eyebrow { color: rgba(255, 255, 255, 0.72); }
.ih__frame--plain .ih__eyebrow { color: var(--ink-60); }
.ih__lead { color: rgba(255, 255, 255, 0.86); max-width: 62ch; }
.ih__frame--plain .ih__lead { color: var(--ink-60); }
.ih__actions { margin-top: var(--sp-mlg); display: flex; gap: var(--sp-msm); flex-wrap: wrap; }

@media (max-width: 991.98px) {
  .ih__title { font-size: 32px; line-height: 38px; letter-spacing: -0.8px; }
  .ih__overlay { padding: var(--sp-lg); }
}
@media (max-width: 575.98px) {
  .ih__title { font-size: 32px; line-height: 38px; letter-spacing: -0.8px; }
}
</style>
