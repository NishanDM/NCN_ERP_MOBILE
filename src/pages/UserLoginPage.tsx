import { useState, type FormEvent } from "react"
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Boxes } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const VALID_EMAIL = "user@domain.lk"
const VALID_PASSWORD = "Abc123@#"

interface UserLoginPageProps {
  onLoginSuccess: () => void
}

export default function UserLoginPage({ onLoginSuccess }: UserLoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    setIsSubmitting(true)

    // Simulate a brief auth check
    setTimeout(() => {
      if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
        onLoginSuccess()
      } else {
        setError("Invalid email or password. Please try again.")
        setIsSubmitting(false)
      }
    }, 500)
  }

  return (
    <div className="flex flex-col min-h-full bg-background px-6 pt-16 pb-10">
      <div className="w-full max-w-sm mx-auto space-y-8">
        {/* Logo / branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Boxes size={26} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Welcome back</h1>
            <p className="text-xs text-muted-foreground mt-1">Sign in to Enterprise Procurement System</p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="you@domain.lk"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground active:scale-95 transition-transform"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-2.5">
              <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button type="button" className="text-xs text-primary">
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full gap-2 h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                <LogIn size={15} />
                Sign In
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground font-mono">EPS v2.4.1</p>
      </div>
    </div>
  )
}