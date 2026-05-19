import type { ReactNode } from 'react'
import { AnimationControllerContext } from './control-context'
import type { AnimationController } from './types'

interface AnimationControlProviderProps {
  controller: AnimationController
  children: ReactNode
}

export function AnimationControlProvider({ controller, children }: AnimationControlProviderProps) {
  return (
    <AnimationControllerContext.Provider value={controller}>
      {children}
    </AnimationControllerContext.Provider>
  )
}
