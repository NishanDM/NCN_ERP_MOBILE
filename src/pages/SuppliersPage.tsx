import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Truck, Phone, Mail, MapPin, Plus, Star, X, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Initial mock supplier directory data
const initialSuppliers = [
  {
    id: "SUP-001",
    name: "Syarikat Maju Jaya Sdn Bhd",
    category: "Raw Materials",
    rating: 4.8,
    status: "Active",
    phone: "+60 3-8012 3456",
    email: "info@majujaya.com.my",
    address: "No 45, Jalan Industri 3, Kawasan Perindustrian",
    location: "Shah Alam, Selangor"
  },
  {
    id: "SUP-002",
    name: "Atlas Supply Sdn Bhd",
    category: "Hardware & Tools",
    rating: 4.5,
    status: "Active",
    phone: "+60 3-5511 8899",
    email: "sales@atlassupply.my",
    address: "Lot 12, Seksyen 51A, Federal Highway",
    location: "Petaling Jaya, Selangor"
  },
  {
    id: "SUP-003",
    name: "Global Industrial Parts",
    category: "Machinery",
    rating: 4.2,
    status: "Active",
    phone: "+60 3-8920 1122",
    email: "contact@globalparts.com",
    address: "Unit 8-B, West Port Logistics Park",
    location: "Klang, Selangor"
  },
  {
    id: "SUP-004",
    name: "Bumi Resources Bhd",
    category: "Packaging Materials",
    rating: 3.9,
    status: "Under Review",
    phone: "+60 3-2144 7788",
    email: "orders@bumiresources.com",
    address: "Level 14, Menara Bumi, Jalan Ampang",
    location: "Kuala Lumpur"
  },
  {
    id: "SUP-005",
    name: "Maju Teknik Sdn Bhd",
    category: "Electrical Components",
    rating: 4.7,
    status: "Active",
    phone: "+60 3-7800 3344",
    email: "support@majuteknik.com.my",
    address: "No 18, Subang Hi-Tech Industrial Park",
    location: "Subang Jaya, Selangor"
  }
]

export default function SuppliersPage() {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [search, setSearch] = useState("")

  // Modal dialog state for Add Supplier
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [location, setLocation] = useState("")

  // Add new supplier submit handler
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return

    const newId = `SUP-${String(suppliers.length + 1).padStart(3, "0")}`
    const newSupplierItem = {
      id: newId,
      name,
      category: category || "General Supplier",
      rating: 5.0,
      status: "Active",
      phone,
      email: email || "info@supplier.com",
      address: address || "Industrial Area",
      location: location || "Selangor"
    }

    setSuppliers([newSupplierItem, ...suppliers])
    setIsModalOpen(false)
    setName("")
    setCategory("")
    setPhone("")
    setEmail("")
    setAddress("")
    setLocation("")
  }

  // Filter supplier list based on search keyword
  const filteredSuppliers = suppliers.filter(
    (sup) =>
      sup.name.toLowerCase().includes(search.toLowerCase()) ||
      sup.category.toLowerCase().includes(search.toLowerCase()) ||
      sup.location.toLowerCase().includes(search.toLowerCase()) ||
      sup.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Suppliers"
        subtitle="Registered vendor directory"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-4">
        {/* Search bar & Add Supplier Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search supplier, location..."
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
            <span>Add Supplier</span>
          </Button>
        </div>

        {/* Suppliers Bar Card List */}
        <div className="space-y-3">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Truck size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No suppliers found</p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 active:bg-secondary/40 transition-colors"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{supplier.id}</span>
                      <Badge variant={supplier.status === "Active" ? "success" : "warning"}>
                        {supplier.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mt-1">{supplier.name}</h3>
                    <p className="text-xs text-primary font-medium">{supplier.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-mono text-xs">
                    <Star size={12} className="fill-amber-400" />
                    <span>{supplier.rating}</span>
                  </div>
                </div>

                {/* Detailed contact and address bars */}
                <div className="pt-2.5 border-t border-border/60 grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-primary shrink-0" />
                    <span className="font-mono">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-blue-400 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Building2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{supplier.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-emerald-400 shrink-0" />
                    <span className="font-medium text-foreground">{supplier.location}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Supplier Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <Truck size={18} className="text-primary" />
                Add New Supplier
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Supplier Name</label>
                <Input
                  required
                  placeholder="e.g. Syarikat Perdana Logistics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Input
                  placeholder="e.g. Hardware & Equipment"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Contact Number</label>
                  <Input
                    required
                    placeholder="+60 3-XXXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                  <Input
                    type="email"
                    placeholder="sales@supplier.my"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Address</label>
                <Input
                  placeholder="Lot 10, Industrial Estate"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Location / City</label>
                <Input
                  placeholder="e.g. Shah Alam, Selangor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Add Supplier
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
