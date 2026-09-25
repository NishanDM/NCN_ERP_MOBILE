import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileBarChart, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Summary indicators for Goods Received Notes
const grnKpis = [
  { label: "Total Received MTD", value: "89 GRNs", color: "text-emerald-400" },
  { label: "Fully Received", value: "68", color: "text-primary" },
  { label: "Partially Received", value: "14", color: "text-amber-400" },
  { label: "Rejected / Pending", value: "7", color: "text-red-400" },
]

// Detailed receiving logs by warehouse
const warehouseReceiving = [
  { warehouse: "Warehouse A (Central Shah Alam)", totalGrn: 45, itemsReceived: 1420, passRate: "98.5%" },
  { warehouse: "Warehouse B (Klang Logistics)", totalGrn: 28, itemsReceived: 890, passRate: "96.2%" },
  { warehouse: "Warehouse C (Subang Depot)", totalGrn: 16, itemsReceived: 450, passRate: "99.0%" },
]

export default function GRNSummaryPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="GRN Summary"
        subtitle="Goods Received Note Performance"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* KPI Summary Matrix */}
        <div className="grid grid-cols-2 gap-3">
          {grnKpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-3.5">
                <p className="text-[10px] text-muted-foreground mb-1">{kpi.label}</p>
                <p className={`font-mono text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Receiving Progress */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Monthly Receiving Fulfillment Rate</span>
              <span className="font-mono text-primary font-bold">92.4%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-[92.4%] rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              82 of 89 GRNs fully inspected and checked into inventory.
            </p>
          </CardContent>
        </Card>

        {/* Warehouse Level Breakdown */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">
            Receiving By Location
          </h3>
          <div className="space-y-2.5">
            {warehouseReceiving.map((wh) => (
              <div
                key={wh.warehouse}
                className="rounded-xl border border-border bg-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-foreground">{wh.warehouse}</h4>
                  <Badge variant="success">Pass: {wh.passRate}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Processed: {wh.totalGrn} GRNs</span>
                  <span>Items: {wh.itemsReceived} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
