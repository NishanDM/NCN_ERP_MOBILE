import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart3, Download, TrendingUp, TrendingDown, AlertTriangle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Stock report summary metric definitions
const reportMetrics = [
  { label: "Total Inventory Value", value: "RM 1,247,850", change: "+4.2%", positive: true },
  { label: "Total SKUs Tracked", value: "1,248", change: "+12 items", positive: true },
  { label: "Low Stock Items", value: "7", change: "-2 from last week", positive: true },
  { label: "Dead Stock Items", value: "3", change: "Action required", positive: false },
]

// Category stock distribution
const categoryStock = [
  { category: "Raw Materials", totalValue: "RM 540,200", itemPercentage: 43 },
  { category: "Finished Goods", totalValue: "RM 380,150", itemPercentage: 30 },
  { category: "Hardware & Tools", totalValue: "RM 185,500", itemPercentage: 15 },
  { category: "Packaging", totalValue: "RM 142,000", itemPercentage: 12 },
]

export default function StockReportsPage() {
  const navigate = useNavigate()
  const [reportPeriod, setReportPeriod] = useState<"this-month" | "last-month" | "quarter">("this-month")

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Stock Reports"
        subtitle="Inventory Analytics & Valuations"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Period selection & Export options */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 bg-secondary p-1 rounded-xl">
            {(["this-month", "last-month", "quarter"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  reportPeriod === period ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {period === "this-month" ? "This Month" : period === "last-month" ? "Last Month" : "Q3 2024"}
              </button>
            ))}
          </div>

          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Download size={14} /> Export
          </Button>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          {reportMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-3.5">
                <p className="text-[10px] text-muted-foreground mb-1">{metric.label}</p>
                <p className="font-mono text-lg font-bold text-foreground">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px]">
                  {metric.positive ? (
                    <TrendingUp size={11} className="text-emerald-400" />
                  ) : (
                    <AlertTriangle size={11} className="text-amber-400" />
                  )}
                  <span className={metric.positive ? "text-emerald-400" : "text-amber-400"}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Breakdown Section */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">
            Category Breakdown
          </h3>
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            {categoryStock.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{cat.category}</span>
                  <span className="font-mono text-muted-foreground">{cat.totalValue}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cat.itemPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
