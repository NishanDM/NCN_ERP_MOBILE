import { useState } from "react"
import { cn } from "@/lib/utils"
import { getInitials } from "@/features/profile/profileUtils"

type AvatarSize = "md" | "lg"

const SIZE_CLASSES: Record<AvatarSize, string> = {
  md: "w-7 h-7 text-[11px]",
  lg: "w-20 h-20 text-2xl",
}

interface ProfileAvatarProps {
  name: string
  avatarUrl?: string
  size?: AvatarSize
}

export default function ProfileAvatar({ name, avatarUrl, size = "md" }: ProfileAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = Boolean(avatarUrl) && avatarUrl !== failedUrl

  return (
    <span
      aria-hidden="true"
      className={cn(
        "shrink-0 overflow-hidden rounded-full bg-primary flex items-center justify-center font-bold text-white",
        SIZE_CLASSES[size]
      )}
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(avatarUrl ?? null)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}