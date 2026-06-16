import { motion, useTransform } from 'framer-motion'

/**
 * The signature F1 wheel. A graphic, palette-true motorsport wheel:
 * near-black tyre, machined dark rim, a single red center-lock + faint brake-disc
 * haze. Only the spoke group rotates (the tyre carries no read of rotation), and
 * rotation is smeared with stacked angular "echoes" for true motion blur.
 *
 * Props:
 *  - rotate: MotionValue<number>  base spoke rotation (deg), scroll-tethered
 *  - spread: MotionValue<number>  angular echo fan (deg), velocity-driven
 */

const SPOKES = [0, 72, 144, 216, 288]

// One static set of five spokes around the hub, no rotation of its own.
function Spokes() {
  return (
    <g>
      {SPOKES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          {/* tapered spoke from rim to hub */}
          <path
            d="M193 96 L207 96 L213 168 L187 168 Z"
            fill="#26262c"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* thin machined highlight ridge */}
          <line
            x1="200"
            y1="100"
            x2="200"
            y2="166"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        </g>
      ))}
    </g>
  )
}

// One rotating layer of spokes, offset by `spread * index` for the motion-blur fan.
function SpokeEcho({ rotate, spread, index, opacity }) {
  const r = useTransform([rotate, spread], ([rot, sp]) => rot + sp * index)
  return (
    <motion.g
      style={{
        rotate: r,
        opacity,
        transformOrigin: '200px 200px',
        transformBox: 'view-box',
      }}
    >
      <Spokes />
    </motion.g>
  )
}

export function SignatureWheel({ rotate, spread, className = '', style }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="brakeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="hubShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* soft drop shadow to seat the wheel in the scene */}
      <circle cx="206" cy="210" r="190" fill="#000000" opacity="0.5" filter="url(#hubShadow)" />

      {/* tyre */}
      <circle cx="200" cy="200" r="190" fill="#141417" />
      <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      {/* sidewall light-catch, top-left arc only */}
      <circle
        cx="200"
        cy="200"
        r="182"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="330 820"
        transform="rotate(-125 200 200)"
        opacity="0.7"
      />

      {/* rim well — slightly darker than the tyre for depth */}
      <circle cx="200" cy="200" r="124" fill="#0B0B0D" />
      <circle cx="200" cy="200" r="124" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

      {/* glowing brake disc behind the spokes — the red, used atmospherically */}
      <circle cx="200" cy="200" r="92" fill="#E8001D" opacity="0.18" filter="url(#brakeGlow)" />
      <circle cx="200" cy="200" r="74" fill="none" stroke="rgba(232,0,29,0.06)" strokeWidth="10" />

      {/* spoke echoes (trailing) then the crisp base set */}
      <SpokeEcho rotate={rotate} spread={spread} index={-3} opacity={0.12} />
      <SpokeEcho rotate={rotate} spread={spread} index={-2} opacity={0.2} />
      <SpokeEcho rotate={rotate} spread={spread} index={-1} opacity={0.34} />
      <SpokeEcho rotate={rotate} spread={spread} index={0} opacity={1} />

      {/* hub + red center lock (static, crisp) */}
      <circle cx="200" cy="200" r="38" fill="#141417" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="200" cy="200" r="14" fill="#E8001D" />
      <circle cx="200" cy="200" r="5" fill="#0B0B0D" />
    </svg>
  )
}
