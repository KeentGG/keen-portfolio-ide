import './index.css'
import { useEffect, useState } from 'react'
import {
  EditorShell,
  TopBar,
  PrimarySidebar,
  MainEditor,
  RightSidebar,
  StatusBar,
  EditorSwitch,
} from './components/editor-shell'
import { FileSystemProvider, useFileSystem } from './components/editor-shell/file-system-context'
import { PreviewPane } from './components/PreviewPane'
import { EditorPane } from './components/EditorPane'

function EditorContent() {
  const { activeFile } = useFileSystem()
  const [mode, setMode] = useState<'editor' | 'preview'>(
    activeFile.preview ? 'preview' : 'editor',
  )

  const isPreviewable = !!activeFile.preview
  const showPreview = mode === 'preview' && isPreviewable

  // When switching to a non-previewable file, drop back to editor
  useEffect(() => {
    if (!isPreviewable) {
      setMode('editor')
    }
  }, [isPreviewable])

  return (
    <EditorShell>
      <TopBar />

      <div className="flex flex-1 overflow-hidden gap-ide-panel px-[18px]">
        <PrimarySidebar />

        {/* Vertical separator */}
        <div className="shrink-0 w-px bg-ide-border-panel/60" />

        <MainEditor
          editorSwitch={
            isPreviewable ? <EditorSwitch mode={mode} onModeChange={setMode} /> : null
          }
        >
          {showPreview ? <PreviewPane /> : <EditorPane />}
        </MainEditor>

        {/* Vertical separator */}
        <div className="shrink-0 w-px bg-ide-border-panel/60" />

        <RightSidebar />
      </div>

      <StatusBar />
    </EditorShell>
  )
}

function App() {
  return (
    <FileSystemProvider>
      <EditorContent />
    </FileSystemProvider>
  )
}

export default App
