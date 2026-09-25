import { ChevronRight, ShoppingCart, BarChart3, Users, Settings, HelpCircle, LogOut, FileBarChart, Truck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AppHeader from "@/components/AppHeader"
import ProfileAvatar from "@/features/profile/ProfileAvatar"
import { useProfile } from "@/features/profile/profileContext"
import { ROUTES } from "@/routes/approutes"

const menuSections = [
  {
    title: "Procurement",
    items: [
      { icon: ShoppingCart, label: "Purchase Orders", badge: "8 open", color: "text-blue-400", bg: "bg-blue-500/10", route: ROUTES.PURCHASE_ORDERS },
      { icon: Truck, label: "Suppliers", badge: null, color: "text-violet-400", bg: "bg-violet-500/10", route: ROUTES.SUPPLIERS },
      { icon: FileBarChart, label: "Purchase Requests", badge: "3 pending", color: "text-amber-400", bg: "bg-amber-500/10", route: ROUTES.PURCHASE_REQUESTS },
    ],
  },
  {
    title: "Reports",
    items: [
      { icon: BarChart3, label: "Stock Reports", badge: null, color: "text-emerald-400", bg: "bg-emerald-500/10", route: ROUTES.STOCK_REPORTS },
      { icon: FileBarChart, label: "GRN Summary", badge: null, color: "text-blue-400", bg: "bg-blue-500/10", route: ROUTES.GRN_SUMMARY },
    ],
  },
  {
    title: "Administration",
    items: [
      { icon: Users, label: "User Management", badge: null, color: "text-primary", bg: "bg-primary/10", route: ROUTES.USER_MANAGEMENT },
      { icon: Settings, label: "System Settings", badge: null, color: "text-muted-foreground", bg: "bg-secondary", route: ROUTES.SYSTEM_SETTINGS },
      { icon: HelpCircle, label: "Help & Support", badge: null, color: "text-muted-foreground", bg: "bg-secondary", route: ROUTES.HELP_SUPPORT },
    ],
  },
]

export default function MorePage() {
  const navigate = useNavigate()
  const { profile } = useProfile()

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="More" subtitle="EPS v2.4.1" />

      <div className="flex-1 scrollable overflow-y-auto px-4 pt-4 pb-28 space-y-5">
        {/* Profile card */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className="w-full rounded-xl border border-border bg-card p-4 flex items-center gap-4 text-left active:bg-secondary transition-colors"
        >
          <ProfileAvatar name={profile?.fullName ?? ""} avatarUrl={profile?.avatarUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{profile?.fullName ?? "—"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.jobTitle ?? "—"} · {profile?.branch ?? "—"}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
              {profile?.employeeCode ?? "—"} · {profile?.email ?? "—"}
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground shrink-0" />
        </button>

        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">{section.title}</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
              {section.items.map(({ icon: Icon, label, badge, color, bg, route }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => route && navigate(route)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                    <Icon size={15} className={color} />
                  </div>
                  <span className="flex-1 text-sm text-foreground">{label}</span>
                  {badge && (
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                      {badge}
                    </span>
                  )}
                  <ChevronRight size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 active:bg-red-500/20 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <LogOut size={15} className="text-red-400" />
          </div>
          <span className="text-sm text-red-400 font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
