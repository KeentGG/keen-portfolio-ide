import { createContext, useContext } from 'react'
import type { PropertyConfig, SavedPreset } from './types'

export interface TimingControls {
  startDelay: number
  setStartDelay: (delay: number) => void
  stagger: number
  setStagger: (stagger: number) => void
}

export interface PropertyControls {
  blur: PropertyConfig
  setBlur: (config: PropertyConfig) => void
  opacity: PropertyConfig
  setOpacity: (config: PropertyConfig) => void
  y: PropertyConfig
  setY: (config: PropertyConfig) => void
}

export interface PresetControls {
  presets: SavedPreset[]
  save: (name: string) => void
  load: (preset: SavedPreset) => void
  deletePreset: (index: number) => void
}

export const TimingContext = createContext<TimingControls | null>(null)
export const PropertyContext = createContext<PropertyControls | null>(null)
export const PresetContext = createContext<PresetControls | null>(null)

function useRequiredContext<T>(context: T | null, name: string): T {
  if (!context) throw new Error(`${name} must be used inside WordRevealControlProviders`)
  return context
}

export function useTimingControls() {
  return useRequiredContext(useContext(TimingContext), 'useTimingControls')
}

export function usePropertyControls() {
  return useRequiredContext(useContext(PropertyContext), 'usePropertyControls')
}

export function usePresetControls() {
  return useRequiredContext(useContext(PresetContext), 'usePresetControls')
}
