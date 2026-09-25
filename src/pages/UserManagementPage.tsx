import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Users, Shield, Plus, Mail, Building2, UserCheck, UserX, X, KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Initial mock existing users list (~5 users with admin privileges)
const initialUsers = [
  {
    id: "USR-101",
    name: "Ahmad Razak",
    email: "ahmad.razak@company.com",
    role: "System Administrator",
    privilege: "Super Admin (Full Access)",
    branch: "HQ - Shah Alam",
    status: "Active"
  },
  {
    id: "USR-102",
    name: "Siti Norhanna",
    email: "norhanna@company.com",
    role: "Procurement Manager",
    privilege: "Admin (PO & GRN Approval)",
    branch: "Warehouse A",
    status: "Active"
  },
  {
    id: "USR-103",
    name: "Kevin Tan",
    email: "kevin.tan@company.com",
    role: "Finance Admin",
    privilege: "Admin (Invoice & Payments)",
    branch: "HQ - Shah Alam",
    status: "Active"
  },
  {
    id: "USR-104",
    name: "Zulkhairi Amir",
    email: "zul.amir@company.com",
    role: "Store Supervisor",
    privilege: "Operator (Stock Read/Write)",
    branch: "Klang Depot",
    status: "Active"
  },
  {
    id: "USR-105",
    name: "Mei Ling Lim",
    email: "meiling@company.com",
    role: "Auditor",
    privilege: "Viewer (Read Only)",
    branch: "HQ - Shah Alam",
    status: "Active"
  }
]

export default function UserManagementPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")

  // Add User modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [privilege, setPrivilege] = useState("Admin (PO & GRN Approval)")
  const [branch, setBranch] = useState("HQ - Shah Alam")

  // Add User Submit Handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    const newUserId = `USR-${String(users.length + 101).padStart(3, "0")}`
    const newUser = {
      id: newUserId,
      name,
      email,
      role: role || "Staff Officer",
      privilege,
      branch: branch || "HQ",
      status: "Active"
    }

    setUsers([newUser, ...users])
    setIsModalOpen(false)
    setName("")
    setEmail("")
    setRole("")
  }

  // Filter user list based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.privilege.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="User Management"
        subtitle="Manage system accounts & admin privileges"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-4">
        {/* Search Bar & + Add User Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user, role, privilege..."
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
            <span>Add User</span>
          </Button>
        </div>

        {/* Existing Users List Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Existing Users ({filteredUsers.length})
          </h3>
        </div>

        {/* Users Cards List */}
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3 active:bg-secondary/40 transition-colors"
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

              {/* Admin Privileges Badge */}
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-medium">
                <KeyRound size={13} />
                <span>Privilege: {u.privilege}</span>
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
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Add New User
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="johndoe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">User Role</label>
                <Input
                  placeholder="e.g. Procurement Officer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Admin Privilege Level</label>
                <select
                  value={privilege}
                  onChange={(e) => setPrivilege(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
                >
                  <option value="Super Admin (Full Access)">Super Admin (Full Access)</option>
                  <option value="Admin (PO & GRN Approval)">Admin (PO & GRN Approval)</option>
                  <option value="Admin (Invoice & Payments)">Admin (Invoice & Payments)</option>
                  <option value="Operator (Stock Read/Write)">Operator (Stock Read/Write)</option>
                  <option value="Viewer (Read Only)">Viewer (Read Only)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Branch / Location</label>
                <Input
                  placeholder="HQ - Shah Alam"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Save User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
