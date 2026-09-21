import type { ReactNode } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

interface ProfileSettingsRowProps {
  icon: LucideIcon
  label: string
  value?: string
  onClick?: () => void
  trailing?: ReactNode
}

const ROW_CLASSES = "flex w-full items-center gap-3 px-3 py-3 text-left"

export default function ProfileSettingsRow({ icon: Icon, label, value, onClick, trailing }: ProfileSettingsRowProps) {
  const content = (
    <>
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon size={15} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {value && <p className="text-xs text-muted-foreground truncate">{value}</p>}
      </div>
      {trailing}
      {onClick && !trailing && <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${ROW_CLASSES} active:bg-secondary transition-colors`}>
        {content}
      </button>
    )
  }

  return <div className={ROW_CLASSES}>{content}</div>
}