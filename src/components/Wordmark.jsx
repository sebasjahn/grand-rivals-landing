/**
 * Text wordmark for Grand Rivals. No external logo asset yet — the brand reads as
 * condensed display type with a single signal-red accent dot.
 */
export function Wordmark({ className = '' }) {
  return (
    <span
      className={`font-display text-[20px] font-bold uppercase leading-none text-primary ${className}`}
      style={{ letterSpacing: '-0.02em' }}
    >
      Grand Rivals<span className="text-accent">.</span>
    </span>
  )
}
