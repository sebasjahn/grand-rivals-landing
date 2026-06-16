/**
 * Procedural smoke. A soft elliptical plume pushed through fractal-noise
 * displacement so the edges read as wispy, non-repeating smoke. Trails the wheel
 * and dissipates via a radial alpha falloff. Grey haze only — the red "catch" is
 * layered separately in WheelStage so the colour stays an accent, never a fill.
 *
 * `seed` lets two instances differ; opacity is controlled by the parent layer.
 */
export function SmokePlume({ className = '', style, seed = 8 }) {
  const filterId = `smoke-${seed}`
  const fadeId = `plume-fade-${seed}`
  return (
    <svg
      viewBox="0 0 1200 800"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.016"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {/* alpha falloff — opaque core dissipating to nothing */}
        <radialGradient id={fadeId} cx="60%" cy="50%" r="52%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="42%" stopColor="#D7D7DC" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#9A9A9F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* main plume */}
      <ellipse cx="700" cy="400" rx="470" ry="250" fill={`url(#${fadeId})`} filter={`url(#${filterId})`} />
      {/* fainter trailing wisp further down the tail */}
      <ellipse
        cx="330"
        cy="470"
        rx="280"
        ry="150"
        fill={`url(#${fadeId})`}
        filter={`url(#${filterId})`}
        opacity="0.5"
      />
    </svg>
  )
}
