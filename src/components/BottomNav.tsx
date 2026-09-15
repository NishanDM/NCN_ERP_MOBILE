import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package, FileText, ClipboardList, MoreHorizontal, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TAB_ROUTE_ORDER, type TabKey } from "@/routes/approutes"

const TAB_ICONS: Record<TabKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  stock: Package,
  invoices: FileText,
  grn: ClipboardList,
  more: MoreHorizontal,
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border flex items-center pb-safe z-20">
      {TAB_ROUTE_ORDER.map(({ key, path, label }) => {
        const Icon = TAB_ICONS[key]
        return (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}