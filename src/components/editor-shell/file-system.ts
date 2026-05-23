import AppSource from '../../App.tsx?raw'
import PreviewPaneSource from '../PreviewPane.tsx?raw'
import EditorPaneSource from '../EditorPane.tsx?raw'
import EditorShellSource from './EditorShell.tsx?raw'
import TopBarSource from './TopBar.tsx?raw'
import PrimarySidebarSource from './PrimarySidebar.tsx?raw'
import MainEditorSource from './MainEditor.tsx?raw'
import EditorSwitchSource from './EditorSwitch.tsx?raw'
import RightSidebarSource from './RightSidebar.tsx?raw'
import StatusBarSource from './StatusBar.tsx?raw'
import TokensSource from '../../theme/tokens.css?raw'
import IndexCSSSource from '../../index.css?raw'

export interface ProjectFile {
  id: string
  name: string
  path: string
  language: 'tsx' | 'css'
  source: string
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    id: 'preview-pane',
    name: 'PreviewPane.tsx',
    path: 'src/components/PreviewPane.tsx',
    language: 'tsx',
    source: PreviewPaneSource,
  },
  {
    id: 'app',
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'tsx',
    source: AppSource,
  },
  {
    id: 'editor-shell',
    name: 'EditorShell.tsx',
    path: 'src/components/editor-shell/EditorShell.tsx',
    language: 'tsx',
    source: EditorShellSource,
  },
  {
    id: 'top-bar',
    name: 'TopBar.tsx',
    path: 'src/components/editor-shell/TopBar.tsx',
    language: 'tsx',
    source: TopBarSource,
  },
  {
    id: 'primary-sidebar',
    name: 'PrimarySidebar.tsx',
    path: 'src/components/editor-shell/PrimarySidebar.tsx',
    language: 'tsx',
    source: PrimarySidebarSource,
  },
  {
    id: 'main-editor',
    name: 'MainEditor.tsx',
    path: 'src/components/editor-shell/MainEditor.tsx',
    language: 'tsx',
    source: MainEditorSource,
  },
  {
    id: 'editor-switch',
    name: 'EditorSwitch.tsx',
    path: 'src/components/editor-shell/EditorSwitch.tsx',
    language: 'tsx',
    source: EditorSwitchSource,
  },
  {
    id: 'right-sidebar',
    name: 'RightSidebar.tsx',
    path: 'src/components/editor-shell/RightSidebar.tsx',
    language: 'tsx',
    source: RightSidebarSource,
  },
  {
    id: 'status-bar',
    name: 'StatusBar.tsx',
    path: 'src/components/editor-shell/StatusBar.tsx',
    language: 'tsx',
    source: StatusBarSource,
  },
  {
    id: 'editor-pane',
    name: 'EditorPane.tsx',
    path: 'src/components/EditorPane.tsx',
    language: 'tsx',
    source: EditorPaneSource,
  },
  {
    id: 'tokens',
    name: 'tokens.css',
    path: 'src/theme/tokens.css',
    language: 'css',
    source: TokensSource,
  },
  {
    id: 'index-css',
    name: 'index.css',
    path: 'src/index.css',
    language: 'css',
    source: IndexCSSSource,
  },
]

export const DEFAULT_FILE = 'preview-pane'
