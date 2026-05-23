import { FolderOpenIcon, GitPullRequestIcon } from '@phosphor-icons/react'

export function PrimarySidebar() {
  return (
    <div className="flex flex-col h-full w-[250px] shrink-0 gap-ide-panel font-host-grotek">
      {/* Icon row */}
      <div className="flex items-center gap-ide-sidebar px-ide-sb-px py-2.5 bg-ide-bg-overlay rounded-ide-panel w-full">
        <FolderOpenIcon size={20} className="text-ide-icon-blue" weight="regular" />
        <GitPullRequestIcon size={20} className="text-ide-icon-blue/60" weight="regular" />
      </div>

      {/* File tree area */}
      <div className="flex flex-col flex-1 bg-ide-bg-deep rounded-ide-panel w-[250px]">
        {/* Horizontal separator */}
        <div className="w-full h-px bg-ide-border-separator/10" />

        {/* Project name */}
        <div className="flex items-center px-2.5 py-2">
          <span className="text-[10px] font-normal tracking-wide text-ide-text-dim">
            KEEN-PORTFOLIO
          </span>
        </div>
      </div>
    </div>
  )
}
