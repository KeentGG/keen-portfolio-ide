import type { CubicBezier } from '../animation-controls/easing'
import type { TransformConfig, TransformPropertyConfig } from '../animation-controls/types'

export interface WordRevealProps {
  text: string
  className?: string
  staggerDelay?: number
  wordDuration?: number
  blurAmount?: number
  yDistance?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'section'
  blurConfig?: PropertyConfig
  opacityConfig?: PropertyConfig
  yConfig?: PropertyConfig
  containerConfig?: ContainerConfig
}

// ── Config types ───────────────────────────────────────────────────
export type { CubicBezier }

export interface PropertyConfig {
  durationRatio: number
  delayRatio: number
  ease: CubicBezier
}

export type ContainerPropertyConfig = TransformPropertyConfig

export type ContainerConfig = TransformConfig

// ── Preset types ───────────────────────────────────────────────────
export interface SavedPreset {
  name: string
  startDelay: number
  staggerDelay: number
  blur: PropertyConfig
  opacity: PropertyConfig
  y: PropertyConfig
  container: ContainerConfig
  createdAt: number
}

/** Legacy container config format (pre-per-property split). */
export interface LegacyContainerConfig {
  duration?: number
  ease?: CubicBezier
  yFrom?: number
  xFrom?: number
  scaleFrom?: number
  opacityFrom?: number
}
