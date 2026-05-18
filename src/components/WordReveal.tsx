import { useRef, useCallback, useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { animate, type AnimationPlaybackControlsWithThen } from 'motion/react'

// ── Types ─────────────────────────────────────────────────────────
export interface WordRevealControls {
  play: () => void
  pause: () => void
  restart: () => void
  step: (frames?: number) => void
  seek: (progress: number) => void
  getProgress: () => number
}

export interface PropertyConfig {
  durationRatio: number
  delayRatio: number
  ease: [number, number, number, number]
}

export interface ContainerConfig {
  xFrom: number
  yFrom: number
  scaleFrom: number
  x: { duration: number; delay: number; ease: [number, number, number, number] }
  y: { duration: number; delay: number; ease: [number, number, number, number] }
  scale: { duration: number; delay: number; ease: [number, number, number, number] }
}

interface WordRevealProps {
  text: string
  className?: string
  staggerDelay?: number
  wordDuration?: number
  blurAmount?: number
  yDistance?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'section'
  devControls?: boolean
  blurConfig?: PropertyConfig
  opacityConfig?: PropertyConfig
  yConfig?: PropertyConfig
  containerConfig?: ContainerConfig
}

// ── Easing presets ────────────────────────────────────────────────
const EASE_PRESETS: Record<string, [number, number, number, number]> = {
  'smooth':      [0.22, 0.68, 0.35, 1],
  'ease-out':    [0.16, 1, 0.3, 1],
  'ease-in':     [0.55, 0.085, 0.68, 0.53],
  'ease-in-out': [0.45, 0.05, 0.55, 0.95],
  'snap':        [0.19, 1, 0.22, 1],
  'bounce-out':  [0.34, 1.56, 0.64, 1],
  'linear':      [0, 0, 1, 1],
}

function findPresetName(ease: [number, number, number, number]): string | null {
  for (const [name, preset] of Object.entries(EASE_PRESETS)) {
    if (preset[0] === ease[0] && preset[1] === ease[1] && preset[2] === ease[2] && preset[3] === ease[3]) {
      return name
    }
  }
  return null
}

// ── Default configs ───────────────────────────────────────────────
const DEFAULT_BLUR: PropertyConfig = {
  durationRatio: 1.1,
  delayRatio: 0.15,
  ease: [0.22, 0.68, 0.35, 1],
}

const DEFAULT_OPACITY: PropertyConfig = {
  durationRatio: 1.2,
  delayRatio: 0.1,
  ease: [0.55, 0.085, 0.68, 0.53],
}

const DEFAULT_Y: PropertyConfig = {
  durationRatio: 0.9,
  delayRatio: 0.2,
  ease: [0.16, 1, 0.3, 1],
}

const DEFAULT_CONTAINER: ContainerConfig = {
  xFrom: 10,
  yFrom: 15,
  scaleFrom: 0.99,
  x: { duration: 1.36, delay: 0.216, ease: [0.45, 0.05, 0.55, 0.95] },
  y: { duration: 1.43, delay: 0.197, ease: [0.16, 1, 0.3, 1] },
  scale: { duration: 1.05, delay: 0.096, ease: [0.45, 0.05, 0.55, 0.95] },
}

const FRAME_MS = 16.67

// ── localStorage helpers ──────────────────────────────────────────
const STORAGE_KEY = 'word-reveal-presets'

interface SavedPreset {
  name: string
  startDelay: number
  staggerDelay: number
  blur: PropertyConfig
  opacity: PropertyConfig
  y: PropertyConfig
  container: ContainerConfig
  createdAt: number
}

function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePreset(preset: SavedPreset): SavedPreset[] {
  const presets = loadPresets()
  presets.push(preset)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}

function deletePreset(index: number): SavedPreset[] {
  const presets = loadPresets()
  presets.splice(index, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}

// Migrate old container configs to new per-property structure
function migrateContainerConfig(raw: Partial<ContainerConfig> | undefined): ContainerConfig {
  const base = DEFAULT_CONTAINER
  if (!raw) return base
  // Old format had `duration` and `ease` at top level — migrate to per-property
  const isOldFormat = 'duration' in raw && !('x' in raw)
  if (isOldFormat) {
    const oldEase = (raw as any).ease ?? base.x.ease
    const oldDuration = (raw as any).duration ?? base.x.duration
    return {
      xFrom: raw.xFrom ?? base.xFrom,
      yFrom: (raw as any).yFrom ?? base.yFrom,
      scaleFrom: raw.scaleFrom ?? base.scaleFrom,
      x: { duration: oldDuration, delay: 0, ease: oldEase },
      y: { duration: oldDuration, delay: 0, ease: oldEase },
      scale: { duration: oldDuration * 1.2, delay: 0, ease: oldEase },
    }
  }
  // New format — fill any missing fields with defaults
  return {
    xFrom: raw.xFrom ?? base.xFrom,
    yFrom: raw.yFrom ?? base.yFrom,
    scaleFrom: raw.scaleFrom ?? base.scaleFrom,
    x: raw.x ?? base.x,
    y: raw.y ?? base.y,
    scale: raw.scale ?? base.scale,
  }
}

// ── Component ─────────────────────────────────────────────────────
export const WordReveal = forwardRef<WordRevealControls, WordRevealProps>(function WordReveal(
  {
    text,
    className = '',
    staggerDelay = 0.07,
    wordDuration = 0.8,
    blurAmount = 24,
    yDistance = 28,
    as: Tag = 'span',
    devControls = false,
    blurConfig: blurConfigProp,
    opacityConfig: opacityConfigProp,
    yConfig: yConfigProp,
    containerConfig: containerConfigProp,
  },
  ref,
) {
  const words = text.split(' ')
  const wordRefs = useRef<HTMLSpanElement[]>([])
  const containerRef = useRef<HTMLElement>(null)
  const animsRef = useRef<AnimationPlaybackControlsWithThen[]>([])
  const isPlayingRef = useRef(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(false)

  // Configs
  const [startDelay, setStartDelay] = useState(0)
  const [stagger, setStagger] = useState(staggerDelay)
  const [blurConfig, setBlurConfig] = useState<PropertyConfig>(blurConfigProp ?? DEFAULT_BLUR)
  const [opacityConfig, setOpacityConfig] = useState<PropertyConfig>(opacityConfigProp ?? DEFAULT_OPACITY)
  const [yConfig, setYConfig] = useState<PropertyConfig>(yConfigProp ?? DEFAULT_Y)
  const [containerConfig, setContainerConfig] = useState<ContainerConfig>(migrateContainerConfig(containerConfigProp))

  // Preset state
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadPresets())
  const [presetName, setPresetName] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  const totalDuration = (words.length - 1) * stagger + wordDuration

  const runAnimations = useCallback(() => {
    animsRef.current.forEach((a) => a.cancel())
    animsRef.current = []

    // Container-level: x + scale entrance
    if (containerRef.current) {
      const el = containerRef.current

      // Set initial state
      el.style.transform = `translateX(${containerConfig.xFrom}px) translateY(${containerConfig.yFrom}px) scale(${containerConfig.scaleFrom})`

      const xAnim = animate(
        el,
        { x: [containerConfig.xFrom, 0] },
        {
          duration: containerConfig.x.duration,
          delay: containerConfig.x.delay,
          ease: containerConfig.x.ease,
        },
      )
      const yAnim = animate(
        el,
        { y: [containerConfig.yFrom, 0] },
        {
          duration: containerConfig.y.duration,
          delay: containerConfig.y.delay,
          ease: containerConfig.y.ease,
        },
      )
      const scaleAnim = animate(
        el,
        { scale: [containerConfig.scaleFrom, 1] },
        {
          duration: containerConfig.scale.duration,
          delay: containerConfig.scale.delay,
          ease: containerConfig.scale.ease,
        },
      )
      animsRef.current.push(xAnim, yAnim, scaleAnim)
    }

    // Per-word animations
    wordRefs.current.forEach((el, i) => {
      if (!el) return
      const baseDelay = i * stagger

      const filterAnim = animate(
        el,
        { filter: [`blur(${blurAmount}px)`, 'blur(0px)'] },
        {
          duration: wordDuration * blurConfig.durationRatio,
          delay: startDelay + baseDelay + wordDuration * blurConfig.delayRatio,
          ease: blurConfig.ease,
        },
      )

      const opacityAnim = animate(
        el,
        { opacity: [0, 1] },
        {
          duration: wordDuration * opacityConfig.durationRatio,
          delay: startDelay + baseDelay + wordDuration * opacityConfig.delayRatio,
          ease: opacityConfig.ease,
        },
      )

      const yAnim = animate(
        el,
        { y: [yDistance, 0] },
        {
          duration: wordDuration * yConfig.durationRatio,
          delay: startDelay + baseDelay + wordDuration * yConfig.delayRatio,
          ease: yConfig.ease,
        },
      )

      animsRef.current.push(filterAnim, opacityAnim, yAnim)
    })
  }, [words.length, startDelay, stagger, wordDuration, blurAmount, yDistance, blurConfig, opacityConfig, yConfig, containerConfig])

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    // rAF ensures DOM is painted so animate() can read computed styles
    requestAnimationFrame(() => runAnimations())
    return () => animsRef.current.forEach((a) => a.cancel())
  }, [runAnimations])

  // Re-run on config change
  const prevConfigsRef = useRef({ startDelay, stagger, blurConfig, opacityConfig, yConfig, containerConfig })
  useEffect(() => {
    const prev = prevConfigsRef.current
    const changed =
      prev.startDelay !== startDelay ||
      prev.stagger !== stagger ||
      prev.blurConfig !== blurConfig ||
      prev.opacityConfig !== opacityConfig ||
      prev.yConfig !== yConfig ||
      prev.containerConfig !== containerConfig
    prevConfigsRef.current = { startDelay, stagger, blurConfig, opacityConfig, yConfig, containerConfig }
    if (changed && mountedRef.current) {
      animsRef.current.forEach((a) => a.cancel())
      setProgress(0)
      isPlayingRef.current = true
      setIsPlaying(true)
      requestAnimationFrame(() => runAnimations())
    }
  }, [startDelay, stagger, blurConfig, opacityConfig, yConfig, containerConfig, runAnimations])

  // Track progress
  useEffect(() => {
    let raf: number
    const tick = () => {
      if (isPlayingRef.current) {
        const first = animsRef.current[0]
        if (first) setProgress(Math.min(first.time / totalDuration, 1))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [totalDuration])

  const pauseAll = useCallback(() => {
    animsRef.current.forEach((a) => a.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const resumeAll = useCallback(() => {
    animsRef.current.forEach((a) => a.play())
    isPlayingRef.current = true
    setIsPlaying(true)
  }, [])

  const restartAll = useCallback(() => {
    animsRef.current.forEach((a) => a.cancel())
    runAnimations()
    isPlayingRef.current = true
    setIsPlaying(true)
    setProgress(0)
  }, [runAnimations])

  const stepFrame = useCallback((frames = 1) => {
    animsRef.current.forEach((a) => a.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
    const dt = (frames * FRAME_MS) / 1000
    animsRef.current.forEach((a) => { a.time = Math.max(0, a.time + dt) })
    const first = animsRef.current[0]
    if (first) setProgress(Math.min(first.time / totalDuration, 1))
  }, [totalDuration])

  const seekTo = useCallback((p: number) => {
    animsRef.current.forEach((a) => a.pause())
    isPlayingRef.current = false
    setIsPlaying(false)
    const targetSec = p * totalDuration
    animsRef.current.forEach((a) => { a.time = targetSec })
    setProgress(p)
  }, [totalDuration])

  // Preset handlers
  const handleSave = useCallback(() => {
    const name = presetName.trim()
    if (!name) return
    const preset: SavedPreset = {
      name,
      startDelay,
      staggerDelay: stagger,
      blur: { ...blurConfig },
      opacity: { ...opacityConfig },
      y: { ...yConfig },
      container: { ...containerConfig },
      createdAt: Date.now(),
    }
    const updated = savePreset(preset)
    setPresets(updated)
    setPresetName('')
  }, [presetName, startDelay, stagger, blurConfig, opacityConfig, yConfig, containerConfig])

  const handleLoad = useCallback((preset: SavedPreset) => {
    if (preset.startDelay !== undefined) setStartDelay(preset.startDelay)
    setStagger(preset.staggerDelay)
    setBlurConfig(preset.blur)
    setOpacityConfig(preset.opacity)
    setYConfig(preset.y)
    if (preset.container) setContainerConfig(migrateContainerConfig(preset.container))
  }, [])

  const handleDelete = useCallback((index: number) => {
    const updated = deletePreset(index)
    setPresets(updated)
  }, [])

  useImperativeHandle(ref, () => ({
    play: resumeAll,
    pause: pauseAll,
    restart: restartAll,
    step: stepFrame,
    seek: seekTo,
    getProgress: () => progress,
  }), [resumeAll, pauseAll, restartAll, stepFrame, seekTo, progress])

  return (
    <div className="relative">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Tag ref={containerRef as any} className={className}>
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { if (el) wordRefs.current[i] = el }}
            className="inline-block origin-left"
            style={{
              willChange: 'transform, filter, opacity',
              opacity: 0,
              filter: `blur(${blurAmount}px)`,
              transform: `translateY(${yDistance}px)`,
            }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </Tag>

      {devControls && (
        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-text-secondary/20 bg-bg/80 p-4 backdrop-blur-sm font-mono text-xs text-text-secondary max-w-[520px]">
          {/* ── Transport ─────────────────────────── */}
          <div className="flex items-center gap-3">
            <button onClick={isPlaying ? pauseAll : resumeAll} className="hover:text-text-primary transition-colors w-5 h-5 flex items-center justify-center" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><rect x="3" y="2" width="3.5" height="12" rx="0.5" /><rect x="9.5" y="2" width="3.5" height="12" rx="0.5" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M4 2.5v11l9-5.5z" /></svg>
              )}
            </button>
            <button onClick={() => stepFrame(-1)} className="hover:text-text-primary transition-colors" aria-label="Step back">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><rect x="2" y="3" width="2" height="10" rx="0.5" /><path d="M13 3v10L6 8z" /></svg>
            </button>
            <button onClick={() => stepFrame(1)} className="hover:text-text-primary transition-colors" aria-label="Step forward">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3 3v10l7-5z" /><rect x="12" y="3" width="2" height="10" rx="0.5" /></svg>
            </button>
            <button onClick={restartAll} className="hover:text-text-primary transition-colors" aria-label="Restart">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M2.5 8a5.5 5.5 0 0 1 9.9-3.3M13.5 8a5.5 5.5 0 0 1-9.9 3.3" /><path d="M12 2v3h-3M4 14v-3h3" /></svg>
            </button>
            <div className="w-px h-4 bg-text-secondary/20" />
            <input type="range" min={0} max={1000} value={Math.round(progress * 1000)} onChange={(e) => seekTo(Number(e.target.value) / 1000)} className="flex-1 h-1 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" aria-label="Scrub timeline" />
            <span className="tabular-nums w-10 text-right">{Math.round(progress * 100)}%</span>
          </div>

          {/* ── Container controls ─────────────────── */}
          <ContainerControls config={containerConfig} onChange={setContainerConfig} />

          {/* ── Start delay ──────────────────────── */}
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-semibold w-14 shrink-0">delay</span>
            <input type="range" min={0} max={500} value={Math.round(startDelay * 1000)} onChange={(e) => setStartDelay(Number(e.target.value) / 1000)} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-12 text-right text-[11px]">{(startDelay * 1000).toFixed(0)}ms</span>
          </div>

          {/* ── Stagger delay ─────────────────────── */}
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold w-14 shrink-0">stagger</span>
            <input type="range" min={20} max={300} value={Math.round(stagger * 1000)} onChange={(e) => setStagger(Number(e.target.value) / 1000)} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-12 text-right text-[11px]">{(stagger * 1000).toFixed(0)}ms</span>
          </div>

          <div className="h-px bg-text-secondary/10" />

          {/* ── Save / Load presets ─────────────────── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} placeholder="preset name..." className="flex-1 bg-text-secondary/5 border border-text-secondary/15 rounded px-2 py-1 text-[11px] text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-text-secondary/30 transition-colors" />
              <button onClick={handleSave} disabled={!presetName.trim()} className="px-2 py-1 rounded text-[11px] bg-text-primary/10 hover:bg-text-primary/20 text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">save</button>
              {presets.length > 0 && (
                <button onClick={() => setShowPresets(!showPresets)} className="px-2 py-1 rounded text-[11px] hover:bg-text-secondary/10 transition-colors flex items-center gap-1">
                  load
                  <span className="text-text-secondary/40">({presets.length})</span>
                  <svg viewBox="0 0 8 8" className={`w-2 h-2 transition-transform ${showPresets ? 'rotate-90' : ''}`} fill="currentColor"><path d="M2 1l4 3-4 3z" /></svg>
                </button>
              )}
            </div>
            {showPresets && presets.length > 0 && (
              <div className="flex flex-col gap-1 pl-2 border-l border-text-secondary/10 ml-1 max-h-40 overflow-y-auto">
                {presets.map((preset, i) => (
                  <div key={`${preset.name}-${preset.createdAt}`} className="flex items-center gap-2 group">
                    <button onClick={() => handleLoad(preset)} className="flex-1 text-left text-[11px] text-text-secondary/70 hover:text-text-primary transition-colors truncate">{preset.name}</button>
                    <span className="text-[9px] text-text-secondary/30 shrink-0">{new Date(preset.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <button onClick={() => handleDelete(i)} className="text-text-secondary/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" aria-label={`Delete ${preset.name}`}>
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M4.5 3L8 6.5 11.5 3 13 4.5 9.5 8 13 11.5 11.5 13 8 9.5 4.5 13 3 11.5 6.5 8 3 4.5z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-text-secondary/10" />

          {/* ── Per-property controls ──────────────── */}
          <PropertyRow label="blur" color="text-blue-400" config={blurConfig} onChange={(c) => setBlurConfig(c)} />
          <PropertyRow label="opacity" color="text-green-400" config={opacityConfig} onChange={(c) => setOpacityConfig(c)} />
          <PropertyRow label="y" color="text-purple-400" config={yConfig} onChange={(c) => setYConfig(c)} />
        </div>
      )}
    </div>
  )
})

// ── Container controls ────────────────────────────────────────────
function ContainerControls({
  config,
  onChange,
}: {
  config: ContainerConfig
  onChange: (c: ContainerConfig) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 hover:text-text-primary transition-colors text-left"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-cyan-400 font-semibold w-14">h1</span>
        <span className="text-text-secondary/60 truncate text-[10px]">
          x:{config.xFrom}px · y:{config.yFrom}px · scale:{config.scaleFrom}
        </span>
        <svg viewBox="0 0 8 8" className={`w-2 h-2 ml-auto transition-transform ${expanded ? 'rotate-90' : ''}`} fill="currentColor"><path d="M2 1l4 3-4 3z" /></svg>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 pl-4 border-l border-text-secondary/10 ml-[3px]">
          {/* x starting value */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">x from</span>
            <input type="range" min={0} max={60} value={config.xFrom} onChange={(e) => onChange({ ...config, xFrom: Number(e.target.value) })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-8 text-right text-[10px]">{config.xFrom}px</span>
          </div>

          {/* y starting value */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">y from</span>
            <input type="range" min={0} max={40} value={config.yFrom} onChange={(e) => onChange({ ...config, yFrom: Number(e.target.value) })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-8 text-right text-[10px]">{config.yFrom}px</span>
          </div>

          {/* scale starting value */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">scale from</span>
            <input type="range" min={80} max={100} value={Math.round(config.scaleFrom * 100)} onChange={(e) => onChange({ ...config, scaleFrom: Number(e.target.value) / 100 })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-8 text-right text-[10px]">{config.scaleFrom.toFixed(2)}</span>
          </div>

          {/* x timing */}
          <ContainerPropertyRow
            label="x"
            config={config.x}
            onChange={(x) => onChange({ ...config, x })}
          />

          {/* y timing */}
          <ContainerPropertyRow
            label="y"
            config={config.y}
            onChange={(y) => onChange({ ...config, y })}
          />

          {/* scale timing */}
          <ContainerPropertyRow
            label="scale"
            config={config.scale}
            onChange={(scale) => onChange({ ...config, scale })}
          />
        </div>
      )}
    </div>
  )
}

function ContainerPropertyRow({
  label,
  config,
  onChange,
}: {
  label: string
  config: { duration: number; delay: number; ease: [number, number, number, number] }
  onChange: (c: { duration: number; delay: number; ease: [number, number, number, number] }) => void
}) {
  const presetName = findPresetName(config.ease)

  return (
    <div className="flex flex-col gap-1.5 pt-1 border-t border-text-secondary/5">
      <span className="text-cyan-400/60 font-semibold text-[10px]">{label}</span>

      <div className="flex items-center gap-2">
        <span className="w-16 text-[10px] text-text-secondary/60">duration</span>
        <input type="range" min={10} max={150} value={Math.round(config.duration * 100)} onChange={(e) => onChange({ ...config, duration: Number(e.target.value) / 100 })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
        <span className="tabular-nums w-8 text-right text-[10px]">{config.duration.toFixed(2)}s</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-16 text-[10px] text-text-secondary/60">delay</span>
        <input type="range" min={0} max={500} value={Math.round(config.delay * 1000)} onChange={(e) => onChange({ ...config, delay: Number(e.target.value) / 1000 })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
        <span className="tabular-nums w-8 text-right text-[10px]">{(config.delay * 1000).toFixed(0)}ms</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">easing</span>
        {Object.entries(EASE_PRESETS).map(([name, ease]) => (
          <button key={name} onClick={() => onChange({ ...config, ease })} className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${presetName === name ? 'bg-text-primary/20 text-text-primary' : 'hover:bg-text-secondary/10 text-text-secondary/60'}`}>{name}</button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">curve</span>
        <EasingPreview ease={config.ease} color="text-cyan-400" />
        <span className="text-[10px] text-text-secondary/40 tabular-nums">[{config.ease.map((v) => v.toFixed(2)).join(', ')}]</span>
      </div>
    </div>
  )
}

// ── Property row sub-component ────────────────────────────────────
function PropertyRow({
  label,
  color,
  config,
  onChange,
}: {
  label: string
  color: string
  config: PropertyConfig
  onChange: (c: PropertyConfig) => void
}) {
  const presetName = findPresetName(config.ease)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 hover:text-text-primary transition-colors text-left">
        <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
        <span className={`${color} font-semibold w-14`}>{label}</span>
        <span className="text-text-secondary/60 truncate text-[10px]">
          {(config.durationRatio * 100).toFixed(0)}% · +{(config.delayRatio * 100).toFixed(0)}% · {presetName ?? 'custom'}
        </span>
        <svg viewBox="0 0 8 8" className={`w-2 h-2 ml-auto transition-transform ${expanded ? 'rotate-90' : ''}`} fill="currentColor"><path d="M2 1l4 3-4 3z" /></svg>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 pl-4 border-l border-text-secondary/10 ml-[3px]">
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">duration</span>
            <input type="range" min={10} max={150} value={Math.round(config.durationRatio * 100)} onChange={(e) => onChange({ ...config, durationRatio: Number(e.target.value) / 100 })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-8 text-right text-[10px]">{(config.durationRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60">delay</span>
            <input type="range" min={0} max={100} value={Math.round(config.delayRatio * 100)} onChange={(e) => onChange({ ...config, delayRatio: Number(e.target.value) / 100 })} className="flex-1 h-0.5 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary" />
            <span className="tabular-nums w-8 text-right text-[10px]">+{(config.delayRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">easing</span>
            {Object.entries(EASE_PRESETS).map(([name, ease]) => (
              <button key={name} onClick={() => onChange({ ...config, ease })} className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${presetName === name ? 'bg-text-primary/20 text-text-primary' : 'hover:bg-text-secondary/10 text-text-secondary/60'}`}>{name}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary/60 shrink-0">curve</span>
            <EasingPreview ease={config.ease} color={color} />
            <span className="text-[10px] text-text-secondary/40 tabular-nums">[{config.ease.map((v) => v.toFixed(2)).join(', ')}]</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Easing curve SVG preview ──────────────────────────────────────
function EasingPreview({ ease, color }: { ease: [number, number, number, number]; color: string }) {
  const [x1, y1, x2, y2] = ease
  const w = 48
  const h = 28
  const pad = 2

  const x0 = pad
  const y0 = h - pad
  const xe = w - pad
  const ye = pad

  const cx1 = pad + x1 * (w - 2 * pad)
  const cy1 = (h - pad) - y1 * (h - 2 * pad)
  const cx2 = pad + x2 * (w - 2 * pad)
  const cy2 = (h - pad) - y2 * (h - 2 * pad)

  const strokeColor = color.replace('text-', 'stroke-')

  return (
    <svg width={w} height={h} className="shrink-0">
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" className="text-text-secondary/10" strokeWidth="0.5" />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" className="text-text-secondary/10" strokeWidth="0.5" />
      <line x1={x0} y1={y0} x2={cx1} y2={cy1} className={strokeColor} strokeWidth="0.5" opacity="0.3" />
      <line x1={xe} y1={ye} x2={cx2} y2={cy2} className={strokeColor} strokeWidth="0.5" opacity="0.3" />
      <path d={`M ${x0} ${y0} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xe} ${ye}`} fill="none" className={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
