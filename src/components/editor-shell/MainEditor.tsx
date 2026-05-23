import type { ReactNode } from 'react'

interface MainEditorProps {
  editorSwitch: ReactNode
  children: ReactNode
}

export function MainEditor({ editorSwitch, children }: MainEditorProps) {
  return (
    <div className="relative flex flex-col flex-1 h-full bg-ide-bg-deep rounded-ide-panel min-w-0">
      {/* Floating editor/preview toggle */}
      <div className="absolute top-3 right-3 z-10">
        {editorSwitch}
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  )
}
