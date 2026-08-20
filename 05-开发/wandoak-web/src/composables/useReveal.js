import { onMounted, onBeforeUnmount, ref } from 'vue'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Adds `.is-in` once the element crosses into view. One-shot — ALO has no
 * scroll-driven animation at all, so this is the entire motion budget for
 * section entry (SPEC §7).
 */
export function useReveal(options = {}) {
  const el = ref(null)
  const shown = ref(false)
  let io = null

  onMounted(() => {
    if (!el.value) return
    if (prefersReduced() || typeof IntersectionObserver === 'undefined') {
      shown.value = true
      return
    }
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          shown.value = true
          io?.disconnect()
          io = null
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' },
    )
    io.observe(el.value)
  })

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })

  return { el, shown }
}
