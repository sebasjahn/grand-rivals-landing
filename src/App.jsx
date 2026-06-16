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
import { useLenis } from './lib/useLenis'
import { useReducedMotion } from './lib/useReducedMotion'

export default function App() {
  const reduced = useReducedMotion()
  // Smooth scroll everywhere — unless the visitor prefers reduced motion.
  useLenis(!reduced)

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
