export function StatusBar() {
  const now = new Date()
  const time = now
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase()

  return (
    <div className="flex items-center justify-end w-full px-[23px] py-1">
      <span className="font-sora text-xs font-light text-ide-text-time/40">
        {time}
      </span>
    </div>
  )
}
