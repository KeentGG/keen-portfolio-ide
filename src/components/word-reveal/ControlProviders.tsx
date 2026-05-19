import type { ReactNode } from 'react'
import {
  PresetContext,
  PropertyContext,
  TimingContext,
  type PresetControls,
  type PropertyControls,
  type TimingControls,
} from './control-context'

interface WordRevealControlProvidersProps {
  timing: TimingControls
  properties: PropertyControls
  presets: PresetControls
  children: ReactNode
}

export function WordRevealControlProviders({
  timing,
  properties,
  presets,
  children,
}: WordRevealControlProvidersProps) {
  return (
    <TimingContext.Provider value={timing}>
      <PropertyContext.Provider value={properties}>
        <PresetContext.Provider value={presets}>{children}</PresetContext.Provider>
      </PropertyContext.Provider>
    </TimingContext.Provider>
  )
}
