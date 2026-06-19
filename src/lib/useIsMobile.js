import { useEffect, useState } from 'react'

// Phones and small tablets. Below this the wheel goes static (no scroll-driven
// rotation, parallax, or pose drift) — smooth scroll matters more than the effect.
const QUERY = '(max-width: 767px)'

/**
 * Tracks whether the viewport is in the mobile range and stays in sync on resize
 * / orientation change. Mirrors useReducedMotion's matchMedia pattern.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
