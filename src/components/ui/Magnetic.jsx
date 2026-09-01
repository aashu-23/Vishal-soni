import { cloneElement, useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* Pull is deliberately small (10px). Anything larger reads as a gimmick and
   makes targets harder to hit, which is the opposite of the point. */
export default function Magnetic({ children, strength = 10 }) {
  const ref = useRef(null)
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return

    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      qx(gsap.utils.clamp(-1, 1, dx) * strength)
      qy(gsap.utils.clamp(-1, 1, dy) * strength)
    }
    const onLeave = () => {
      qx(0)
      qy(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [fine, reduced, strength])

  return cloneElement(children, { ref })
}
