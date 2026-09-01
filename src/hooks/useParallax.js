import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useReducedMotion } from './useReducedMotion'
import { useIsDesktop } from './useMediaQuery'

/* Depth, not decoration: a few percent of counter-movement so foreground and
   background separate. Off entirely on touch and under reduced motion. */
export function useParallax(distance = 7) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !desktop) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -distance / 2 },
        {
          yPercent: distance / 2,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [distance, reduced, desktop])

  return ref
}
