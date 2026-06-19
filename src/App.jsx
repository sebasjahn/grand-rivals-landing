import { Navbar } from './components/Navbar'
import { WheelStage } from './components/WheelStage'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { ScoreDrama } from './sections/ScoreDrama'
import { Tokens } from './sections/Tokens'
import { SpotlightRaces } from './sections/SpotlightRaces'
import { LeaderboardPreview } from './sections/LeaderboardPreview'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './components/Footer'
import { LegalPage } from './pages/LegalPage'
import { useLenis } from './lib/useLenis'
import { useReducedMotion } from './lib/useReducedMotion'
import privacyMd from './legal/privacy.md?raw'
import termsMd from './legal/terms.md?raw'
import legalNoticeMd from './legal/legal-notice.md?raw'

// Static legal routes. Lightweight path-based routing — no router dependency; the
// SPA fallback (vite dev + vercel.json rewrite) serves index.html for these paths.
const LEGAL_PAGES = {
  '/privacy': privacyMd,
  '/terms': termsMd,
  '/legal': legalNoticeMd,
}

function currentPath() {
  if (typeof window === 'undefined') return '/'
  const p = window.location.pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

export default function App() {
  const reduced = useReducedMotion()
  // Smooth scroll everywhere — unless the visitor prefers reduced motion.
  useLenis(!reduced)

  const legalContent = LEGAL_PAGES[currentPath()]
  if (legalContent) return <LegalPage content={legalContent} />

  return (
    <>
      {/* The signature wheel/smoke spine — fixed behind everything. */}
      <WheelStage />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <ScoreDrama />
        <Tokens />
        <SpotlightRaces />
        <LeaderboardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
