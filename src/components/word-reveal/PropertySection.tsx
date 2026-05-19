import { useState, useId } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import type { PropertyConfig } from './types'
import { usePropertyControls } from './control-context'
import { findPresetName } from '../animation-controls/easing'
import { EasingPreview } from '../animation-controls/EasingPreview'
import { EasingSelect } from '../animation-controls/EasingSelect'

interface PropertyRowProps {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
  ariaLabel?: string
}

function PropertySlider({ label, value, min, max, unit = '', onChange, ariaLabel }: PropertyRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-[10px] text-text-secondary/65">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel ?? label}
        className="min-h-[28px] flex-1 cursor-pointer appearance-none rounded-full bg-text-secondary/20 accent-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary"
      />
      <span className="tabular-nums w-12 text-right text-[11px]">
        {unit === '%' ? `${value.toFixed(0)}%` : `${value.toFixed(2)}${unit}`}
      </span>
    </div>
  )
}

interface PropertyRowPropsInternal {
  label: string
  color: string
  config: PropertyConfig
  onChange: (config: PropertyConfig) => void
}

function PropertyRow({
  label,
  color,
  config,
  onChange,
}: PropertyRowPropsInternal) {
  const [expanded, setExpanded] = useState(false)
  const regionId = useId()
  const presetName = findPresetName(config.ease)
  const bgClass = color.replace('text-', 'bg-')

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={regionId}
        className="flex items-center gap-2 hover:text-text-primary transition-colors text-left min-h-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 rounded"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${bgClass}`} />
        <span className={`${color} w-14 font-semibold`}>{label}</span>
        <span className="text-text-secondary/60 truncate text-[10px]">
          {presetName ?? 'custom'} easing · {(config.durationRatio * 100).toFixed(0)}% duration · +{(config.delayRatio * 100).toFixed(0)}% delay
        </span>
        <CaretRightIcon className={`w-2 h-2 ml-auto transition-transform ${expanded ? 'rotate-90' : ''}`} weight="fill" aria-hidden="true" />
      </button>

      {expanded && (
        <div id={regionId} role="group" aria-label={`${label} animation properties`} className="flex flex-col gap-2 pl-4 border-l border-text-secondary/10 ml-[3px]">
          <PropertySlider
            label="duration"
            value={config.durationRatio * 100}
            min={10}
            max={150}
            unit="%"
            onChange={(v) => onChange({ ...config, durationRatio: v / 100 })}
          />
          <PropertySlider
            label="delay"
            value={config.delayRatio * 100}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => onChange({ ...config, delayRatio: v / 100 })}
          />
          <EasingSelect ease={config.ease} color={color} onChange={(ease) => onChange({ ...config, ease })} />
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">curve</span>
            <EasingPreview ease={config.ease} color={color} />
            <span className="text-[10px] text-text-secondary/40 tabular-nums">[{config.ease.map((v) => v.toFixed(2)).join(', ')}]</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function PropertySection() {
  const { blur, setBlur, opacity, setOpacity, y, setY } = usePropertyControls()

  return (
    <div role="group" aria-label="Word animation properties" className="flex flex-col gap-2">
      <PropertyRow label="blur" color="text-text-primary" config={blur} onChange={setBlur} />
      <PropertyRow label="opacity" color="text-text-primary" config={opacity} onChange={setOpacity} />
      <PropertyRow label="y" color="text-text-primary" config={y} onChange={setY} />
    </div>
  )
}
