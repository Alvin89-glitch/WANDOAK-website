import { onMounted, onBeforeUnmount, ref } from 'vue'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Safety net for the observer below.
 *
 * IntersectionObserver samples at frame boundaries and only reports a change
 * when the intersection ratio crosses a threshold. An instant jump — browser
 * scroll restoration on a back-navigation, an in-page #hash, or the End key —
 * moves a middle section from "below the fold" (ratio 0) to "above the fold"
 * (ratio 0) between two frames. It never intersects, so the callback never
 * runs and the section stays at opacity 0 until the visitor happens to scroll
 * back up over it.
 *
 * One shared, rAF-throttled scroll listener sweeps anything that has ended up
 * at or above the fold and releases it. It unsubscribes itself once the last
 * pending element has been shown, so a settled page carries no listener.
 */
const pending = new Set()
let sweepQueued = false
let listening = false

function sweep() {
  sweepQueued = false
  for (const entry of pending) {
    const el = entry.el.value
    if (!el) {
      pending.delete(entry)
      continue
    }
    if (el.getBoundingClientRect().top < window.innerHeight) {
      entry.reveal()
    }
  }
  if (pending.size === 0) stopListening()
}

function queueSweep() {
  if (sweepQueued) return
  sweepQueued = true
  requestAnimationFrame(sweep)
}

function startListening() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', queueSweep, { passive: true })
  window.addEventListener('resize', queueSweep, { passive: true })
}

function stopListening() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', queueSweep)
  window.removeEventListener('resize', queueSweep)
}

/**
 * Adds `.is-in` once the element crosses into view. One-shot — ALO has no
 * scroll-driven animation at all, so this is the entire motion budget for
 * section entry (SPEC §7).
 */
export function useReveal(options = {}) {
  const el = ref(null)
  const shown = ref(false)
  let io = null
  let entry = null

  const reveal = () => {
    shown.value = true
    io?.disconnect()
    io = null
    if (entry) {
      pending.delete(entry)
      entry = null
    }
  }

  onMounted(() => {
    if (!el.value) return
    if (prefersReduced() || typeof IntersectionObserver === 'undefined') {
      shown.value = true
      return
    }
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          reveal()
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' },
    )
    io.observe(el.value)

    entry = { el, reveal }
    pending.add(entry)
    startListening()
    queueSweep()
  })

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
    if (entry) {
      pending.delete(entry)
      entry = null
    }
    if (pending.size === 0) stopListening()
  })

  return { el, shown }
}
