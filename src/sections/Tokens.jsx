import { motion } from 'framer-motion'
import { Gauge, Shield, Wind, Timer, Plus } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

const TOKENS = [
  { key: 'throttle', icon: Gauge, name: 'Full Throttle', effect: 'Double your points' },
  { key: 'safety', icon: Shield, name: 'Safety Car', effect: 'Cancel the negatives' },
  { key: 'slipstream', icon: Wind, name: 'Slipstream', effect: 'Double down on one driver' },
  { key: 'purple', icon: Timer, name: 'Purple Sector', effect: 'Call the fastest lap' },
  { key: 'undercut', icon: Plus, name: 'Undercut', effect: 'Sneak an extra pick' },
]

export function Tokens() {
  const reduced = useReducedMotion()

  const grid = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.04 } },
  }
  const card = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: SHARP } },
  }

  return (
    <section id="tokens" className="relative flex min-h-screen items-center py-16">
      <div className="mx-auto w-full max-w-content px-3 md:px-8">
        <SectionHeading title="Play your hand" />
        <p className="mt-6 max-w-[44ch] font-body text-[18px] leading-relaxed text-primary">
          Five tokens. One per race. Spend them at the perfect moment.
        </p>

        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {TOKENS.map(({ key, icon: Icon, name, effect }) => (
            <motion.li key={key} variants={card} className="group relative">
              <div
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/75 p-4 backdrop-blur-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:bg-surface group-hover:shadow-[0_0_40px_-10px_rgba(232,0,29,0.5)]"
                style={{ minHeight: 'clamp(172px, 15vw, 200px)' }}
              >
                {/* ignition line fires on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                {/* faint red bloom on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(110% 80% at 50% 0%, rgba(232,0,29,0.12), transparent 70%)',
                  }}
                />

                <Icon
                  size={32}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="relative text-primary transition-colors duration-300 ease-out group-hover:text-accent"
                />

                <div className="relative mt-6">
                  <h3
                    className="font-display text-[20px] font-bold uppercase text-primary"
                    style={{ lineHeight: 0.95, letterSpacing: '-0.02em' }}
                  >
                    {name}
                  </h3>
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-secondary">{effect}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
