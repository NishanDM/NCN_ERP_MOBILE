import { useState } from "react"
import { Search, ClipboardList, ChevronRight, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"

const statusFilters = ["All", "Received", "Partial", "Pending", "Rejected"]

const grns = [
  { id: "GRN-2024-0891", po: "PO-2024-1102", supplier: "Syarikat Maju Jaya Sdn Bhd", date: "2024-09-10", receivedBy: "Azman Bin Yusof", status: "received", items: 6, qtyOrdered: 240, qtyReceived: 240 },
  { id: "GRN-2024-0890", po: "PO-2024-1098", supplier: "Atlas Supply Sdn Bhd", date: "2024-09-09", receivedBy: "Norhana Binti Ali", status: "partial", items: 4, qtyOrdered: 180, qtyReceived: 120 },
  { id: "GRN-2024-0888", po: "PO-2024-1095", supplier: "Global Industrial Parts", date: "2024-09-08", receivedBy: "Pending", status: "pending", items: 8, qtyOrdered: 400, qtyReceived: 0 },
  { id: "GRN-2024-0885", po: "PO-2024-1090", supplier: "Bumi Resources Bhd", date: "2024-09-07", receivedBy: "Razif Bin Hassan", status: "rejected", items: 2, qtyOrdered: 50, qtyReceived: 0 },
  { id: "GRN-2024-0880", po: "PO-2024-1085", supplier: "Maju Teknik Sdn Bhd", date: "2024-09-05", receivedBy: "Azman Bin Yusof", status: "received", items: 7, qtyOrdered: 320, qtyReceived: 320 },
  { id: "GRN-2024-0876", po: "PO-2024-1080", supplier: "Kejuruteraan Bersatu", date: "2024-09-03", receivedBy: "Siti Nurhaliza", status: "received", items: 5, qtyOrdered: 100, qtyReceived: 100 },
  { id: "GRN-2024-0871", po: "PO-2024-1075", supplier: "Trans-Asia Logistics", date: "2024-09-01", receivedBy: "Pending", status: "pending", items: 3, qtyOrdered: 60, qtyReceived: 0 },
  { id: "GRN-2024-0866", po: "PO-2024-1070", supplier: "Atlas Supply Sdn Bhd", date: "2024-08-29", receivedBy: "Norhana Binti Ali", status: "partial", items: 5, qtyOrdered: 200, qtyReceived: 85 },
]

function statusConfig(status: string) {
  switch (status) {
    case "received": return { badge: "success" as const, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "RECEIVED" }
    case "partial": return { badge: "warning" as const, icon: Loader2, color: "text-amber-400", bg: "bg-amber-500/10", label: "PARTIAL" }
    case "rejected": return { badge: "destructive" as const, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "REJECTED" }
    default: return { badge: "secondary" as const, icon: Clock, color: "text-muted-foreground", bg: "bg-secondary", label: "PENDING" }
  }
}

type GRN = typeof grns[0]

export default function GRNPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selected, setSelected] = useState<GRN | null>(null)

  const filtered = grns.filter((grn) => {
    const matchFilter = activeFilter === "All" || grn.status.toLowerCase() === activeFilter.toLowerCase()
    const matchSearch =
      grn.id.toLowerCase().includes(search.toLowerCase()) ||
      grn.supplier.toLowerCase().includes(search.toLowerCase()) ||
      grn.po.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const receiveRate = Math.round((grns.filter(g => g.status === "received").length / grns.length) * 100)

  if (selected) {
    const cfg = statusConfig(selected.status)
    const pct = selected.qtyOrdered > 0 ? Math.round((selected.qtyReceived / selected.qtyOrdered) * 100) : 0
    return (
      <div className="flex flex-col min-h-full bg-background">
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 pt-12 pb-4">
          <button onClick={() => setSelected(null)} className="text-xs text-primary mb-2">← Back to GRN</button>
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
              ["PO Reference", selected.po],
              ["GRN Date", selected.date],
              ["Received By", selected.receivedBy],
              ["Line Items", `${selected.items} items`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-sm text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest font-mono">Quantity Summary</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ordered</span>
              <span className="font-mono text-sm font-semibold text-foreground">{selected.qtyOrdered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Received</span>
              <span className={`font-mono text-sm font-semibold ${cfg.color}`}>{selected.qtyReceived}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${selected.status === "rejected" ? "bg-red-500" : selected.status === "received" ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="font-mono text-xs text-muted-foreground">{pct}% fulfillment</p>
          </div>

          {selected.status === "pending" && (
            <Button className="w-full">Process Receipt</Button>
          )}
          {selected.status === "partial" && (
            <Button className="w-full">Complete Receipt</Button>
          )}
          <Button className="w-full" variant="outline">Print GRN</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="GRN" subtitle="Goods Received Notes" />

      <div className="px-4 pt-4 pb-2 space-y-3 sticky top-[76px] z-10 bg-background">
        {/* Summary */}
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">MTD Receive Rate</span>
            <span className="font-mono text-xs text-primary font-semibold">{receiveRate}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" style={{ width: `${receiveRate}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-muted-foreground">{grns.filter(g => g.status === "received").length} fully received</span>
            <span className="font-mono text-[10px] text-muted-foreground">{grns.length} total GRNs</span>
          </div>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search GRN, PO or supplier..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollable pb-0.5">
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
            <ClipboardList size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No GRNs found</p>
          </div>
        )}
        {filtered.map((grn) => {
          const cfg = statusConfig(grn.status)
          const Icon = cfg.icon
          const pct = grn.qtyOrdered > 0 ? Math.round((grn.qtyReceived / grn.qtyOrdered) * 100) : 0
          return (
            <button
              key={grn.id}
              onClick={() => setSelected(grn)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-left active:bg-secondary transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <Icon size={15} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-mono text-xs text-foreground font-medium">{grn.id}</span>
                  <Badge variant={cfg.badge}>{cfg.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{grn.supplier}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${grn.status === "rejected" ? "bg-red-500" : grn.status === "received" ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">{pct}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{grn.po} · {grn.date}</p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
