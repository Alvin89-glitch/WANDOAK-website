import { onBeforeUnmount, ref, watch } from 'vue'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Counts up to `to` when `active` flips true. Used only by StatsBar —
 * the three numbers there are the fastest trust signal on the whole site,
 * so they earn the one piece of decorative motion we allow.
 */
export function useCountUp(to, active, duration = 1200) {
  const value = ref(prefersReduced() ? to : 0)
  let raf = null

  const stop = () => {
    if (raf !== null) cancelAnimationFrame(raf)
    raf = null
  }

  watch(
    active,
    (on) => {
      if (!on) return
      if (prefersReduced()) {
        value.value = to
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        value.value = Math.round(easeOutExpo(t) * to)
        raf = t < 1 ? requestAnimationFrame(tick) : null
      }
      raf = requestAnimationFrame(tick)
    },
    { immediate: true },
  )

  onBeforeUnmount(stop)
  return value
}
