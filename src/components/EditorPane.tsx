import { useEffect, useRef, useState } from 'react'
import { createHighlighter } from 'shiki'
import type { HighlighterCore } from 'shiki'
import { useFileSystem } from './editor-shell/file-system-context'

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: ['tsx', 'css', 'typescript'],
    })
  }
  return highlighterPromise
}

function HighlightedCode({ source, lang }: { source: string; lang: string }) {
  const [html, setHtml] = useState<string>('')
  const [lineCount, setLineCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const hl = await getHighlighter()
      if (cancelled) return

      // Ensure language is loaded
      if (!hl.getLoadedLanguages().includes(lang)) {
        await hl.loadLanguage(lang as any)
      }
      if (cancelled) return

      const result = hl.codeToHtml(source, {
        lang,
        theme: 'github-dark',
        transformers: [
          {
            line(node, line) {
              node.properties['data-line'] = line
            },
          },
        ],
      })
      if (!cancelled) {
        setHtml(result)
        setLineCount(source.split('\n').length)
      }
    })()
    return () => { cancelled = true }
  }, [source, lang])

  if (!html) {
    return (
      <div className="flex items-center justify-center h-32 text-ide-text-dim text-sm">
        Highlighting...
      </div>
    )
  }

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

      {/* Highlighted code */}
      <div
        className="flex-1 min-w-0 font-mono text-[13px] leading-[22px]"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export function EditorPane() {
  const { activeFile, sources, loading, error } = useFileSystem()
  const containerRef = useRef<HTMLDivElement>(null)

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
            <HighlightedCode source={sources[activeFile.id]} lang={activeFile.language} />
          </div>
        )}
      </div>
    </div>
  )
}
