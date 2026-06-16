import { useEffect } from 'react'
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

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [enabled])
}
