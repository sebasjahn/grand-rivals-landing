import { useEffect, useState } from 'react'
import { Countdown } from './Countdown'

const APP_URL = 'https://app.grandrivals.com'

/**
 * Sticky minimal top bar. Transparent over the hero, gains a subtle dark, blurred
 * background once the visitor scrolls past most of the first viewport. The live
 * countdown slides in next to the CTA after the hero, keeping the urgency — and the
 * "Play now" button — in view all the way down the page.
 */
// Logo click → home. On the landing page, smooth-scroll to the top instead of
// reloading; on any other page (e.g. the legal pages), follow the href to "/".
function goHome(e) {
  if (typeof window === 'undefined') return
  const onHome = window.location.pathname.replace(/\/+$/, '') === ''
  if (!onHome) return
  e.preventDefault()
  if (window.lenis) window.lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'border-b border-border bg-canvas/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-3 py-3 md:px-8">
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
          {/* Live countdown — reveals next to the CTA once past the hero. */}
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
    </header>
  )
}
