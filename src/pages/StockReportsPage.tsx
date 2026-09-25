import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Package,
  Cpu,
  Monitor,
  HardDrive,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Computer Shop stock items mock data
const computerShopStockItems = [
  { id: "SKU-PC-001", name: "ASUS ROG Strix Gaming Laptop 16\"", category: "Laptops", qty: 24, unitPrice: "RM 6,499", stockValue: "RM 155,976", status: "In Stock" },
  { id: "SKU-PC-002", name: "NVIDIA RTX 4080 Super 16GB GPU", category: "Graphic Cards", qty: 12, unitPrice: "RM 4,899", stockValue: "RM 58,788", status: "In Stock" },
  { id: "SKU-PC-003", name: "Samsung Odyssey G7 32\" 240Hz Monitor", category: "Monitors", qty: 18, unitPrice: "RM 2,399", stockValue: "RM 43,182", status: "In Stock" },
  { id: "SKU-PC-004", name: "Corsair Vengeance DDR5 32GB (2x16GB) RAM", category: "Memory", qty: 65, unitPrice: "RM 599", stockValue: "RM 38,935", status: "In Stock" },
  { id: "SKU-PC-005", name: "Samsung 990 PRO 2TB NVMe M.2 SSD", category: "Storage", qty: 8, unitPrice: "RM 849", stockValue: "RM 6,792", status: "Low Stock" },
  { id: "SKU-PC-006", name: "Intel Core i9-14900K Processor", category: "Processors", qty: 15, unitPrice: "RM 2,799", stockValue: "RM 41,985", status: "In Stock" },
  { id: "SKU-PC-007", name: "Logitech G Pro X Superlight 2 Mouse", category: "Peripherals", qty: 42, unitPrice: "RM 659", stockValue: "RM 27,678", status: "In Stock" },
  { id: "SKU-PC-008", name: "Razer BlackWidow V4 Mechanical Keyboard", category: "Peripherals", qty: 3, unitPrice: "RM 799", stockValue: "RM 2,397", status: "Low Stock" }
]

// Stock category distribution for visual Bar/Pie chart graph simulation
const categoryDistribution = [
  { category: "Laptops & Systems", percentage: 40, value: "RM 155,976", color: "bg-primary" },
  { category: "Graphic Cards & GPUs", percentage: 25, value: "RM 58,788", color: "bg-blue-500" },
  { category: "Processors & Components", percentage: 18, value: "RM 41,985", color: "bg-violet-500" },
  { category: "Storage & Memory", percentage: 12, value: "RM 45,727", color: "bg-emerald-500" },
  { category: "Monitors & Peripherals", percentage: 5, value: "RM 73,257", color: "bg-amber-500" }
]

export default function StockReportsPage() {
  const navigate = useNavigate()
  const [downloadToast, setDownloadToast] = useState<string | null>(null)
  const [selectedChartTab, setSelectedChartTab] = useState<"bar" | "pie">("bar")

  // Generate Report Toast Handler
  const handleGenerateReport = (type: "PDF" | "Excel") => {
    setDownloadToast(`Generating and downloading ${type} stock report...`)
    setTimeout(() => setDownloadToast(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Stock Reports"
        subtitle="Computer Shop Inventory & Analytics"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Export Buttons: Generate PDF & Generate Excel */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleGenerateReport("PDF")}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 gap-2 h-11"
          >
            <FileText size={16} />
            <span>Generate PDF</span>
          </Button>

          <Button
            onClick={() => handleGenerateReport("Excel")}
            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 gap-2 h-11"
          >
            <FileSpreadsheet size={16} />
            <span>Generate Excel</span>
          </Button>
        </div>

        {/* Download Feedback Notification Toast */}
        {downloadToast && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Visual Charts Section (Bar Chart & Category Distribution Graph) */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                  Stock Category Distribution
                </h3>
              </div>
              <div className="flex gap-1 bg-secondary p-1 rounded-lg">
                <button
                  onClick={() => setSelectedChartTab("bar")}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded ${
                    selectedChartTab === "bar" ? "bg-primary text-white" : "text-muted-foreground"
                  }`}
                >
                  Bar Graph
                </button>
                <button
                  onClick={() => setSelectedChartTab("pie")}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded ${
                    selectedChartTab === "pie" ? "bg-primary text-white" : "text-muted-foreground"
                  }`}
                >
                  Distribution
                </button>
              </div>
            </div>

            {/* Visual Bar Graphs */}
            <div className="space-y-3 pt-1">
              {categoryDistribution.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{cat.category}</span>
                    <span className="font-mono text-muted-foreground">{cat.percentage}% ({cat.value})</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Computer Shop Inventory Itemized List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              Computer Shop Stock Items ({computerShopStockItems.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {computerShopStockItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-4 space-y-2 active:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground">{item.id}</span>
                    <h4 className="font-semibold text-xs text-foreground mt-0.5">{item.name}</h4>
                    <p className="text-[11px] text-primary">{item.category}</p>
                  </div>
                  <Badge variant={item.status === "Low Stock" ? "warning" : "success"}>
                    {item.status}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Qty: <strong className="text-foreground">{item.qty} units</strong></span>
                  <span className="text-muted-foreground">Price: {item.unitPrice}</span>
                  <span className="text-primary font-semibold">{item.stockValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
