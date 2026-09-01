import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Grain from '@/components/layout/Grain'
import Cursor from '@/components/ui/Cursor'
import PageShell from '@/components/layout/PageShell'
import { LightboxProvider } from '@/context/LightboxContext'

import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

import { useSmoothScroll, scrollToTarget } from '@/hooks/useSmoothScroll'
import { ScrollTrigger } from '@/lib/gsap'
import { applyField, initFields } from '@/lib/fields'

function Routing() {
  const location = useLocation()

  /* Pinned sections measure the document; re-measure after every route swap
     and after fonts land, or the horizontal rail ends up the wrong length. */
  useEffect(() => {
    applyField('chalk', true)
    if (!location.hash) scrollToTarget(0, { immediate: true })
    const t = setTimeout(() => ScrollTrigger.refresh(), 500)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageShell><Home /></PageShell>} />
        <Route path="/about" element={<PageShell><About /></PageShell>} />
        <Route path="*" element={<PageShell><NotFound /></PageShell>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useSmoothScroll()
  useEffect(() => initFields(), [])

  return (
    <LightboxProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-field"
      >
        Skip to content
      </a>
      <Cursor />
      <Grain />
      <Nav />
      <Routing />
      <Footer />
    </LightboxProvider>
  )
}
