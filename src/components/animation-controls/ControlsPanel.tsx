import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise'
import { CaretUpIcon } from '@phosphor-icons/react/dist/csr/CaretUp'
import { CornersInIcon } from '@phosphor-icons/react/dist/csr/CornersIn'
import { CornersOutIcon } from '@phosphor-icons/react/dist/csr/CornersOut'
import { MinusIcon } from '@phosphor-icons/react/dist/csr/Minus'
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { useAnimationController } from './control-context'
import { TransportBar } from './TransportBar'
import type { ControlSectionDefinition } from './types'

interface ControlsPanelProps {
  title: string
  description?: string
  sections: ControlSectionDefinition[]
  placement?: 'bottom-right' | 'bottom-left'
}

interface DragState {
  offsetX: number
  offsetY: number
  originX: number
  originY: number
  nextX: number
  nextY: number
  width: number
  height: number
}

export function ControlsPanel({ title, description = 'Floating tuning panel', sections, placement = 'bottom-right' }: ControlsPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const dragFrameRef = useRef<number | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dockClass = placement === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'
  const panelSizeClass = position
    ? isMaximized
      ? 'w-[min(720px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)]'
      : 'w-[min(520px,calc(100vw-2rem))]'
    : isMaximized
      ? `${dockClass} w-[min(720px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)]`
      : `${dockClass} w-[min(520px,calc(100vw-2rem))]`

  const panelStyle: CSSProperties | undefined = position && !isMaximized
    ? { left: position.x, top: position.y }
    : undefined

  const applyDragTransform = () => {
    dragFrameRef.current = null
    const panel = panelRef.current
    const dragState = dragStateRef.current
    if (!panel || !dragState) return

    const deltaX = dragState.nextX - dragState.originX
    const deltaY = dragState.nextY - dragState.originY
    panel.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
  }

  useEffect(() => {
    if (!isDragging) return undefined

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState) return

      const margin = 16
      const maxX = Math.max(margin, window.innerWidth - dragState.width - margin)
      const maxY = Math.max(margin, window.innerHeight - dragState.height - margin)

      dragState.nextX = Math.min(Math.max(event.clientX - dragState.offsetX, margin), maxX)
      dragState.nextY = Math.min(Math.max(event.clientY - dragState.offsetY, margin), maxY)

      if (dragFrameRef.current === null) {
        dragFrameRef.current = requestAnimationFrame(applyDragTransform)
      }
    }

    const handlePointerUp = () => {
      const panel = panelRef.current
      const dragState = dragStateRef.current

      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current)
        dragFrameRef.current = null
      }

      if (panel && dragState) {
        panel.style.transform = ''
        setPosition({ x: dragState.nextX, y: dragState.nextY })
      }

      dragStateRef.current = null
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp, { once: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging])

  useEffect(() => () => {
    if (dragFrameRef.current !== null) cancelAnimationFrame(dragFrameRef.current)
  }, [])

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    const panel = panelRef.current
    if (!panel) return

    const rect = panel.getBoundingClientRect()
    const nextPosition = { x: rect.left, y: rect.top }

    panel.style.left = `${nextPosition.x}px`
    panel.style.top = `${nextPosition.y}px`
    panel.style.right = 'auto'
    panel.style.bottom = 'auto'

    setPosition(nextPosition)
    dragStateRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      originX: rect.left,
      originY: rect.top,
      nextX: rect.left,
      nextY: rect.top,
      width: rect.width,
      height: rect.height,
    }
    setIsDragging(true)
  }

  const clampPanelPosition = (width: number, height: number, x: number, y: number) => {
    const margin = 16
    const maxX = Math.max(margin, window.innerWidth - width - margin)
    const maxY = Math.max(margin, window.innerHeight - height - margin)
    return {
      x: Math.min(Math.max(x, margin), maxX),
      y: Math.min(Math.max(y, margin), maxY),
    }
  }

  const toggleMaximized = () => {
    const panel = panelRef.current
    if (!panel) {
      setIsMaximized((value) => !value)
      setIsMinimized(false)
      return
    }

    const rect = panel.getBoundingClientRect()
    const nextIsMaximized = !isMaximized
    const nextWidth = nextIsMaximized ? Math.min(720, window.innerWidth - 32) : Math.min(520, window.innerWidth - 32)
    const nextHeight = nextIsMaximized ? Math.min(window.innerHeight - 32, Math.max(rect.height, 560)) : rect.height
    const nextPosition = clampPanelPosition(nextWidth, nextHeight, rect.left, rect.top)

    setPosition(nextPosition)
    setIsMaximized(nextIsMaximized)
    setIsMinimized(false)
    dragStateRef.current = null
    setIsDragging(false)
  }

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`fixed z-50 flex flex-col overflow-hidden rounded-xl border border-text-secondary/20 bg-bg/95 text-xs text-text-secondary shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-200 will-change-transform hover:border-text-secondary/30 ${panelSizeClass}`}
      role="region"
      aria-label={title}
    >
      <div
        className={`flex min-h-12 touch-none select-none items-center gap-3 border-b border-text-secondary/10 bg-bg/80 px-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handleHeaderPointerDown}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-secondary/45">{title}</span>
          <span className="truncate text-[11px] text-text-secondary/70">
            {isMinimized ? 'Minimized' : isMaximized ? 'Expanded tuning panel' : description}
          </span>
        </div>
        {isMinimized && <MiniPlayback />}
        <PanelIconButton
          label={isMinimized ? 'Restore animation controls' : 'Minimize animation controls'}
          onClick={() => setIsMinimized((value) => !value)}
        >
          {isMinimized ? <CaretUpIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" /> : <MinusIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />}
        </PanelIconButton>
        <PanelIconButton
          label={isMaximized ? 'Restore compact animation controls' : 'Maximize animation controls'}
          onClick={toggleMaximized}
          pressed={isMaximized}
        >
          {isMaximized ? <CornersInIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" /> : <CornersOutIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />}
        </PanelIconButton>
      </div>

      {!isMinimized && (
        <div className={`flex flex-col gap-4 overflow-y-auto p-4 ${isMaximized ? 'min-h-0 flex-1' : 'max-h-[min(72vh,720px)]'}`}>
          <ControlSection label="Playback">
            <TransportBar />
          </ControlSection>

          {sections.map((section) => (
            <ControlSection key={section.id} label={section.label}>
              {section.render()}
            </ControlSection>
          ))}
        </div>
      )}
    </div>
  )
}

function MiniPlayback() {
  const { isPlaying, progress, playPause, restart } = useAnimationController()

  return (
    <div
      className="flex items-center gap-2 text-text-secondary/75"
      role="toolbar"
      aria-label="Minimized playback controls"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={playPause}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-text-secondary/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        {isPlaying ? <PauseIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" /> : <PlayIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={restart}
        aria-label="Restart animation"
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-text-secondary/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        <ArrowClockwiseIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />
      </button>
      <span className="w-9 text-right text-[11px] tabular-nums text-text-primary/80">{Math.round(progress * 100)}%</span>
    </div>
  )
}

function PanelIconButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string
  onClick: () => void
  pressed?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary/70 transition-colors hover:bg-text-secondary/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
    >
      {children}
    </button>
  )
}


function ControlSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2" aria-label={label}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-secondary/45">{label}</span>
        <span className="h-px flex-1 bg-text-secondary/10" aria-hidden="true" />
      </div>
      {children}
    </section>
  )
}
