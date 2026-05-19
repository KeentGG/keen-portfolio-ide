export type CubicBezier = [number, number, number, number]

export const EASE_PRESETS: Record<string, CubicBezier> = {
  'smooth': [0.22, 0.68, 0.35, 1],
  'ease-out': [0.16, 1, 0.3, 1],
  'ease-in': [0.55, 0.085, 0.68, 0.53],
  'ease-in-out': [0.45, 0.05, 0.55, 0.95],
  'snap': [0.19, 1, 0.22, 1],
  'bounce-out': [0.34, 1.56, 0.64, 1],
  'linear': [0, 0, 1, 1],
}

export function findPresetName(ease: CubicBezier): string | null {
  for (const [name, preset] of Object.entries(EASE_PRESETS)) {
    if (preset[0] === ease[0] && preset[1] === ease[1] && preset[2] === ease[2] && preset[3] === ease[3]) {
      return name
    }
  }
  return null
}
