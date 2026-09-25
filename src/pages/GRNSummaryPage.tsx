import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileBarChart, CheckCircle2, Clock, Plus, X, Package, ClipboardList, Loader2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Initial mock Goods Received Notes list
const initialGrnList = [
  {
    id: "GRN-2024-0891",
    po: "PO-2024-1102",
    supplier: "Syarikat Maju Jaya Sdn Bhd",
    date: "2024-09-10",
    receivedBy: "Azman Bin Yusof",
    status: "received",
    items: 6,
    qtyOrdered: 240,
    qtyReceived: 240
  },
  {
    id: "GRN-2024-0890",
    po: "PO-2024-1098",
    supplier: "Atlas Supply Sdn Bhd",
    date: "2024-09-09",
    receivedBy: "Norhana Binti Ali",
    status: "partial",
    items: 4,
    qtyOrdered: 180,
    qtyReceived: 120
  },
  {
    id: "GRN-2024-0888",
    po: "PO-2024-1095",
    supplier: "Global Industrial Parts",
    date: "2024-09-08",
    receivedBy: "Pending Inspection",
    status: "pending",
    items: 8,
    qtyOrdered: 400,
    qtyReceived: 0
  },
  {
    id: "GRN-2024-0885",
    po: "PO-2024-1090",
    supplier: "Bumi Resources Bhd",
    date: "2024-09-07",
    receivedBy: "Razif Bin Hassan",
    status: "rejected",
    items: 2,
    qtyOrdered: 50,
    qtyReceived: 0
  }
]

export default function GRNSummaryPage() {
  const navigate = useNavigate()
  const [grnList, setGrnList] = useState(initialGrnList)

  // Create GRN modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [poNumber, setPoNumber] = useState("")
  const [supplier, setSupplier] = useState("")
  const [itemsCount, setItemsCount] = useState("1")
  const [qtyOrdered, setQtyOrdered] = useState("100")
  const [qtyReceived, setQtyReceived] = useState("100")
  const [status, setStatus] = useState<"received" | "partial" | "pending" | "rejected">("received")

  // Create GRN Submit Handler
  const handleCreateGrn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!poNumber || !supplier) return

    const newGrnId = `GRN-2024-${Math.floor(1000 + Math.random() * 9000)}`
    const newGrn = {
      id: newGrnId,
      po: poNumber.startsWith("PO-") ? poNumber : `PO-${poNumber}`,
      supplier,
      date: new Date().toISOString().split("T")[0],
      receivedBy: "Current Inspector",
      status,
      items: parseInt(itemsCount) || 1,
      qtyOrdered: parseInt(qtyOrdered) || 100,
      qtyReceived: parseInt(qtyReceived) || 100
    }

    setGrnList([newGrn, ...grnList])
    setIsModalOpen(false)
    setPoNumber("")
    setSupplier("")
    setItemsCount("1")
    setQtyOrdered("100")
    setQtyReceived("100")
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="GRN Summary"
        subtitle="Goods Received Note Overview"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Action Bar with + Create New GRN Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Receiving Log Records
            </h3>
            <p className="text-[11px] text-muted-foreground">{grnList.length} GRNs recorded</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground gap-1.5 font-medium text-xs px-3.5 h-10 rounded-xl"
          >
            <Plus size={16} />
            <span>Create New GRN</span>
          </Button>
        </div>

        {/* Existing GRNs List */}
        <div className="space-y-3">
          {grnList.map((grn) => (
            <div
              key={grn.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3 active:bg-secondary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">{grn.id}</span>
                    <Badge
                      variant={
                        grn.status === "received"
                          ? "success"
                          : grn.status === "rejected"
                          ? "destructive"
                          : grn.status === "partial"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {grn.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-primary mt-1 font-medium">{grn.po}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{grn.date}</span>
              </div>

              <div className="pt-2 border-t border-border/50 text-xs space-y-1">
                <p className="text-foreground font-medium">{grn.supplier}</p>
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Received By: {grn.receivedBy}</span>
                  <span>Qty: {grn.qtyReceived} / {grn.qtyOrdered}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New GRN Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <ClipboardList size={18} className="text-primary" />
                Create New GRN
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGrn} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">PO Number</label>
                <Input
                  required
                  placeholder="e.g. PO-2024-1105"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Supplier Name</label>
                <Input
                  required
                  placeholder="e.g. Atlas Supply Sdn Bhd"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Ordered Qty</label>
                  <Input
                    type="number"
                    value={qtyOrdered}
                    onChange={(e) => setQtyOrdered(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Received Qty</label>
                  <Input
                    type="number"
                    value={qtyReceived}
                    onChange={(e) => setQtyReceived(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Receiving Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
                >
                  <option value="received">Received (Full)</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Save GRN
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
