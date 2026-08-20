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
            <!-- Slot rather than a section of its own: anything placed between
                 two .section elements inflates the measured 70px gap and
                 breaks the page rhythm. A breadcrumb goes here, where it also
                 does the eyebrow's job of naming the parent. -->
            <div v-if="$slots.top" class="ih__top"><slot name="top" /></div>
            <p v-else-if="eyebrow" class="ih__eyebrow t-micro">{{ eyebrow }}</p>
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
   pages open on the same measure as the home page's strongest block.
   Stacked as a grid rather than an absolutely-positioned overlay: the frame's
   height used to come from the photograph's 2.9155:1 ratio alone, so once the
   viewport narrowed past the point where the caption was taller than the band
   — 1024px on the partner page, 390px on all of them — the headline was
   simply clipped away by the overflow. In one grid cell the row resolves to
   whichever of the two is taller and the photograph stretches to meet it. */
.ih__frame { position: relative; overflow: hidden; background: var(--ink); display: grid; }

.ih__frame > :deep(.pic) {
  grid-area: 1 / 1;
  align-self: stretch;
  height: 100%;
  /* The band owns its geometry; the photograph does not. AppPicture writes
     the asset's own ratio as an inline style, so an editorial-ratio asset
     passed to this slot billowed the frame to 1170px (which is what /design
     was doing). Overriding an inline style needs !important. object-fit on
     the img crops whatever ratio actually arrives. */
  aspect-ratio: 1300 / 445.9 !important;
}

.ih__frame--plain {
  background: var(--wash-band);
  min-height: 320px;
}

.ih__overlay {
  grid-area: 1 / 1;
  position: relative;
  z-index: 1;
  min-height: 100%;
  display: flex;
  align-items: flex-end;
  padding: var(--sp-3xl);
  /* Two scrims, matching the home hero's approach. The caption sits bottom
     LEFT, so the horizontal ramp is the one doing the work — a purely
     vertical gradient leaves the headline (which sits above the lead) in the
     palest band, and against a near-white photograph such as the factory
     floor that measured 3.05:1. The vertical ramp only seats the block. */
  background:
    linear-gradient(
      100deg,
      rgba(0, 0, 0, 0.82) 0%,
      rgba(0, 0, 0, 0.66) 46%,
      rgba(0, 0, 0, 0.1) 82%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.45) 0%,
      rgba(0, 0, 0, 0.18) 60%,
      rgba(0, 0, 0, 0) 100%
    );
}

.ih__frame--plain .ih__overlay { background: none; }

.ih__inner { max-width: 720px; color: var(--paper); display: flex; flex-direction: column; gap: var(--sp-msm); }
.ih__frame--plain .ih__inner { color: var(--ink); }

/* --t-display-sm: the single step below the 60px reserved for the home
   page's CTA. Shared with StatsBar so the scale stays at seven sizes. */
.ih__title { font-size: 44px; line-height: 52px; letter-spacing: -1.2px; font-weight: 700; text-transform: uppercase; }
:global(:lang(zh)) .ih__title { text-transform: none; letter-spacing: 0; }

.ih__eyebrow { color: rgba(255, 255, 255, 0.72); }
/* Whatever the slot carries inherits the eyebrow's washed-out white so a
   breadcrumb sits behind the headline, not beside it. */
.ih__top { color: rgba(255, 255, 255, 0.72); }
.ih__top :deep(a) { color: inherit; }
.ih__top :deep(a:hover) { color: var(--paper); }
.ih__frame--plain .ih__top { color: var(--ink-60); }
.ih__frame--plain .ih__top :deep(a:hover) { color: var(--brand-ink); }
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
