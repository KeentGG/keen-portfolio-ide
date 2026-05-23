import { MagnifyingGlassIcon } from '@phosphor-icons/react'

interface FileTab {
  name: string
  active?: boolean
}

const TABS: FileTab[] = [
  { name: 'home.tsx', active: true },
  { name: 'career.tsx' },
]

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

function FileTabChip({ name, active }: FileTab) {
  return (
    <div
      className={`flex items-center gap-1 font-host-grotek px-ide-tab-x py-ide-tab-y ${
        active ? 'bg-ide-bg-active-tab rounded-ide-tab' : 'rounded-ide-sm'
      }`}
    >
      <span className="text-xs text-ide-text-muted font-normal">{name}</span>
      <span className="text-ide-text-muted/50 text-[10px] ml-1">✕</span>
    </div>
  )
}

export function TopBar() {
  return (
    <div className="flex flex-row-reverse justify-between items-center w-full px-[23px] py-2 gap-[50px]">
      <SearchBar />

      <div className="flex items-center gap-3">
        <SearchBar />
        <div className="flex items-center gap-ide-tab">
          {TABS.map((tab) => (
            <FileTabChip key={tab.name} {...tab} />
          ))}
        </div>
      </div>
    </div>
  )
}
