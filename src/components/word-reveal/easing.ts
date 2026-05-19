import type { PropertyConfig, ContainerConfig, SavedPreset } from './types'

export const DEFAULT_WORD_REVEAL_PRESET: SavedPreset = {
  name: 'natural-5-1',
  startDelay: 0,
  staggerDelay: 0.07,
  blur: {
    durationRatio: 1,
    delayRatio: 0.15,
    ease: [0.22, 0.68, 0.35, 1],
  },
  opacity: {
    durationRatio: 1.2,
    delayRatio: 0.05,
    ease: [0.55, 0.085, 0.68, 0.53],
  },
  y: {
    durationRatio: 0.95,
    delayRatio: 0.15,
    ease: [0.16, 1, 0.3, 1],
  },
  container: {
    xFrom: 20,
    yFrom: 20,
    scaleFrom: 0.97,
    x: {
      duration: 1.5,
      delay: 0.013,
      ease: [0.45, 0.05, 0.55, 0.95],
    },
    y: {
      duration: 0.84,
      delay: 0.167,
      ease: [0.16, 1, 0.3, 1],
    },
    scale: {
      duration: 1.05,
      delay: 0.13,
      ease: [0.45, 0.05, 0.55, 0.95],
    },
  },
  createdAt: 1779087008665,
}

export const DEFAULT_START_DELAY = DEFAULT_WORD_REVEAL_PRESET.startDelay
export const DEFAULT_STAGGER_DELAY = DEFAULT_WORD_REVEAL_PRESET.staggerDelay

export const DEFAULT_BLUR: PropertyConfig = {
  ...DEFAULT_WORD_REVEAL_PRESET.blur,
}

export const DEFAULT_OPACITY: PropertyConfig = {
  ...DEFAULT_WORD_REVEAL_PRESET.opacity,
}

export const DEFAULT_Y: PropertyConfig = {
  ...DEFAULT_WORD_REVEAL_PRESET.y,
}

export const DEFAULT_CONTAINER: ContainerConfig = {
  ...DEFAULT_WORD_REVEAL_PRESET.container,
}

export const FRAME_MS = 16.67
