import { ROUTES } from "@/routes/approutes"

export type NotificationType = "order" | "invoice" | "grn" | "stock" | "approval" | "system"

export type NotificationPriority = "high" | "normal"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  isRead: boolean
  priority: NotificationPriority
  actionPath?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock database
// ─────────────────────────────────────────────────────────────────────────────

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-001",
    type: "order",
    title: "New purchase order",
    message: "PO-2024-1108 for Syarikat Maju Jaya Sdn Bhd was raised — RM 48,500.",
    createdAt: ago(2 * MINUTE_MS),
    isRead: false,
    priority: "normal",
  },
  {
    id: "ntf-002",
    type: "invoice",
    title: "Payment received",
    message: "RM 25,000 received from Atlas Supply Sdn Bhd against INV-2024-4421.",
    createdAt: ago(35 * MINUTE_MS),
    isRead: false,
    priority: "normal",
    actionPath: ROUTES.INVOICES,
  },
  {
    id: "ntf-003",
    type: "stock",
    title: "Low stock alert",
    message: "Basmati Rice 5kg is down to 4 units. Reorder level is 10.",
    createdAt: ago(2 * HOUR_MS),
    isRead: false,
    priority: "high",
    actionPath: ROUTES.STOCK,
  },
  {
    id: "ntf-004",
    type: "approval",
    title: "Approval needed",
    message: "Purchase request PR-2024-0312 is waiting for your approval.",
    createdAt: ago(4 * HOUR_MS),
    isRead: false,
    priority: "normal",
  },
  {
    id: "ntf-005",
    type: "grn",
    title: "Goods received",
    message: "GRN-2024-0891 from Syarikat Maju Jaya was received at Warehouse A.",
    createdAt: ago(DAY_MS),
    isRead: true,
    priority: "normal",
    actionPath: ROUTES.GRN,
  },
  {
    id: "ntf-006",
    type: "invoice",
    title: "Invoice overdue",
    message: "INV-2024-4418 from Bumi Resources Bhd is 7 days overdue (RM 112,300).",
    createdAt: ago(DAY_MS + 3 * HOUR_MS),
    isRead: false,
    priority: "high",
    actionPath: ROUTES.INVOICES,
  },
  {
    id: "ntf-007",
    type: "grn",
    title: "Partial delivery",
    message: "GRN-2024-0890 was partially received. 3 items are still pending from PO-2024-1098.",
    createdAt: ago(2 * DAY_MS),
    isRead: true,
    priority: "normal",
    actionPath: ROUTES.GRN,
  },
  {
    id: "ntf-008",
    type: "system",
    title: "Scheduled maintenance",
    message: "EPS will be unavailable on Sunday between 1:00 AM and 2:00 AM.",
    createdAt: ago(3 * DAY_MS),
    isRead: true,
    priority: "normal",
  },
  {
    id: "ntf-009",
    type: "stock",
    title: "Stock adjustment posted",
    message: "STK-ADJ-0234 adjusted Warehouse A by +24 units.",
    createdAt: ago(5 * DAY_MS),
    isRead: true,
    priority: "normal",
    actionPath: ROUTES.STOCK,
  },
  {
    id: "ntf-010",
    type: "order",
    title: "Purchase order approved",
    message: "PO-2024-1102 was approved by the Finance Manager.",
    createdAt: ago(6 * DAY_MS),
    isRead: true,
    priority: "normal",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Mock endpoints
// ─────────────────────────────────────────────────────────────────────────────

const SIMULATED_LATENCY_MS = 600
const SIMULATE_FAILURE = false

let serverNotifications: AppNotification[] = MOCK_NOTIFICATIONS.map((item) => ({ ...item }))

function respond<T>(produce: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error("Simulated network error"))
        return
      }
      resolve(produce())
    }, SIMULATED_LATENCY_MS)
  })
}

export function fetchNotifications(): Promise<AppNotification[]> {
  return respond(() => serverNotifications.map((item) => ({ ...item })))
}

export function markNotificationRead(id: string): Promise<void> {
  return respond(() => {
    serverNotifications = serverNotifications.map((item) =>
      item.id === id ? { ...item, isRead: true } : item
    )
  })
}

export function markAllNotificationsRead(): Promise<void> {
  return respond(() => {
    serverNotifications = serverNotifications.map((item) =>
      item.isRead ? item : { ...item, isRead: true }
    )
  })
}