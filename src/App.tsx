import './index.css'
import { useEffect, useState } from 'react'
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowClockwise'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { stagger } from 'motion'
import { useAnimate } from 'motion/react'

const HEADLINE_TEXT = "I'm a frontend engineer that builds intuitive tools designed to be invisible in your workflow."
const HEADLINE_WORD_DURATION = 0.8
const HEADLINE_STAGGER = 0.075
const HEADLINE_INTRO_WORD_COUNT = 4
const HEADLINE_INTRO_OPACITY_DURATION = HEADLINE_WORD_DURATION * 2
const HEADLINE_INTRO_OPACITY_START_DELAY = HEADLINE_WORD_DURATION * 0.05
const HEADLINE_BLUR_AMOUNT = 24
const HEADLINE_Y_DISTANCE = 28
const words = HEADLINE_TEXT.split(' ')
const HEADLINE_SEQUENCE_START = 0

function App() {
  const [animationRun, setAnimationRun] = useState(0)
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    const headlineContainerControls = animate(
      '.headline-copy',
      { x: [32, 0], y: [4, 0], scale: [1.07, 1] },
      {
        x: { duration: 2.3, delay: 0.05, ease: 'easeInOut' },
        y: { duration: 0.84, delay: 0.167, ease: 'easeInOut' },
        scale: { duration: 1.7, delay: 0, ease: [0.49, 0.15, 0.48, 0.85] },
      },
    )
    const headlineIntroControls = animate(
      '.headline-word--intro',
      { opacity: [0, 1] },
      {
        duration: HEADLINE_INTRO_OPACITY_DURATION,
        delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_INTRO_OPACITY_START_DELAY }),
        ease: [0.55, 0.085, 0.68, 0.53],
        opacity: { duration: 0.95, delay: 0, ease: 'easeInOut' },
      },
    )
    const headlineRestControls = animate(
      [
        [
          '.headline-word--rest',
          { filter: [`blur(${HEADLINE_BLUR_AMOUNT}px)`, 'blur(0px)'] },
          {
            at: HEADLINE_SEQUENCE_START,
            duration: HEADLINE_WORD_DURATION,
            delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.15 }),
            ease: [0.22, 0.68, 0.35, 1],
          },
        ],
        [
          '.headline-word--rest',
          { y: [HEADLINE_Y_DISTANCE, 0] },
          {
            at: '<',
            duration: HEADLINE_WORD_DURATION * 0.95,
            delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.15 }),
            ease: [0.16, 1, 0.3, 1],
          },
        ],
        [
          '.headline-word--rest',
          { opacity: [0, 1] },
          {
            at: '<',
            duration: HEADLINE_WORD_DURATION * 1.2,
            delay: stagger(HEADLINE_STAGGER, { startDelay: HEADLINE_WORD_DURATION * 0.05 }),
            ease: [0.55, 0.085, 0.68, 0.53],
          },
        ],
      ],
      { delay: headlineIntroControls.duration * 0.5 },
    )
    const supportingCopyDelay = (headlineIntroControls.duration + headlineRestControls.duration) * 0.7
    const supportingCopyControls = animate(
      '.supporting-copy',
      { opacity: [0, 1], y: [3, 0] },
      {
        y: { duration: 1, delay: supportingCopyDelay, ease: 'easeOut' },
        opacity: { duration: 1, delay: supportingCopyDelay + 0.05, ease: 'easeIn' },
      },
    )

    return () => {
      headlineContainerControls.stop()
      headlineIntroControls.stop()
      headlineRestControls.stop()
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
        <span className="text-text-primary font-light tracking-normal">
          Keanu Kent Gargar
        </span>
        <span className="text-[#3f677d] font-extralight tracking-normal">
          {'// Sr. frontend developer'}
        </span>
      </div>

      {/* Content block — headline + description with arrow */}
      <div ref={scope} key={animationRun} className="flex flex-col gap-3 items-center max-w-[1200px]">
        <h1
          className="headline-copy text-text-primary text-2xl max-w-3xl font-extralight leading-[1.2] text-center"
          style={{ transform: 'translate(20px, 20px) scale(0.97)' }}
        >
          {words.map((word, i) => {
            const isIntroWord = i < HEADLINE_INTRO_WORD_COUNT

            return (
              <span
                key={`${word}-${i}`}
                className={`headline-word inline-block origin-left ${isIntroWord ? 'headline-word--intro' : 'headline-word--rest'}`}
                style={{
                  opacity: 0,
                  filter: isIntroWord ? 'none' : `blur(${HEADLINE_BLUR_AMOUNT}px)`,
                  transform: isIntroWord ? 'none' : `translateY(${HEADLINE_Y_DISTANCE}px)`,
                  willChange: 'transform, filter, opacity',
                }}
              >
                {word}{i < words.length - 1 ? '\u00A0' : ''}
              </span>
            )
          })}
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
