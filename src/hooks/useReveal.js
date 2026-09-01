import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, DUR } from '@/lib/gsap'
import { useReducedMotion } from './useReducedMotion'

/* The site's one entrance gesture: an editorial wipe.
   Media uncovers from an edge while its inner layer settles from 1.08 → 1.
   Direction is passed in by the layout so the wipe matches the composition. */
export function useReveal({ from = 'bottom', delay = 0 } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inner = el.firstElementChild
    if (reduced) {
      gsap.set(el, { clipPath: 'none' })
      if (inner) gsap.set(inner, { scale: 1 })
      return
    }

    const start = {
      bottom: 'inset(100% 0% 0% 0%)',
      top: 'inset(0% 0% 100% 0%)',
      left: 'inset(0% 100% 0% 0%)',
      right: 'inset(0% 0% 0% 100%)',
    }[from]

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: start })
      if (inner) gsap.set(inner, { scale: 1.08 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        delay,
      })
      tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.reveal, ease: 'expo.out' })
      if (inner) tl.to(inner, { scale: 1, duration: 1.4, ease: 'expo.out' }, 0)
    }, el)

    return () => ctx.revert()
  }, [from, delay, reduced])

  return ref
}

/* Line-masked text reveal. Reserved for section openers and project names —
   not applied to body copy, where it would just slow reading down. */
export function useTextReveal({ delay = 0, stagger = 0.075 } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lines = el.querySelectorAll('[data-line]')
    if (!lines.length) return
    if (reduced) {
      gsap.set(lines, { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 108 })
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [delay, stagger, reduced])

  return ref
}

export { ScrollTrigger }
