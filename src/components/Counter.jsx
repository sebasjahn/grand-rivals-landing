import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

/**
 * Counts from 0 to `to` once `play` becomes true. Positive targets are prefixed
 * with "+"; negatives keep their own sign. Snaps straight to the final value under
 * reduced motion. The parent owns the in-view trigger so a group can stay in sync.
 */
export function Counter({ to, play, durationMs = 850, delayMs = 0, signed = true, className }) {
  const reduced = useReducedMotion()
  const count = useMotionValue(0)
  const sign = signed && to >= 0 ? '+' : ''
  const text = useTransform(count, (v) => `${sign}${Math.round(v)}`)

  useEffect(() => {
    if (reduced) {
      count.set(to)
      return
    }
    if (!play) return
    const controls = animate(count, to, {
      duration: durationMs / 1000,
      delay: delayMs / 1000,
      ease: SHARP,
    })
    return () => controls.stop()
  }, [play, reduced, to, durationMs, delayMs, count])

  return (
    <motion.span className={className} aria-hidden="true">
      {text}
    </motion.span>
  )
}
