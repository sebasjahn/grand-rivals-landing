import { Instagram, Twitter, Music2 } from 'lucide-react'

const APP_URL = 'https://app.grandrivals.com'

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Tokens', href: '#tokens' },
  { label: 'Spotlight Races', href: '#spotlight' },
  { label: 'Leagues', href: '#leagues' },
  { label: 'Play now', href: APP_URL, external: true },
]

const SOCIALS = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'X', icon: Twitter, href: '#' },
  { label: 'TikTok', icon: Music2, href: '#' },
]

const LEGAL =
  'Grand Rivals is not affiliated with, endorsed by, or associated with Formula 1, Formula One Licensing BV, the FIA, or any Formula 1 team or driver. All driver and team names are used for identification purposes only.'

// Smooth-scroll internal anchors via Lenis (falls back to native).
function scrollToHash(e, href) {
  if (!href.startsWith('#')) return
  e.preventDefault()
  const el = document.querySelector(href)
  if (!el) return
  if (typeof window !== 'undefined' && window.lenis) window.lenis.scrollTo(el, { offset: -80 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

const linkClass =
  'rounded-sm font-body text-[14px] font-medium text-secondary transition-colors duration-200 ease-out hover:text-primary'
const smallLinkClass =
  'rounded-sm font-body text-[12px] text-secondary transition-colors duration-200 ease-out hover:text-primary'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-canvas">
      <div className="mx-auto w-full max-w-content px-3 py-12 md:px-8">
        {/* top: wordmark, nav, socials */}
        <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
          <a
            href="#top"
            onClick={(e) => scrollToHash(e, '#top')}
            className="shrink-0 rounded-sm"
            aria-label="Grand Rivals — back to top"
          >
            <img
              src="/logo-horizontal.png"
              alt="Grand Rivals"
              width={179}
              height={36}
              className="h-[36px] w-auto max-w-none shrink-0"
            />
          </a>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {NAV.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToHash(e, item.href)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="rounded-sm text-secondary transition-colors duration-200 ease-out hover:text-primary"
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* bottom: legal, copyright, small print */}
        <div className="mt-8">
          <p className="max-w-[92ch] font-body text-[12px] leading-relaxed text-secondary">{LEGAL}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[12px] text-secondary">
              © 2026 Grand Rivals. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className={smallLinkClass}>
                Privacy Policy
              </a>
              <a href="#" className={smallLinkClass}>
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
