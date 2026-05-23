import { useEffect, useMemo, useRef, useState } from 'react'
import { createHighlighter } from 'shiki'
import type { HighlighterCore } from 'shiki'
import { useFileSystem } from './editor-shell/file-system-context'

// Eagerly initialize on module load
const highlighterPromise: Promise<HighlighterCore> = createHighlighter({
  themes: ['github-dark'],
  langs: ['tsx', 'css', 'typescript'],
})

async function highlight(source: string, lang: string): Promise<string> {
  const hl = await highlighterPromise
  if (!hl.getLoadedLanguages().includes(lang)) {
    await hl.loadLanguage(lang as any)
  }
  return hl.codeToHtml(source, {
    lang,
    theme: 'github-dark',
  })
}

function countLinesFromHtml(html: string): number {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const lineEls = doc.querySelectorAll('.line')
  console.log('[EditorPane] DOMParser .line count:', lineEls.length)
  return lineEls.length
}

function CodeView({ source, lang }: { source: string; lang: string }) {
  const [html, setHtml] = useState<string>('')
  const rawLineCount = useMemo(() => {
    const count = source.split('\n').length
    console.log('[EditorPane] raw source line count:', count)
    console.log('[EditorPane] source length (chars):', source.length)
    console.log('[EditorPane] source preview (first 200):', source.slice(0, 200))
    console.log('[EditorPane] source preview (last 200):', source.slice(-200))
    return count
  }, [source])
  const [highlightedLineCount, setHighlightedLineCount] = useState(rawLineCount)

  useEffect(() => {
    let cancelled = false
    console.log('[EditorPane] starting highlight for lang:', lang)
    highlight(source, lang).then((h) => {
      if (cancelled) return
      console.log('[EditorPane] highlighted HTML length:', h.length)
      console.log('[EditorPane] highlighted preview (first 300):', h.slice(0, 300))
      console.log('[EditorPane] highlighted preview (last 300):', h.slice(-300))
      const domCount = countLinesFromHtml(h)
      setHtml(h)
      setHighlightedLineCount(domCount)
    })
    return () => { cancelled = true }
  }, [source, lang])

  const lineCount = Math.max(rawLineCount, highlightedLineCount)
  console.log('[EditorPane] final lineCount:', lineCount, '(raw:', rawLineCount, 'highlighted:', highlightedLineCount, ')')

  return (
    <div className="flex overflow-x-auto">
      {/* Sticky line numbers */}
      <div
        className="sticky left-0 z-10 shrink-0 select-none text-right pr-4 font-mono text-[13px] leading-[22px] bg-ide-bg-deep"
        style={{ minWidth: '48px' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="min-h-[22px] text-ide-text-dim/40 hover:text-ide-text-dim/70 transition-colors">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Highlighted code or raw fallback */}
      {html ? (
        <div
          className="flex-1 min-w-0 font-mono text-[13px] leading-[22px]"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="flex-1 min-w-0 font-mono text-[13px] leading-[22px] m-0 p-0 text-ide-text-primary/70 whitespace-pre">
          {source}
        </pre>
      )}
    </div>
  )
}

export function EditorPane() {
  const { activeFile, sources, loading, error } = useFileSystem()
  const containerRef = useRef<HTMLDivElement>(null)

  console.log('[EditorPane] render — activeFile:', activeFile.name, 'loading:', loading, 'hasSource:', !!sources[activeFile.id])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [activeFile.id])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* File path breadcrumb */}
      <div className="flex items-center px-4 py-1.5 text-[11px] font-host-grotek text-ide-text-dim/60 shrink-0 border-b border-ide-border-subtle/5">
        {activeFile.path}
      </div>

      {/* Code view */}
      <div ref={containerRef} className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-32 text-ide-text-dim text-sm">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-32 text-red-400/80 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && sources[activeFile.id] && (
          <div className="py-2">
            <CodeView source={sources[activeFile.id]} lang={activeFile.language} />
          </div>
        )}
      </div>
    </div>
  )
}
