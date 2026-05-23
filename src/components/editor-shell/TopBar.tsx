import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useFileSystem } from './file-system-context'

function SearchBar() {
  return (
    <div className="flex items-center gap-4 rounded-ide-btn bg-ide-bg-surface border border-ide-border-subtle/5 p-ide-search font-host-grotek">
      <MagnifyingGlassIcon size={14} className="text-ide-text-muted/50" weight="regular" />
      <span className="text-xs text-ide-text-muted/60 font-normal">
        Search files, command, etc..
      </span>
    </div>
  )
}

function ActiveFileTab() {
  const { activeFile } = useFileSystem()

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-ide-bg-active-tab rounded-ide-tab font-host-grotek">
      <span className="text-xs text-ide-text-muted font-normal">{activeFile.name}</span>
    </div>
  )
}

export function TopBar() {
  return (
    <div className="flex flex-row-reverse justify-between items-center w-full px-[23px] py-2 gap-[50px]">
      <SearchBar />

      <div className="flex items-center gap-3">
        <ActiveFileTab />
        <SearchBar />
      </div>
    </div>
  )
}
