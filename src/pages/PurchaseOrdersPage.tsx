import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Package,
  FileText,
  CheckCircle2,
  X,
  Truck,
  DollarSign
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Initial mock data for Purchase Orders
const initialPurchaseOrders = [
  {
    id: "PO-2024-1102",
    supplier: "Syarikat Maju Jaya Sdn Bhd",
    date: "2024-09-12",
    amount: "RM 45,200",
    status: "open",
    itemsCount: 6,
    deliveryDate: "2024-09-28",
    itemsList: [
      { name: "Steel Beams (Grade A)", qty: 100, price: "RM 300" },
      { name: "Cement Bags (50kg)", qty: 250, price: "RM 20" },
      { name: "Safety Helmets", qty: 50, price: "RM 40" }
    ]
  },
  {
    id: "PO-2024-1098",
    supplier: "Atlas Supply Sdn Bhd",
    date: "2024-09-10",
    amount: "RM 18,500",
    status: "open",
    itemsCount: 4,
    deliveryDate: "2024-09-25",
    itemsList: [
      { name: "Power Drills (Industrial)", qty: 15, price: "RM 500" },
      { name: "Heavy Duty Extension Cables", qty: 30, price: "RM 100" }
    ]
  },
  {
    id: "PO-2024-1095",
    supplier: "Global Industrial Parts",
    date: "2024-09-08",
    amount: "RM 32,000",
    status: "open",
    itemsCount: 8,
    deliveryDate: "2024-09-30",
    itemsList: [
      { name: "Hydraulic Pumps", qty: 4, price: "RM 5,000" },
      { name: "Rubber Gaskets Set", qty: 100, price: "RM 120" }
    ]
  },
  {
    id: "PO-2024-1090",
    supplier: "Bumi Resources Bhd",
    date: "2024-09-05",
    amount: "RM 12,400",
    status: "fulfilled",
    itemsCount: 2,
    deliveryDate: "2024-09-15",
    itemsList: [
      { name: "Corrugated Packing Boxes", qty: 500, price: "RM 15" }
    ]
  },
  {
    id: "PO-2024-1085",
    supplier: "Maju Teknik Sdn Bhd",
    date: "2024-09-01",
    amount: "RM 28,900",
    status: "fulfilled",
    itemsCount: 7,
    deliveryDate: "2024-09-10",
    itemsList: [
      { name: "Circuit Breakers (3-Phase)", qty: 20, price: "RM 800" }
    ]
  }
]

export default function PurchaseOrdersPage() {
  const navigate = useNavigate()
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "open" | "fulfilled" | "cancelled">("all")
  
  // Track expanded PO card ID
  const [expandedPoId, setExpandedPoId] = useState<string | null>(null)

  // State for Create PO Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newDeliveryDate, setNewDeliveryDate] = useState("")
  const [newItemsCount, setNewItemsCount] = useState("1")

  // Toggle card expansion
  const toggleExpand = (id: string) => {
    setExpandedPoId(expandedPoId === id ? null : id)
  }

  // Handle new PO creation submit
  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSupplier || !newAmount) return

    const newPoId = `PO-2024-${Math.floor(1000 + Math.random() * 9000)}`
    const newPoItem = {
      id: newPoId,
      supplier: newSupplier,
      date: new Date().toISOString().split("T")[0],
      amount: newAmount.startsWith("RM") ? newAmount : `RM ${newAmount}`,
      status: "open",
      itemsCount: parseInt(newItemsCount) || 1,
      deliveryDate: newDeliveryDate || "TBD",
      itemsList: [
        { name: "General Procurement Item", qty: parseInt(newItemsCount) || 1, price: newAmount }
      ]
    }

    setPurchaseOrders([newPoItem, ...purchaseOrders])
    setIsModalOpen(false)
    setNewSupplier("")
    setNewAmount("")
    setNewDeliveryDate("")
    setNewItemsCount("1")
  }

  // Filter purchase orders based on search query and selected filter
  const filteredOrders = purchaseOrders.filter((order) => {
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
        {/* Top Header Action Bar with + Create PO Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search PO # or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-primary text-primary-foreground gap-1.5 font-medium text-xs px-3.5 h-10 rounded-xl"
          >
            <Plus size={16} />
            <span>Create PO</span>
          </Button>
        </div>

        {/* Filter Status Chips */}
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

        {/* Purchase Orders Bar List */}
        <div className="space-y-2.5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No purchase orders found</p>
            </div>
          ) : (
            filteredOrders.map((po) => {
              const isExpanded = expandedPoId === po.id
              return (
                <div
                  key={po.id}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
                >
                  {/* Clickable Bar Header */}
                  <div
                    onClick={() => toggleExpand(po.id)}
                    className="p-4 cursor-pointer hover:bg-secondary/40 active:bg-secondary/60 transition-colors space-y-2"
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-primary">{po.amount}</span>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={16} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <p className="text-foreground font-medium truncate flex-1 pr-2">{po.supplier}</p>
                      <span className="text-[11px] text-muted-foreground font-mono">{po.date}</span>
                    </div>
                  </div>

                  {/* Expanded Purchase Order Details View */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-secondary/20 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-mono bg-card p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-1.5">
                          <Package size={13} className="text-primary" />
                          <span>Items Count: {po.itemsCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-blue-400" />
                          <span>Delivery: {po.deliveryDate}</span>
                        </div>
                      </div>

                      {/* Items breakdown list */}
                      <div>
                        <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-2">
                          Order Items Breakdown
                        </p>
                        <div className="space-y-1.5">
                          {po.itemsList?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-card px-3 py-2 rounded-md border border-border/60"
                            >
                              <span className="text-foreground font-medium truncate">{item.name}</span>
                              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                                <span>Qty: {item.qty}</span>
                                <span className="text-primary">{item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Create PO Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                Create Purchase Order
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Supplier Name</label>
                <Input
                  required
                  placeholder="e.g. Syarikat Maju Jaya Sdn Bhd"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Total Amount (RM)</label>
                  <Input
                    required
                    placeholder="e.g. 25000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Items Count</label>
                  <Input
                    type="number"
                    min="1"
                    value={newItemsCount}
                    onChange={(e) => setNewItemsCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Expected Delivery Date</label>
                <Input
                  type="date"
                  value={newDeliveryDate}
                  onChange={(e) => setNewDeliveryDate(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Submit PO
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
