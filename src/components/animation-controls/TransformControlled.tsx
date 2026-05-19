import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { animate, type AnimationPlaybackControlsWithThen } from 'motion/react'
import { AnimationControlProvider } from './AnimationControlProvider'
import { ControlsPanel } from './ControlsPanel'
import { TransformSection } from './TransformSection'
import { getInitialOpacity, getInitialTransform, getTransformDuration, isTransformPropertyEnabled } from './transform-config'
import type { AnimationController, ControlSectionDefinition, TransformConfig } from './types'

const FRAME_MS = 16.67

interface TransformControlledProps {
  children: ReactNode
  initialConfig: TransformConfig
  className?: string
  controlsTitle: string
  controlsDescription?: string
  controlsPlacement?: 'bottom-right' | 'bottom-left'
  sectionLabel?: string
  transformLabel?: string
}

export function TransformControlled({
  children,
  initialConfig,
  className,
  controlsTitle,
  controlsDescription,
  controlsPlacement = 'bottom-right',
  sectionLabel = 'Transform',
  transformLabel = 'transform',
}: TransformControlledProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const controller = useTransformPlayback(containerRef, initialConfig)

  const controlSections: ControlSectionDefinition[] = useMemo(() => [
    {
      id: 'transform',
      label: sectionLabel,
      render: () => (
        <TransformSection
          label={transformLabel}
          config={controller.config}
          onChange={controller.setConfig}
        />
      ),
    },
  ], [controller.config, controller.setConfig, sectionLabel, transformLabel])

  return (
    <>
      <div ref={containerRef} className={className ? `${className} will-change-transform` : 'will-change-transform'}>
        {children}
      </div>

      <AnimationControlProvider controller={controller.playbackControls}>
        <ControlsPanel
          title={controlsTitle}
          description={controlsDescription}
          sections={controlSections}
          placement={controlsPlacement}
        />
      </AnimationControlProvider>
    </>
  )
}

function useTransformPlayback(targetRef: React.RefObject<HTMLElement | null>, initialConfig: TransformConfig) {
  const animationsRef = useRef<AnimationPlaybackControlsWithThen[]>([])
  const isPlayingRef = useRef(true)
  const mountedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [config, setConfig] = useState<TransformConfig>(initialConfig)

  const totalDuration = getTransformDuration(config)

  const syncProgress = useCallback(() => {
    if (animationsRef.current.length === 0) return

    const currentTime = Math.max(...animationsRef.current.map((animation) => animation.time))
    setProgress(Math.min(currentTime / totalDuration, 1))
  }, [totalDuration])

  const runAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel())
    animationsRef.current = []

    const element = targetRef.current
    if (!element) return

    element.style.transform = getInitialTransform(config)
    element.style.opacity = `${getInitialOpacity(config)}`

    if (isTransformPropertyEnabled(config.x)) {
      animationsRef.current.push(animate(
        element,
        { x: [config.xFrom, 0] },
        { duration: config.x.duration, delay: config.x.delay, ease: config.x.ease },
      ))
    }

    if (isTransformPropertyEnabled(config.y)) {
      animationsRef.current.push(animate(
        element,
        { y: [config.yFrom, 0] },
        { duration: config.y.duration, delay: config.y.delay, ease: config.y.ease },
      ))
    }

    if (isTransformPropertyEnabled(config.scale)) {
      animationsRef.current.push(animate(
        element,
        { scale: [config.scaleFrom, 1] },
        { duration: config.scale.duration, delay: config.scale.delay, ease: config.scale.ease },
      ))
    }

    if (config.opacity && isTransformPropertyEnabled(config.opacity)) {
      animationsRef.current.push(animate(
        element,
        { opacity: [config.opacityFrom ?? 0, 1] },
        { duration: config.opacity.duration, delay: config.opacity.delay, ease: config.opacity.ease },
      ))
    }
  }, [config, targetRef])

  useEffect(() => {
    if (mountedRef.current) {
      setProgress(0)
      isPlayingRef.current = true
      setIsPlaying(true)
    } else {
      mountedRef.current = true
    }

    requestAnimationFrame(() => runAnimations())
    return () => animationsRef.current.forEach((animation) => animation.cancel())
  }, [runAnimations])

  useEffect(() => {
    let raf: number
    const tick = () => {
      if (isPlayingRef.current) syncProgress()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [syncProgress])

  const pauseAll = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const resumeAll = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.play())
    isPlayingRef.current = true
    setIsPlaying(true)
  }, [])

  const restartAll = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel())
    runAnimations()
    isPlayingRef.current = true
    setIsPlaying(true)
    setProgress(0)
  }, [runAnimations])

  const stepFrame = useCallback((frames = 1) => {
    animationsRef.current.forEach((animation) => animation.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
    const seconds = (frames * FRAME_MS) / 1000
    animationsRef.current.forEach((animation) => { animation.time = Math.max(0, animation.time + seconds) })
    syncProgress()
  }, [syncProgress])

  const seekTo = useCallback((nextProgress: number) => {
    animationsRef.current.forEach((animation) => animation.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
    const targetSecond = nextProgress * totalDuration
    animationsRef.current.forEach((animation) => { animation.time = targetSecond })
    setProgress(nextProgress)
  }, [totalDuration])

  const playbackControls: AnimationController = useMemo(() => ({
    isPlaying,
    progress,
    playPause: isPlaying ? pauseAll : resumeAll,
    restart: restartAll,
    step: stepFrame,
    seek: seekTo,
  }), [isPlaying, progress, pauseAll, resumeAll, restartAll, stepFrame, seekTo])

  return { config, setConfig, playbackControls }
}
