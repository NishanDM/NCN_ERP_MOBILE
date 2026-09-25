export const ROUTES = {
  // --- Auth ---
  LOGIN: "/login",

  // --- Bottom-nav tabs ---
  DASHBOARD: "/dashboard",
  STOCK: "/stock",
  INVOICES: "/invoices",
  GRN: "/grn",
  MORE: "/more",

  // --- Pushed screens ---
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_CHANGE_EMAIL: "/profile/change-email",
  PROFILE_CHANGE_PASSWORD: "/profile/change-password",

  // --- Procurement & Administration ---
  PURCHASE_ORDERS: "/purchase_orders",
  PURCHASE_REQUESTS: "/purchase_requests",
  SUPPLIERS: "/suppliers",
  STOCK_REPORTS: "/stock-reports",
  GRN_SUMMARY: "/grn-summary",
  USER_MANAGEMENT: "/user-management",
  SYSTEM_SETTINGS: "/system-settings",
  HELP_SUPPORT: "/help-support",
} as const;

export type MobileRoute = (typeof ROUTES)[keyof typeof ROUTES];

// -----------------------------------------------------------------------------
// 2. BOTTOM-NAV TAB ORDER
// -----------------------------------------------------------------------------

export type TabKey = "dashboard" | "stock" | "invoices" | "grn" | "more";

export interface TabRouteEntry {
  key: TabKey;
  path: MobileRoute;
  label: string;
}

export const TAB_ROUTE_ORDER: TabRouteEntry[] = [
  { key: "dashboard", path: ROUTES.DASHBOARD, label: "Home" },
  { key: "stock", path: ROUTES.STOCK, label: "Stock" },
  { key: "invoices", path: ROUTES.INVOICES, label: "Invoices" },
  { key: "grn", path: ROUTES.GRN, label: "GRN" },
  { key: "more", path: ROUTES.MORE, label: "More" },
];

// -----------------------------------------------------------------------------
// 3. ACTIVE-TAB RESOLUTION
// -----------------------------------------------------------------------------

export function getActiveTabFromPath(pathname: string): TabKey {
  if (pathname.startsWith(ROUTES.PROFILE)) return "more";

  const match = TAB_ROUTE_ORDER.find((tab) => pathname.startsWith(tab.path));
  return match ? match.key : "dashboard";
}

export default ROUTES;