/**
 * Minimal, dependency-free Markdown renderer for the legal pages. It handles the
 * subset the legal docs use — headings, paragraphs, unordered lists, blockquotes,
 * horizontal rules, and inline bold / italic / links — and styles the output with
 * Tailwind so it matches the landing page (Barlow Condensed headings, Inter body,
 * brand palette). It is deliberately small; if the docs grow more complex, reach
 * for a real Markdown library instead.
 */

// Inline formatting: **bold**, _italic_, [text](url). Plain text otherwise.
function renderInline(text, keyBase) {
  const patterns = [
    {
      re: /\*\*([^*]+)\*\*/,
      node: (m, k) => (
        <strong key={k} className="font-semibold text-primary">
          {renderInline(m[1], k)}
        </strong>
      ),
    },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      node: (m, k) => (
        <a key={k} href={m[2]} className="text-accent underline-offset-2 hover:underline">
          {renderInline(m[1], k)}
        </a>
      ),
    },
    {
      re: /_([^_]+)_/,
      node: (m, k) => (
        <em key={k} className="italic">
          {renderInline(m[1], k)}
        </em>
      ),
    },
  ]

  const out = []
  let rest = text
  let i = 0
  while (rest) {
    let best = null
    for (const p of patterns) {
      const m = p.re.exec(rest)
      if (m && (!best || m.index < best.m.index)) best = { p, m }
    }
    if (!best) {
      out.push(rest)
      break
    }
    if (best.m.index > 0) out.push(rest.slice(0, best.m.index))
    out.push(best.p.node(best.m, `${keyBase}-${i++}`))
    rest = rest.slice(best.m.index + best.m[0].length)
  }
  return out
}

// Group raw lines into block-level tokens.
function parseBlocks(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }
    if (/^(?:---+|\*\*\*+)$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      blocks.push({ type: 'h', level: heading[1].length, text: heading[2].trim() })
      i++
      continue
    }
    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: quote.join(' ') })
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }
    const para = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^(?:---+|\*\*\*+)$/.test(lines[i].trim())
    ) {
      para.push(lines[i])
      i++
    }
    blocks.push({ type: 'p', text: para.join(' ') })
  }
  return blocks
}

const bodyText = 'text-[16px] leading-[1.7] text-secondary md:text-[18px]'

export function Markdown({ content }) {
  const blocks = parseBlocks(content)
  return (
    <div className="font-body">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case 'hr':
            return <hr key={idx} className="my-8 border-border" />
          case 'h':
            if (b.level === 1)
              return (
                <h1
                  key={idx}
                  className="mb-3 font-display text-[40px] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-primary md:text-[56px]"
                >
                  {renderInline(b.text, `h${idx}`)}
                </h1>
              )
            if (b.level === 2)
              return (
                <h2
                  key={idx}
                  className="mb-3 mt-8 font-display text-[24px] font-semibold uppercase leading-[1.1] tracking-[-0.01em] text-primary md:text-[28px]"
                >
                  {renderInline(b.text, `h${idx}`)}
                </h2>
              )
            return (
              <h3
                key={idx}
                className="mb-2 mt-6 font-display text-[20px] font-semibold uppercase tracking-[-0.01em] text-primary"
              >
                {renderInline(b.text, `h${idx}`)}
              </h3>
            )
          case 'quote':
            return (
              <blockquote
                key={idx}
                className={`my-6 border-l-2 border-accent pl-3 italic ${bodyText}`}
              >
                {renderInline(b.text, `q${idx}`)}
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={idx} className="my-4 list-disc space-y-2 pl-3 marker:text-accent">
                {b.items.map((it, j) => (
                  <li key={j} className={`pl-1 ${bodyText}`}>
                    {renderInline(it, `li${idx}-${j}`)}
                  </li>
                ))}
              </ul>
            )
          default:
            return (
              <p key={idx} className={`my-4 ${bodyText}`}>
                {renderInline(b.text, `p${idx}`)}
              </p>
            )
        }
      })}
    </div>
  )
}
