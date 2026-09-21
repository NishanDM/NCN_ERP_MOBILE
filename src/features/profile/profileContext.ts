import { createContext, useContext } from "react"
import type { UserPreferences, UserProfile } from "@/features/profile/profileApi"
import type { ProfileFormValues } from "@/features/profile/profileUtils"

export type ProfileStatus = "loading" | "success" | "error"

export interface ProfileContextValue {
  profile: UserProfile | null
  status: ProfileStatus
  actionError: string | null
  refresh: () => Promise<void>
  saveProfile: (values: ProfileFormValues) => Promise<void>
  setPreference: (key: keyof UserPreferences, value: boolean) => Promise<void>
  applyProfile: (profile: UserProfile) => void
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used inside <ProfileProvider>")
  }
  return context
}