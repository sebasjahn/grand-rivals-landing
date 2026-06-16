import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '../components/MagneticButton'
import { useReducedMotion } from '../lib/useReducedMotion'

const APP_URL = 'https://app.grandrivals.com'
const SHARP = [0.16, 1, 0.3, 1]

// The real F1 start sequence: light up one column at a time, hold all five,
// then snap out together — "lights out, go". Drives `lit` (0–5) and a `flash`.
function useStartSequence(active) {
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(reduced ? 5 : 0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (reduced) {
      setLit(5)
      setFlash(false)
      return
    }
    if (!active) {
      setLit(0)
      setFlash(false)
      return
    }
    let timeouts = []
    let stopped = false
    const clearAll = () => {
      timeouts.forEach(clearTimeout)
      timeouts = []
    }
    const run = () => {
      if (stopped) return
      clearAll()
      setFlash(false)
      setLit(0)
      for (let i = 1; i <= 5; i++) timeouts.push(setTimeout(() => setLit(i), 500 + (i - 1) * 550))
      const tOut = 500 + 4 * 550 + 1500 // all lit at 2700, hold 1500 → out at 4200
      timeouts.push(
        setTimeout(() => {
          setLit(0)
          setFlash(true)
        }, tOut),
      )
      timeouts.push(setTimeout(() => setFlash(false), tOut + 420))
      timeouts.push(setTimeout(run, tOut + 1500)) // pause, then loop
    }
    run()
    return () => {
      stopped = true
      clearAll()
    }
  }, [reduced, active])

  return { lit, flash }
}

function StartLights({ lit }) {
  return (
    <div
      className="flex items-end justify-center gap-2 sm:gap-3"
      role="img"
      aria-label="Formula 1 start lights"
    >
      {[0, 1, 2, 3, 4].map((col) => {
        const on = col < lit
        return (
          <div
            key={col}
            className="flex flex-col gap-1 rounded-lg border border-border bg-[#08080A] p-2"
          >
            {[0, 1].map((j) => (
              <span
                key={j}
                className={`block rounded-full transition-all duration-150 ease-out ${
                  on ? 'bg-accent shadow-[0_0_26px_6px_rgba(232,0,29,0.85)]' : 'bg-accent/15'
                }`}
                style={{ width: 'clamp(22px, 4.2vw, 34px)', height: 'clamp(22px, 4.2vw, 34px)' }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function FinalCTA() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const { lit, flash } = useStartSequence(inView)

  const group = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: reduced ? 0 : 0.2 } },
  }
  const rise = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SHARP } },
  }

  return (
    <section
      id="join"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-16 text-center"
    >
      {/* atmosphere — lifts the near-black and anchors the right with the wheel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-[88vh] w-[88vh] -translate-y-1/2 translate-x-1/4 rounded-full opacity-[0.16] mix-blend-screen blur-[120px]"
        style={{ background: 'radial-gradient(circle, #E8001D 0%, rgba(232,0,29,0) 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-[58%] h-[60vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] mix-blend-screen blur-[120px]"
        style={{ background: 'radial-gradient(circle, #E8001D 0%, rgba(232,0,29,0) 70%)' }}
      />

      {/* lights-out flash through the whole section */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-accent"
        animate={{ opacity: flash ? 0.16 : 0 }}
        transition={{ duration: flash ? 0.06 : 0.5, ease: 'easeOut' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[860px] px-3 md:px-8">
        <StartLights lit={lit} />

        <motion.div variants={group} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.h2
            variants={rise}
            className="mx-auto mt-12 max-w-[16ch] font-display font-bold uppercase text-primary"
            style={{ fontSize: 'clamp(40px, 7vw, 92px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
          >
            The lights are about to go out.
          </motion.h2>

          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-[34ch] font-body text-[18px] leading-relaxed text-secondary sm:text-[20px]"
          >
            Start the group. Share the code. Leave your friends in the gravel.
          </motion.p>

          <motion.div variants={rise} className="mt-12 flex justify-center">
            <span className="relative inline-flex">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 rounded-lg bg-accent blur-lg"
                animate={{ opacity: flash ? 0.85 : 0.3 }}
                transition={{ duration: flash ? 0.08 : 0.6, ease: 'easeOut' }}
              />
              <MagneticButton
                href={APP_URL}
                className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-body text-[18px] font-semibold text-primary"
              >
                Create your group — free
                <ArrowRight
                  size={22}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MagneticButton>
            </span>
          </motion.div>

          <motion.p variants={rise} className="mt-6 font-body text-[14px] text-secondary">
            Free to play. No ads in the race.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
