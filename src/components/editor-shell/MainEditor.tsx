import type { ReactNode } from 'react'

interface MainEditorProps {
  editorSwitch: ReactNode
  children: ReactNode
}

export function MainEditor({ editorSwitch, children }: MainEditorProps) {
  return (
    <div className="flex flex-col flex-1 h-full bg-ide-bg-deep rounded-ide-panel min-w-0">
      {/* Editor/Preview toggle bar */}
      <div className="flex items-center justify-end w-full p-3">
        {editorSwitch}
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  )
}
