import { motion } from 'framer-motion'
import { ListOrdered, Target, Trophy } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

const STEPS = [
  {
    n: '01',
    icon: ListOrdered,
    title: 'Predict the top 10',
    body: 'Set your finishing order before lights out. Drag, drop, lock it in.',
    accent: false,
  },
  {
    n: '02',
    icon: Target,
    title: 'Score on accuracy',
    body: 'Nail exact positions for big points. Bold calls win seasons. Bad calls cost you.',
    accent: false,
  },
  {
    n: '03',
    icon: Trophy,
    title: 'Beat your group',
    body: 'Climb the leaderboard, earn badges, settle it over a full season.',
    accent: true,
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()

  const grid = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: reduced ? 0 : 0.04 } },
  }
  // Harder, faster, snappier than the rest of the page.
  const card = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: SHARP } },
  }

  return (
    <section id="how-it-works" className="relative flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-content px-3 md:px-8">
        <SectionHeading title="How it works" />

        <motion.ol
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {STEPS.map(({ n, icon: Icon, title, body, accent }) => (
            <motion.li key={n} variants={card} className="group relative">
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ease-out group-hover:-translate-y-1 ${
                  accent
                    ? 'border-accent/30 bg-surface/85 shadow-[0_0_44px_-12px_rgba(232,0,29,0.5)] group-hover:border-accent/70 group-hover:shadow-[0_0_60px_-10px_rgba(232,0,29,0.65)]'
                    : 'border-border bg-surface/75 group-hover:border-accent/40 group-hover:shadow-[0_0_44px_-12px_rgba(232,0,29,0.45)]'
                }`}
                style={{ minHeight: 'clamp(230px, 23vw, 270px)' }}
              >
                {/* ignition line — lit on the accent card, fires on hover for the rest */}
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] origin-left bg-accent transition-transform duration-300 ease-out ${
                    accent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />

                {/* oversized ghosted number — the first thing the eye hits */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-2 right-1 select-none font-display font-bold leading-none transition-all duration-300 ease-out group-hover:translate-x-1 ${
                    accent
                      ? 'text-accent/[0.18] group-hover:text-accent/25'
                      : 'text-primary/[0.06] group-hover:text-primary/10'
                  }`}
                  style={{ fontSize: 'clamp(120px, 15vw, 184px)', letterSpacing: '-0.04em' }}
                >
                  {n}
                </span>

                {/* big, naked icon, top-left */}
                <Icon
                  size={56}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`relative z-10 transition-colors duration-300 ease-out ${
                    accent ? 'text-accent' : 'text-primary group-hover:text-accent'
                  }`}
                />

                {/* title + body sit just under the number for a tighter composition */}
                <div className="relative z-10 mt-6">
                  <h3
                    className="font-display font-bold uppercase text-primary"
                    style={{ fontSize: 'clamp(26px, 3vw, 34px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
                  >
                    {title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] font-body text-[15px] leading-relaxed text-secondary">
                    {body}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
