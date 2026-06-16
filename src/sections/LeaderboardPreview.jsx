import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Crown, ChevronUp, ChevronDown, Minus } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { Counter } from '../components/Counter'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

// Invented handles — not real people.
const PODIUM = [
  { rank: 2, name: 'Slipstream Sam', points: 1190, exacts: 36, step: 118 },
  { rank: 1, name: 'Apex Avery', points: 1284, exacts: 41, step: 176 },
  { rank: 3, name: 'Box Box Ben', points: 1147, exacts: 34, step: 92 },
]
const ROWS = [
  { rank: 4, name: 'Chicane Chloe', points: 1098, exacts: 31, move: 1 },
  { rank: 5, name: 'Lights Out Liv', points: 1041, exacts: 29, move: -1 },
  { rank: 6, name: 'You', points: 987, exacts: 27, move: 2, you: true },
  { rank: 7, name: 'Pitlane Pat', points: 942, exacts: 25, move: -2 },
  { rank: 8, name: 'DRS Dana', points: 905, exacts: 24, move: 1 },
]

function PodiumColumn({ entry, play, reduced }) {
  const { rank, name, points, exacts, step } = entry
  const first = rank === 1
  const delay = (3 - rank) * 0.1 // P3, P2, then the winner last

  // Brightness tiers (palette-safe stand-in for gold / silver / bronze)
  const stepClass = first
    ? 'border-accent/60 bg-accent/[0.14] shadow-[0_0_60px_-10px_rgba(232,0,29,0.8)]'
    : rank === 2
      ? 'border-white/25 bg-white/[0.05]'
      : 'border-white/12 bg-white/[0.03]'
  const ghostClass = first ? 'text-accent/50' : rank === 2 ? 'text-white/[0.22]' : 'text-white/[0.13]'
  // P1 biggest; P2/P3 sized down so they sit cleanly inside their shorter steps.
  const ghostSize = first
    ? 'clamp(72px, 9vw, 116px)'
    : rank === 2
      ? 'clamp(44px, 6vw, 74px)'
      : 'clamp(36px, 5vw, 60px)'

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: SHARP, delay: reduced ? 0 : delay }}
    >
      {first ? (
        <Crown size={22} strokeWidth={2} className="text-accent" aria-hidden="true" />
      ) : (
        <span className="h-[22px]" />
      )}
      <span
        className={`mt-1 font-display text-[13px] font-semibold tabular-nums ${
          first ? 'text-accent' : 'text-secondary'
        }`}
      >
        P{rank}
      </span>
      <span
        className={`mt-1 px-1 text-center font-display font-bold uppercase leading-tight ${
          first ? 'text-[18px] text-primary sm:text-[24px]' : 'text-[14px] text-primary/90 sm:text-[18px]'
        }`}
      >
        {name}
      </span>
      <Counter
        to={points}
        play={play}
        signed={false}
        durationMs={first ? 600 : 850}
        delayMs={(reduced ? 0 : delay + 0.1) * 1000}
        className={`mt-1 font-display font-bold leading-none tabular-nums ${
          first ? 'text-[32px] text-accent sm:text-[46px]' : 'text-[24px] text-primary sm:text-[30px]'
        }`}
      />
      <span className="mt-1 font-body text-[12px] text-secondary">{exacts} exacts</span>

      <div
        className={`relative mt-4 flex w-full items-start justify-center overflow-hidden rounded-t-xl border ${stepClass}`}
        style={{ height: step }}
      >
        {first && !reduced && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent blur-2xl"
            animate={{ opacity: [0.12, 0.36, 0.12] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span
          aria-hidden="true"
          className={`relative select-none pt-2 font-display font-bold leading-none ${ghostClass}`}
          style={{ fontSize: ghostSize, letterSpacing: '-0.04em' }}
        >
          {rank}
        </span>
      </div>
    </motion.div>
  )
}

function Move({ move }) {
  if (move > 0) {
    return (
      <span className="flex items-center text-positive" aria-label={`up ${move}`}>
        <ChevronUp size={13} strokeWidth={2.5} aria-hidden="true" />
        <span className="font-body text-[11px] font-semibold tabular-nums">{move}</span>
      </span>
    )
  }
  if (move < 0) {
    return (
      <span className="flex items-center text-accent" aria-label={`down ${-move}`}>
        <ChevronDown size={13} strokeWidth={2.5} aria-hidden="true" />
        <span className="font-body text-[11px] font-semibold tabular-nums">{-move}</span>
      </span>
    )
  }
  return <Minus size={13} strokeWidth={2.5} className="text-secondary" aria-label="no change" />
}

function Row({ entry, play, reduced, index }) {
  const { rank, name, points, exacts, move, you } = entry
  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, ease: SHARP, delay: reduced ? 0 : 0.25 + index * 0.05 }}
      className={`grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200 ease-out sm:grid-cols-[56px_minmax(0,1fr)_72px_88px] sm:gap-4 ${
        you
          ? 'border border-accent/55 bg-accent/[0.12] shadow-[0_0_34px_-12px_rgba(232,0,29,0.6)]'
          : 'border border-transparent hover:bg-accent/[0.05]'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`font-display text-[14px] font-semibold tabular-nums ${
            you ? 'text-accent' : 'text-secondary'
          }`}
        >
          {rank}
        </span>
        <Move move={move} />
      </div>
      <span
        className={`truncate font-display text-[15px] font-semibold uppercase sm:text-[16px] ${
          you ? 'text-accent' : 'text-primary'
        }`}
      >
        {name}
      </span>
      <span className="hidden text-right font-body text-[14px] tabular-nums text-secondary sm:block">
        {exacts}
      </span>
      <div className="text-right">
        <Counter
          to={points}
          play={play}
          signed={false}
          delayMs={(reduced ? 0 : 0.25 + index * 0.05) * 1000}
          className={`font-display text-[20px] font-bold tabular-nums sm:text-[22px] ${
            you ? 'text-accent' : 'text-primary'
          }`}
        />
      </div>
    </motion.div>
  )
}

export function LeaderboardPreview() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const play = inView

  return (
    <section id="leagues" className="relative flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-content px-3 md:px-8">
        <SectionHeading title="Climb the table" />
        <p className="mt-6 max-w-[52ch] font-body text-[18px] leading-relaxed text-primary">
          Private groups with your friends. Global, country and team leagues with everyone else.
        </p>

        <div
          ref={ref}
          className="mt-12 rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm sm:p-6"
        >
          {/* card header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-primary">
              Global league
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-secondary">
                Live
              </span>
            </span>
          </div>

          {/* podium */}
          <div className="mx-auto mt-8 grid max-w-[660px] grid-cols-3 items-end gap-2 sm:gap-4">
            {PODIUM.map((entry) => (
              <PodiumColumn key={entry.rank} entry={entry} play={play} reduced={reduced} />
            ))}
          </div>

          {/* table */}
          <div className="mt-12">
            <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3 px-3 pb-2 sm:grid-cols-[56px_minmax(0,1fr)_72px_88px] sm:gap-4">
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">
                #
              </span>
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">
                Player
              </span>
              <span className="hidden text-right font-body text-[11px] font-medium uppercase tracking-[0.16em] text-secondary sm:block">
                Exacts
              </span>
              <span className="text-right font-body text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">
                Points
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {ROWS.map((entry, i) => (
                <Row key={entry.rank} entry={entry} play={play} reduced={reduced} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
