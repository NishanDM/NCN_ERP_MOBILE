import { memo } from "react"
import {
  ShoppingCart,
  FileText,
  ClipboardList,
  Package,
  ClipboardCheck,
  Info,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AppNotification, NotificationType } from "@/features/notifications/notificationApi"
import { formatRelativeTime } from "@/features/notifications/notificationUtils"

interface TypeConfig {
  icon: LucideIcon
  label: string
  color: string
  bg: string
}

const TYPE_CONFIG: Record<NotificationType, TypeConfig> = {
  order: { icon: ShoppingCart, label: "Purchase Order", color: "text-blue-400", bg: "bg-blue-500/10" },
  invoice: { icon: FileText, label: "Invoice", color: "text-violet-400", bg: "bg-violet-500/10" },
  grn: { icon: ClipboardList, label: "GRN", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  stock: { icon: Package, label: "Stock", color: "text-amber-400", bg: "bg-amber-500/10" },
  approval: { icon: ClipboardCheck, label: "Approval", color: "text-primary", bg: "bg-primary/10" },
  system: { icon: Info, label: "System", color: "text-muted-foreground", bg: "bg-secondary" },
}

interface NotificationItemProps {
  notification: AppNotification
  now: Date
  onOpen: (notification: AppNotification) => void
}

function NotificationItem({ notification, now, onOpen }: NotificationItemProps) {
  const { title, message, createdAt, isRead, priority, type } = notification
  const { icon: Icon, label, color, bg } = TYPE_CONFIG[type]

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={cn(
        "w-full flex items-start gap-3 rounded-xl border px-3 py-3 text-left active:bg-secondary transition-colors",
        isRead ? "border-border bg-card" : "border-primary/30 bg-primary/5"
      )}
    >
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", bg)}>
        <Icon size={15} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn("text-sm text-foreground truncate", isRead ? "font-medium" : "font-semibold")}>
            {title}
          </span>
          {priority === "high" && <Badge variant="destructive">URGENT</Badge>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{message}</p>
        <p className="font-mono text-[10px] text-muted-foreground mt-1">
          {label} · <time dateTime={createdAt}>{formatRelativeTime(createdAt, now)}</time>
        </p>
      </div>
      {!isRead && (
        <>
          <span aria-hidden="true" className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="sr-only">Unread</span>
        </>
      )}
    </button>
  )
}

export default memo(NotificationItem)