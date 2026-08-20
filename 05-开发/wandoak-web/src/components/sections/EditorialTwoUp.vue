<script setup>
import AppPicture from '@/components/primitives/AppPicture.vue'
import { useReveal } from '@/composables/useReveal'

defineProps({
  image: { type: String, required: true },
  tag: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  /** image on the left (default) or the right */
  flip: { type: Boolean, default: false },
  position: { type: String, default: 'center' },
})

const { el, shown } = useReveal()
</script>

<template>
  <section ref="el" class="ed section reveal" :class="{ 'is-in': shown, 'ed--flip': flip }">
    <div class="container-c">
      <div class="ed__grid">
        <figure class="ed__media">
          <AppPicture
            :id="image"
            :position="position"
            sizes="(max-width: 991px) 100vw, 45vw"
          />
          <!-- ALO's best detail: a white plate that sits over the foot of the
               image and carries the section's tag. -->
          <figcaption v-if="tag" class="ed__plate t-tag">{{ tag }}</figcaption>
        </figure>

        <div class="ed__text">
          <p v-if="eyebrow" class="ed__eyebrow t-micro">{{ eyebrow }}</p>
          <h2 v-if="title" class="t-editorial u-balance">{{ title }}</h2>
          <div v-if="body" class="ed__body">
            <p v-for="(para, i) in body.split('\n\n')" :key="i" class="t-body">{{ para }}</p>
          </div>
          <div v-if="$slots.actions" class="ed__actions"><slot name="actions" /></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Container C, 2-up: (1300 − 15) / 2 = 642.5 per column. */
.ed__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gutter-2);
  align-items: center;
}

.ed--flip .ed__media { order: 2; }

.ed__media { position: relative; margin: 0; overflow: hidden; }
.ed__media :deep(img) { transition: transform var(--dur-hover) var(--ease-out); }
.ed__media:hover :deep(img) { transform: scale(1.03); }

.ed__plate {
  position: absolute;
  left: 0;
  bottom: 0;
  background: var(--paper);
  color: var(--ink);
  padding: 15px 30px;
  max-width: 80%;
}

.ed__text { display: flex; flex-direction: column; gap: var(--sp-md); }
.ed__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-msm);
  color: var(--ink-60);
}
.ed__eyebrow::before {
  content: "";
  width: 26px;
  height: 2px;
  background: var(--brand);
  display: block;
  flex: none;
}

.ed__body { display: flex; flex-direction: column; gap: var(--sp-md); color: var(--ink-60); max-width: 56ch; }
.ed__actions { margin-top: var(--sp-sm); }

@media (max-width: 991.98px) {
  .ed__grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-xl); }
  .ed--flip .ed__media { order: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ed__media :deep(img) { transition: none; }
  .ed__media:hover :deep(img) { transform: none; }
}
</style>
