import { useEffect, useRef } from 'react'
import { useFileSystem } from './editor-shell/file-system-context'

const NUM_CLASS = 'select-none text-right pr-4 shrink-0 w-12 text-ide-text-dim/40 text-[13px] font-host-grotek'

function SourceView({ source }: { source: string }) {
  const lines = source.split('\n')

  return (
    <div className="flex flex-col font-mono text-[13px] leading-[22px]">
      {lines.map((line, i) => (
        <div key={i} className="flex min-h-[22px] group">
          <span className={`${NUM_CLASS} group-hover:text-ide-text-dim/70 transition-colors`}>
            {String(i + 1).padStart(2, ' ')}
          </span>
          <pre className="m-0 p-0 whitespace-pre text-ide-text-primary/90">{line || '\u00A0'}</pre>
        </div>
      ))}
    </div>
  )
}

export function EditorPane() {
  const { activeFile, sources, loading, error } = useFileSystem()
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to top when file changes
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
      <div ref={containerRef} className="flex-1 overflow-auto px-0 py-2">
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
          <SourceView source={sources[activeFile.id]} />
        )}
      </div>
    </div>
  )
}
