import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Crosshair, CircleDot, AlertTriangle } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { Counter } from '../components/Counter'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]
const COUNT_MS = 600

const PICKS = [
  {
    key: 'exact',
    icon: Crosshair,
    label: 'Exact call',
    sub: 'P1 — nailed the position',
    points: 15,
    tone: 'pos',
    delay: 120,
  },
  {
    key: 'close',
    icon: CircleDot,
    label: 'One position off',
    sub: 'P4 — so close',
    points: 8,
    tone: 'pos',
    delay: 440,
  },
  {
    key: 'dnf',
    icon: AlertTriangle,
    label: 'Crashed out',
    sub: 'Lap one — DNF',
    points: -5,
    tone: 'neg',
    delay: 760,
  },
]

const TOTAL = PICKS.reduce((s, p) => s + p.points, 0) // 18
const TOTAL_DELAY = 1480
const TOTAL_LAND = TOTAL_DELAY + 700

/** Pulsing "live" indicator dot for the SCORED status. */
function PulseDot({ reduced }) {
  return (
    <span className="relative inline-flex h-1 w-1">
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full bg-accent"
          animate={{ opacity: [0.55, 0], scale: [1, 3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
      <span className="relative inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
    </span>
  )
}

function ScoreRow({ row, play, reduced }) {
  const { icon: Icon, label, sub, points, tone, delay } = row
  const isNeg = tone === 'neg'
  const color = isNeg ? 'text-accent' : 'text-positive'
  const barColor = isNeg ? 'bg-accent' : 'bg-positive'
  const landAt = delay + COUNT_MS // ms the number settles
  const flashAt = isNeg ? landAt : delay // positives ignite on entry, the DNF punches on landing

  return (
    <li className="relative flex items-stretch gap-3 border-b border-border py-4 last:border-0 md:gap-4">
      {/* ignite / punch flash */}
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${barColor}`}
        initial={{ opacity: 0 }}
        animate={play && !reduced ? { opacity: [0, isNeg ? 0.26 : 0.12, 0] } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: flashAt / 1000, ease: 'easeOut', times: [0, 0.28, 1] }}
      />

      {/* telemetry channel + structural icon */}
      <span className={`w-[3px] shrink-0 self-stretch rounded-full ${barColor}`} aria-hidden="true" />
      <Icon
        strokeWidth={2}
        aria-hidden="true"
        className={`relative h-[34px] w-[34px] shrink-0 self-center md:h-[44px] md:w-[44px] ${color}`}
      />

      <div className="relative flex-1 self-center">
        <p
          className="font-display text-[17px] font-bold uppercase text-primary md:text-[18px]"
          style={{ lineHeight: 1.0 }}
        >
          {label}
        </p>
        <p className="mt-1 font-body text-[12px] text-secondary">{sub}</p>
      </div>

      {/* the number — punches with a sharp shake on the DNF */}
      <motion.div
        className="relative self-center"
        animate={play && isNeg && !reduced ? { x: [0, -6, 6, -5, 5, -2, 0] } : { x: 0 }}
        transition={{ delay: landAt / 1000, duration: 0.42, ease: 'easeOut' }}
      >
        <Counter
          to={points}
          play={play}
          delayMs={delay}
          durationMs={COUNT_MS}
          className={`font-display text-[34px] font-bold leading-none tabular-nums md:text-[46px] ${color}`}
        />
      </motion.div>
    </li>
  )
}

function ScorePanel() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const play = inView

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface/90 p-4 backdrop-blur-sm shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]"
    >
      {/* top ignition line — powers on with the panel */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
        initial={{ scaleX: 0 }}
        animate={play || reduced ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: SHARP }}
      />

      {/* scan-line texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* one-time scan sweep on reveal */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
          }}
          initial={{ y: '-120%', opacity: 0 }}
          animate={play ? { y: '320%', opacity: [0, 1, 0] } : { y: '-120%', opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      )}

      {/* header */}
      <div className="relative flex items-center justify-between border-b border-border pb-3">
        <span className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-primary">
          Race result
        </span>
        <span className="flex items-center gap-2">
          <PulseDot reduced={reduced} />
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary">
            Scored
          </span>
        </span>
      </div>

      {/* picks resolving live */}
      <ul className="relative">
        {PICKS.map((row) => (
          <ScoreRow key={row.key} row={row} play={play} reduced={reduced} />
        ))}
      </ul>

      {/* running total — lands last, the payoff */}
      <div className="relative mt-3 flex items-center justify-between">
        <span className="font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-secondary">
          Race total
        </span>
        <motion.div
          className="relative"
          animate={play && !reduced ? { scale: [0.9, 1.06, 1] } : { scale: 1 }}
          transition={{ delay: TOTAL_LAND / 1000, duration: 0.45, ease: SHARP, times: [0, 0.6, 1] }}
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-positive blur-xl"
            initial={{ opacity: 0 }}
            animate={play && !reduced ? { opacity: [0, 0.4, 0.16] } : { opacity: 0 }}
            transition={{ delay: TOTAL_LAND / 1000, duration: 0.6, ease: 'easeOut' }}
          />
          <Counter
            to={TOTAL}
            play={play}
            delayMs={TOTAL_DELAY}
            durationMs={700}
            className="relative font-display text-[46px] font-bold leading-none tabular-nums text-positive md:text-[64px]"
          />
        </motion.div>
      </div>
    </div>
  )
}

export function ScoreDrama() {
  return (
    <section id="scoring" className="relative flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-content px-3 md:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <SectionHeading title="Every lap counts" />
            <p className="mt-6 max-w-[40ch] font-body text-[18px] leading-relaxed text-primary">
              Get it exactly right and bank 15. Miss by one and take 8. But when your pick crashes out
              on lap one, you feel it.
            </p>
          </div>

          <ScorePanel />
        </div>
      </div>
    </section>
  )
}
