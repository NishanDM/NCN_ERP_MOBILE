import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ShoppingCart, ChevronRight, CheckCircle2, Clock, AlertTriangle, Filter, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Mock data for Purchase Orders
const mockPurchaseOrders = [
  { id: "PO-2024-1102", supplier: "Syarikat Maju Jaya Sdn Bhd", date: "2024-09-12", amount: "RM 45,200", status: "open", itemsCount: 6, deliveryDate: "2024-09-28" },
  { id: "PO-2024-1098", supplier: "Atlas Supply Sdn Bhd", date: "2024-09-10", amount: "RM 18,500", status: "open", itemsCount: 4, deliveryDate: "2024-09-25" },
  { id: "PO-2024-1095", supplier: "Global Industrial Parts", date: "2024-09-08", amount: "RM 32,000", status: "open", itemsCount: 8, deliveryDate: "2024-09-30" },
  { id: "PO-2024-1090", supplier: "Bumi Resources Bhd", date: "2024-09-05", amount: "RM 12,400", status: "fulfilled", itemsCount: 2, deliveryDate: "2024-09-15" },
  { id: "PO-2024-1085", supplier: "Maju Teknik Sdn Bhd", date: "2024-09-01", amount: "RM 28,900", status: "fulfilled", itemsCount: 7, deliveryDate: "2024-09-10" },
  { id: "PO-2024-1080", supplier: "Kejuruteraan Bersatu", date: "2024-08-28", amount: "RM 64,100", status: "open", itemsCount: 12, deliveryDate: "2024-10-05" },
  { id: "PO-2024-1075", supplier: "Trans-Asia Logistics", date: "2024-08-25", amount: "RM 9,800", status: "cancelled", itemsCount: 1, deliveryDate: "2024-09-01" },
]

export default function PurchaseOrdersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "open" | "fulfilled" | "cancelled">("all")

  // Filter purchase orders based on search query and selected filter
  const filteredOrders = mockPurchaseOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.supplier.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || order.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Purchase Orders"
        subtitle="Manage and track procurement POs"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-4">
        {/* Search and Action Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search PO # or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="icon" className="shrink-0 bg-primary">
            <Plus size={18} />
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "open", "fulfilled", "cancelled"] as const).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilter(statusKey)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize shrink-0 transition-colors ${
                filter === statusKey ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {statusKey}
            </button>
          ))}
        </div>

        {/* Purchase Orders List */}
        <div className="space-y-2.5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No purchase orders found</p>
            </div>
          ) : (
            filteredOrders.map((po) => (
              <div
                key={po.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 active:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">{po.id}</span>
                    <Badge
                      variant={
                        po.status === "fulfilled"
                          ? "success"
                          : po.status === "cancelled"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {po.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="font-mono text-sm font-semibold text-primary">{po.amount}</span>
                </div>

                <div className="text-xs space-y-1 text-muted-foreground">
                  <p className="text-foreground font-medium truncate">{po.supplier}</p>
                  <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                    <span>Items: {po.itemsCount}</span>
                    <span>Expected: {po.deliveryDate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
