import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import BottomNav from "@/components/BottomNav"
import DashboardPage from "@/pages/DashboardPage"
import StockPage from "@/pages/StockPage"
import InvoicePage from "@/pages/InvoicePage"
import GRNPage from "@/pages/GRNPage"
import MorePage from "@/pages/MorePage"
import UserLoginPage from "./pages/UserLoginPage"

import { ROUTES } from "./routes/approutes"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="flex items-start justify-center min-h-full bg-[#030508]">
      <div className="relative w-full max-w-[430px] min-h-full bg-background overflow-hidden">
        {isLoggedIn ? (
          <div className="min-h-full">
             <Routes>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.STOCK} element={<StockPage />} />
              <Route path={ROUTES.INVOICES} element={<InvoicePage />} />
              <Route path={ROUTES.GRN} element={<GRNPage />} />
              <Route path={ROUTES.MORE} element={<MorePage />} />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </div>
        ) : (
          <UserLoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
        {isLoggedIn && <BottomNav />}
      </div>
    </div>
  )
}