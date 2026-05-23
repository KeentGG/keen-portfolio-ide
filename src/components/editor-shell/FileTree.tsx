import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  FolderOpenIcon,
  FolderIcon,
  FileIcon,
} from '@phosphor-icons/react'
import { useFileSystem } from './file-system-context'
import type { ProjectFile } from './file-system'

interface TreeNode {
  name: string
  children?: TreeNode[]
  file?: ProjectFile
}

function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = []

  for (const file of files) {
    const parts = file.path.split('/')
    let current = root

    // Walk path segments (skip last = filename)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      let existing = current.find((n) => n.name === part && n.children)
      if (!existing) {
        existing = { name: part, children: [] }
        current.push(existing)
      }
      current = existing.children!
    }

    // Add file node
    current.push({ name: parts[parts.length - 1], file })
  }

  return root
}

function TreeFolder({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2)

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 w-full px-2 py-0.5 text-xs text-left cursor-pointer border-none bg-transparent hover:bg-ide-bg-active-tab/20 transition-colors text-ide-text-dim hover:text-ide-text-muted"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {expanded ? (
          <FolderOpenIcon size={14} className="text-ide-icon-blue/80 shrink-0" weight="regular" />
        ) : (
          <FolderIcon size={14} className="text-ide-icon-blue/60 shrink-0" weight="regular" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {expanded && node.children && (
        <TreeNodes nodes={node.children} depth={depth + 1} />
      )}
    </div>
  )
}

function TreeFile({ node, depth }: { node: TreeNode; depth: number }) {
  const { activeFile, selectFile } = useFileSystem()
  const isActive = node.file?.id === activeFile.id

  return (
    <button
      type="button"
      onClick={() => node.file && selectFile(node.file)}
      className={`flex items-center gap-1.5 w-full px-2 py-0.5 text-xs text-left cursor-pointer border-none transition-colors ${
        isActive
          ? 'bg-ide-bg-active-tab/60 text-ide-text-muted'
          : 'bg-transparent text-ide-text-dim hover:text-ide-text-muted hover:bg-ide-bg-active-tab/20'
      }`}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <FileIcon
        size={14}
        className={isActive ? 'text-ide-text-secondary/60 shrink-0' : 'text-ide-text-dim/40 shrink-0'}
        weight="regular"
      />
      <span className="truncate">{node.name}</span>
    </button>
  )
}

function TreeNodes({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
  return (
    <>
      {nodes.map((node) =>
        node.children ? (
          <TreeFolder key={node.name} node={node} depth={depth} />
        ) : (
          <TreeFile key={node.name} node={node} depth={depth} />
        ),
      )}
    </>
  )
}

export function FileTree() {
  const { files } = useFileSystem()
  const tree = buildTree(files)

  return <TreeNodes nodes={tree} depth={0} />
}
