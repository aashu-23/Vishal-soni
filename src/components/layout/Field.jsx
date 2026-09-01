import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { applyField } from '@/lib/fields'

/* Wrap a section to give it a room colour. The switch happens at the middle of
   the viewport in both directions, so scrolling back up repaints correctly. */
const Field = forwardRef(function Field(
  { name = 'chalk', as: Tag = 'div', className = '', children, ...rest },
  forwarded
) {
  const ref = useRef(null)
  useImperativeHandle(forwarded, () => ref.current, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => self.isActive && applyField(name),
    })
    return () => st.kill()
  }, [name])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
})

export default Field
