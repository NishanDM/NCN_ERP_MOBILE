import type { ProfileUpdate, UserPreferences, UserProfile } from "@/features/profile/profileApi"

// ── Edit profile ─────────────────────────────────────────────────────────────

export interface ProfileFormValues {
  fullName: string
  phone: string
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>

// ── Change password ──────────────────────────────────────────────────────────

export interface ChangePasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordFormErrors = Partial<Record<keyof ChangePasswordFormValues, string>>

export interface PasswordCheck {
  id: "length" | "case" | "number"
  label: string
  passed: boolean
}

// ── Change email ─────────────────────────────────────────────────────────────

export interface ChangeEmailFormValues {
  newEmail: string
  currentPassword: string
}

export type ChangeEmailFormErrors = Partial<Record<keyof ChangeEmailFormValues, string>>

export const VERIFICATION_CODE_LENGTH = 6

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 60
const PHONE_MIN_DIGITS = 8
const PHONE_MAX_DIGITS = 15
const PHONE_ALLOWED_CHARS = /^\+?[\d\s-]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254
const PASSWORD_MIN_LENGTH = 8
const VERIFICATION_CODE_PATTERN = new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`)

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  const last = parts[parts.length - 1]

  if (!first || !last) return "?"
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export function formatMemberSince(isoDate: string): string {
  const time = Date.parse(isoDate)
  if (Number.isNaN(time)) return ""
  return new Date(time).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

export function withPreference(
  profile: UserProfile,
  key: keyof UserPreferences,
  value: boolean
): UserProfile {
  return { ...profile, preferences: { ...profile.preferences, [key]: value } }
}

export function hasFormErrors(errors: object): boolean {
  return Object.keys(errors).length > 0
}

// ── Edit profile ─────────────────────────────────────────────────────────────

export function toFormValues(profile: UserProfile): ProfileFormValues {
  return { fullName: profile.fullName, phone: profile.phone }
}

export function normalizeFormValues(values: ProfileFormValues): ProfileUpdate {
  return {
    fullName: values.fullName.trim().replace(/\s+/g, " "),
    phone: values.phone.trim(),
  }
}

export function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const { fullName, phone } = normalizeFormValues(values)
  const errors: ProfileFormErrors = {}

  if (fullName.length < NAME_MIN_LENGTH) {
    errors.fullName = `Enter at least ${NAME_MIN_LENGTH} characters.`
  } else if (fullName.length > NAME_MAX_LENGTH) {
    errors.fullName = `Keep the name under ${NAME_MAX_LENGTH} characters.`
  }

  const digitCount = phone.replace(/\D/g, "").length
  if (!phone) {
    errors.phone = "Enter your phone number."
  } else if (
    !PHONE_ALLOWED_CHARS.test(phone) ||
    digitCount < PHONE_MIN_DIGITS ||
    digitCount > PHONE_MAX_DIGITS
  ) {
    errors.phone = "Enter a valid phone number, e.g. +60 12-345 6789."
  }

  return errors
}

export function isProfileFormDirty(profile: UserProfile, values: ProfileFormValues): boolean {
  const next = normalizeFormValues(values)
  return next.fullName !== profile.fullName || next.phone !== profile.phone
}

// ── Change password ──────────────────────────────────────────────────────────

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    {
      id: "length",
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      passed: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "case",
      label: "Upper and lower case letters",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { id: "number", label: "At least one number", passed: /\d/.test(password) },
  ]
}

export function validateChangePasswordForm(values: ChangePasswordFormValues): ChangePasswordFormErrors {
  const errors: ChangePasswordFormErrors = {}

  if (!values.currentPassword) {
    errors.currentPassword = "Enter your current password."
  }

  if (!getPasswordChecks(values.newPassword).every((check) => check.passed)) {
    errors.newPassword = "Your new password doesn't meet all the requirements."
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = "Choose a password different from your current one."
  }

  if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = "Passwords don't match."
  }

  return errors
}

// ── Change email ─────────────────────────────────────────────────────────────

export function validateChangeEmailForm(
  values: ChangeEmailFormValues,
  currentEmail: string
): ChangeEmailFormErrors {
  const errors: ChangeEmailFormErrors = {}
  const newEmail = values.newEmail.trim()

  if (!newEmail) {
    errors.newEmail = "Enter your new email address."
  } else if (newEmail.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(newEmail)) {
    errors.newEmail = "Enter a valid email address."
  } else if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
    errors.newEmail = "This is already your email address."
  }

  if (!values.currentPassword) {
    errors.currentPassword = "Enter your current password."
  }

  return errors
}

export function isValidVerificationCode(code: string): boolean {
  return VERIFICATION_CODE_PATTERN.test(code)
}