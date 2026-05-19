import type { ReactNode } from 'react'
import type { CubicBezier } from './easing'

export interface AnimationController {
  isPlaying: boolean
  progress: number
  playPause: () => void
  restart: () => void
  step: (frames: number) => void
  seek: (progress: number) => void
}

export interface ControlSectionDefinition {
  id: string
  label: string
  render: () => ReactNode
}

export interface TransformPropertyConfig {
  enabled?: boolean
  duration: number
  delay: number
  ease: CubicBezier
}

export interface TransformConfig {
  xFrom: number
  yFrom: number
  scaleFrom: number
  opacityFrom?: number
  x: TransformPropertyConfig
  y: TransformPropertyConfig
  scale: TransformPropertyConfig
  opacity?: TransformPropertyConfig
}
