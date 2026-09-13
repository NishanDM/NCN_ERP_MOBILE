import { Bell, ChevronDown } from "lucide-react"

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-background sticky top-0 z-10 border-b border-border">
      <div>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-0.5">EPS System</p>
        <h1 className="text-lg font-semibold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground active:scale-95 transition-transform">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-background" />
        </button>
        <button className="flex items-center gap-1.5 bg-secondary rounded-full pl-3 pr-2 py-1.5 active:scale-95 transition-transform">
          <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">A</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
