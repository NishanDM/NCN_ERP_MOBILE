import { useState } from "react"
import BottomNav, { type TabKey } from "@/components/BottomNav"
import DashboardPage from "@/pages/DashboardPage"
import StockPage from "@/pages/StockPage"
import InvoicePage from "@/pages/InvoicePage"
import GRNPage from "@/pages/GRNPage"
import MorePage from "@/pages/MorePage"
import UserLoginPage from "./pages/UserLoginPage"

import approutes from './routes/approutes'

function renderPage(tab: TabKey) {
  switch (tab) {
    case "dashboard": return <DashboardPage />
    case "stock": return <StockPage />
    case "invoices": return <InvoicePage />
    case "grn": return <GRNPage />
    case "more": return <MorePage />
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")

  return (
    <div className="flex items-start justify-center min-h-full bg-[#030508]">
      <div className="relative w-full max-w-[430px] min-h-full bg-background overflow-hidden">
        {isLoggedIn ? (
          <div className="min-h-full">
            {renderPage(activeTab)}
          </div>
        ) : (
          <UserLoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
        {isLoggedIn && <BottomNav active={activeTab} onChange={setActiveTab} />}
      </div>
    </div>
  )
}