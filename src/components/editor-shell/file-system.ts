import type { ComponentType } from 'react'
import { LandingPage } from '../../pages/LandingPage'

export interface PreviewComponentProps {
  replayKey: number
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  language: 'tsx' | 'css'
  /** If set, this file is previewable — preview mode renders this component. */
  preview?: ComponentType<PreviewComponentProps>
}

const REPO_BASE = 'https://raw.githubusercontent.com/KeentGG/keen-portfolio-ide/ide-theme/main'

export const PROJECT_FILES: ProjectFile[] = [
  {
    id: 'landing-page',
    name: 'LandingPage.tsx',
    path: 'src/pages/LandingPage.tsx',
    language: 'tsx',
    preview: LandingPage,
  },
  {
    id: 'app',
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'tsx',
  },
  {
    id: 'editor-shell',
    name: 'EditorShell.tsx',
    path: 'src/components/editor-shell/EditorShell.tsx',
    language: 'tsx',
  },
  {
    id: 'top-bar',
    name: 'TopBar.tsx',
    path: 'src/components/editor-shell/TopBar.tsx',
    language: 'tsx',
  },
  {
    id: 'primary-sidebar',
    name: 'PrimarySidebar.tsx',
    path: 'src/components/editor-shell/PrimarySidebar.tsx',
    language: 'tsx',
  },
  {
    id: 'main-editor',
    name: 'MainEditor.tsx',
    path: 'src/components/editor-shell/MainEditor.tsx',
    language: 'tsx',
  },
  {
    id: 'editor-switch',
    name: 'EditorSwitch.tsx',
    path: 'src/components/editor-shell/EditorSwitch.tsx',
    language: 'tsx',
  },
  {
    id: 'right-sidebar',
    name: 'RightSidebar.tsx',
    path: 'src/components/editor-shell/RightSidebar.tsx',
    language: 'tsx',
  },
  {
    id: 'status-bar',
    name: 'StatusBar.tsx',
    path: 'src/components/editor-shell/StatusBar.tsx',
    language: 'tsx',
  },
  {
    id: 'editor-pane',
    name: 'EditorPane.tsx',
    path: 'src/components/EditorPane.tsx',
    language: 'tsx',
  },
  {
    id: 'tokens',
    name: 'tokens.css',
    path: 'src/theme/tokens.css',
    language: 'css',
  },
  {
    id: 'index-css',
    name: 'index.css',
    path: 'src/index.css',
    language: 'css',
  },
]

export const DEFAULT_FILE_ID = 'landing-page'

export async function fetchFileSource(file: ProjectFile): Promise<string> {
  const url = `${REPO_BASE}/${file.path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${file.name}: ${res.status}`)
  return res.text()
}
