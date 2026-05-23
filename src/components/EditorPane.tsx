import { useEffect, useRef, useState } from 'react'
import { createHighlighter } from 'shiki'
import type { HighlighterCore } from 'shiki'
import { useFileSystem } from './editor-shell/file-system-context'

// Eagerly initialize on module load (not on first file open)
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
    transformers: [
      {
        line(node, line) {
          node.properties['data-line'] = line
        },
      },
    ],
  })
}

function LineNumbers({ count }: { count: number }) {
  return (
    <div
      className="sticky left-0 z-10 shrink-0 select-none text-right pr-4 font-mono text-[13px] leading-[22px] bg-ide-bg-deep"
      style={{ minWidth: '48px' }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="min-h-[22px] text-ide-text-dim/40 hover:text-ide-text-dim/70 transition-colors">
          {i + 1}
        </div>
      ))}
    </div>
  )
}

function CodeView({ source, lang }: { source: string; lang: string }) {
  const [html, setHtml] = useState<string>('')
  const lineCount = source.split('\n').length

  // Show raw code immediately, highlight in background
  useEffect(() => {
    let cancelled = false
    highlight(source, lang).then((h) => {
      if (!cancelled) setHtml(h)
    })
    return () => { cancelled = true }
  }, [source, lang])

  return (
    <div className="flex overflow-x-auto">
      <LineNumbers count={lineCount} />
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
