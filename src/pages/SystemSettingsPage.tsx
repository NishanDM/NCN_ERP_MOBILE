import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, Bell, Lock, Globe, Moon, Database, ShieldAlert, ChevronRight } from "lucide-react"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

export default function SystemSettingsPage() {
  const navigate = useNavigate()

  // System settings state flags
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="System Settings"
        subtitle="App preferences & configurations"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Section: Notifications */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
            Notification Preferences
          </h3>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive real-time PO & GRN alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Summaries</p>
                  <p className="text-xs text-muted-foreground">Daily inventory status via email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Section: General App Settings */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
            General & Data
          </h3>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-violet-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Theme</p>
                  <p className="text-xs text-muted-foreground">Use high contrast dark colors</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Offline Auto-Sync</p>
                  <p className="text-xs text-muted-foreground">Sync local changes when back online</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Security Quick Link */}
        <button
          onClick={() => navigate(ROUTES.PROFILE_CHANGE_PASSWORD)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card text-left active:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-amber-400" />
            <div>
              <p className="text-sm font-medium text-foreground">Security & Password</p>
              <p className="text-xs text-muted-foreground">Change your account password</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
