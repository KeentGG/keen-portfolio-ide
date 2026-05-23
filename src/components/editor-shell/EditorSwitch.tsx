interface EditorSwitchProps {
  mode: 'editor' | 'preview'
  onModeChange: (mode: 'editor' | 'preview') => void
}

export function EditorSwitch({ mode, onModeChange }: EditorSwitchProps) {
  return (
    <div className="flex items-center gap-ide-pill p-ide-pill bg-ide-bg-shell border border-ide-bg-surface rounded-ide-pill font-host-grotek">
      {(['editor', 'preview'] as const).map((m) => {
        const isActive = m === mode
        return (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`text-xs font-light transition-colors cursor-pointer border-none ${
              isActive
                ? 'bg-ide-bg-active-tab rounded-ide-tab text-ide-text-secondary'
                : 'bg-transparent rounded-ide-sm text-ide-text-secondary/80'
            } px-ide-tab-x py-ide-tab-y`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        )
      })}
    </div>
  )
}
