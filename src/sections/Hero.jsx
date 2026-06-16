import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Countdown } from '../components/Countdown'
import { useReducedMotion } from '../lib/useReducedMotion'

const APP_URL = 'https://app.grandrivals.com'
const JOIN_URL = 'https://app.grandrivals.com/join'
const SHARP = [0.16, 1, 0.3, 1]

/**
 * Primary CTA with a subtle magnetic pull + 1.02 hover scale. Falls back to a
 * static button when the user prefers reduced motion.
 */
function MagneticCTA({ reduced }) {
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
      href={APP_URL}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduced ? undefined : { x: sx, y: sy }}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2, ease: SHARP }}
      className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 font-body text-[16px] font-semibold text-primary"
    >
      Create your group
      <ArrowRight
        size={20}
        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
        aria-hidden="true"
      />
    </motion.a>
  )
}

export function Hero() {
  const reduced = useReducedMotion()

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.12 },
    },
  }
  // Fast rise + settle, sharp easing — never floaty.
  const rise = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SHARP } },
  }
  const fade = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut', delay: reduced ? 0 : 0.6 } },
  }

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-content flex-col px-3 md:px-8">
        {/* top telemetry — pushed clear of the fixed nav */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="flex justify-start pt-16 sm:justify-end"
        >
          <Countdown variant="telemetry" />
        </motion.div>

        {/* headline cluster, anchored low-left for an asymmetric composition */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-1 flex-col justify-end pb-12"
        >
          <h1
            className="font-display font-bold uppercase text-primary"
            style={{ lineHeight: 0.92, letterSpacing: '-0.02em' }}
          >
            {['Call', 'every', 'position.'].map((word) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  variants={rise}
                  className="block"
                  style={{ fontSize: 'clamp(44px, 10vw, 96px)' }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            className="mt-4 max-w-[40ch] font-body text-[18px] font-normal leading-relaxed text-primary"
          >
            Predict the grid. Outscore your friends. Rule the season.
          </motion.p>

          <motion.div variants={rise} className="mt-6 flex flex-wrap items-center gap-3">
            <MagneticCTA reduced={reduced} />
            <a
              href={JOIN_URL}
              className="rounded-sm font-body text-[15px] font-medium text-secondary underline-offset-4 transition-colors duration-200 ease-out hover:text-primary hover:underline"
            >
              or join with a code
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
