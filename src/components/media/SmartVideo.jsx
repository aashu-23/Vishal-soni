import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* -----------------------------------------------------------------------------
   Two IntersectionObservers, deliberately separate:

   1. ARM  (rootMargin 600px) — only then is `src` attached to the <video>.
      Nothing downloads until a clip is nearly on screen.
   2. PLAY (threshold 0.25)   — plays while visible, pauses the moment it isn't.

   Under prefers-reduced-motion nothing autoplays: the poster stays and the
   viewer gets a real control instead.
----------------------------------------------------------------------------- */
const SmartVideo = forwardRef(function SmartVideo(
  {
    src,
    poster,
    autoplay = true,
    loop = true,
    muted = true,
    controls = false,
    startAt = 0,
    className = '',
    objectFit = 'cover',
    onReady,
  },
  ref
) {
  const wrap = useRef(null)
  const video = useRef(null)
  const [armed, setArmed] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  useImperativeHandle(ref, () => video.current, [])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!armed || reduced || !autoplay) return
    const el = wrap.current
    const v = video.current
    if (!el || !v) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.25) {
          const p = v.play()
          if (p?.catch) p.catch(() => {})
        } else if (!v.paused) {
          v.pause()
        }
      },
      { threshold: [0, 0.25, 0.6] }
    )
    io.observe(el)

    const onVisibility = () => {
      if (document.hidden && !v.paused) v.pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [armed, autoplay, reduced])

  const handleLoaded = () => {
    setReady(true)
    if (startAt && video.current) {
      try {
        video.current.currentTime = startAt
      } catch {}
    }
    onReady?.()
  }

  return (
    <div ref={wrap} className={`absolute inset-0 ${className}`}>
      <video
        ref={video}
        src={armed && !failed ? src : undefined}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
        preload="none"
        disablePictureInPicture
        tabIndex={controls ? 0 : -1}
        onLoadedData={handleLoaded}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit }}
      />
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="media-poster"
          data-ready={String(ready && !reduced)}
        />
      )}
      {armed && !ready && !failed && <span className="media-load" aria-hidden="true" />}
    </div>
  )
})

export default SmartVideo
