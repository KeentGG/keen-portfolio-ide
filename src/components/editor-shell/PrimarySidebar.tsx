import { FolderOpenIcon, GitPullRequestIcon, FileIcon } from '@phosphor-icons/react'
import { useFileSystem } from './file-system-context'

export function PrimarySidebar() {
  const { files, activeFile, selectFile } = useFileSystem()

  return (
    <div className="flex flex-col h-full w-[250px] shrink-0 font-host-grotek">
      {/* Icon row */}
      <div className="flex items-center gap-ide-sidebar px-ide-sb-px py-2.5 bg-ide-bg-overlay rounded-ide-panel w-full mb-px">
        <FolderOpenIcon size={20} className="text-ide-icon-blue" weight="regular" />
        <GitPullRequestIcon size={20} className="text-ide-icon-blue/60" weight="regular" />
      </div>

      {/* File tree */}
      <div className="flex flex-col flex-1 bg-ide-bg-deep rounded-ide-panel w-[250px] overflow-y-auto">
        {/* Project name */}
        <div className="flex items-center px-2.5 py-2 shrink-0">
          <span className="text-[10px] font-normal tracking-wide text-ide-text-dim">
            KEEN-PORTFOLIO
          </span>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-ide-border-separator/10 shrink-0" />

        {/* File list */}
        <div className="flex flex-col py-1">
          {files.map((file) => {
            const isActive = activeFile.id === file.id
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => selectFile(file)}
                className={`flex items-center gap-2 px-3 py-1 text-xs text-left cursor-pointer border-none transition-colors ${
                  isActive
                    ? 'bg-ide-bg-active-tab/60 text-ide-text-muted'
                    : 'bg-transparent text-ide-text-dim hover:text-ide-text-muted hover:bg-ide-bg-active-tab/20'
                }`}
              >
                <FileIcon size={14} className={isActive ? 'text-ide-text-secondary/60' : 'text-ide-text-dim/40'} weight="regular" />
                <span className="truncate">{file.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
