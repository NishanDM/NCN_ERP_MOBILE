import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import NotificationItem from "@/features/notifications/NotificationItem"
import { useNotifications } from "@/features/notifications/notificationContext"
import type { AppNotification } from "@/features/notifications/notificationApi"
import {
  filterNotifications,
  formatBadgeCount,
  groupNotificationsByDate,
  type NotificationFilter,
} from "@/features/notifications/notificationUtils"

const NOW_REFRESH_MS = 60_000
const SKELETON_ROW_COUNT = 5

const filters: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
]

const emptyMessages: Record<NotificationFilter, string> = {
  all: "No notifications yet",
  unread: "You're all caught up",
}

function LoadingList() {
  return (
    <div role="status" className="space-y-2">
      <span className="sr-only">Loading notifications</span>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex animate-pulse items-start gap-3 rounded-xl border border-border bg-card px-3 py-3"
        >
          <div className="w-9 h-9 rounded-lg bg-secondary shrink-0" />
          <div className="flex-1 space-y-2 pt-0.5">
            <div className="h-3 w-2/3 rounded bg-secondary" />
            <div className="h-3 w-full rounded bg-secondary" />
            <div className="h-2 w-1/3 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, status, actionError, refresh, markRead, markAllRead } =
    useNotifications()

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")
  const [now, setNow] = useState(() => new Date())

  // Keeps "2m ago" labels and the Today / Yesterday grouping fresh while the screen stays open.
  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), NOW_REFRESH_MS)
    return () => window.clearInterval(intervalId)
  }, [])

  const groups = useMemo(
    () => groupNotificationsByDate(filterNotifications(notifications, activeFilter), now),
    [notifications, activeFilter, now]
  )

  const handleOpen = useCallback(
    (notification: AppNotification) => {
      if (!notification.isRead) void markRead(notification.id)
      if (notification.actionPath) navigate(notification.actionPath)
    },
    [markRead, navigate]
  )

  let body: ReactNode
  if (status === "loading") {
    body = <LoadingList />
  } else if (status === "error") {
    body = (
      <div role="alert" className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm text-foreground font-medium">Couldn't load notifications</p>
        <p className="text-xs mt-1 mb-4">Check your connection and try again.</p>
        <Button size="sm" onClick={() => void refresh()}>Try again</Button>
      </div>
    )
  } else if (groups.length === 0) {
    body = (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <BellOff size={32} className="mb-2 opacity-40" />
        <p className="text-sm">{emptyMessages[activeFilter]}</p>
      </div>
    )
  } else {
    body = groups.map((group) => (
      <div key={group.label}>
        <h2 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">{group.label}</h2>
        <div className="space-y-2">
          {group.items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} now={now} onOpen={handleOpen} />
          ))}
        </div>
      </div>
    ))
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Notifications"
        subtitle={status === "success" ? (unreadCount > 0 ? `${unreadCount} unread` : "All caught up") : undefined}
        showBell={false}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div role="group" aria-label="Filter notifications" className="flex gap-2">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={activeFilter === value}
                onClick={() => setActiveFilter(value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === value ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                }`}
              >
                {value === "unread" && unreadCount > 0 ? `${label} (${formatBadgeCount(unreadCount)})` : label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            disabled={unreadCount === 0}
            onClick={() => void markAllRead()}
          >
            Mark all read
          </Button>
        </div>

        {actionError && (
          <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {actionError}
          </p>
        )}

        {body}
      </div>
    </div>
  )
}