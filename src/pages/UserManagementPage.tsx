import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Users, Shield, Plus, Mail, Building2, UserCheck, UserX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Mock system users list
const mockUsers = [
  { id: "USR-101", name: "Ahmad Razak", email: "ahmad.razak@company.com", role: "Procurement Manager", branch: "HQ - Shah Alam", status: "Active" },
  { id: "USR-102", name: "Siti Norhanna", email: "norhanna@company.com", role: "Store Keeper", branch: "Warehouse A", status: "Active" },
  { id: "USR-103", name: "Kevin Tan", email: "kevin.tan@company.com", role: "Finance Officer", branch: "HQ - Shah Alam", status: "Active" },
  { id: "USR-104", name: "Zulkhairi Amir", email: "zul.amir@company.com", role: "Inspector", branch: "Klang Depot", status: "Inactive" },
  { id: "USR-105", name: "Mei Ling Lim", email: "meiling@company.com", role: "Inventory Admin", branch: "HQ - Shah Alam", status: "Active" },
]

export default function UserManagementPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  // Filter users based on search string
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="User Management"
        subtitle="Manage team members & permissions"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-4">
        {/* Search & Invite User Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="icon" className="shrink-0 bg-primary">
            <Plus size={18} />
          </Button>
        </div>

        {/* User Cards List */}
        <div className="space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">{u.name}</h4>
                      <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                        {u.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium mt-0.5">{u.role}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{u.id}</span>
                </div>

                <div className="pt-2 border-t border-border/50 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={13} />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={13} />
                    <span>{u.branch}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
