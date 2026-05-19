import { createContext, useContext } from 'react'
import type { AnimationController } from './types'

export const AnimationControllerContext = createContext<AnimationController | null>(null)

export function useAnimationController() {
  const controller = useContext(AnimationControllerContext)
  if (!controller) throw new Error('useAnimationController must be used inside AnimationControlProvider')
  return controller
}
