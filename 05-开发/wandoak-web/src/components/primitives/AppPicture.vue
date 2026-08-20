<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import manifest from '@/data/images.json'

const props = defineProps({
  /** id from src/data/images.json */
  id: { type: String, required: true },
  /** `sizes` attribute — tell the browser the slot width so it picks well */
  sizes: { type: String, default: '100vw' },
  /** true only for the LCP image */
  eager: { type: Boolean, default: false },
  /** object-position, e.g. "center 30%" */
  position: { type: String, default: 'center' },
  /** overrides the manifest alt; pass "" for decorative images */
  alt: { type: String, default: null },
})

const { locale } = useI18n()
const asset = computed(() => manifest[props.id] ?? null)

const srcset = (ext) =>
  asset.value?.sets?.[ext]?.map((s) => `${s.url} ${s.w}w`).join(', ') ?? ''

const fallback = computed(() => {
  const jpg = asset.value?.sets?.jpg ?? []
  return jpg[Math.min(2, jpg.length - 1)]?.url ?? ''
})

const imgEl = ref(null)
const loaded = ref(false)

/* A cached image can finish before Vue binds @load, which would leave it
   stuck at opacity 0. Check `complete` on mount as well. */
onMounted(() => {
  if (imgEl.value?.complete) loaded.value = true
})

const altText = computed(() => {
  if (props.alt !== null) return props.alt
  const a = asset.value?.alt
  if (!a) return ''
  return a[locale.value] ?? a.en ?? ''
})
</script>

<template>
  <div
    v-if="asset"
    class="pic"
    :style="{
      aspectRatio: String(asset.ratio),
      backgroundImage: `url(${asset.lqip})`,
    }"
  >
    <picture>
      <source :srcset="srcset('avif')" :sizes="sizes" type="image/avif" />
      <source :srcset="srcset('webp')" :sizes="sizes" type="image/webp" />
      <img
        ref="imgEl"
        :class="{ 'is-loaded': loaded }"
        :src="fallback"
        :srcset="srcset('jpg')"
        :sizes="sizes"
        :alt="altText"
        :width="asset.native.w"
        :height="Math.round(asset.native.w / asset.ratio)"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        :decoding="eager ? 'sync' : 'async'"
        :style="{ objectPosition: position }"
        @load="loaded = true"
      />
    </picture>
  </div>
</template>

<style scoped>
/* The LQIP sits behind the real image and is covered as it decodes,
   which is what ALO's blur-up class does. */
.pic {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-color: var(--wash);
}

picture,
img {
  display: block;
  width: 100%;
  height: 100%;
}

img {
  object-fit: cover;
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}

img.is-loaded {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  img {
    opacity: 1;
    transition: none;
  }
}
</style>
