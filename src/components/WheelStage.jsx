import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { SignatureWheel } from './SignatureWheel'
import { SmokePlume } from './SmokePlume'
import { useReducedMotion } from '../lib/useReducedMotion'
import textureCarbon from '../../assets/texture-carbon.svg'

const SHARP = [0.16, 1, 0.3, 1]

/**
 * Per-section "poses" for the wheel and its smoke. Index 0 is the hero; each
 * subsequent index is the resting pose while that section (~1 viewport tall) is
 * centred. Extend these arrays by one entry as each new section is added — the
 * wheel then drifts to a deliberate, distinct spot for every section.
 *
 * x/y are in viewport units (vw/vh); opacity here is a *scroll* multiplier layered
 * on top of the responsive base opacity, so the wheel recedes as it travels.
 */
// Each stop is the section's top in *viewport* units. Most sections are 1vp, but
// the Spotlight section is a ~5vp pinned track, so the stops jump 4 -> 9. Then
// leaderboard at 9 (held to 9.7) and the final CTA at 10, where the wheel returns
// big and central for the "lights out" close.
const POSE_STOPS = [0, 1, 2, 3, 4, 9, 9.7, 10]
const WHEEL_POSE = {
  x: [0, -18, 8, -14, 12, -10, -10, -4], // vw
  y: [0, 12, 18, 24, 16, 18, 18, -2], // vh
  scale: [1, 0.82, 0.72, 0.64, 0.7, 0.6, 0.6, 0.92],
  opacity: [1, 0.86, 0.8, 0.76, 0.74, 0.62, 0.62, 0.98],
}
const SMOKE_POSE = {
  x: [0, -12, 6, -10, 8, -8, -8, 0], // vw
  y: [0, 10, 16, 22, 14, 16, 16, 0], // vh
  opacity: [1, 0.5, 0.42, 0.36, 0.4, 0.36, 0.36, 0.6],
}

export function WheelStage() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  // Track viewport size so poses can be expressed in vw/vh.
  const [vp, setVp] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Which section is in view (0 = hero, 1 = next, ...), assuming ~full-height sections.
  const sectionF = useTransform(scrollY, (v) => (vp.h ? v / vp.h : 0))
  const stops = POSE_STOPS

  // Scroll-tethered spoke rotation (degrees per pixel) — never time-based.
  const scrollRotate = useTransform(scrollY, (v) => v * 0.12)
  const zero = useMotionValue(0)

  // Velocity → motion-blur fan + smoke life, spring-settled so it snaps back sharp.
  const velocity = useVelocity(scrollY)
  const absV = useTransform(velocity, (v) => Math.min(Math.abs(v), 2600))
  const spread = useSpring(useTransform(absV, [0, 2600], [0, 7]), {
    stiffness: 160,
    damping: 22,
    mass: 0.3,
  })
  const smokeLife = useSpring(useTransform(absV, [0, 2600], [0.4, 1]), {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  })

  // Per-section drift poses.
  const wheelX = useTransform(sectionF, stops, WHEEL_POSE.x.map((n) => (n / 100) * vp.w))
  const wheelY = useTransform(sectionF, stops, WHEEL_POSE.y.map((n) => (n / 100) * vp.h))
  const wheelScale = useTransform(sectionF, stops, WHEEL_POSE.scale)
  const wheelOpacity = useTransform(sectionF, stops, WHEEL_POSE.opacity)
  const smokeX = useTransform(sectionF, stops, SMOKE_POSE.x.map((n) => (n / 100) * vp.w))
  const smokeY = useTransform(sectionF, stops, SMOKE_POSE.y.map((n) => (n / 100) * vp.h))
  const smokeOpacity = useTransform(sectionF, stops, SMOKE_POSE.opacity)

  // Pointer parallax for depth — layers move by different amounts.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const wheelMx = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 80, damping: 20 })
  const wheelMy = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 80, damping: 20 })
  const smokeMx = useSpring(useTransform(mx, [-1, 1], [-34, 34]), { stiffness: 60, damping: 22 })
  const smokeMy = useSpring(useTransform(my, [-1, 1], [-22, 22]), { stiffness: 60, damping: 22 })

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(hover: hover)').matches) return
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, mx, my])

  const rotate = reduced ? zero : scrollRotate
  const fan = reduced ? zero : spread
  const wheelPose = reduced
    ? undefined
    : { x: wheelX, y: wheelY, scale: wheelScale, opacity: wheelOpacity }
  const smokePose = reduced ? undefined : { x: smokeX, y: smokeY, opacity: smokeOpacity }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* base vertical near-black gradient — the one permitted dark-to-darker */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0B0B0D 0%, #141417 100%)' }}
      />

      {/* tarmac / carbon grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{ backgroundImage: `url(${textureCarbon})`, backgroundSize: '560px 560px' }}
      />

      {/* red haze the smoke catches — accent used only as atmosphere */}
      <div
        className="absolute right-[6%] top-1/2 h-[60vh] w-[60vh] -translate-y-1/2 rounded-full opacity-[0.10] blur-[90px]"
        style={{ background: 'radial-gradient(circle, #E8001D 0%, rgba(232,0,29,0) 70%)' }}
      />

      {/* smoke plume — trails the wheel, leftward */}
      <div className="absolute right-[-5%] top-1/2 h-[80vh] w-[130vw] max-w-[1600px] -translate-y-1/2 opacity-80 sm:opacity-90">
        <motion.div
          className="h-full w-full"
          initial={reduced ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: SHARP, delay: 0.1 }}
        >
          <motion.div className="h-full w-full" style={smokePose}>
            <motion.div
              className="h-full w-full"
              style={reduced ? undefined : { x: smokeMx, y: smokeMy, opacity: smokeLife }}
            >
              <SmokePlume className="h-full w-full" seed={8} style={{ mixBlendMode: 'screen' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* the wheel — center-right, bleeding off the edge, behind content */}
      <div
        className="absolute top-1/2 opacity-[0.5] sm:opacity-[0.7] lg:opacity-[0.8]"
        style={{
          right: 'clamp(-220px, -8vw, -80px)',
          width: 'clamp(440px, 58vw, 980px)',
          transform: 'translateY(-50%)',
        }}
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, x: '14%', scale: 0.94, rotate: -32 }}
          animate={{ opacity: 1, x: '0%', scale: 1, rotate: 0 }}
          transition={{ duration: 0.55, ease: SHARP, delay: 0.05 }}
        >
          <motion.div style={wheelPose}>
            <motion.div style={reduced ? undefined : { x: wheelMx, y: wheelMy }}>
              <SignatureWheel rotate={rotate} spread={fan} className="h-auto w-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* low vignette to seat everything and protect text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 30% 40%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
