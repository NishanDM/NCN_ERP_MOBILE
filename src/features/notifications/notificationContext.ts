import { createContext, useContext } from "react"
import type { AppNotification } from "@/features/notifications/notificationApi"

export type NotificationsStatus = "loading" | "success" | "error"

export interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  status: NotificationsStatus
  actionError: string | null
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used inside <NotificationsProvider>")
  }
  return context
}