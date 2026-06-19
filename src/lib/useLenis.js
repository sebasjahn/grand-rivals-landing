import { useEffect } from 'react'
import { cancelFrame, frame } from 'framer-motion'
import Lenis from 'lenis'

/**
 * Initialises Lenis smooth scrolling for the whole page.
 * Skipped entirely when the user prefers reduced motion — native scroll takes over.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    // Expose the instance for anchor-link scrolling and tooling.
    window.lenis = lenis

    // Tick Lenis from Framer Motion's single render loop rather than a second,
    // independent requestAnimationFrame. Two competing RAF loops both touching
    // scroll is what causes the double-firing and jank — this unifies them so
    // Lenis advances first, then Framer reads the resulting scroll in the same
    // frame.
    const update = (data) => {
      lenis.raf(data.timestamp)
    }
    frame.update(update, true)

    return () => {
      cancelFrame(update)
      lenis.destroy()
      delete window.lenis
    }
  }, [enabled])
}
