import { useEffect, useRef } from 'react'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LABELS = { play: 'Play', view: 'View', arrow: '→', drag: 'Drag' }

/* Driven entirely by `data-cursor` attributes in the markup rather than by
   context, so any element can opt in without re-rendering the app. */
export default function Cursor() {
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()
  const dot = useRef(null)
  const ring = useRef(null)
  const text = useRef(null)
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cursor-hidden')
      return
    }
    document.body.classList.add('cursor-hidden')

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let raf
    let state = 'default'

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    }

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (ring.current) {
        const s = state === 'default' ? 0.42 : state === 'hide' ? 0 : 1
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${s})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const apply = (el) => {
      state = el?.dataset.cursor || 'default'
      const label = el?.dataset.cursorLabel || LABELS[state] || ''
      if (ring.current) ring.current.dataset.state = state
      if (text.current) {
        text.current.textContent = label
        text.current.style.opacity = label ? '1' : '0'
      }
      if (dot.current) dot.current.style.opacity = state === 'default' ? '1' : '0'
    }

    const onOver = (e) => apply(e.target.closest?.('[data-cursor]'))
    const onLeave = () => apply(null)

    const onOut = (e) => {
      if (!e.relatedTarget) onLeave()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('cursor-hidden')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true">
      <div ref={dot} className="cur cur-dot" />
      <div ref={ring} className="cur cur-ring" data-state="default">
        <span ref={text} className="cur-text" />
      </div>
    </div>
  )
}
