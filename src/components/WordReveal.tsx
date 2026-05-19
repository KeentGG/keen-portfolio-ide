import { motion } from 'motion/react'
import type { WordRevealProps, PropertyConfig, ContainerConfig } from './word-reveal/types'
import { DEFAULT_BLUR, DEFAULT_OPACITY, DEFAULT_START_DELAY, DEFAULT_STAGGER_DELAY, DEFAULT_Y } from './word-reveal/easing'
import { migrateContainerConfig } from './word-reveal/presets'
import { isTransformPropertyEnabled } from './animation-controls/transform-config'

export type { WordRevealProps, PropertyConfig, ContainerConfig }

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
  section: motion.section,
}

function getContainerTransition(config: ContainerConfig) {
  return {
    x: {
      duration: config.x.duration,
      delay: config.x.delay,
      ease: config.x.ease,
    },
    y: {
      duration: config.y.duration,
      delay: config.y.delay,
      ease: config.y.ease,
    },
    scale: {
      duration: config.scale.duration,
      delay: config.scale.delay,
      ease: config.scale.ease,
    },
    opacity: config.opacity
      ? {
          duration: config.opacity.duration,
          delay: config.opacity.delay,
          ease: config.opacity.ease,
        }
      : undefined,
  }
}

function getWordTransition(
  baseDelay: number,
  wordDuration: number,
  blurConfig: PropertyConfig,
  opacityConfig: PropertyConfig,
  yConfig: PropertyConfig,
) {
  return {
    filter: {
      duration: wordDuration * blurConfig.durationRatio,
      delay: DEFAULT_START_DELAY + baseDelay + wordDuration * blurConfig.delayRatio,
      ease: blurConfig.ease,
    },
    opacity: {
      duration: wordDuration * opacityConfig.durationRatio,
      delay: DEFAULT_START_DELAY + baseDelay + wordDuration * opacityConfig.delayRatio,
      ease: opacityConfig.ease,
    },
    y: {
      duration: wordDuration * yConfig.durationRatio,
      delay: DEFAULT_START_DELAY + baseDelay + wordDuration * yConfig.delayRatio,
      ease: yConfig.ease,
    },
  }
}


export function WordReveal({
  text,
  className = '',
  staggerDelay = DEFAULT_STAGGER_DELAY,
  wordDuration = 0.8,
  blurAmount = 24,
  yDistance = 28,
  as: Tag = 'span',
  blurConfig = DEFAULT_BLUR,
  opacityConfig = DEFAULT_OPACITY,
  yConfig = DEFAULT_Y,
  containerConfig: containerConfigProp,
}: WordRevealProps) {
  const words = text.split(' ')
  const MotionTag = motionTags[Tag]
  const containerConfig = migrateContainerConfig(containerConfigProp)

  return (
    <MotionTag
      className={className}
      initial={{
        x: isTransformPropertyEnabled(containerConfig.x) ? containerConfig.xFrom : 0,
        y: isTransformPropertyEnabled(containerConfig.y) ? containerConfig.yFrom : 0,
        scale: isTransformPropertyEnabled(containerConfig.scale) ? containerConfig.scaleFrom : 1,
        opacity: containerConfig.opacity && isTransformPropertyEnabled(containerConfig.opacity)
          ? containerConfig.opacityFrom ?? 0
          : 1,
      }}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      transition={getContainerTransition(containerConfig)}
    >
      {/*
        Animation controls are intentionally disconnected here. The tuning UI remains
        in src/components/word-reveal/* so this component can be temporarily rewired
        for future timing/easing adjustments without changing the locked defaults.
        See src/components/word-reveal/CONTROLS.md for the reconnect checklist.
      */}
      {words.map((word, i) => {
        const baseDelay = i * staggerDelay

        return (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block origin-left"
            initial={{
              opacity: 0,
              filter: `blur(${blurAmount}px)`,
              y: yDistance,
            }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
            }}
            transition={getWordTransition(baseDelay, wordDuration, blurConfig, opacityConfig, yConfig)}
            style={{ willChange: 'transform, filter, opacity' }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        )
      })}
    </MotionTag>
  )
}
