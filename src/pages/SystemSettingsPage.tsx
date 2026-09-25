import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Eye,
  Database,
  ShieldAlert,
  Smartphone,
  Trash2,
  CheckCircle2,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

export default function SystemSettingsPage() {
  const navigate = useNavigate()

  // Theme state: dark / light
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")

  // Notification toggles
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  // System security & app preferences
  const [biometricLock, setBiometricLock] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [language, setLanguage] = useState("English (US)")
  
  // Cache feedback toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleClearCache = () => {
    setToastMessage("Local storage cache cleared successfully!")
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="System Settings"
        subtitle="App preferences & configurations"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section 1: Appearance & Theme Toggle (Dark Theme / Light Theme) */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
            Theme & Appearance
          </h3>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {themeMode === "dark" ? (
                  <Moon size={20} className="text-violet-400" />
                ) : (
                  <Sun size={20} className="text-amber-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">App Theme Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle between dark and light view</p>
                </div>
              </div>
              
              {/* Eye Toggle Switch */}
              <button
                onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  themeMode === "dark" ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                }`}
              >
                <Eye size={14} />
                <span>{themeMode === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Notification Controls (ON/OFF Switches) */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
            Notification Settings
          </h3>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive instant PO & GRN status updates</p>
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
                  <p className="text-sm font-medium text-foreground">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">Daily stock summary report emails</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">SMS Urgent Alerts</p>
                  <p className="text-xs text-muted-foreground">Critical low stock SMS messages</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Additional App Requirements */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
            Security & System Preferences
          </h3>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Biometric Lock</p>
                  <p className="text-xs text-muted-foreground">Require Fingerprint / Face ID to open app</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={biometricLock}
                onChange={(e) => setBiometricLock(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Background Auto-Sync</p>
                  <p className="text-xs text-muted-foreground">Sync offline data when internet is restored</p>
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

        {/* Section 4: Maintenance Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleClearCache}
            variant="outline"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 justify-start gap-3 h-12 rounded-xl"
          >
            <Trash2 size={18} />
            <span>Clear App Cache & Local Storage</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
