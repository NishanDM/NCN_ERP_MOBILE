import { useCallback, useId, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import PasswordField from "@/components/forms/PasswordField"
import { cn } from "@/lib/utils"
import { ProfileApiError, changePassword } from "@/features/profile/profileApi"
import {
  getPasswordChecks,
  hasFormErrors,
  validateChangePasswordForm,
  type ChangePasswordFormErrors,
  type ChangePasswordFormValues,
} from "@/features/profile/profileUtils"
import { ROUTES } from "@/routes/approutes"

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const currentPasswordId = useId()
  const newPasswordId = useId()
  const confirmPasswordId = useId()

  const [values, setValues] = useState<ChangePasswordFormValues>(EMPTY_VALUES)
  const [touched, setTouched] = useState<Partial<Record<keyof ChangePasswordFormValues, boolean>>>({})
  const [serverErrors, setServerErrors] = useState<ChangePasswordFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const errors = useMemo(() => validateChangePasswordForm(values), [values])
  const passwordChecks = useMemo(() => getPasswordChecks(values.newPassword), [values.newPassword])
  const canSubmit = !hasFormErrors(errors) && !isSaving

  const goToProfile = useCallback(() => navigate(ROUTES.PROFILE, { replace: true }), [navigate])

  const handleChange = (field: keyof ChangePasswordFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setValues((previous) => ({ ...previous, [field]: value }))
    setServerErrors({})
    setSubmitError(null)
  }

  const handleBlur = (field: keyof ChangePasswordFormValues) => () => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const fieldError = (field: keyof ChangePasswordFormValues) =>
    touched[field] ? (errors[field] ?? serverErrors[field]) : serverErrors[field]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true })
    if (!canSubmit) return

    setIsSaving(true)
    setSubmitError(null)
    try {
      await changePassword(values.currentPassword, values.newPassword)
      setValues(EMPTY_VALUES) // Don't keep passwords in memory once they're no longer needed.
      setIsDone(true)
    } catch (error) {
      if (error instanceof ProfileApiError && error.code === "INVALID_PASSWORD") {
        setServerErrors({ currentPassword: error.message })
      } else {
        setSubmitError("Couldn't update your password. Please try again.")
      }
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Change password" showBell={false} showAvatar={false} onBack={goToProfile} />

      <div className="flex-1 px-4 pb-28 pt-6 scrollable overflow-y-auto">
        {isDone ? (
          <div role="status" className="flex flex-col items-center pt-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Check size={28} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">Password updated</h2>
            <p className="mt-1 text-sm text-muted-foreground">Use your new password the next time you sign in.</p>
            <Button className="mt-6 w-full" onClick={goToProfile}>
              Back to profile
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
            <PasswordField
              id={currentPasswordId}
              label="Current password"
              value={values.currentPassword}
              onChange={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              error={fieldError("currentPassword")}
              autoComplete="current-password"
              enterKeyHint="next"
              disabled={isSaving}
            />

            <div className="space-y-2">
              <PasswordField
                id={newPasswordId}
                label="New password"
                value={values.newPassword}
                onChange={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={fieldError("newPassword")}
                autoComplete="new-password"
                enterKeyHint="next"
                disabled={isSaving}
              />
              <ul aria-label="Password requirements" className="space-y-1">
                {passwordChecks.map((check) => (
                  <li
                    key={check.id}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      check.passed ? "text-emerald-400" : "text-muted-foreground"
                    )}
                  >
                    <Check size={12} aria-hidden="true" className={check.passed ? "opacity-100" : "opacity-30"} />
                    {check.label}
                    <span className="sr-only">{check.passed ? "(met)" : "(not met)"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <PasswordField
              id={confirmPasswordId}
              label="Confirm new password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={fieldError("confirmPassword")}
              autoComplete="new-password"
              enterKeyHint="done"
              disabled={isSaving}
            />

            {submitError && (
              <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {submitError}
              </p>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSaving ? "Updating…" : "Update password"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" disabled={isSaving} onClick={goToProfile}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}