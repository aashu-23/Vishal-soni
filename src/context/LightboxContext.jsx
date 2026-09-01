import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Lightbox from '@/components/media/Lightbox'

const Ctx = createContext({ open: () => {}, close: () => {} })
export const useLightbox = () => useContext(Ctx)

export function LightboxProvider({ children }) {
  const [entry, setEntry] = useState(null)

  /* Capture the source rect and the exact playhead position at click time —
     both are what make the expansion read as the *same* object moving. */
  const open = useCallback((media, sourceEl) => {
    if (!sourceEl) return
    const r = sourceEl.getBoundingClientRect()
    const v = sourceEl.querySelector('video')
    // flushSync, not the default async commit: the video's ref callback has
    // to run inside this same click, or the browser's user-activation
    // window closes before it plays — Chrome then allows the video to play
    // but silently strips the sound instead of just erroring.
    flushSync(() => {
      setEntry({
        media,
        sourceEl,
        startAt: v && Number.isFinite(v.currentTime) ? v.currentTime : 0,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      })
    })
  }, [])

  const close = useCallback(() => setEntry(null), [])
  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <Ctx.Provider value={value}>
      {children}
      {entry && <Lightbox entry={entry} onClose={close} />}
    </Ctx.Provider>
  )
}
