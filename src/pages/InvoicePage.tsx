import { useState } from "react"
import { Search, FileText, ChevronRight, CheckCircle2, Clock, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"

const statusFilters = ["All", "Pending", "Paid", "Overdue"]

const invoices = [
  { id: "INV-2024-4421", supplier: "Atlas Supply Sdn Bhd", date: "2024-09-08", due: "2024-09-22", amount: 18450.00, status: "pending", ref: "PO-2024-1098", items: 4 },
  { id: "INV-2024-4418", supplier: "Bumi Resources Bhd", date: "2024-09-01", due: "2024-09-15", amount: 7820.50, status: "overdue", ref: "PO-2024-1091", items: 2 },
  { id: "INV-2024-4410", supplier: "Maju Teknik Sdn Bhd", date: "2024-08-28", due: "2024-09-11", amount: 32100.00, status: "paid", ref: "PO-2024-1085", items: 7 },
  { id: "INV-2024-4405", supplier: "Syarikat Wawasan", date: "2024-08-25", due: "2024-09-08", amount: 5650.00, status: "paid", ref: "PO-2024-1080", items: 3 },
  { id: "INV-2024-4399", supplier: "Global Industrial Parts", date: "2024-08-20", due: "2024-09-03", amount: 91200.00, status: "overdue", ref: "PO-2024-1075", items: 12 },
  { id: "INV-2024-4387", supplier: "Atlas Supply Sdn Bhd", date: "2024-08-15", due: "2024-08-29", amount: 4300.00, status: "paid", ref: "PO-2024-1070", items: 2 },
  { id: "INV-2024-4380", supplier: "Kejuruteraan Bersatu", date: "2024-08-12", due: "2024-08-26", amount: 15800.00, status: "pending", ref: "PO-2024-1065", items: 5 },
  { id: "INV-2024-4375", supplier: "Trans-Asia Logistics", date: "2024-08-08", due: "2024-08-22", amount: 2880.00, status: "paid", ref: "PO-2024-1060", items: 1 },
]

function statusConfig(status: string) {
  if (status === "paid") return { badge: "success" as const, icon: CheckCircle2, color: "text-emerald-400", label: "PAID" }
  if (status === "overdue") return { badge: "destructive" as const, icon: AlertCircle, color: "text-red-400", label: "OVERDUE" }
  return { badge: "warning" as const, icon: Clock, color: "text-amber-400", label: "PENDING" }
}

type Invoice = typeof invoices[0]

export default function InvoicePage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selected, setSelected] = useState<Invoice | null>(null)

  const filtered = invoices.filter((inv) => {
    const matchFilter = activeFilter === "All" || inv.status.toLowerCase() === activeFilter.toLowerCase()
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.supplier.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPending = invoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0)

  if (selected) {
    const cfg = statusConfig(selected.status)
    const StatusIcon = cfg.icon
    return (
      <div className="flex flex-col min-h-full bg-background">
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 pt-12 pb-4">
          <button onClick={() => setSelected(null)} className="text-xs text-primary mb-2">← Back to Invoices</button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-mono text-base font-semibold">{selected.id}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.supplier}</p>
            </div>
            <Badge variant={cfg.badge}>{cfg.label}</Badge>
          </div>
        </div>
        <div className="flex-1 scrollable overflow-y-auto px-4 py-4 pb-28 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            {[
              ["PO Reference", selected.ref],
              ["Invoice Date", selected.date],
              ["Due Date", selected.due],
              ["No. of Items", `${selected.items} line items`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-sm text-foreground">{value}</span>
              </div>
            ))}
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Amount</span>
              <span className="font-mono text-lg font-semibold text-primary">RM {selected.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          {selected.status === "overdue" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400">Payment Overdue</p>
                <p className="text-xs text-muted-foreground mt-0.5">This invoice passed its due date. Please process payment or contact finance.</p>
              </div>
            </div>
          )}
          {selected.status !== "paid" && (
            <Button className="w-full">Mark as Paid</Button>
          )}
          <Button className="w-full" variant="outline">Download PDF</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Invoices" subtitle={`${invoices.length} total invoices`} />

      <div className="px-4 pt-4 pb-2 space-y-3 sticky top-[76px] z-10 bg-background">
        {/* Summary strip */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <p className="text-[10px] text-amber-400 font-mono uppercase">Pending</p>
            <p className="font-mono text-sm font-semibold text-amber-300">RM {totalPending.toLocaleString("en-MY", { minimumFractionDigits: 0 })}</p>
          </div>
          <div className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p className="text-[10px] text-red-400 font-mono uppercase">Overdue</p>
            <p className="font-mono text-sm font-semibold text-red-300">RM {totalOverdue.toLocaleString("en-MY", { minimumFractionDigits: 0 })}</p>
          </div>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search invoice or supplier..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollable">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 pt-2 scrollable overflow-y-auto space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No invoices found</p>
          </div>
        )}
        {filtered.map((inv) => {
          const cfg = statusConfig(inv.status)
          const Icon = cfg.icon
          return (
            <button
              key={inv.id}
              onClick={() => setSelected(inv)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-left active:bg-secondary transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.badge === "success" ? "bg-emerald-500/10" : cfg.badge === "destructive" ? "bg-red-500/10" : "bg-amber-500/10"}`}>
                <Icon size={15} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-mono text-xs text-foreground font-medium">{inv.id}</span>
                  <Badge variant={cfg.badge}>{cfg.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{inv.supplier}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono text-xs font-semibold text-foreground">RM {inv.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</span>
                  <span className="text-[10px] text-muted-foreground">Due {inv.due}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
