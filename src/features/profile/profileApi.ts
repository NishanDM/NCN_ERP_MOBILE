export interface UserPreferences {
  pushNotifications: boolean
  emailDigest: boolean
  biometricLogin: boolean
}

export interface UserProfile {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  jobTitle: string
  department: string
  branch: string
  company: string
  joinedAt: string
  lastLoginAt: string
  avatarUrl?: string
  preferences: UserPreferences
}

export type ProfileUpdate = Pick<UserProfile, "fullName" | "phone">

export type ProfileErrorCode = "INVALID_PASSWORD" | "INVALID_CODE" | "EMAIL_IN_USE" | "UNKNOWN"

export class ProfileApiError extends Error {
  code: ProfileErrorCode

  constructor(code: ProfileErrorCode, message: string) {
    super(message)
    this.name = "ProfileApiError"
    this.code = code
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock database
// ─────────────────────────────────────────────────────────────────────────────

const HOUR_MS = 60 * 60_000

const MOCK_PROFILE: UserProfile = {
  id: "usr-0142",
  employeeCode: "EMP-0142",
  fullName: "Amal Silva",
  email: "amir.hakim@ncn-eps.com",
  phone: "+94 77 585 24 36",
  jobTitle: "Procurement Manager",
  department: "Procurement",
  branch: "Matara HA",
  company: "ABC PVT Ltd",
  joinedAt: "2021-03-15T00:00:00.000Z",
  lastLoginAt: new Date(Date.now() - 3 * HOUR_MS).toISOString(),
  preferences: {
    pushNotifications: true,
    emailDigest: false,
    biometricLogin: true,
  },
}

const MOCK_PASSWORD = "Password@123"
const MOCK_TAKEN_EMAIL = "taken@ncn-eps.com"
const MOCK_VERIFICATION_CODE = "123456"

// ─────────────────────────────────────────────────────────────────────────────
// Mock endpoints
// ─────────────────────────────────────────────────────────────────────────────

const SIMULATED_LATENCY_MS = 600
const SIMULATE_FAILURE = false

let serverProfile: UserProfile = cloneProfile(MOCK_PROFILE)
let serverPassword = MOCK_PASSWORD
let pendingEmail: string | null = null

function cloneProfile(profile: UserProfile): UserProfile {
  return { ...profile, preferences: { ...profile.preferences } }
}

function respond<T>(produce: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error("Simulated network error"))
        return
      }
      try {
        resolve(produce())
      } catch (error) {
        reject(error)
      }
    }, SIMULATED_LATENCY_MS)
  })
}

export function fetchProfile(): Promise<UserProfile> {
  return respond(() => cloneProfile(serverProfile))
}

export function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  return respond(() => {
    serverProfile = { ...serverProfile, ...update }
    return cloneProfile(serverProfile)
  })
}

export function updatePreference(key: keyof UserPreferences, value: boolean): Promise<UserPreferences> {
  return respond(() => {
    serverProfile = {
      ...serverProfile,
      preferences: { ...serverProfile.preferences, [key]: value },
    }
    return { ...serverProfile.preferences }
  })
}

/** Step 1 of an email change: verifies the password and "sends" a code to the new address. */
export function requestEmailChange(newEmail: string, currentPassword: string): Promise<void> {
  return respond(() => {
    if (currentPassword !== serverPassword) {
      throw new ProfileApiError("INVALID_PASSWORD", "Current password is incorrect.")
    }
    if (newEmail.toLowerCase() === MOCK_TAKEN_EMAIL) {
      throw new ProfileApiError("EMAIL_IN_USE", "That email is already in use.")
    }
    pendingEmail = newEmail
  })
}

export function confirmEmailChange(code: string): Promise<UserProfile> {
  return respond(() => {
    if (!pendingEmail || code !== MOCK_VERIFICATION_CODE) {
      throw new ProfileApiError("INVALID_CODE", "That code is incorrect or has expired.")
    }
    serverProfile = { ...serverProfile, email: pendingEmail }
    pendingEmail = null
    return cloneProfile(serverProfile)
  })
}

export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return respond(() => {
    if (currentPassword !== serverPassword) {
      throw new ProfileApiError("INVALID_PASSWORD", "Current password is incorrect.")
    }
    serverPassword = newPassword
  })
}

export function signOut(): Promise<void> {
  return respond(() => undefined)
}