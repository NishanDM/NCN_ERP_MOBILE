import { useCallback, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  Fingerprint,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import ConfirmSheet from "@/components/ConfirmSheet"
import ProfileAvatar from "@/features/profile/ProfileAvatar"
import SettingsRow from "@/features/profile/ProfileSettingsRow"
import SettingsSection from "@/features/profile/ProfileSettingsSection"
import ToggleSwitch from "@/components/forms/ToggleSwitch"
import { useNotifications } from "@/features/notifications/notificationContext"
import { formatRelativeTime } from "@/features/notifications/notificationUtils"
import { signOut, type UserPreferences } from "@/features/profile/profileApi"
import { useProfile } from "@/features/profile/profileContext"
import { formatMemberSince } from "@/features/profile/profileUtils"
import { ROUTES } from "@/routes/approutes"

const APP_VERSION = "1.0.0"

interface PreferenceRowConfig {
  key: keyof UserPreferences
  label: string
  description: string
  icon: LucideIcon
}

const PREFERENCE_ROWS: PreferenceRowConfig[] = [
  { key: "pushNotifications", label: "Push notifications", description: "Orders, approvals and stock alerts", icon: Bell },
  { key: "emailDigest", label: "Daily email digest", description: "A summary sent every morning", icon: Mail },
  { key: "biometricLogin", label: "Biometric login", description: "Use fingerprint or face to sign in", icon: Fingerprint },
]

function LoadingState() {
  return (
    <div role="status" className="space-y-5">
      <span className="sr-only">Loading profile</span>
      <div aria-hidden="true" className="flex animate-pulse flex-col items-center rounded-xl border border-border bg-card px-4 py-6">
        <div className="h-20 w-20 rounded-full bg-secondary" />
        <div className="mt-3 h-4 w-1/2 rounded bg-secondary" />
        <div className="mt-2 h-3 w-1/3 rounded bg-secondary" />
      </div>
      {[0, 1].map((index) => (
        <div key={index} aria-hidden="true" className="animate-pulse space-y-px overflow-hidden rounded-xl border border-border bg-card">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-3 px-3 py-3">
              <div className="h-8 w-8 rounded-lg bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

interface ProfilePageProps {
  onLogout: () => void
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const navigate = useNavigate()
  const { profile, status, actionError, refresh, setPreference } = useProfile()
  const { unreadCount } = useNotifications()

  const [isSignOutOpen, setIsSignOutOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [now] = useState(() => new Date())

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch {
    } finally {
      onLogout()
    }
  }, [onLogout])

  let body: ReactNode
  if (status === "loading" || (status === "success" && !profile)) {
    body = <LoadingState />
  } else if (status === "error" || !profile) {
    body = (
      <div role="alert" className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm text-foreground font-medium">Couldn't load your profile</p>
        <p className="text-xs mt-1 mb-4">Check your connection and try again.</p>
        <Button size="sm" onClick={() => void refresh()}>Try again</Button>
      </div>
    )
  } else {
    body = (
      <>
        <section
          aria-label="Your profile"
          className="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-6 text-center"
        >
          <ProfileAvatar name={profile.fullName} avatarUrl={profile.avatarUrl} size="lg" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">{profile.fullName}</h2>
          <p className="text-sm text-muted-foreground">{profile.jobTitle}</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            {profile.employeeCode} · {profile.department}
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(ROUTES.PROFILE_EDIT)}>
            Edit profile
          </Button>
        </section>

        {actionError && (
          <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {actionError}
          </p>
        )}

        <SettingsSection title="Contact">
          <SettingsRow icon={Mail} label="Email" value={profile.email} />
          <SettingsRow icon={Phone} label="Phone" value={profile.phone} />
        </SettingsSection>

        <SettingsSection title="Work">
          <SettingsRow icon={Building2} label="Company" value={profile.company} />
          <SettingsRow icon={MapPin} label="Branch" value={profile.branch} />
          <SettingsRow icon={Briefcase} label="Department" value={profile.department} />
          <SettingsRow icon={CalendarDays} label="Member since" value={formatMemberSince(profile.joinedAt)} />
          <SettingsRow icon={Clock} label="Last sign-in" value={formatRelativeTime(profile.lastLoginAt, now)} />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingsRow
            icon={Mail}
            label="Change email"
            value="Confirm a new address with a code"
            onClick={() => navigate(ROUTES.PROFILE_CHANGE_EMAIL)}
          />
          <SettingsRow
            icon={Lock}
            label="Change password"
            value="Use a strong, unique password"
            onClick={() => navigate(ROUTES.PROFILE_CHANGE_PASSWORD)}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsRow
            icon={Bell}
            label="Notification centre"
            value={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          />
          {PREFERENCE_ROWS.map(({ key, label, description, icon }) => (
            <SettingsRow
              key={key}
              icon={icon}
              label={label}
              value={description}
              trailing={
                <ToggleSwitch
                  label={label}
                  checked={profile.preferences[key]}
                  onChange={(checked) => void setPreference(key, checked)}
                />
              }
            />
          ))}
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon={Info} label="App version" value={`v${APP_VERSION}`} />
        </SettingsSection>

        <Button
          variant="outline"
          className="w-full text-red-400"
          onClick={() => setIsSignOutOpen(true)}
        >
          <LogOut size={16} />
          Sign out
        </Button>

        <ConfirmSheet
          open={isSignOutOpen}
          onOpenChange={setIsSignOutOpen}
          title="Sign out of EPS?"
          description="You'll need to sign in again to view orders, stock and invoices."
          confirmLabel="Sign out"
          busyLabel="Signing out…"
          busy={isSigningOut}
          onConfirm={() => void handleSignOut()}
        />
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Profile" showAvatar={false} />
      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">{body}</div>
    </div>
  )
}