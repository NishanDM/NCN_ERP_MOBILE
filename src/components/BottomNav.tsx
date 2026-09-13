import { LayoutDashboard, Package, FileText, ClipboardList, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabKey = "dashboard" | "stock" | "invoices" | "grn" | "more"

interface NavItem {
  key: TabKey
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "stock", label: "Stock", icon: Package },
  { key: "invoices", label: "Invoices", icon: FileText },
  { key: "grn", label: "GRN", icon: ClipboardList },
  { key: "more", label: "More", icon: MoreHorizontal },
]

interface BottomNavProps {
  active: TabKey
  onChange: (key: TabKey) => void
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border flex items-center pb-safe z-20">
      {navItems.map(({ key, label, icon: Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
