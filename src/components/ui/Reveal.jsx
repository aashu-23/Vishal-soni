import { useReveal, useTextReveal } from '@/hooks/useReveal'

/* Wrapper for the wipe. `from` is chosen by the layout so the media uncovers
   in the same direction the composition leans. */
export function RevealBox({ from = 'bottom', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal({ from, delay })
  return (
    <div ref={ref} className={`reveal-media ${className}`} {...rest}>
      {children}
    </div>
  )
}

/* Lines must be supplied as an array of strings — each becomes its own mask. */
export function RevealLines({ lines, as: Tag = 'h2', className = '', delay = 0, stagger = 0.075 }) {
  const ref = useTextReveal({ delay, stagger })
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span data-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
