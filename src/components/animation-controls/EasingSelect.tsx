import type { CubicBezier } from './easing'
import { EASE_PRESETS, findPresetName } from './easing'

interface EasingSelectProps {
  ease: CubicBezier
  color?: string
  onChange: (ease: CubicBezier) => void
}

export function EasingSelect({ ease, color = 'text-text-secondary', onChange }: EasingSelectProps) {
  const activePreset = findPresetName(ease)

  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="radiogroup" aria-label="Easing preset">
      <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">easing</span>
      {Object.entries(EASE_PRESETS).map(([name, preset]) => (
        <button
          key={name}
          type="button"
          role="radio"
          aria-checked={activePreset === name}
          onClick={() => onChange(preset)}
          className={`min-h-[28px] rounded px-2 py-1 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary/40 ${
            activePreset === name
              ? `${color} bg-text-primary/20 text-text-primary`
              : 'hover:bg-text-secondary/10 text-text-secondary/60'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
