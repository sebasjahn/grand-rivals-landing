import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { LayoutGrid, Zap, Users, Wrench, Swords } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

const ROUNDS = 24
const RACES = [
  { round: 3, icon: LayoutGrid, name: 'The Grid', effect: 'Predict qualifying' },
  { round: 8, icon: Zap, name: 'Sprint Start', effect: 'Predict the sprint' },
  { round: 13, icon: Users, name: 'Full Field', effect: 'Predict all 22 drivers' },
  { round: 18, icon: Wrench, name: 'Pit Wall', effect: 'Predict the constructors' },
  { round: 23, icon: Swords, name: 'Wheel to Wheel', effect: 'Call which driver beats their teammate' },
]
const N = RACES.length
const AT = RACES.map((r) => (r.round - 1) / (ROUNDS - 1)) // scroll-progress threshold per spotlight
const ROUND_TO_SPOT = Object.fromEntries(RACES.map((r, i) => [r.round, i]))

const PER_RACE_VH = 80
const SECTION_VH = N * PER_RACE_VH + 100

const INTRO =
  'A few weekends each season break the rules. Predict qualifying. Call the full grid. Pick the constructors. Announced at the start, marked on your calendar.'

function Progress({ active }) {
  return (
    <div className="flex flex-col items-start gap-3 sm:items-end">
      <div className="font-display text-[16px] font-semibold tabular-nums">
        <span className="text-accent">{active < 0 ? '00' : pad(active + 1)}</span>
        <span className="mx-1 text-secondary">/</span>
        <span className="text-secondary">{pad(N)}</span>
      </div>
      <div className="flex gap-1">
        {RACES.map((r, i) => (
          <span
            key={r.round}
            className={`h-[3px] w-6 rounded-full transition-colors duration-200 ease-out ${
              i <= active ? 'bg-accent' : 'bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function SeasonCalendar({ scrollYProgress, active }) {
  const playheadX = useTransform(scrollYProgress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`)

  return (
    <div className="relative h-[88px] w-full select-none" aria-hidden="true">
      {/* baseline */}
      <div className="absolute inset-x-0 bottom-[24px] h-px bg-border" />
      {/* traveled fill — grows continuously behind the playhead */}
      <motion.div
        className="absolute bottom-[24px] left-0 h-[2px] w-full origin-left bg-accent/70"
        style={{ scaleX: scrollYProgress }}
      />

      {/* round ticks, absolutely placed so the playhead lands dead-centre */}
      {Array.from({ length: ROUNDS }).map((_, i) => {
        const round = i + 1
        const spot = ROUND_TO_SPOT[round]
        const isSpot = spot !== undefined
        const lit = isSpot && spot <= active
        const isActive = spot === active
        return (
          <div
            key={round}
            className="absolute bottom-[24px] flex flex-col items-center"
            style={{ left: `${(i / (ROUNDS - 1)) * 100}%`, transform: 'translateX(-50%)' }}
          >
            {isSpot ? (
              <>
                <span
                  className={`mb-2 hidden font-display text-[10px] font-semibold tracking-[0.06em] transition-colors duration-200 sm:block ${
                    lit ? 'text-accent' : 'text-secondary/50'
                  }`}
                >
                  R{pad(round)}
                </span>
                <span className="relative">
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ opacity: [0.6, 0], scale: [1, 2.6] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <span
                    className={`relative block h-[9px] w-[9px] rounded-full transition-all duration-200 ease-out ${
                      lit
                        ? 'bg-accent shadow-[0_0_12px_rgba(232,0,29,0.95)]'
                        : 'bg-white/25'
                    }`}
                  />
                </span>
                <span
                  className={`mt-1 h-[18px] w-[2px] transition-colors duration-200 ease-out ${
                    lit ? 'bg-accent' : 'bg-border'
                  }`}
                />
              </>
            ) : (
              <span className="h-[10px] w-px bg-border" />
            )}
          </div>
        )
      })}

      {/* playhead — travels continuously with scroll */}
      <motion.div className="absolute inset-0" style={{ x: playheadX }}>
        <div className="absolute bottom-[14px] left-0 flex -translate-x-1/2 flex-col items-center">
          <span className="h-[11px] w-[11px] rounded-full bg-accent shadow-[0_0_16px_rgba(232,0,29,1)]" />
          <span className="mt-[2px] h-[44px] w-[2px] bg-accent/80" />
        </div>
      </motion.div>
    </div>
  )
}

function RaceReveal({ race }) {
  const { idx, round, icon: Icon, name, effect } = race
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none font-display font-bold leading-none text-accent/[0.1] sm:block"
        style={{ fontSize: 'clamp(220px, 26vw, 400px)', letterSpacing: '-0.04em' }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: SHARP }}
      >
        {pad(idx)}
      </motion.span>

      <motion.div
        className="relative flex items-center gap-3"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: SHARP, delay: 0.04 }}
      >
        <Icon size={28} strokeWidth={2} aria-hidden="true" className="text-accent" />
        <span className="h-px w-8 bg-accent" />
        <span className="font-display text-[15px] font-semibold uppercase tracking-[0.18em] text-accent">
          Round {pad(round)}
        </span>
      </motion.div>

      <motion.h3
        className="relative mt-4 font-display font-bold uppercase text-primary"
        style={{ fontSize: 'clamp(46px, 9vw, 120px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
        initial={{ opacity: 0, x: -70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: SHARP, delay: 0.08 }}
      >
        {name}
      </motion.h3>

      <motion.p
        className="relative mt-4 max-w-[40ch] font-body text-[20px] leading-relaxed text-secondary"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: SHARP, delay: 0.16 }}
      >
        {effect}
      </motion.p>
    </motion.div>
  )
}

function SpotlightPinned() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let idx = -1
    for (let i = 0; i < N; i++) if (v >= AT[i]) idx = i
    setActive((prev) => (prev === idx ? prev : idx))
  })

  return (
    <section id="spotlight" ref={sectionRef} className="relative" style={{ height: `${SECTION_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-content flex-col px-3 pb-8 pt-12 md:px-8">
          {/* header */}
          <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[54ch]">
              <SectionHeading title="Spotlight races" />
              <p className="mt-4 font-body text-[15px] leading-relaxed text-secondary">{INTRO}</p>
            </div>
            <Progress active={active} />
          </div>

          {/* reveal stage */}
          <div className="relative flex-1">
            <AnimatePresence>
              {active >= 0 && (
                <RaceReveal key={active} race={{ ...RACES[active], idx: active + 1 }} />
              )}
            </AnimatePresence>
          </div>

          {/* moving season calendar */}
          <SeasonCalendar scrollYProgress={scrollYProgress} active={active} />
        </div>
      </div>
    </section>
  )
}

function SpotlightStacked() {
  return (
    <section id="spotlight" className="relative py-16">
      <div className="mx-auto w-full max-w-content px-3 md:px-8">
        <SectionHeading title="Spotlight races" />
        <p className="mt-6 max-w-[60ch] font-body text-[18px] leading-relaxed text-primary">{INTRO}</p>

        <div className="mt-12 border-t border-border">
          {RACES.map(({ round, icon: Icon, name, effect }) => (
            <div key={round} className="border-b border-border py-8">
              <div className="flex items-center gap-3">
                <Icon size={24} strokeWidth={2} aria-hidden="true" className="text-accent" />
                <span className="font-display text-[14px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Round {pad(round)}
                </span>
              </div>
              <h3
                className="mt-3 font-display font-bold uppercase text-primary"
                style={{ fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
              >
                {name}
              </h3>
              <p className="mt-2 font-body text-[18px] leading-relaxed text-secondary">{effect}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SpotlightRaces() {
  const reduced = useReducedMotion()
  return reduced ? <SpotlightStacked /> : <SpotlightPinned />
}
