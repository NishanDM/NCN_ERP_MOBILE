import { useCallback, useId, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import PasswordField from "@/components/forms/PasswordField"
import TextField from "@/components/forms/TextField"
import { ProfileApiError, confirmEmailChange, requestEmailChange } from "@/features/profile/profileApi"
import { useProfile } from "@/features/profile/profileContext"
import {
  VERIFICATION_CODE_LENGTH,
  hasFormErrors,
  isValidVerificationCode,
  validateChangeEmailForm,
  type ChangeEmailFormErrors,
  type ChangeEmailFormValues,
} from "@/features/profile/profileUtils"
import { ROUTES } from "@/routes/approutes"

type EmailChangeStep = "details" | "verify"

const EMPTY_VALUES: ChangeEmailFormValues = { newEmail: "", currentPassword: "" }

export default function ChangeEmailPage() {
  const navigate = useNavigate()
  const { profile, applyProfile } = useProfile()
  const newEmailId = useId()
  const passwordId = useId()
  const codeId = useId()

  const [step, setStep] = useState<EmailChangeStep>("details")
  const [values, setValues] = useState<ChangeEmailFormValues>(EMPTY_VALUES)
  const [touched, setTouched] = useState<Partial<Record<keyof ChangeEmailFormValues, boolean>>>({})
  const [serverErrors, setServerErrors] = useState<ChangeEmailFormErrors>({})
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const newEmail = values.newEmail.trim()
  const errors = useMemo(
    () => validateChangeEmailForm(values, profile?.email ?? ""),
    [values, profile?.email]
  )

  const goToProfile = useCallback(() => navigate(ROUTES.PROFILE, { replace: true }), [navigate])

  const handleChange = (field: keyof ChangeEmailFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setValues((previous) => ({ ...previous, [field]: value }))
    setServerErrors({})
    setSubmitError(null)
  }

  const handleBlur = (field: keyof ChangeEmailFormValues) => () => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const fieldError = (field: keyof ChangeEmailFormValues) =>
    touched[field] ? (errors[field] ?? serverErrors[field]) : serverErrors[field]

  const requestCode = async (): Promise<boolean> => {
    setIsBusy(true)
    setSubmitError(null)
    try {
      await requestEmailChange(newEmail, values.currentPassword)
      return true
    } catch (error) {
      if (error instanceof ProfileApiError && error.code === "INVALID_PASSWORD") {
        setServerErrors({ currentPassword: error.message })
      } else if (error instanceof ProfileApiError && error.code === "EMAIL_IN_USE") {
        setServerErrors({ newEmail: error.message })
      } else {
        setSubmitError("Couldn't send the verification code. Please try again.")
      }
      return false
    } finally {
      setIsBusy(false)
    }
  }

  const handleDetailsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ newEmail: true, currentPassword: true })
    if (hasFormErrors(errors) || isBusy) return

    if (await requestCode()) {
      setCode("")
      setCodeError(null)
      setNotice(null)
      setStep("verify")
    }
  }

  const handleResend = async () => {
    if (await requestCode()) setNotice("We sent you a new code.")
  }

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value.replace(/\D/g, "").slice(0, VERIFICATION_CODE_LENGTH))
    setCodeError(null)
    setSubmitError(null)
  }

  const handleVerifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidVerificationCode(code) || isBusy) return

    setIsBusy(true)
    setSubmitError(null)
    try {
      applyProfile(await confirmEmailChange(code))
      goToProfile()
    } catch (error) {
      if (error instanceof ProfileApiError && error.code === "INVALID_CODE") {
        setCodeError(error.message)
      } else {
        setSubmitError("Couldn't verify the code. Please try again.")
      }
      setIsBusy(false)
    }
  }

  const errorBanner = submitError && (
    <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
      {submitError}
    </p>
  )

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Change email" showBell={false} showAvatar={false} onBack={goToProfile} />

      <div className="flex-1 px-4 pb-28 pt-6 scrollable overflow-y-auto">
        {step === "details" ? (
          <form noValidate onSubmit={(event) => void handleDetailsSubmit(event)} className="space-y-5">
            {profile && (
              <p className="text-sm text-muted-foreground">
                Your email is currently <span className="text-foreground">{profile.email}</span>. We'll send a code
                to the new address to confirm it's yours.
              </p>
            )}

            <TextField
              id={newEmailId}
              label="New email"
              type="email"
              inputMode="email"
              value={values.newEmail}
              onChange={handleChange("newEmail")}
              onBlur={handleBlur("newEmail")}
              error={fieldError("newEmail")}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="next"
              disabled={isBusy}
            />

            <PasswordField
              id={passwordId}
              label="Current password"
              hint="We ask for it to confirm it's really you."
              value={values.currentPassword}
              onChange={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              error={fieldError("currentPassword")}
              autoComplete="current-password"
              enterKeyHint="done"
              disabled={isBusy}
            />

            {errorBanner}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={hasFormErrors(errors) || isBusy}>
                {isBusy ? "Sending code…" : "Send verification code"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" disabled={isBusy} onClick={goToProfile}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <form noValidate onSubmit={(event) => void handleVerifySubmit(event)} className="space-y-5">
            <p className="text-sm text-muted-foreground">
              We sent a {VERIFICATION_CODE_LENGTH}-digit code to{" "}
              <span className="text-foreground">{newEmail}</span>. Enter it below to finish changing your email.
            </p>

            <TextField
              id={codeId}
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={VERIFICATION_CODE_LENGTH}
              placeholder="123456"
              value={code}
              onChange={handleCodeChange}
              error={codeError ?? undefined}
              hint={notice ?? undefined}
              enterKeyHint="done"
              disabled={isBusy}
            />

            {errorBanner}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={!isValidVerificationCode(code) || isBusy}>
                {isBusy ? "Verifying…" : "Verify and update"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" disabled={isBusy} onClick={() => void handleResend()}>
                Resend code
              </Button>
              <Button type="button" variant="ghost" className="w-full" disabled={isBusy} onClick={() => setStep("details")}>
                Use a different email
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}