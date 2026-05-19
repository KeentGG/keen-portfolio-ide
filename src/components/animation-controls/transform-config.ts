import type { TransformConfig, TransformPropertyConfig } from './types'

export function isTransformPropertyEnabled(config: TransformPropertyConfig) {
  return config.enabled !== false
}

export function getTransformDuration(config: TransformConfig) {
  const durations = [config.x, config.y, config.scale, config.opacity]
    .filter((property): property is TransformPropertyConfig => Boolean(property))
    .filter(isTransformPropertyEnabled)
    .map((property) => property.duration + property.delay)

  return Math.max(0.001, ...durations)
}

export function getInitialTransform(config: TransformConfig) {
  const x = isTransformPropertyEnabled(config.x) ? config.xFrom : 0
  const y = isTransformPropertyEnabled(config.y) ? config.yFrom : 0
  const scale = isTransformPropertyEnabled(config.scale) ? config.scaleFrom : 1

  return `translateX(${x}px) translateY(${y}px) scale(${scale})`
}

export function getInitialOpacity(config: TransformConfig) {
  if (!config.opacity || !isTransformPropertyEnabled(config.opacity)) return 1

  return config.opacityFrom ?? 0
}
