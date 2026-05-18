import './index.css'
import { WordReveal } from './components/WordReveal'

function App() {
  return (
    <div className="min-h-screen bg-bg font-sora flex flex-col items-center justify-center px-6">
      {/* Header group — name + role */}
      <div className="flex flex-col gap-0.5 items-start mb-24">
        <span className="text-text-primary text-base font-normal tracking-normal">
          Keanu Kent Gargar
        </span>
        <span className="text-text-secondary text-sm font-extralight tracking-normal">
          {'// Sr. frontend developer'}
        </span>
      </div>

      {/* Content block — headline + description with arrow */}
      <div className="flex flex-col gap-3 items-center max-w-[1200px]">
        <WordReveal
          as="h1"
          text="I'm a frontend engineer that gives people software tools designed to be invisible."
          className="text-text-primary text-2xl font-extralight leading-[1.2] text-center"
          staggerDelay={0.12}
          wordDuration={0.8}
          blurAmount={24}
          yDistance={28}
          devControls
        />

        <div className="flex items-center gap-[17px]">
          <p className="text-text-secondary text-base font-light leading-[1.2]">
            Empowering companies in aligning product to be human-centric.
          </p>
          <button
            className="w-3.5 h-3.5 border border-text-secondary rounded-sm flex items-center justify-center hover:border-text-primary transition-colors"
            aria-label="Continue"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-text-secondary"
            >
              <path d="M1 4h6M5 1l3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
