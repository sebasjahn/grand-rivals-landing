import { motion } from 'framer-motion'
import { useReducedMotion } from '../lib/useReducedMotion'

const SHARP = [0.16, 1, 0.3, 1]

/**
 * Shared section header: a short red rule + an optional kicker, then the uppercase
 * display title. Reveals once on scroll. Used across every section for rhythm.
 */
export function SectionHeading({ title, kicker, align = 'left', className = '' }) {
  const reduced = useReducedMotion()
  const rise = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SHARP } },
  }

  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.06 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className={`${align === 'center' ? 'flex flex-col items-center text-center' : ''} ${className}`}
    >
      <motion.div variants={rise} className="flex items-center gap-3">
        <span className="h-px w-3 bg-accent" />
        {kicker && (
          <span className="font-body text-[12px] font-medium uppercase tracking-[0.24em] text-secondary">
            {kicker}
          </span>
        )}
      </motion.div>
      <motion.h2
        variants={rise}
        className="mt-3 font-display font-bold uppercase text-primary"
        style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.0, letterSpacing: '-0.02em' }}
      >
        {title}
      </motion.h2>
    </motion.div>
  )
}
