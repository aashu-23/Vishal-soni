import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* One motion vocabulary for the whole site. Every timing on the site
   comes from here so the pacing stays consistent between sections. */
export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inout: 'expo.inOut',
}

export const DUR = {
  fast: 0.36,
  base: 0.72,
  reveal: 1.05,
  shared: 0.86, // shared-element expand/collapse
}

export { gsap, ScrollTrigger }
