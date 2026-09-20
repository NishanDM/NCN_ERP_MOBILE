import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  fetchProfile,
  updatePreference,
  updateProfile,
  type UserPreferences,
  type UserProfile,
} from "@/features/profile/profileApi"
import {
  ProfileContext,
  type ProfileContextValue,
  type ProfileStatus,
} from "@/features/profile/profileContext"
import { normalizeFormValues, withPreference, type ProfileFormValues } from "@/features/profile/profileUtils"

interface ProfileProviderProps {
  children: ReactNode
}

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<ProfileStatus>("loading")
  const [actionError, setActionError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setStatus("loading")
    setActionError(null)
    try {
      setProfile(await fetchProfile())
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const saveProfile = useCallback(async (values: ProfileFormValues) => {
    const updated = await updateProfile(normalizeFormValues(values))
    setProfile(updated)
  }, [])

  const setPreference = useCallback(async (key: keyof UserPreferences, value: boolean) => {
    setActionError(null)
    setProfile((previous) => (previous ? withPreference(previous, key, value) : previous))
    try {
      await updatePreference(key, value)
    } catch {
      // Roll back only this key so other in-flight toggles are not undone.
      setProfile((previous) => (previous ? withPreference(previous, key, !value) : previous))
      setActionError("Couldn't update your preference. Please try again.")
    }
  }, [])

  const applyProfile = useCallback((next: UserProfile) => {
    setProfile(next)
    setStatus("success")
  }, [])

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, status, actionError, refresh, saveProfile, setPreference, applyProfile }),
    [profile, status, actionError, refresh, saveProfile, setPreference, applyProfile]
  )

  return <ProfileContext value={value}>{children}</ProfileContext>
}