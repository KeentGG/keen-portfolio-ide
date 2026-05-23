import { useEffect, useRef } from 'react'

/**
 * EditorPane — A faux code editor displaying the portfolio's "source code"
 * with syntax highlighting and line numbers. Uses Tailwind + IDE theme tokens.
 */

interface CodeLineData {
  type: string
  text?: string
  rest?: string
  from?: string
  str?: string
  key?: string
  value?: string
  comma?: boolean
  last?: boolean
}

const CODE_LINES: CodeLineData[] = [
  { type: 'comment', text: '// portfolio.config.tsx' },
  { type: 'blank', text: '' },
  { type: 'keyword', text: 'import', rest: ' { definePortfolio } ', from: 'from', str: ' "@keen/portfolio"' },
  { type: 'blank', text: '' },
  { type: 'keyword', text: 'export default', rest: ' definePortfolio({' },
  { type: 'blank', text: '' },
  { type: 'prop', key: 'name', value: '"Keanu Kent Gargar"', comma: true },
  { type: 'prop', key: 'role', value: '"Sr. Frontend Engineer"', comma: true },
  { type: 'blank', text: '' },
  { type: 'prop', key: 'tagline', value: '"I\'m a frontend engineer that builds intuitive\ntools designed to be invisible in your workflow."', comma: true },
  { type: 'blank', text: '' },
  { type: 'comment', text: '  // what I do' },
  { type: 'key-open', key: 'focus' },
  { type: 'string-item', value: '"Human-centric product design"' },
  { type: 'string-item', value: '"Invisible workflow tooling"' },
  { type: 'string-item', value: '"Frontend architecture"', last: true },
  { type: 'close-bracket', text: '  ],' },
  { type: 'blank', text: '' },
  { type: 'comment', text: '  // where I add value' },
  { type: 'key-open', key: 'philosophy' },
  { type: 'string-item', value: '"Empowering companies in aligning\n   product to be human-centric."', last: true },
  { type: 'close-bracket', text: '  ],' },
  { type: 'blank', text: '' },
  { type: 'comment', text: '  // stack' },
  { type: 'key-open', key: 'tools' },
  { type: 'string-item', value: '"React"', comma: true },
  { type: 'string-item', value: '"TypeScript"', comma: true },
  { type: 'string-item', value: '"Tailwind CSS"', comma: true },
  { type: 'string-item', value: '"Motion"', comma: true },
  { type: 'string-item', value: '"NestJS"', last: true },
  { type: 'close-bracket', text: '  ],' },
  { type: 'blank', text: '' },
  { type: 'closing', text: '})' },
]

const NUM_CLASS = 'select-none text-right pr-4 shrink-0 w-12 text-ide-text-dim/40 text-[13px] font-host-grotek'

function CodeLine({ lineNum, line }: { lineNum: number; line: CodeLineData }) {
  const numStr = String(lineNum).padStart(2, ' ')

  if (line.type === 'blank') {
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span>&nbsp;</span>
      </div>
    )
  }

  if (line.type === 'comment') {
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-ide-text-accent/70 text-[13px]">{line.text}</span>
      </div>
    )
  }

  if (line.type === 'keyword') {
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-[13px]">
          <span style={{ color: '#c792ea' }}>{line.text}</span>
          <span className="text-ide-text-primary">{line.rest}</span>
          <span style={{ color: '#c792ea' }}> {line.from} </span>
          <span style={{ color: '#c3e88d' }}>{line.str}</span>
        </span>
      </div>
    )
  }

  if (line.type === 'prop') {
    const lines = (line.value ?? '').split('\n')
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-[13px]">
          <span style={{ color: '#82aaff' }}>{line.key}</span>
          <span className="text-ide-text-muted">: </span>
          <span style={{ color: '#c3e88d' }}>{lines[0]}</span>
          {lines.length > 1 && lines.slice(1).map((l, i) => (
            <span key={i} style={{ color: '#c3e88d' }}>{'\n'}{l}</span>
          ))}
          {line.comma && <span className="text-ide-text-muted">,</span>}
        </span>
      </div>
    )
  }

  if (line.type === 'key-open') {
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-[13px]">
          <span style={{ color: '#82aaff' }}>{line.key}</span>
          <span className="text-ide-text-muted">: [</span>
        </span>
      </div>
    )
  }

  if (line.type === 'string-item') {
    const lines = (line.value ?? '').split('\n')
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-[13px]">
          <span className="text-ide-text-muted">{'  '}</span>
          <span style={{ color: '#c3e88d' }}>{lines[0]}</span>
          {lines.length > 1 && lines.slice(1).map((l, i) => (
            <span key={i} style={{ color: '#c3e88d' }}>{'\n'}{l}</span>
          ))}
          {!line.last && line.comma !== false && <span className="text-ide-text-muted">,</span>}
        </span>
      </div>
    )
  }

  if (line.type === 'close-bracket' || line.type === 'closing') {
    return (
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>{numStr}</span>
        <span className="text-ide-text-muted text-[13px]">{line.text}</span>
      </div>
    )
  }

  return null
}

export function EditorPane() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = containerRef.current?.querySelector('.cursor-blink')
    if (cursor) {
      const interval = setInterval(() => {
        ;(cursor as HTMLElement).style.opacity =
          (cursor as HTMLElement).style.opacity === '0' ? '1' : '0'
      }, 530)
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex-1 overflow-auto font-mono px-0 py-4 text-[13px] leading-[22px]">
      {CODE_LINES.map((line, i) => (
        <CodeLine key={i} lineNum={i + 1} line={line} />
      ))}
      {/* Cursor */}
      <div className="flex min-h-[22px]">
        <span className={NUM_CLASS}>&nbsp;</span>
        <span
          className="cursor-blink inline-block w-0.5 h-4 bg-ide-text-secondary align-text-bottom"
          style={{ opacity: 1 }}
        />
      </div>
    </div>
  )
}
