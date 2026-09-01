import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { fragments } from '@/data/work'
import MediaFrame from '@/components/media/MediaFrame'
import { RevealLines } from '@/components/ui/Reveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import Field from '@/components/layout/Field'

const LINES = ['Design', 'that', 'moves.']

/* Each line drifts at a slightly different rate, so the phrase assembles and
   disassembles as it passes. Two fragments of work sit behind it, dim enough
   to read as texture rather than as competing content. */
export default function Statement() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()

  useEffect(() => {
    if (reduced || !desktop) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-drift]').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: Number(el.dataset.drift) * -1 },
          {
            xPercent: Number(el.dataset.drift),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
          }
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, desktop])

  return (
    <Field name="violet" as="section" ref={root} className="relative overflow-hidden py-[16vh]" aria-label="Statement">
      {/* fragments */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <div className="absolute left-[6%] top-[12%] w-[22vw] max-w-[300px]">
          {fragments[0] && <MediaFrame media={fragments[0]} expandable={false} />}
        </div>
        <div className="absolute bottom-[8%] right-[8%] w-[16vw] max-w-[220px]">
          {fragments[1] && <MediaFrame media={fragments[1]} expandable={false} />}
        </div>
      </div>

      <div className="shell relative">
        <RevealLines as="p" lines={[LINES[0]]} className="t-statement" />
        <div data-drift="3" className="pl-[8vw]">
          <RevealLines as="p" lines={[LINES[1]]} className="t-statement text-on2" delay={0.06} />
        </div>
        <div data-drift="-4" className="pl-[2vw]">
          <RevealLines as="p" lines={[LINES[2]]} className="t-statement" delay={0.12} />
        </div>
      </div>
    </Field>
  )
}
