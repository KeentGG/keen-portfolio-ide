import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise'
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { SkipBackIcon } from '@phosphor-icons/react/dist/csr/SkipBack'
import { SkipForwardIcon } from '@phosphor-icons/react/dist/csr/SkipForward'
import { useAnimationController } from './control-context'

export function TransportBar() {
  const { isPlaying, progress, playPause, restart, step, seek } = useAnimationController()

  return (
    <div className="flex items-center gap-3" role="toolbar" aria-label="Playback controls">
      <button
        onClick={playPause}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        className="hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        {isPlaying ? (
          <PauseIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
        ) : (
          <PlayIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
        )}
      </button>
      <button
        onClick={() => step(-1)}
        aria-label="Step back one frame"
        className="hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        <SkipBackIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
      </button>
      <button
        onClick={() => step(1)}
        aria-label="Step forward one frame"
        className="hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        <SkipForwardIcon className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
      </button>
      <button
        onClick={restart}
        aria-label="Restart animation"
        className="hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
      >
        <ArrowClockwiseIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />
      </button>
      <div className="w-px h-4 bg-text-secondary/20" aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={(e) => seek(Number(e.target.value) / 1000)}
        aria-label="Scrub animation timeline"
        className="flex-1 h-1 accent-text-primary bg-text-secondary/20 rounded-full appearance-none cursor-pointer min-h-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-primary"
      />
      <span className="tabular-nums w-10 text-right">{Math.round(progress * 100)}%</span>
    </div>
  )
}
