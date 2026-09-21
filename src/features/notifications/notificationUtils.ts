import type { AppNotification } from "@/features/notifications/notificationApi"

export type NotificationFilter = "all" | "unread"

export interface NotificationGroup {
  label: "Today" | "Yesterday" | "Earlier"
  items: AppNotification[]
}

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const RELATIVE_TIME_LIMIT_MS = 7 * DAY_MS
const MAX_BADGE_COUNT = 99

const GROUP_ORDER: NotificationGroup["label"][] = ["Today", "Yesterday", "Earlier"]

function startOfDay(date: Date, dayOffset = 0): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOffset).getTime()
}

export function sortByNewest(notifications: AppNotification[]): AppNotification[] {
  return [...notifications].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function getUnreadCount(notifications: AppNotification[]): number {
  return notifications.reduce((count, item) => count + (item.isRead ? 0 : 1), 0)
}

export function filterNotifications(
  notifications: AppNotification[],
  filter: NotificationFilter
): AppNotification[] {
  return filter === "unread" ? notifications.filter((item) => !item.isRead) : notifications
}

export function setReadState(
  notifications: AppNotification[],
  id: string,
  isRead: boolean
): AppNotification[] {
  return notifications.map((item) => (item.id === id ? { ...item, isRead } : item))
}

export function markAllAsRead(notifications: AppNotification[]): AppNotification[] {
  return notifications.map((item) => (item.isRead ? item : { ...item, isRead: true }))
}

export function groupNotificationsByDate(
  notifications: AppNotification[],
  now: Date
): NotificationGroup[] {
  const todayStart = startOfDay(now)
  const yesterdayStart = startOfDay(now, -1)

  const buckets: Record<NotificationGroup["label"], AppNotification[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  }

  for (const item of notifications) {
    const createdAt = Date.parse(item.createdAt)
    if (createdAt >= todayStart) buckets.Today.push(item)
    else if (createdAt >= yesterdayStart) buckets.Yesterday.push(item)
    else buckets.Earlier.push(item)
  }

  return GROUP_ORDER.map((label) => ({ label, items: buckets[label] })).filter(
    (group) => group.items.length > 0
  )
}

export function formatRelativeTime(isoDate: string, now: Date): string {
  const time = Date.parse(isoDate)
  if (Number.isNaN(time)) return ""

  const diff = Math.max(0, now.getTime() - time)
  if (diff < MINUTE_MS) return "Just now"
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}m ago`
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}h ago`
  if (diff < RELATIVE_TIME_LIMIT_MS) return `${Math.floor(diff / DAY_MS)}d ago`

  return new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

export function formatBadgeCount(count: number): string {
  return count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count)
}