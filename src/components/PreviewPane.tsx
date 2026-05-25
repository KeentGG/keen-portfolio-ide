import { useState } from 'react'
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise'
import { useFileSystem } from './editor-shell/file-system-context'

export function PreviewPane() {
  const { activeFile } = useFileSystem()
  const [replayKey, setReplayKey] = useState(0)
  const PreviewComponent = activeFile.preview

  if (!PreviewComponent) {
    return (
      <div className="flex-1 flex items-center justify-center font-sora">
        <p className="text-ide-text-dim text-sm">
          No preview available for <span className="text-ide-text-secondary">{activeFile.name}</span>.
          {' '}Switch to Editor mode to view the source.
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center">
      {/* Replay button */}
      <button
        type="button"
        onClick={() => setReplayKey((k) => k + 1)}
        className="absolute right-3 flex h-9 items-center gap-2 rounded-md border border-ide-border-separator/30 px-3 text-xs font-light text-ide-text-secondary/60 bg-transparent cursor-pointer transition-colors hover:border-ide-border-separator/50 hover:text-ide-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ top: '48px' }}
        aria-label="Replay animations"
      >
        <ArrowClockwiseIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />
        Replay
      </button>

      <PreviewComponent replayKey={replayKey} />
    </div>
  )
}
