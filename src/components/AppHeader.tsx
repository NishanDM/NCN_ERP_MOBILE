import { Bell, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfileAvatar from "@/features/profile/ProfileAvatar"
import { useNotifications } from "@/features/notifications/notificationContext"
import { formatBadgeCount } from "@/features/notifications/notificationUtils"
import { useProfile } from "@/features/profile/profileContext"
import { ROUTES } from "@/routes/approutes"

interface AppHeaderProps {
  title: string
  subtitle?: string
  showBell?: boolean
  showAvatar?: boolean
  onBack?: () => void
}

export default function AppHeader({
  title,
  subtitle,
  showBell = true,
  showAvatar = true,
  onBack,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const { profile } = useProfile()

  return (
    <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-background sticky top-0 z-10 border-b border-border">
      <div className="flex min-w-0 items-center gap-1">
        {onBack && (
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="-ml-2 mr-1 w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-0.5">EPS System</p>
          <h1 className="text-lg font-semibold text-foreground leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showBell && (
          <button
            type="button"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 border border-background flex items-center justify-center text-[9px] font-bold text-white"
              >
                {formatBadgeCount(unreadCount)}
              </span>
            )}
          </button>
        )}
        {showAvatar && (
          <button
            type="button"
            aria-label="Open profile"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <ProfileAvatar name={profile?.fullName ?? ""} avatarUrl={profile?.avatarUrl} />
          </button>
        )}
      </div>
    </header>
  )
}
