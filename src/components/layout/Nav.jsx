import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from '@/lib/gsap'
import { nav, site } from '@/data/site'
import { scrollToTarget } from '@/hooks/useSmoothScroll'
import Magnetic from '@/components/ui/Magnetic'
import { useHasFinePointer } from '@/hooks/useMediaQuery'

/* Hides on scroll down, returns on scroll up. Small, fixed, never in the way
   of the work — which is the only reason anyone is here. */
export default function Nav() {
  const bar = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const fine = useHasFinePointer()

  useEffect(() => {
    let last = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      const shouldHide = y > last && y > 160 && !menuOpen
      if (shouldHide !== hidden) {
        hidden = shouldHide
        gsap.to(bar.current, { yPercent: hidden ? -110 : 0, duration: 0.5, ease: 'power3.out' })
      }
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [pathname, hash])

  const go = (item) => (e) => {
    if (!item.hash) return
    e.preventDefault()
    setMenuOpen(false)
    if (pathname !== item.to) {
      navigate(item.to)
      setTimeout(() => scrollToTarget(item.hash), 320)
    } else {
      scrollToTarget(item.hash)
    }
  }

  const Item = ({ item }) => {
    const el = (
      <Link
        to={item.hash ? `${item.to}${item.hash}` : item.to}
        onClick={go(item)}
        data-cursor="arrow"
        data-cursor-label="→"
        className="ul-draw t-meta text-on/60 transition-colors duration-400 hover:text-on"
      >
        {item.label}
      </Link>
    )
    return fine ? <Magnetic strength={6}>{el}</Magnetic> : el
  }

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-50 border-b border-rule-soft bg-field/80 backdrop-blur-md"
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="shell flex h-full items-center justify-between">
          <Link
            to="/"
            data-cursor="arrow"
            className="t-meta !tracking-[0.18em] text-on"
            aria-label="Vishal Soni — home"
          >
            {site.name}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Item key={item.label} item={item} />
            ))}
            <span className="flex items-center gap-2 pl-2">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              <span className="t-meta">Open to work</span>
            </span>
          </nav>

          <button
            type="button"
            className="t-meta text-on md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile menu — a plain list, sized for thumbs, no cleverness */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-40 bg-field md:hidden"
        style={{ paddingTop: 'var(--nav-h)', display: menuOpen ? 'block' : 'none' }}
      >
        <nav aria-label="Primary" className="shell flex flex-col pt-10">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.hash ? `${item.to}${item.hash}` : item.to}
              onClick={go(item)}
              className="t-title rule-bot py-5 text-on"
            >
              {item.label}
            </Link>
          ))}
          <p className="t-meta mt-8">{site.availability}</p>
        </nav>
      </div>
    </>
  )
}
