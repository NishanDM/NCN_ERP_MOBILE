import { useCallback, useState } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import BottomNav from "@/components/BottomNav"
import NotificationsProvider from "@/features/notifications/NotificationsProvider"
import ProfileProvider from "@/features/profile/ProfileProvider"
import DashboardPage from "@/pages/DashboardPage"
import StockPage from "@/pages/StockPage"
import InvoicePage from "@/pages/InvoicePage"
import GRNPage from "@/pages/GRNPage"
import MorePage from "@/pages/MorePage"
import NotificationsPage from "@/pages/NotificationsPage"
import ProfilePage from "@/pages/ProfilePage"
import EditProfilePage from "@/pages/EditProfilePage"
import ChangeEmailPage from "@/pages/ChangeEmailPage"
import ChangePasswordPage from "@/pages/ChangePasswordPage"
import UserLoginPage from "./pages/UserLoginPage"
import PurchaseOrdersPage from "@/pages/PurchaseOrdersPage"
import SuppliersPage from "@/pages/SuppliersPage"
import StockReportsPage from "@/pages/StockReportsPage"
import GRNSummaryPage from "@/pages/GRNSummaryPage"
import UserManagementPage from "@/pages/UserManagementPage"
import SystemSettingsPage from "@/pages/SystemSettingsPage"
import HelpSupportPage from "@/pages/HelpSupportPage"

import { ROUTES } from "./routes/approutes"

export default function App() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    navigate(ROUTES.LOGIN, { replace: true })
  }, [navigate])

  return (
    <div className="flex items-start justify-center min-h-full bg-[#030508]">
      <div className="relative w-full max-w-[430px] min-h-full bg-background overflow-hidden">
        {isLoggedIn ? (
          <div className="min-h-full">
            <ProfileProvider>
              <NotificationsProvider>
                <Routes>
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.STOCK} element={<StockPage />} />
                  <Route path={ROUTES.INVOICES} element={<InvoicePage />} />
                  <Route path={ROUTES.GRN} element={<GRNPage />} />
                  <Route path={ROUTES.MORE} element={<MorePage />} />
                  <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage onLogout={handleLogout} />} />
                  <Route path={ROUTES.PROFILE_EDIT} element={<EditProfilePage />} />
                  <Route path={ROUTES.PROFILE_CHANGE_EMAIL} element={<ChangeEmailPage />} />
                  <Route path={ROUTES.PROFILE_CHANGE_PASSWORD} element={<ChangePasswordPage />} />
                  <Route path={ROUTES.PURCHASE_ORDERS} element={<PurchaseOrdersPage />} />
                  <Route path={ROUTES.SUPPLIERS} element={<SuppliersPage />} />
                  <Route path={ROUTES.STOCK_REPORTS} element={<StockReportsPage />} />
                  <Route path={ROUTES.GRN_SUMMARY} element={<GRNSummaryPage />} />
                  <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagementPage />} />
                  <Route path={ROUTES.SYSTEM_SETTINGS} element={<SystemSettingsPage />} />
                  <Route path={ROUTES.HELP_SUPPORT} element={<HelpSupportPage />} />
                  <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                </Routes>
              </NotificationsProvider>
            </ProfileProvider>
          </div>
        ) : (
          <UserLoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
        {isLoggedIn && <BottomNav />}
      </div>
    </div>
  )
}