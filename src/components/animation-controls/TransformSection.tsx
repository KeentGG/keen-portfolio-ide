import { useId, useState, type ReactNode } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import type { TransformConfig, TransformPropertyConfig } from './types'
import { EasingPreview } from './EasingPreview'
import { EasingSelect } from './EasingSelect'
import { isTransformPropertyEnabled } from './transform-config'

const sliderClassName = 'min-h-[28px] flex-1 cursor-ew-resize appearance-none bg-transparent accent-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 disabled:cursor-not-allowed disabled:opacity-35 [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-none [&::-webkit-slider-runnable-track]:bg-text-secondary/20 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-[2px] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-text-primary/70 [&::-webkit-slider-thumb]:bg-bg [&::-webkit-slider-thumb]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.03)] [&::-moz-range-track]:h-0.5 [&::-moz-range-track]:rounded-none [&::-moz-range-track]:bg-text-secondary/20 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-[2px] [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-text-primary/70 [&::-moz-range-thumb]:bg-bg'

interface TransformSectionProps {
  label?: string
  config: TransformConfig
  onChange: (config: TransformConfig) => void
}

export function TransformSection({ label = 'transform', config, onChange }: TransformSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const regionId = useId()
  const summary = [
    `x:${config.xFrom}px`,
    `y:${config.yFrom}px`,
    `scale:${config.scaleFrom}`,
    config.opacity ? `opacity:${config.opacityFrom ?? 0}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={regionId}
        className="flex items-center gap-2 hover:text-text-primary transition-colors text-left min-h-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 rounded"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-text-primary" />
        <span className="w-16 font-semibold text-text-primary">{label}</span>
        <span className="text-text-secondary/60 truncate text-[10px]">
          {summary}
        </span>
        <CaretRightIcon className={`w-2 h-2 ml-auto transition-transform ${expanded ? 'rotate-90' : ''}`} weight="fill" aria-hidden="true" />
      </button>

      {expanded && (
        <div id={regionId} role="group" aria-label={`${label} transform controls`} className="flex flex-col gap-2 pl-4 border-l border-text-secondary/10 ml-[3px]">
          <TransformPropertyRow label="x" config={config.x} onChange={(x) => onChange({ ...config, x })}>
            <SliderRow label="from" value={config.xFrom} min={0} max={60} unit="px" onChange={(xFrom) => onChange({ ...config, xFrom })} />
          </TransformPropertyRow>

          <TransformPropertyRow label="y" config={config.y} onChange={(y) => onChange({ ...config, y })}>
            <SliderRow label="from" value={config.yFrom} min={0} max={40} unit="px" onChange={(yFrom) => onChange({ ...config, yFrom })} />
          </TransformPropertyRow>

          <TransformPropertyRow label="scale" config={config.scale} onChange={(scale) => onChange({ ...config, scale })}>
            <SliderRow label="from" value={config.scaleFrom} min={0.8} max={1} step={0.01} unit="" displayFn={(v) => v.toFixed(2)} onChange={(scaleFrom) => onChange({ ...config, scaleFrom })} />
          </TransformPropertyRow>

          {config.opacity && (
            <TransformPropertyRow label="opacity" config={config.opacity} onChange={(opacity) => onChange({ ...config, opacity })}>
              <SliderRow label="from" value={config.opacityFrom ?? 0} min={0} max={1} step={0.01} unit="" displayFn={(v) => v.toFixed(2)} onChange={(opacityFrom) => onChange({ ...config, opacityFrom })} />
            </TransformPropertyRow>
          )}
        </div>
      )}
    </div>
  )
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit: string
  displayFn?: (v: number) => string
  disabled?: boolean
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step, unit, displayFn, disabled = false, onChange }: SliderRowProps) {
  const display = displayFn ? displayFn(value) : `${value}${unit}`
  const sliderValue = unit === '' && !displayFn ? Math.round(value * 100) : value
  const handleChange = (raw: number) => onChange(unit === '' && !displayFn ? raw / 100 : raw)

  return (
    <div className={`flex items-center gap-2 ${disabled ? 'opacity-55' : ''}`}>
      <span className="w-16 text-[10px] text-text-secondary/60">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={label}
        className={sliderClassName}
      />
      <span className="tabular-nums w-8 text-right text-[10px]">{display}</span>
    </div>
  )
}

function TransformPropertyRow({
  label,
  config,
  onChange,
  children,
}: {
  label: string
  config: TransformPropertyConfig
  onChange: (c: TransformPropertyConfig) => void
  children: ReactNode
}) {
  const enabled = isTransformPropertyEnabled(config)

  return (
    <div className={`flex flex-col gap-1.5 pt-1 border-t border-text-secondary/5 transition-opacity ${enabled ? '' : 'opacity-55'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-text-secondary/75">{label}</span>
        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => onChange({ ...config, enabled: !enabled })}
          className={`group flex h-5 items-center gap-1.5 rounded-sm border px-1.5 text-[9px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 ${enabled ? 'border-text-primary/35 text-text-primary' : 'border-text-secondary/15 text-text-secondary/45'}`}
        >
          <span className={`h-2.5 w-1 rounded-[1px] border transition-colors ${enabled ? 'border-text-primary bg-text-primary' : 'border-text-secondary/30 bg-transparent'}`} />
          {enabled ? 'on' : 'off'}
        </button>
      </div>

      {enabled && (
        <>
          {children}

          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">duration</span>
            <input
              type="range"
              min={10}
              max={150}
              value={Math.round(config.duration * 100)}
              onChange={(e) => onChange({ ...config, duration: Number(e.target.value) / 100 })}
              aria-label={`${label} duration`}
              className={sliderClassName}
            />
            <span className="tabular-nums w-8 text-right text-[10px]">{config.duration.toFixed(2)}s</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">delay</span>
            <input
              type="range"
              min={0}
              max={500}
              value={Math.round(config.delay * 1000)}
              onChange={(e) => onChange({ ...config, delay: Number(e.target.value) / 1000 })}
              aria-label={`${label} delay`}
              className={sliderClassName}
            />
            <span className="tabular-nums w-8 text-right text-[10px]">{(config.delay * 1000).toFixed(0)}ms</span>
          </div>

          <EasingSelect ease={config.ease} color="text-text-primary" onChange={(ease) => onChange({ ...config, ease })} />

          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">curve</span>
            <EasingPreview ease={config.ease} color="text-text-primary" />
            <span className="text-[10px] text-text-secondary/40 tabular-nums">[{config.ease.map((v) => v.toFixed(2)).join(', ')}]</span>
          </div>
        </>
      )}
    </div>
  )
}
