import type { SavedPreset, ContainerConfig, LegacyContainerConfig } from './types'
import { DEFAULT_CONTAINER } from './easing'

const STORAGE_KEY = 'word-reveal-presets'

export function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as SavedPreset[] : []
  } catch {
    return []
  }
}

export function savePreset(preset: SavedPreset): SavedPreset[] {
  const presets = loadPresets()
  presets.push(preset)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}

export function deletePreset(index: number): SavedPreset[] {
  const presets = loadPresets()
  presets.splice(index, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}

/** Migrate old container configs (single duration/ease) to per-property structure. */
export function migrateContainerConfig(raw: Partial<ContainerConfig> | undefined): ContainerConfig {
  const base = DEFAULT_CONTAINER
  if (!raw) return base

  const isOldFormat = 'duration' in raw && !('x' in raw)
  if (isOldFormat) {
    const old = raw as LegacyContainerConfig
    const oldEase = old.ease ?? base.x.ease
    const oldDuration = old.duration ?? base.x.duration
    return {
      xFrom: raw.xFrom ?? base.xFrom,
      yFrom: old.yFrom ?? base.yFrom,
      scaleFrom: raw.scaleFrom ?? base.scaleFrom,
      opacityFrom: raw.opacityFrom ?? base.opacityFrom,
      x: { duration: oldDuration, delay: 0, ease: oldEase },
      y: { duration: oldDuration, delay: 0, ease: oldEase },
      scale: { duration: oldDuration * 1.2, delay: 0, ease: oldEase },
      opacity: base.opacity,
    }
  }

  return {
    xFrom: raw.xFrom ?? base.xFrom,
    yFrom: raw.yFrom ?? base.yFrom,
    scaleFrom: raw.scaleFrom ?? base.scaleFrom,
    opacityFrom: raw.opacityFrom ?? base.opacityFrom,
    x: raw.x ?? base.x,
    y: raw.y ?? base.y,
    scale: raw.scale ?? base.scale,
    opacity: raw.opacity ?? base.opacity,
  }
}
