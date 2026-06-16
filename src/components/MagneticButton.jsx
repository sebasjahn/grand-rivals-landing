import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

/**
 * Anchor link with a subtle magnetic pull toward the cursor + a 1.02 hover scale.
 * Falls back to a static button under reduced motion. Pass button styles via
 * className (include `group` if children animate on hover).
 */
export function MagneticButton({ href, children, className = '', ...rest }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const mx = e.clientX - (r.left + r.width / 2)
    const my = e.clientY - (r.top + r.height / 2)
    x.set(Math.max(-6, Math.min(6, mx * 0.25)))
    y.set(Math.max(-6, Math.min(6, my * 0.25)))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduced ? undefined : { x: sx, y: sy }}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2, ease: SHARP }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
