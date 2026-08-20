<script setup>
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  image: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  position: { type: String, default: 'center' },
})

const { el, shown } = useReveal({ threshold: 0.1 })
</script>

<template>
  <section ref="el" class="cta section reveal" :class="{ 'is-in': shown }">
    <div class="container-c">
      <div class="cta__frame">
        <AppPicture :id="image" :position="position" sizes="(max-width: 767px) 100vw, 1300px" />
        <div class="cta__overlay">
          <div class="cta__inner">
            <p v-if="eyebrow" class="cta__eyebrow t-micro">{{ eyebrow }}</p>
            <h2 class="cta__title t-display u-prewrap u-balance">{{ title }}</h2>
            <p v-if="lead" class="cta__lead t-lead">{{ lead }}</p>
            <div v-if="$slots.actions" class="cta__actions"><slot name="actions" /></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The one place on the page allowed to use 60/72 display type — ALO shows
   exactly one instance of it, on this section. */
.cta__frame { position: relative; overflow: hidden; background: var(--ink); }

.cta__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--sp-2xl);
  /* The factory floor is a bright, busy photograph; 60px white type needs
     a heavier ground than a hero shot against sky does. */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.56) 0%,
    rgba(0, 0, 0, 0.68) 100%
  );
}

.cta__inner {
  max-width: 880px;
  text-align: center;
  color: var(--paper);
  display: flex;
  flex-direction: column;
  gap: var(--sp-xs);
}

.cta__eyebrow { color: rgba(255, 255, 255, 0.7); }
.cta__lead { color: rgba(255, 255, 255, 0.85); margin-top: var(--sp-sm); }
.cta__actions { margin-top: var(--sp-xl); display: flex; justify-content: center; gap: var(--sp-msm); flex-wrap: wrap; }

@media (max-width: 767.98px) {
  .cta__overlay { padding: var(--sp-lg); }
}
</style>
