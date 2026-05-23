import { useCallback, useEffect, useRef, useState } from 'react'
import { PROJECT_FILES, DEFAULT_FILE_ID, fetchFileSource } from './editor-shell/file-system'
import type { ProjectFile } from './editor-shell/file-system'

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
  const [activeFile, setActiveFile] = useState<ProjectFile>(
    PROJECT_FILES.find((f) => f.id === DEFAULT_FILE_ID) ?? PROJECT_FILES[0],
  )
  const [sources, setSources] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadFile = useCallback(async (file: ProjectFile) => {
    // Cache hit
    if (sources[file.id]) {
      setActiveFile(file)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const source = await fetchFileSource(file)
      setSources((prev) => ({ ...prev, [file.id]: source }))
      setActiveFile(file)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load file')
    } finally {
      setLoading(false)
    }
  }, [sources])

  // Load default file on mount
  useEffect(() => {
    loadFile(PROJECT_FILES.find((f) => f.id === DEFAULT_FILE_ID) ?? PROJECT_FILES[0])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top when file changes
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [activeFile.id])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* File tabs */}
      <div className="flex items-center shrink-0 overflow-x-auto border-b border-ide-border-subtle/5">
        {PROJECT_FILES.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => loadFile(file)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-host-grotek whitespace-nowrap cursor-pointer border-none transition-colors ${
              activeFile.id === file.id
                ? 'bg-ide-bg-active-tab text-ide-text-muted border-b-2 border-ide-text-secondary/30'
                : 'bg-transparent text-ide-text-dim hover:text-ide-text-muted'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* File path breadcrumb */}
      <div className="flex items-center px-4 py-1.5 text-[11px] font-host-grotek text-ide-text-dim/60 shrink-0">
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
