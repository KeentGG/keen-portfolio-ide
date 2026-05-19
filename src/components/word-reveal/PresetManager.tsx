import { useState, useId } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import type { SavedPreset } from './types'
import { usePresetControls } from './control-context'

export function PresetManager() {
  const [name, setName] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)
  const listId = useId()
  const { presets, save, load, deletePreset } = usePresetControls()

  const handleSave = () => {
    if (!name.trim()) return
    save(name.trim())
    setName('')
    setPendingDelete(null)
  }

  const handleDelete = (index: number) => {
    if (pendingDelete !== index) {
      setPendingDelete(index)
      return
    }
    deletePreset(index)
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Presets">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="my preset"
          aria-label="Preset name"
          className="min-h-[32px] flex-1 rounded border border-text-secondary/15 bg-text-secondary/5 px-2 py-1 text-[11px] text-text-primary outline-none transition-colors placeholder:text-text-secondary/30 focus:border-text-secondary/30 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary/30"
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="min-h-[32px] min-w-[72px] rounded bg-text-primary/10 px-3 py-1 text-[11px] text-text-primary transition-colors hover:bg-text-primary/20 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
        >
          save preset
        </button>
        {presets.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={listId}
            aria-label="Toggle saved presets"
            className="flex min-h-[32px] items-center gap-1 rounded px-2 py-1 text-[11px] transition-colors hover:bg-text-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
          >
            presets
            <span className="text-text-secondary/40">({presets.length})</span>
            <CaretRightIcon className={`w-2 h-2 transition-transform ${expanded ? 'rotate-90' : ''}`} weight="fill" aria-hidden="true" />
          </button>
        )}
      </div>
      {expanded && presets.length > 0 && (
        <div id={listId} role="list" aria-label="Saved presets" className="flex flex-col gap-1 pl-2 border-l border-text-secondary/10 ml-1 max-h-40 overflow-y-auto">
          {presets.map((preset, i) => (
            <PresetItem
              key={`${preset.name}-${preset.createdAt}`}
              preset={preset}
              confirmDelete={pendingDelete === i}
              onLoad={() => {
                load(preset)
                setPendingDelete(null)
              }}
              onDelete={() => handleDelete(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface PresetItemProps {
  preset: SavedPreset
  confirmDelete: boolean
  onLoad: () => void
  onDelete: () => void
}

function PresetItem({ preset, confirmDelete, onLoad, onDelete }: PresetItemProps) {
  return (
    <div role="listitem" className="flex items-center gap-2 group">
      <button
        onClick={onLoad}
        className="flex-1 text-left text-[11px] text-text-secondary/70 hover:text-text-primary transition-colors truncate min-h-[28px] px-1 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary/40"
      >
        {preset.name}
      </button>
      <span className="text-[9px] text-text-secondary/30 shrink-0">{new Date(preset.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      <button
        onClick={onDelete}
        aria-label={confirmDelete ? `Confirm delete preset ${preset.name}` : `Delete preset ${preset.name}`}
        className={`flex h-7 min-w-7 items-center justify-center rounded px-1 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 ${
          confirmDelete
            ? 'text-red-300 bg-red-400/10'
            : 'text-text-secondary/45 hover:text-red-300 hover:bg-red-400/10'
        }`}
      >
        {confirmDelete ? 'confirm' : <XIcon className="h-3 w-3" weight="bold" aria-hidden="true" />}
      </button>
    </div>
  )
}
