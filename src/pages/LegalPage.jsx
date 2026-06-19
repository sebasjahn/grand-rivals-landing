import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Markdown } from '../components/Markdown'

/**
 * Static legal/policy page. Same chrome as the landing page (navbar + footer) on a
 * clean near-black canvas, with the markdown content rendered in a centred ~800px
 * column. No scroll animations — these pages are meant to be simple and readable.
 */
export function LegalPage({ content }) {
  return (
    <>
      <Navbar />
      <main className="relative z-10 min-h-screen bg-canvas">
        <article className="mx-auto w-full max-w-[800px] px-3 pb-12 pt-16 md:px-8">
          <Markdown content={content} />
        </article>
      </main>
      <Footer />
    </>
  )
}
