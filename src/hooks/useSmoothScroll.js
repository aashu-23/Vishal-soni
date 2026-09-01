import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from './useReducedMotion'

let lenis = null
export const getLenis = () => lenis

/* Drive Lenis off GSAP's ticker so smooth scroll and ScrollTrigger share one
   clock — two RAF loops is the usual cause of jittery pinned sections. */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      lenis?.destroy()
      lenis = null
      return
    }

    lenis = new Lenis({
      duration: 1.05,
      lerp: 0.1,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.off('scroll', onScroll)
      lenis?.destroy()
      lenis = null
    }
  }, [reduced])
}

export function scrollToTarget(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.2, ...opts })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'smooth' })
  }
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.classList.toggle('lenis-stopped', locked)
  document.body.style.overflow = locked ? 'hidden' : ''
}
