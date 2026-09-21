import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import TextField, { type TextFieldProps } from "@/components/forms/TextField"

type PasswordFieldProps = Omit<TextFieldProps, "type" | "endAdornment">

export default function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  return (
    <TextField
      autoCapitalize="none"
      spellCheck={false}
      {...props}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((previous) => !previous)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground active:bg-secondary"
        >
          <Icon size={16} />
        </button>
      }
    />
  )
}