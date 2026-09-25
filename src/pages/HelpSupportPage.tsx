import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  HelpCircle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Frequently Asked Questions list
const faqs = [
  {
    question: "How do I create a new Purchase Order?",
    answer: "Navigate to Procurement > Purchase Orders in the More menu or click the '+ Create PO' button on the Purchase Orders page.",
  },
  {
    question: "What happens if a GRN has missing or damaged items?",
    answer: "Select status as 'Partial' or 'Rejected' when filling the GRN inspection form, and specify the damaged item details.",
  },
  {
    question: "How do I request admin access privileges?",
    answer: "Contact your System Administrator via User Management or send a message through the Help & Support message desk.",
  }
]

export default function HelpSupportPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Message Form State
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Handle Send Support Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSuccessToast("Your message has been sent to IT Support! We will reply shortly.")
      setSubject("")
      setMessage("")
      setTimeout(() => setSuccessToast(null), 4000)
    }, 800)
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Help & Support"
        subtitle="Assistance & Support Desk"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Support Sent Feedback Toast */}
        {successToast && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successToast}</span>
          </div>
        )}

        {/* Quick IT Contact Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Phone size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Call IT Desk</h4>
            <p className="text-[11px] text-muted-foreground font-mono">+60 3-8000 9999</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mail size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Email Support</h4>
            <p className="text-[11px] text-muted-foreground font-mono">support@eps.com.my</p>
          </div>
        </div>

        {/* Support Message Textarea Form */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
            <MessageSquare size={18} className="text-primary" />
            <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Send Support Message
            </h3>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Subject / Topic</label>
              <Input
                placeholder="e.g. Issue with PO approval"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Message / Details</label>
              <textarea
                required
                rows={4}
                placeholder="Type your message or issue description here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full bg-primary text-primary-foreground gap-2 h-11"
            >
              <Send size={15} />
              <span>{isSending ? "Sending Message..." : "Send Message"}</span>
            </Button>
          </form>
        </div>

        {/* FAQs Section */}
        <div>
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-xs text-foreground"
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp size={16} className="text-primary shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 pt-0 text-xs text-muted-foreground border-t border-border/50 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
