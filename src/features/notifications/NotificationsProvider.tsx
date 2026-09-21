import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "@/features/notifications/notificationApi"
import {
  NotificationsContext,
  type NotificationsContextValue,
  type NotificationsStatus,
} from "@/features/notifications/notificationContext"
import { getUnreadCount, markAllAsRead, setReadState, sortByNewest } from "@/features/notifications/notificationUtils"

interface NotificationsProviderProps {
  children: ReactNode
}

export default function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [status, setStatus] = useState<NotificationsStatus>("loading")
  const [actionError, setActionError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setStatus("loading")
    setActionError(null)
    try {
      const data = await fetchNotifications()
      setNotifications(sortByNewest(data))
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const markRead = useCallback(async (id: string) => {
    setActionError(null)
    setNotifications((previous) => setReadState(previous, id, true))
    try {
      await markNotificationRead(id)
    } catch {
      setNotifications((previous) => setReadState(previous, id, false))
      setActionError("Couldn't mark the notification as read. Please try again.")
    }
  }, [])

  const markAllRead = useCallback(async () => {
    if (getUnreadCount(notifications) === 0) return

    const snapshot = notifications
    setActionError(null)
    setNotifications(markAllAsRead)
    try {
      await markAllNotificationsRead()
    } catch {
      setNotifications(snapshot)
      setActionError("Couldn't mark all notifications as read. Please try again.")
    }
  }, [notifications])

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount: getUnreadCount(notifications),
      status,
      actionError,
      refresh,
      markRead,
      markAllRead,
    }),
    [notifications, status, actionError, refresh, markRead, markAllRead]
  )

  return <NotificationsContext value={value}>{children}</NotificationsContext>
}