import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { site } from '@/data/site'
import { cover } from '@/data/work'
import { scrollToTarget } from '@/hooks/useSmoothScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* -----------------------------------------------------------------------------
   The showreel is a framed object on a lit wall, not a dimmed background.
   It plays at full strength from the first second — the work is the opening
   image, and the type sits beside it rather than on top of it.
----------------------------------------------------------------------------- */
export default function Hero() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.12 })
      tl.from('[data-hero-frame]', {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.15,
        ease: 'expo.out',
      })
        .from('[data-hero-line]', { yPercent: 108, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.18)
        .from('[data-hero-role]', { yPercent: 108, duration: 0.85, stagger: 0.06, ease: 'expo.out' }, 0.42)
        .from('[data-hero-meta]', { opacity: 0, y: 8, duration: 0.6, stagger: 0.06 }, 0.66)
        .from('[data-hero-rule]', { scaleX: 0, duration: 1, ease: 'expo.inOut' }, 0.3)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      className="flex flex-col justify-center"
      style={{ minHeight: '92svh', paddingTop: 'calc(var(--nav-h) + 5vh)' }}
      aria-label="Introduction"
    >
      <div className="shell flex items-center justify-between gap-6 pb-6">
        <p data-hero-meta className="t-meta">Video Portfolio</p>
        <p data-hero-meta className="t-meta tabular-nums">{site.yearsRange}</p>
      </div>

      <div className="shell grid12 items-center gap-y-8">
        {/* type */}
        <div className="col-span-12 md:col-span-4">
          <h1 className="t-name">
            {['Vishal', 'Soni'].map((word) => (
              <span key={word} className="block overflow-hidden">
                <span data-hero-line className="block">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <ul className="mt-7">
            {site.roleLines.map((role) => (
              <li key={role} className="overflow-hidden">
                <span data-hero-role className="t-label block !text-on">
                  {role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* showreel — full strength, undimmed */}
        <div className="col-span-12 md:col-span-8">
          <div
            data-hero-frame
            className="media"
            style={{ aspectRatio: cover.ratio.replace('/', ' / ') }}
          >
            <img
              src={cover.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="shell mt-10">
        <span data-hero-rule className="mb-5 block h-px w-full origin-left bg-rule" />
        <div className="flex items-end justify-between gap-6">
          <button
            type="button"
            onClick={() => scrollToTarget('#work')}
            data-hero-meta
            data-cursor="arrow"
            className="ul-draw t-meta !text-on/70 transition-colors duration-300 hover:!text-on"
          >
            Scroll to explore ↓
          </button>
          <p data-hero-meta className="t-meta hidden sm:block">
            {site.location}
          </p>
        </div>
      </div>
    </section>
  )
}
