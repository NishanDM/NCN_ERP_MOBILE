import { TrendingUp, TrendingDown, AlertTriangle, Package, FileText, ClipboardList, ChevronRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppHeader from "@/components/AppHeader"

const kpis = [
  {
    label: "Total Stock Value",
    value: "RM 1,247,850",
    sub: "+4.2% this month",
    trend: "up",
    color: "text-emerald-400",
  },
  {
    label: "Open Invoices",
    value: "34",
    sub: "RM 182,400 outstanding",
    trend: "neutral",
    color: "text-primary",
  },
  {
    label: "Pending GRNs",
    value: "12",
    sub: "3 overdue",
    trend: "warn",
    color: "text-amber-400",
  },
  {
    label: "Low Stock Items",
    value: "7",
    sub: "Reorder required",
    trend: "down",
    color: "text-red-400",
  },
]

const recentActivity = [
  { id: "GRN-2024-0891", type: "GRN", desc: "Received from Syarikat Maju Jaya", time: "2h ago", status: "success" as const },
  { id: "INV-2024-4421", type: "Invoice", desc: "Payment due: Atlas Supply Sdn Bhd", time: "4h ago", status: "warning" as const },
  { id: "STK-ADJ-0234", type: "Stock Adj", desc: "Manual adjustment — Warehouse A", time: "6h ago", status: "default" as const },
  { id: "INV-2024-4418", type: "Invoice", desc: "Overdue: Bumi Resources Bhd", time: "1d ago", status: "destructive" as const },
  { id: "GRN-2024-0890", type: "GRN", desc: "Partially received — PO-2024-1102", time: "1d ago", status: "warning" as const },
]

const quickStats = [
  { icon: Package, label: "SKUs", value: "1,248", bg: "bg-blue-500/10 text-blue-400" },
  { icon: FileText, label: "Invoices", value: "34", bg: "bg-violet-500/10 text-violet-400" },
  { icon: ClipboardList, label: "GRNs MTD", value: "89", bg: "bg-emerald-500/10 text-emerald-400" },
  { icon: AlertTriangle, label: "Alerts", value: "7", bg: "bg-amber-500/10 text-amber-400" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Dashboard" subtitle="Good morning, Ahmad" />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-2">
          {quickStats.map(({ icon: Icon, label, value, bg }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon size={15} />
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* KPI Cards */}
        <div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">Key Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-[10px] text-muted-foreground mb-2 leading-tight">{kpi.label}</p>
                  <p className={`font-mono text-xl font-semibold ${kpi.color} leading-none mb-1.5`}>{kpi.value}</p>
                  <div className="flex items-center gap-1">
                    {kpi.trend === "up" && <TrendingUp size={10} className="text-emerald-400" />}
                    {kpi.trend === "down" && <TrendingDown size={10} className="text-red-400" />}
                    {kpi.trend === "warn" && <AlertTriangle size={10} className="text-amber-400" />}
                    <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Monthly summary bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-foreground">Sep 2024 — Receiving Progress</span>
              <span className="font-mono text-xs text-primary">68%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-blue-400" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">60 of 89 GRNs processed</span>
              <span className="text-[10px] text-muted-foreground">Target: 100</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Recent Activity</p>
            <button className="flex items-center gap-0.5 text-xs text-primary">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 active:bg-secondary transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-foreground font-medium truncate">{item.id}</span>
                    <Badge variant={item.status}>{item.type}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
