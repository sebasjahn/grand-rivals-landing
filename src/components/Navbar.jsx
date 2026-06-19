import { useEffect, useState } from 'react'
import { Countdown } from './Countdown'

const APP_URL = 'https://app.grandrivals.com'

/**
 * Sticky minimal top bar. Transparent over the hero, gains a subtle dark, blurred
 * background once the visitor scrolls past most of the first viewport. The live
 * countdown slides in next to the CTA after the hero, keeping the urgency — and the
 * "Play now" button — in view all the way down the page.
 */
const onHomePage = () =>
  typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === ''

// How far down the homepage you scroll before the countdown reveals. Kept small
// so it appears soon after you start scrolling.
const HOME_REVEAL_AT = 120

// Logo click → home. On the landing page, smooth-scroll to the top instead of
// reloading; on any other page (e.g. the legal pages), follow the href to "/".
function goHome(e) {
  if (!onHomePage()) return
  e.preventDefault()
  if (window.lenis) window.lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Navbar() {
  const isHome = onHomePage()
  // On the homepage the countdown reveals after a short scroll; on every other
  // page it's always shown.
  const [scrolled, setScrolled] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const onScroll = () => {
      setScrolled(window.scrollY > HOME_REVEAL_AT)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto max-w-content px-3 py-3 md:px-8">
        <div className="flex items-center justify-between">
          <a
            href="/"
            onClick={goHome}
            className="shrink-0 rounded-sm"
            aria-label="Grand Rivals — home"
          >
            <img
              src="/logo-horizontal.png"
              alt="Grand Rivals"
              width={179}
              height={36}
              className="h-[36px] w-auto max-w-none shrink-0"
            />
          </a>

          <div className="flex items-center gap-3">
            {/* Live countdown — reveals next to the CTA once past the hero (sm+). */}
            <div
              className={`hidden transition-all duration-300 ease-out sm:block ${
                scrolled ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-1 opacity-0'
              }`}
              aria-hidden={!scrolled}
            >
              <Countdown variant="compact" />
            </div>

            <a
              href={APP_URL}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1 font-body text-[14px] font-semibold text-primary transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]"
            >
              Play now
            </a>
          </div>
        </div>

        {/* Mobile countdown banner — its own line below the row, reveals on scroll
            and stays (the inline desktop version lives in the row above). */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out sm:hidden ${
            scrolled
              ? 'mt-2 max-h-[48px] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 -translate-y-1 opacity-0'
          }`}
          aria-hidden={!scrolled}
        >
          <div className="flex justify-center border-t border-border pt-2">
            <Countdown variant="compact" />
          </div>
        </div>
      </div>
    </header>
  )
}
