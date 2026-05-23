import type { ReactNode } from 'react'

interface EditorShellProps {
  children: ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  return (
    <div
      className="relative flex flex-col w-screen h-screen overflow-hidden font-sora"
      style={{
        background:
          'linear-gradient(to bottom right, rgba(40, 153, 222, 0.1) 0%, rgba(17, 20, 94, 0.6) 100%)',
      }}
    >
      {children}
    </div>
  )
}
