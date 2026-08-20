<script setup>
import { computed } from 'vue'
import AppPicture from '@/components/primitives/AppPicture.vue'

const props = defineProps({
  image: { type: String, required: true },
  /** square variant swapped in below 768 — ALO's mobile hero is 1:1 */
  imageMobile: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  sub1: { type: String, default: '' },
  sub2: { type: String, default: '' },
  /** left | right — which side the caption block sits on */
  align: { type: String, default: 'left' },
  /** light text over imagery, or dark text over a pale area of the photo */
  tone: { type: String, default: 'light' },
  eager: { type: Boolean, default: false },
  position: { type: String, default: 'center' },
})

const captionClass = computed(() => [
  `hero__caption--${props.align}`,
  `hero__caption--${props.tone}`,
])
</script>

<template>
  <section class="hero section">
    <div class="hero__media hero__media--wide">
      <AppPicture :id="image" :eager="eager" sizes="100vw" :position="position" />
    </div>
    <div v-if="imageMobile" class="hero__media hero__media--sq">
      <AppPicture :id="imageMobile" :eager="eager" sizes="100vw" :position="position" />
    </div>

    <div class="hero__inner container-a">
      <div class="hero__caption" :class="captionClass">
        <p v-if="eyebrow" class="hero__eyebrow t-micro">{{ eyebrow }}</p>
        <h1 v-if="title" class="hero__title t-display u-prewrap u-balance">{{ title }}</h1>
        <p v-if="sub1" class="hero__sub t-body-semi">{{ sub1 }}</p>
        <p v-if="sub2" class="hero__sub t-body">{{ sub2 }}</p>
        <div v-if="$slots.actions" class="hero__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ALO hero: full-bleed 1440×575.25, image aspect 1920/743, caption
   absolutely positioned inside with 20px of vertical padding. */
.hero { position: relative; background: var(--ink); }

.hero__media--wide { display: block; }
.hero__media--sq { display: none; }

.hero__inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  /* Above the scrim. Without this the ::after gradient paints over the
     caption — same stacking context, later in source order — and the
     headline drops to roughly 2:1 contrast. */
  z-index: 2;
}

.hero__caption {
  pointer-events: auto;
  /* Wide enough for an eleven-character CJK headline at 60px without
     running the type over the subject on the right. */
  max-width: 700px;
  padding-block: var(--sp-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--sp-msm);
}

.hero__caption--left { margin-right: auto; }
.hero__caption--right { margin-left: auto; text-align: right; align-items: flex-end; }

.hero__caption--light { color: var(--paper); }
.hero__caption--dark { color: var(--ink); }

.hero__eyebrow { opacity: 0.8; }
.hero__title { margin-bottom: var(--sp-sm); }
.hero__caption--light .hero__sub { color: rgba(255, 255, 255, 0.92); }
.hero__caption--dark .hero__sub { color: var(--ink-60); }
.hero__sub { max-width: 52ch; }

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-msm);
  margin-top: var(--sp-mlg);
}

/* A scrim only where the text sits — never darken the whole photograph.
   Sized generously so the AA of 60px type still clears 4.5:1. */
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.hero:has(.hero__caption--light.hero__caption--left)::after {
  background: linear-gradient(
    100deg,
    rgba(0, 0, 0, 0.68) 0%,
    rgba(0, 0, 0, 0.46) 38%,
    rgba(0, 0, 0, 0) 72%
  );
}
.hero:has(.hero__caption--light.hero__caption--right)::after {
  background: linear-gradient(
    260deg,
    rgba(0, 0, 0, 0.68) 0%,
    rgba(0, 0, 0, 0.46) 38%,
    rgba(0, 0, 0, 0) 72%
  );
}

@media (max-width: 767.98px) {
  .hero__media--wide { display: none; }
  .hero__media--sq { display: block; }

  /* Below 768 the caption is taller than the 1:1 image, so overlaying it
     pushes the headline up under the sticky nav. Stack instead: image, then
     caption on the ink ground. Legibility stops depending on the photo. */
  .hero { display: flex; flex-direction: column; background: var(--ink); }
  .hero__inner { position: static; display: block; }
  .hero__caption {
    padding-block: var(--sp-xl) var(--sp-2xl);
    max-width: none;
    color: var(--paper);
  }
  .hero__caption--right { text-align: left; align-items: flex-start; margin-left: 0; }
  .hero__caption--dark { color: var(--paper); }
  .hero__caption--dark .hero__sub { color: rgba(255, 255, 255, 0.82); }
  .hero::after { display: none; }
}

</style>
