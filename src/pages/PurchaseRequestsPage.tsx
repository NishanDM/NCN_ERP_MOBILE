import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, FileBarChart, Plus, Clock, CheckCircle2, AlertTriangle, ChevronRight, X, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Mock data for Purchase Requests
const initialPurchaseRequests = [
  {
    id: "PR-2024-0042",
    requestedBy: "Siti Norhanna",
    department: "IT Infrastructure",
    date: "2024-09-24",
    estimatedCost: "RM 15,400",
    status: "pending",
    itemsCount: 5,
    purpose: "Server Room UPS Upgrade & Power Distribution Units",
    items: [
      { name: "3000VA Rackmount UPS", qty: 2, estimatedUnitPrice: "RM 5,200" },
      { name: "Smart PDU 16A", qty: 3, estimatedUnitPrice: "RM 1,666" }
    ]
  },
  {
    id: "PR-2024-0041",
    requestedBy: "Ahmad Razak",
    department: "Warehouse Operations",
    date: "2024-09-22",
    estimatedCost: "RM 8,200",
    status: "approved",
    itemsCount: 12,
    purpose: "Handheld Barcode Scanners for Inventory Check",
    items: [
      { name: "Wireless 2D Scanner", qty: 10, estimatedUnitPrice: "RM 600" },
      { name: "Heavy Duty Scanner Docks", qty: 2, estimatedUnitPrice: "RM 1,100" }
    ]
  },
  {
    id: "PR-2024-0040",
    requestedBy: "Kevin Tan",
    department: "Finance & Accounting",
    date: "2024-09-20",
    estimatedCost: "RM 24,000",
    status: "approved",
    itemsCount: 8,
    purpose: "Workstation Laptops for New Finance Trainees",
    items: [
      { name: "Core i7 Business Laptops 16GB RAM", qty: 6, estimatedUnitPrice: "RM 4,000" }
    ]
  },
  {
    id: "PR-2024-0038",
    requestedBy: "Mei Ling Lim",
    department: "Administration",
    date: "2024-09-18",
    estimatedCost: "RM 3,500",
    status: "rejected",
    itemsCount: 3,
    purpose: "Executive Ergonomic Chairs Replacement",
    items: [
      { name: "Ergonomic Mesh Office Chair", qty: 3, estimatedUnitPrice: "RM 1,166" }
    ]
  }
]

export default function PurchaseRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(initialPurchaseRequests)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  
  // Expanded item state
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Modal dialog state for Create PR
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requestedBy, setRequestedBy] = useState("")
  const [department, setDepartment] = useState("")
  const [purpose, setPurpose] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")

  // Submit handler for new PR
  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestedBy || !purpose) return

    const newPrId = `PR-2024-${String(requests.length + 43).padStart(4, "0")}`
    const newPr = {
      id: newPrId,
      requestedBy,
      department: department || "General Dept",
      date: new Date().toISOString().split("T")[0],
      estimatedCost: estimatedCost.startsWith("RM") ? estimatedCost : `RM ${estimatedCost || "0"}`,
      status: "pending",
      itemsCount: 1,
      purpose,
      items: [{ name: purpose, qty: 1, estimatedUnitPrice: estimatedCost }]
    }

    setRequests([newPr, ...requests])
    setIsModalOpen(false)
    setRequestedBy("")
    setDepartment("")
    setPurpose("")
    setEstimatedCost("")
  }

  // Filter requests by search and status
  const filteredRequests = requests.filter((pr) => {
    const matchesSearch =
      pr.id.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()) ||
      pr.purpose.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || pr.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Purchase Requests"
        subtitle="Requisitions & Approval Workflow"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-4">
        {/* Header Search & Create PR Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search PR #, requester, dept..."
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
            <span>Create PR</span>
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "pending", "approved", "rejected"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize shrink-0 transition-colors ${
                filter === key ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Purchase Requests List */}
        <div className="space-y-2.5">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileBarChart size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No purchase requests found</p>
            </div>
          ) : (
            filteredRequests.map((pr) => {
              const isExpanded = expandedId === pr.id
              return (
                <div key={pr.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : pr.id)}
                    className="p-4 cursor-pointer hover:bg-secondary/40 active:bg-secondary/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-foreground">{pr.id}</span>
                        <Badge
                          variant={
                            pr.status === "approved"
                              ? "success"
                              : pr.status === "rejected"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {pr.status.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="font-mono text-sm font-semibold text-primary">{pr.estimatedCost}</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-foreground font-medium">{pr.purpose}</p>
                      <div className="flex items-center justify-between text-muted-foreground text-[11px] font-mono pt-1">
                        <span>By: {pr.requestedBy} ({pr.department})</span>
                        <span>{pr.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded PR Item List */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-secondary/20 space-y-2">
                      <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                        Requested Items Detail
                      </p>
                      <div className="space-y-1.5">
                        {pr.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-card px-3 py-2 rounded-md border border-border/60"
                          >
                            <span className="text-foreground font-medium">{item.name}</span>
                            <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                              <span>Qty: {item.qty}</span>
                              <span className="text-primary">{item.estimatedUnitPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal for Creating Purchase Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <FileBarChart size={18} className="text-primary" />
                New Purchase Request
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePr} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Requester Name</label>
                <Input
                  required
                  placeholder="e.g. Siti Norhanna"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Department</label>
                <Input
                  placeholder="e.g. IT / Operations"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Request Purpose / Description</label>
                <Input
                  required
                  placeholder="e.g. 5x Wireless Barcode Scanners"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Estimated Total Cost (RM)</label>
                <Input
                  placeholder="e.g. 12500"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
