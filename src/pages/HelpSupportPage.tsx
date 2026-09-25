import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle, Phone, Mail, MessageSquare, FileText, ChevronDown, ChevronUp } from "lucide-react"
import AppHeader from "@/components/AppHeader"
import { ROUTES } from "@/routes/approutes"

// Frequently Asked Questions list
const faqs = [
  {
    question: "How do I create a new Purchase Order?",
    answer: "Navigate to Procurement > Purchase Orders in the More menu or click the '+' button on the Purchase Orders page.",
  },
  {
    question: "What happens if a GRN has missing or damaged items?",
    answer: "Select status as 'Partial' or 'Rejected' when filling the GRN inspection form, and add notes specifying damaged item quantities.",
  },
  {
    question: "How do I update my profile details?",
    answer: "Go to More > Profile > Edit Profile to update your name and contact phone number.",
  },
]

export default function HelpSupportPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader
        title="Help & Support"
        subtitle="Assistance & Knowledge Base"
        onBack={() => navigate(ROUTES.MORE)}
      />

      <div className="flex-1 px-4 pb-28 pt-4 scrollable overflow-y-auto space-y-5">
        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Phone size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Call IT Desk</h4>
            <p className="text-[11px] text-muted-foreground">+60 3-8000 9999</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mail size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground">Email Support</h4>
            <p className="text-[11px] text-muted-foreground">support@eps.com.my</p>
          </div>
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
