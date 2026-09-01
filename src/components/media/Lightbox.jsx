import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, DUR } from '@/lib/gsap'
import { fitToViewport } from '@/lib/media'
import { lockScroll } from '@/hooks/useSmoothScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

/* -----------------------------------------------------------------------------
   SHARED-ELEMENT LIGHTBOX

   Not a modal that fades over the page. The frame you clicked is measured,
   a fixed clone is placed exactly on top of it, and that clone is animated to
   its fitted position. On close it animates back to wherever the source now
   is — re-measured, because the page may have scrolled underneath.

   The source frame is hidden for the duration so there is only ever one of
   the object on screen.
----------------------------------------------------------------------------- */
export default function Lightbox({ entry, onClose }) {
  const { media, sourceEl, startAt, rect } = entry
  const isVideo = media.type === 'video'
  const hasSd = isVideo && Boolean(media.sdSrc)
  const reduced = useReducedMotion()

  const dialog = useRef(null)
  const box = useRef(null)
  const backdrop = useRef(null)
  const chrome = useRef(null)
  const video = useRef(null)
  const closeBtn = useRef(null)
  const closing = useRef(false)
  const resumeAt = useRef(startAt || 0)
  const isInitialSrc = useRef(true)
  const playbackStarted = useRef(false)

  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [quality, setQuality] = useState('hd')
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState({ now: 0, total: 0 })

  const activeSrc = quality === 'sd' && hasSd ? media.sdSrc : media.src

  const toggleQuality = () => {
    if (video.current) resumeAt.current = video.current.currentTime
    setQuality((q) => (q === 'hd' ? 'sd' : 'hd'))
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else video.current?.requestFullscreen?.()
  }

  // Switching HD/SD swaps `src` out from under the element, which resets
  // playback to 0 — put the viewer back where they were. Skip on the very
  // first mount: startPlayback() already owns that, and firing this too
  // means a redundant seek+play landing after the open click's activation
  // window has closed — which Chrome answers by silently pausing/muting.
  useEffect(() => {
    if (isInitialSrc.current) {
      isInitialSrc.current = false
      return
    }
    const v = video.current
    if (!v) return
    const onMeta = () => {
      v.currentTime = resumeAt.current
      if (playing) {
        const p = v.play()
        if (p?.catch) p.catch(() => {})
      }
    }
    v.addEventListener('loadedmetadata', onMeta, { once: true })
    return () => v.removeEventListener('loadedmetadata', onMeta)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSrc])

  /* ---- open ------------------------------------------------------------- */
  useLayoutEffect(() => {
    lockScroll(true)
    sourceEl.style.opacity = '0'

    const target = fitToViewport(media.ratio)
    gsap.set(box.current, {
      position: 'fixed',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    if (isVideo) startPlayback()
    gsap.set(backdrop.current, { opacity: 0 })
    gsap.set(chrome.current, { opacity: 0, y: 10 })

    const tl = gsap.timeline()
    if (reduced) {
      tl.set(box.current, { ...target }).to([backdrop.current, chrome.current], {
        opacity: 1,
        y: 0,
        duration: 0.2,
      })
    } else {
      tl.to(backdrop.current, { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0)
        .to(box.current, { ...target, duration: DUR.shared, ease: 'expo.inOut' }, 0)
        .to(chrome.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.45)
    }

    closeBtn.current?.focus({ preventScroll: true })
    return () => {
      tl.kill()
      lockScroll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- close ------------------------------------------------------------ */
  const dismiss = useCallback(() => {
    if (closing.current) return
    closing.current = true
    video.current?.pause()

    // Re-measure: the page may have moved while the lightbox was open.
    const now = sourceEl.getBoundingClientRect()
    const restore = () => {
      sourceEl.style.opacity = ''
      sourceEl.focus?.({ preventScroll: true })
      onClose()
    }

    if (reduced) {
      restore()
      return
    }

    gsap
      .timeline({ onComplete: restore })
      .to(chrome.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
      .to(
        box.current,
        {
          top: now.top,
          left: now.left,
          width: now.width,
          height: now.height,
          duration: DUR.shared,
          ease: 'expo.inOut',
        },
        0.05
      )
      .to(backdrop.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.2)
  }, [sourceEl, onClose, reduced])

  /* ---- keyboard --------------------------------------------------------- */
  useEffect(() => {
    const trapTab = (e) => {
      if (e.key !== 'Tab' || !dialog.current) return
      const focusable = dialog.current.querySelectorAll(
        'button:not([tabindex="-1"]), [href], [role="slider"]'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onKey = (e) => {
      const v = video.current
      trapTab(e)
      if (e.key === 'Escape') return dismiss()
      if (!isVideo || !v) return
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault()
        v.paused ? v.play() : v.pause()
      }
      if (e.key === 'm') setMuted((m) => !m)
      if (e.key === 'ArrowRight') v.currentTime = Math.min(v.duration || 0, v.currentTime + 5)
      if (e.key === 'ArrowLeft') v.currentTime = Math.max(0, v.currentTime - 5)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismiss, isVideo])

  /* ---- keep the frame fitted if the window changes ---------------------- */
  useEffect(() => {
    const onResize = () => {
      if (closing.current) return
      gsap.to(box.current, { ...fitToViewport(media.ratio), duration: 0.4, ease: 'power3.out' })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [media.ratio])

  /* ---- playhead --------------------------------------------------------- */
  useEffect(() => {
    if (!isVideo) return
    let raf
    const tick = () => {
      const v = video.current
      if (v && v.duration) {
        setProgress(v.currentTime / v.duration)
        setTime({ now: v.currentTime, total: v.duration })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVideo])

  useEffect(() => {
    if (video.current) video.current.muted = muted
  }, [muted])

  const onVideoMount = (el) => {
    video.current = el
  }

  // Called from the open effect, *after* the box has been sized — a video
  // whose container is still 0×0 (true here at ref-callback time: the box
  // gets its real fixed-position size from GSAP a moment later) can have
  // its load silently deferred by Chrome and never retried, leaving it
  // frozen on the poster forever with no network request ever sent.
  const startPlayback = () => {
    // StrictMode double-invokes this layout effect in dev; without this
    // guard the second pass calls load() again mid-flight, which aborts
    // the first play() with AbortError — misread below as an autoplay
    // refusal, permanently muting a video Chrome was happy to play.
    if (playbackStarted.current) return
    playbackStarted.current = true
    const el = video.current
    if (!el) return
    // Set the real muted state synchronously, in the same gesture as the
    // click that opened this — Chrome allows unmuted autoplay here, but
    // will silently *pause* an already-playing video if it's unmuted from
    // a later effect/microtask instead, once that gesture has lapsed.
    el.muted = muted
    el.load()
    try {
      el.currentTime = startAt || 0
    } catch {}
    if (!reduced) {
      const p = el.play()
      if (p?.catch)
        p.catch((e) => {
          // A newer load/play superseded this one — that one owns the
          // outcome now, this rejection isn't a real autoplay refusal.
          if (e.name === 'AbortError') return
          // Unmuted autoplay was refused — muted autoplay is always
          // allowed, so fall back to that rather than not playing at all.
          el.muted = true
          setMuted(true)
          const p2 = el.play()
          if (p2?.catch) p2.catch(() => setPlaying(false))
        })
    } else {
      setPlaying(false)
    }
  }

  const scrub = (e) => {
    const v = video.current
    if (!v || !v.duration) return
    const r = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={media.title || media.alt || 'Media viewer'}
      data-lenis-prevent
      ref={dialog}
      className="fixed inset-0 z-[80]"
    >
      <button
        ref={backdrop}
        type="button"
        onClick={dismiss}
        aria-label="Close"
        tabIndex={-1}
        data-cursor="hide"
        className="absolute inset-0 h-full w-full bg-shade/95 backdrop-blur-[3px]"
      />

      {/* the moving object */}
      <div ref={box} className="overflow-hidden bg-well" style={{ willChange: 'top,left,width,height' }}>
        {isVideo ? (
          <video
            ref={onVideoMount}
            src={activeSrc}
            poster={media.poster}
            loop
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={media.src}
            alt={media.alt || media.title || ''}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      {/* chrome */}
      <div ref={chrome} className="pointer-events-none absolute inset-0">
        <div className="shell flex h-full flex-col justify-between py-5 md:py-7">
          <div className="flex items-start justify-between gap-6">
            <div>
              {media.title && <p className="t-label text-paper">{media.title}</p>}
              {media.caption && <p className="t-meta mt-1 text-paper/70">{media.caption}</p>}
            </div>
            <button
              ref={closeBtn}
              type="button"
              onClick={dismiss}
              data-cursor="hide"
              className="pointer-events-auto t-meta text-paper/70 transition-colors duration-300 hover:text-paper"
            >
              Close · Esc
            </button>
          </div>

          {isVideo && (
            <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
              <button
                type="button"
                onClick={() => (video.current?.paused ? video.current.play() : video.current?.pause())}
                data-cursor="hide"
                className="t-meta w-12 text-left text-paper/75 transition-colors duration-300 hover:text-paper"
              >
                {playing ? 'Pause' : 'Play'}
              </button>

              <div
                onClick={scrub}
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                onKeyDown={(e) => {
                  const v = video.current
                  if (!v) return
                  if (e.key === 'ArrowRight') v.currentTime += 5
                  if (e.key === 'ArrowLeft') v.currentTime -= 5
                }}
                className="relative h-6 flex-1 cursor-pointer"
                data-cursor="hide"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/20" />
                <span
                  className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-accent"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <span className="t-meta tabular-nums text-paper/75">
                {fmt(time.now)} / {fmt(time.total)}
              </span>

              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                data-cursor="hide"
                className="t-meta w-16 text-right text-paper/75 transition-colors duration-300 hover:text-paper"
              >
                {muted ? 'Sound on' : 'Mute'}
              </button>

              {hasSd && (
                <button
                  type="button"
                  onClick={toggleQuality}
                  data-cursor="hide"
                  className="t-meta w-10 text-right text-paper/75 transition-colors duration-300 hover:text-paper"
                >
                  {quality === 'hd' ? 'SD' : 'HD'}
                </button>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                data-cursor="hide"
                className="t-meta text-paper/75 transition-colors duration-300 hover:text-paper"
              >
                Fullscreen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
