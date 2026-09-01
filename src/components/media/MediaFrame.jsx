import { useRef } from 'react'
import SmartVideo from './SmartVideo'
import { RevealBox } from '@/components/ui/Reveal'
import { useLightbox } from '@/context/LightboxContext'

/* -----------------------------------------------------------------------------
   One frame for every piece of media on the site.
   `ratio` sets the box via CSS aspect-ratio — vertical clips are never cropped
   to landscape and landscape clips are never letterboxed into a square.
----------------------------------------------------------------------------- */
export default function MediaFrame({
  media,
  alt = '',
  caption,
  expandable = true,
  revealFrom = 'bottom',
  className = '',
  priority = false,
  previewQuality = 'sd',
  title,
}) {
  const { open } = useLightbox()
  const frame = useRef(null)
  const isVideo = media.type === 'video'
  const cursor = isVideo ? 'play' : 'view'

  const handleOpen = () => {
    if (!expandable) return
    open({ ...media, title, alt, caption }, frame.current)
  }

  const inner = (
    <div
      className="media h-full w-full"
      style={{ aspectRatio: media.ratio?.replace('/', ' / ') }}
    >
      {isVideo ? (
        <SmartVideo
          src={previewQuality === 'hd' ? media.src : media.sdSrc || media.src}
          poster={media.poster}
        />
      ) : (
        <img
          src={media.src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )

  return (
    <figure className={`group relative ${className}`}>
      <RevealBox from={revealFrom}>
        {expandable ? (
          <button
            ref={frame}
            type="button"
            onClick={handleOpen}
            data-cursor={cursor}
            data-lightbox-source
            aria-label={`${isVideo ? 'Play' : 'View'} ${title || alt || 'media'} full screen`}
            className="relative block w-full overflow-hidden"
          >
            {inner}
            {/* Hover affordance — appears only where a pointer can hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden bg-on/0 transition-colors duration-500 ease-out group-hover:bg-on/10 lg:block"
            />
          </button>
        ) : (
          <div ref={frame}>{inner}</div>
        )}
      </RevealBox>

      {caption && (
        <figcaption className="t-meta mt-3 flex items-baseline gap-3">
          <span className="inline-block h-px w-4 translate-y-[-3px] bg-rule" />
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
