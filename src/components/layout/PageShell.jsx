import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* Route change reads as a wipe rather than a crossfade: the incoming page
   uncovers from the bottom edge, matching the media reveals inside it. */
export default function PageShell({ children }) {
  const reduced = useReducedMotion()

  const variants = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 },
        animate: {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
        },
        exit: { opacity: 0, transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } },
      }

  return (
    <motion.main
      id="main"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      style={{ willChange: 'clip-path, opacity' }}
    >
      {children}
    </motion.main>
  )
}
