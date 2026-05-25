import { useEffect } from 'react'
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
const HEADLINE_SEQUENCE_START = 0

const words = HEADLINE_TEXT.split(' ')

interface LandingPageProps {
  /** Changing this key forces the animation to replay (remount). */
  replayKey: number
}

export function LandingPage({ replayKey }: LandingPageProps) {
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
  }, [animate, replayKey])

  return (
    <div className="flex flex-col items-center font-sora">
      {/* Header group — name + role */}
      <div className="flex gap-1.5 text-base items-center justify-center mb-32">
        <span className="text-ide-text-primary font-light tracking-normal">
          Keanu Kent Gargar
        </span>
        <span className="text-ide-text-accent font-extralight tracking-normal">
          {'// Sr. frontend engineer'}
        </span>
      </div>

      {/* Content block — headline + description with arrow */}
      <div ref={scope} key={replayKey} className="flex flex-col items-center gap-3 max-w-[797px]">
        <h1
          className="headline-copy text-ide-text-primary font-extralight leading-[1.2] text-center text-[28px]"
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
          <ArrowRightIcon className="text-sm text-ide-text-ghost" weight="regular" aria-hidden="true" />
          <p className="text-ide-text-ghost text-base font-light leading-[1.2]">
            Empowering companies in aligning product to be human-centric.
          </p>
        </div>
      </div>
    </div>
  )
}
