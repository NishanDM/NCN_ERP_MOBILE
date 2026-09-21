import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/AppHeader"
import ProfileAvatar from "@/features/profile/ProfileAvatar"
import TextField from "@/components/forms/TextField"
import type { UserProfile } from "@/features/profile/profileApi"
import { useProfile } from "@/features/profile/profileContext"
import {
  hasFormErrors,
  isProfileFormDirty,
  toFormValues,
  validateProfileForm,
  type ProfileFormValues,
} from "@/features/profile/profileUtils"
import { ROUTES } from "@/routes/approutes"

interface EditProfileFormProps {
  profile: UserProfile
  onDone: () => void
}

function EditProfileForm({ profile, onDone }: EditProfileFormProps) {
  const { saveProfile } = useProfile()
  const nameId = useId()
  const phoneId = useId()

  const [values, setValues] = useState<ProfileFormValues>(() => toFormValues(profile))
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileFormValues, boolean>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const errors = useMemo(() => validateProfileForm(values), [values])
  const isDirty = isProfileFormDirty(profile, values)
  const canSave = isDirty && !hasFormErrors(errors) && !isSaving

  const handleChange = (field: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setValues((previous) => ({ ...previous, [field]: value }))
    setSubmitError(null)
  }

  const handleBlur = (field: keyof ProfileFormValues) => () => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ fullName: true, phone: true })
    if (!canSave) return

    setIsSaving(true)
    setSubmitError(null)
    try {
      await saveProfile(values)
      onDone()
    } catch {
      setSubmitError("Couldn't save your changes. Please try again.")
      setIsSaving(false)
    }
  }

  return (
    <form noValidate onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      <div className="flex justify-center">
        <ProfileAvatar name={values.fullName || profile.fullName} avatarUrl={profile.avatarUrl} size="lg" />
      </div>

      <TextField
        id={nameId}
        label="Full name"
        value={values.fullName}
        onChange={handleChange("fullName")}
        onBlur={handleBlur("fullName")}
        error={touched.fullName ? errors.fullName : undefined}
        autoComplete="name"
        enterKeyHint="next"
        disabled={isSaving}
      />

      <TextField
        id={phoneId}
        label="Phone"
        type="tel"
        inputMode="tel"
        value={values.phone}
        onChange={handleChange("phone")}
        onBlur={handleBlur("phone")}
        error={touched.phone ? errors.phone : undefined}
        autoComplete="tel"
        enterKeyHint="done"
        disabled={isSaving}
      />

      {submitError && (
        <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {submitError}
        </p>
      )}

      <div className="space-y-2">
        <Button type="submit" className="w-full" disabled={!canSave}>
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" disabled={isSaving} onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { profile, status, refresh } = useProfile()
  const goToProfile = useCallback(() => navigate(ROUTES.PROFILE, { replace: true }), [navigate])

  let body: ReactNode
  if (status === "loading" || (status === "success" && !profile)) {
    body = (
      <div role="status" aria-live="polite" className="py-16 text-center text-sm text-muted-foreground">
        Loading profile…
      </div>
    )
  } else if (status === "error" || !profile) {
    body = (
      <div role="alert" className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm text-foreground font-medium">Couldn't load your profile</p>
        <p className="text-xs mt-1 mb-4">Check your connection and try again.</p>
        <Button size="sm" onClick={() => void refresh()}>Try again</Button>
      </div>
    )
  } else {
    body = <EditProfileForm profile={profile} onDone={goToProfile} />
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <AppHeader title="Edit profile" showBell={false} showAvatar={false} onBack={goToProfile} />
      <div className="flex-1 px-4 pb-28 pt-6 scrollable overflow-y-auto">{body}</div>
    </div>
  )
}