import './index.css'
import { useEffect, useState } from 'react'
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { stagger } from 'motion'
import { useAnimate } from 'motion/react'

const HEADLINE_TEXT = "I'm a frontend engineer that gives people software tools designed to be invisible."
const HEADLINE_WORD_DURATION = 0.8
const HEADLINE_STAGGER = 0.07
const HEADLINE_BLUR_AMOUNT = 24
const HEADLINE_Y_DISTANCE = 28
const words = HEADLINE_TEXT.split(' ')
const HEADLINE_SEQUENCE_START = 0

function App() {
  const [animationRun, setAnimationRun] = useState(0)
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    const headlineControls = animate([
      [
        '.headline-copy',
        { x: [20, 0], y: [20, 0], scale: [0.97, 1] },
        {
          at: HEADLINE_SEQUENCE_START,
          x: { duration: 1.5, delay: 0.013, ease: [0.45, 0.05, 0.55, 0.95] },
          y: { duration: 0.84, delay: 0.167, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.05, delay: 0.13, ease: [0.45, 0.05, 0.55, 0.95] },
        },
      ],
      [
        '.headline-word',
        { filter: [`blur(${HEADLINE_BLUR_AMOUNT}px)`, 'blur(0px)'] },
        {
          at: HEADLINE_SEQUENCE_START,
          duration: HEADLINE_WORD_DURATION,
          delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.15 }),
          ease: [0.22, 0.68, 0.35, 1],
        },
      ],
      [
        '.headline-word',
        { y: [HEADLINE_Y_DISTANCE, 0] },
        {
          at: HEADLINE_SEQUENCE_START,
          duration: HEADLINE_WORD_DURATION * 0.95,
          delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.15 }),
          ease: [0.16, 1, 0.3, 1],
        },
      ],
      [
        '.headline-word',
        { opacity: [0, 1] },
        {
          at: HEADLINE_SEQUENCE_START,
          duration: HEADLINE_WORD_DURATION * 1.2,
          delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.05 }),
          ease: [0.55, 0.085, 0.68, 0.53],
        },
      ],
    ])
    const supportingCopyDelay = headlineControls.duration * 0.5
    const supportingCopyControls = animate(
      '.supporting-copy',
      { opacity: [0, 1], y: [-2, 0] },
      {
        y: { duration: 0.85, delay: supportingCopyDelay, ease: 'easeInOut' },
        opacity: { duration: 0.95, delay: supportingCopyDelay + 0.15, ease: 'easeIn' },
      },
    )

    return () => {
      headlineControls.stop()
      supportingCopyControls.stop()
    }
  }, [animate, animationRun])
  return (
    <div className="relative min-h-screen bg-bg font-sora flex flex-col items-center justify-center px-6">
      <button
        type="button"
        onClick={() => setAnimationRun((run) => run + 1)}
        className="absolute right-6 top-6 flex h-9 items-center gap-2 rounded-md border border-text-secondary/20 px-3 text-xs font-light text-text-secondary transition-colors hover:border-text-secondary/45 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary/40"
        aria-label="Replay animations"
      >
        <ArrowClockwiseIcon className="h-3.5 w-3.5" weight="regular" aria-hidden="true" />
        Replay
      </button>

      {/* Header group — name + role */}
      <div className="flex gap-1 text-base items-center justify-center mb-24">
        <span className="text-text-primary font-normal tracking-normal">
          Keanu Kent Gargar
        </span>
        <span className="text-[#3f677d] font-extralight tracking-normal">
          {'// Sr. frontend developer'}
        </span>
      </div>

      {/* Content block — headline + description with arrow */}
      <div ref={scope} key={animationRun} className="flex flex-col gap-3 items-center max-w-[1200px]">
        <h1
          className="headline-copy text-text-primary text-2xl font-extralight leading-[1.2] text-center"
          style={{ transform: 'translate(20px, 20px) scale(0.97)' }}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="headline-word inline-block origin-left"
              style={{
                opacity: 0,
                filter: `blur(${HEADLINE_BLUR_AMOUNT}px)`,
                transform: `translateY(${HEADLINE_Y_DISTANCE}px)`,
                willChange: 'transform, filter, opacity',
              }}
            >
              {word}{i < words.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h1>

        <div
          className="supporting-copy flex items-center gap-2"
          style={{ opacity: 0, transform: 'translateY(-4px)', willChange: 'transform, opacity' }}
        >
          <ArrowRightIcon className="text-sm text-text-secondary" weight="regular" aria-hidden="true" />
          {/*
            Supporting copy controls are intentionally disconnected. The locked
            animation config above is the source of truth; see
            src/components/animation-controls/SUPPORTING_COPY_CONTROLS.md to
            temporarily reconnect TransformControlled for future tuning.
          */}
          <p className="text-text-secondary text-base font-light leading-[1.2]">
            Empowering companies in aligning product to be human-centric.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
