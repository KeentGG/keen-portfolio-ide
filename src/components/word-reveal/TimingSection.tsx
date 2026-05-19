import { useId } from 'react'
import { useTimingControls } from './control-context'

interface TimingSliderProps {
  label: string
  valueMs: number
  minMs: number
  maxMs: number
  onChange: (seconds: number) => void
  format?: 'ms' | 's'
}

function TimingSlider({ label, valueMs, minMs, maxMs, onChange, format = 'ms' }: TimingSliderProps) {
  const display = format === 'ms' ? `${valueMs.toFixed(0)}ms` : `${(valueMs / 1000).toFixed(2)}s`

  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 font-medium text-text-secondary/75">{label}</span>
      <input
        type="range"
        min={minMs}
        max={maxMs}
        value={Math.round(valueMs)}
        onChange={(e) => onChange(Number(e.target.value) / 1000)}
        aria-label={`${label} timing`}
        className="min-h-[28px] flex-1 cursor-pointer appearance-none rounded-full bg-text-secondary/20 accent-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary"
      />
      <span className="w-12 text-right text-[11px] tabular-nums text-text-primary/80">{display}</span>
    </div>
  )
}

export function TimingSection() {
  const groupId = useId()
  const { startDelay, setStartDelay, stagger, setStagger } = useTimingControls()

  return (
    <div role="group" aria-labelledby={groupId} className="flex flex-col gap-2">
      <span id={groupId} className="sr-only">Timing controls</span>
      <TimingSlider
        label="start delay"
        valueMs={startDelay * 1000}
        minMs={0}
        maxMs={500}
        onChange={setStartDelay}
      />
      <TimingSlider
        label="word stagger"
        valueMs={stagger * 1000}
        minMs={20}
        maxMs={300}
        onChange={setStagger}
      />
    </div>
  )
}
