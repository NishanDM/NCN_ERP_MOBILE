import { useState } from "react"
import { Search, SlidersHorizontal, Package, ChevronRight, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"

const categories = ["All", "Raw Material", "Packaging", "Finished", "Spare Parts"]

const stockItems = [
  { code: "RM-001-A", name: "Aluminium Sheet 1.5mm", category: "Raw Material", qty: 842, unit: "pcs", location: "WHB-R1-03", value: 12630, reorder: 200, status: "ok" },
  { code: "RM-002-B", name: "Mild Steel Rod 12mm", category: "Raw Material", qty: 56, unit: "kg", location: "WHB-R2-01", value: 2800, reorder: 100, status: "low" },
  { code: "PKG-010", name: "Cardboard Box 40x30x20", category: "Packaging", qty: 2400, unit: "pcs", location: "WHA-P1-02", value: 1440, reorder: 500, status: "ok" },
  { code: "FG-024-C", name: "Control Panel Unit v3", category: "Finished", qty: 14, unit: "unit", location: "FGW-A1-01", value: 84000, reorder: 20, status: "low" },
  { code: "SP-088", name: "Bearing 6205ZZ", category: "Spare Parts", qty: 0, unit: "pcs", location: "MRO-B2-04", value: 0, reorder: 10, status: "out" },
  { code: "RM-015-D", name: "Copper Wire 2.5mm²", category: "Raw Material", qty: 320, unit: "m", location: "WHB-R3-07", value: 6400, reorder: 50, status: "ok" },
  { code: "PKG-022", name: "Bubble Wrap Roll 50m", category: "Packaging", qty: 8, unit: "roll", location: "WHA-P2-01", value: 320, reorder: 15, status: "low" },
  { code: "FG-031-A", name: "Switchgear Module 400A", category: "Finished", qty: 3, unit: "unit", location: "FGW-B1-02", value: 45000, reorder: 5, status: "ok" },
  { code: "SP-102", name: "V-Belt B56", category: "Spare Parts", qty: 24, unit: "pcs", location: "MRO-A1-08", value: 720, reorder: 10, status: "ok" },
  { code: "RM-007-E", name: "PVC Insulation Tape 18mm", category: "Raw Material", qty: 0, unit: "roll", location: "WHB-R4-02", value: 0, reorder: 50, status: "out" },
]

function statusBadge(status: string) {
  if (status === "ok") return <Badge variant="success">OK</Badge>
  if (status === "low") return <Badge variant="warning">LOW</Badge>
  return <Badge variant="destructive">OUT</Badge>
}

export default function StockPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<typeof stockItems[0] | null>(null)

  const filtered = stockItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (selectedItem) {
    return (
      <div className="flex flex-col min-h-full bg-background">
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 pt-12 pb-4">
          <button onClick={() => setSelectedItem(null)} className="text-xs text-primary mb-2 flex items-center gap-1">
            ← Back to Stock
          </button>
          <h1 className="text-base font-semibold">{selectedItem.name}</h1>
          <p className="font-mono text-xs text-muted-foreground">{selectedItem.code}</p>
        </div>
        <div className="flex-1 scrollable overflow-y-auto px-4 py-4 pb-28 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {statusBadge(selectedItem.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-mono text-sm font-semibold text-foreground">{selectedItem.qty.toLocaleString()} {selectedItem.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reorder Level</span>
              <span className="font-mono text-sm text-foreground">{selectedItem.reorder} {selectedItem.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="font-mono text-sm text-foreground">{selectedItem.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm text-foreground">{selectedItem.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stock Value</span>
              <span className="font-mono text-sm font-semibold text-emerald-400">RM {selectedItem.value.toLocaleString()}</span>
            </div>
          </div>
          {selectedItem.status !== "ok" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
              <TrendingDown size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-400">Stock Alert</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedItem.status === "out" ? "Item is out of stock. Initiate purchase order immediately." : "Stock below reorder level. Consider raising a PO."}
                </p>
              </div>
            </div>
          )}
          <Button className="w-full" variant="outline">Raise Purchase Order</Button>
          <Button className="w-full" variant="ghost">View Movement History</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Stock" subtitle={`${stockItems.length} SKUs tracked`} />

      <div className="px-4 pt-4 pb-2 space-y-3 sticky top-[76px] z-10 bg-background">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollable">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 pt-2 scrollable overflow-y-auto space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No items found</p>
          </div>
        )}
        {filtered.map((item) => (
          <button
            key={item.code}
            onClick={() => setSelectedItem(item)}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-left active:bg-secondary transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package size={15} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
                {statusBadge(item.status)}
              </div>
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono text-xs text-foreground">{item.qty.toLocaleString()} {item.unit}</span>
                <span className="text-[10px] text-muted-foreground">{item.location}</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
