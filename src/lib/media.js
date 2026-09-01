/* =============================================================================
   The media system's single source of truth.
   A clip's aspect ratio is treated as design information: it decides how much
   of the grid the clip takes, which way it offsets, and how it reveals.
   ============================================================================= */

export const parseRatio = (r = '16/9') => {
  const [w, h] = String(r).split('/').map(Number)
  if (!w || !h) return 16 / 9
  return w / h
}

export const orientationOf = (ratio) => {
  const v = parseRatio(ratio)
  if (v > 1.15) return 'landscape'
  if (v < 0.9) return 'portrait'
  return 'square'
}

/* Fit a media box inside the viewport for the lightbox, preserving ratio. */
export const fitToViewport = (ratio, pad = 0.12) => {
  const r = parseRatio(ratio)
  const availW = window.innerWidth * (1 - pad)
  const availH = window.innerHeight * (1 - pad * 1.4)
  let w = availW
  let h = w / r
  if (h > availH) {
    h = availH
    w = h * r
  }
  return {
    width: w,
    height: h,
    left: (window.innerWidth - w) / 2,
    top: (window.innerHeight - h) / 2,
  }
}
