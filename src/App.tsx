import './index.css'
import { useState } from 'react'
import {
  EditorShell,
  TopBar,
  PrimarySidebar,
  MainEditor,
  RightSidebar,
  StatusBar,
  EditorSwitch,
} from './components/editor-shell'
import { FileSystemProvider } from './components/editor-shell/file-system-context'
import { PreviewPane } from './components/PreviewPane'
import { EditorPane } from './components/EditorPane'

function App() {
  const [mode, setMode] = useState<'editor' | 'preview'>('preview')

  return (
    <FileSystemProvider>
      <EditorShell>
        <TopBar />

        <div className="flex flex-1 overflow-hidden gap-ide-panel px-[18px]">
          <PrimarySidebar />

          {/* Vertical separator */}
          <div className="shrink-0 w-px bg-ide-border-panel/60" />

          <MainEditor
            editorSwitch={<EditorSwitch mode={mode} onModeChange={setMode} />}
          >
            {mode === 'preview' ? <PreviewPane /> : <EditorPane />}
          </MainEditor>

          {/* Vertical separator */}
          <div className="shrink-0 w-px bg-ide-border-panel/60" />

          <RightSidebar />
        </div>

        <StatusBar />
      </EditorShell>
    </FileSystemProvider>
  )
}

export default App
