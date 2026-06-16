import { useEffect, useMemo, useState } from 'react'
import { getNextRaceDate } from '../lib/raceSchedule'

const pad = (n) => String(n).padStart(2, '0')

function diff(target, now) {
  let s = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(s / 86400)
  s -= days * 86400
  const hours = Math.floor(s / 3600)
  s -= hours * 3600
  const minutes = Math.floor(s / 60)
  const seconds = s - minutes * 60
  return { days, hours, minutes, seconds }
}

function useCountdown() {
  const target = useMemo(() => getNextRaceDate(), [])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) return null
  return diff(target.getTime(), now)
}

/**
 * Live "next lights out" countdown to the next scheduled race. Ticks every second,
 * renders nothing if the schedule is exhausted.
 *
 * variant:
 *  - "inline"    — single row, label then time (default)
 *  - "telemetry" — right-aligned timing readout, larger numerals, for the hero
 */
export function Countdown({ variant = 'inline' }) {
  const t = useCountdown()
  if (!t) return null

  const { days, hours, minutes, seconds } = t
  const parts = [
    [days, 'days'],
    [hours, 'hrs'],
    [minutes, 'min'],
    [seconds, 'sec'],
  ]
  const ariaLabel = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds until the next race`

  if (variant === 'telemetry') {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
          <span className="whitespace-nowrap font-body text-[11px] font-medium uppercase tracking-[0.24em] text-secondary">
            Next lights out
          </span>
        </div>
        <span
          className="flex items-baseline gap-3 font-display text-[28px] font-semibold leading-none tabular-nums text-primary md:text-[34px]"
          style={{ letterSpacing: '-0.02em' }}
          aria-label={ariaLabel}
        >
          {parts.map(([value, label], i) => (
            <span key={label} className="flex flex-col items-center gap-1">
              <span className="flex items-baseline">
                <span>{pad(value)}</span>
                {i < parts.length - 1 && <span className="ml-3 text-secondary">:</span>}
              </span>
              <span className="font-body text-[9px] font-medium uppercase tracking-[0.16em] text-secondary">
                {label}
              </span>
            </span>
          ))}
        </span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2" aria-label={ariaLabel}>
        <span className="inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
        <span className="hidden font-body text-[10px] font-medium uppercase tracking-[0.2em] text-secondary lg:inline">
          Lights out
        </span>
        <span
          className="flex items-baseline gap-1 font-display text-[15px] font-semibold tabular-nums text-primary"
          style={{ letterSpacing: '-0.01em' }}
          aria-hidden="true"
        >
          {parts.map(([value, label], i) => (
            <span key={label} className="flex items-baseline">
              <span>{pad(value)}</span>
              <span className="ml-px text-[8px] font-medium uppercase text-secondary">{label[0]}</span>
              {i < parts.length - 1 && <span className="ml-1 text-secondary">:</span>}
            </span>
          ))}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
        <span className="whitespace-nowrap font-body text-[13px] font-medium uppercase tracking-[0.18em] text-secondary">
          Next lights out in
        </span>
      </div>
      <span
        className="flex items-baseline gap-2 font-display text-[18px] font-semibold tabular-nums text-primary"
        aria-label={ariaLabel}
      >
        {parts.map(([value, label], i) => (
          <span key={label} className="flex items-baseline">
            <span style={{ letterSpacing: '-0.02em' }}>{pad(value)}</span>
            <span className="ml-px text-[10px] font-medium uppercase tracking-[0.12em] text-secondary">
              {label}
            </span>
            {i < parts.length - 1 && <span className="ml-2 text-secondary">:</span>}
          </span>
        ))}
      </span>
    </div>
  )
}
