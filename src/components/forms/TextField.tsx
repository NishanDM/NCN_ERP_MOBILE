import type { InputHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  id: string
  label: string
  error?: string
  hint?: string
  endAdornment?: ReactNode
}

export default function TextField({ id, label, error, hint, endAdornment, ...inputProps }: TextFieldProps) {
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "h-11 w-full rounded-xl border bg-card px-3 text-base text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60",
            endAdornment && "pr-11",
            error ? "border-red-500/60" : "border-border"
          )}
          {...inputProps}
        />
        {endAdornment && <div className="absolute inset-y-0 right-0 flex items-center pr-1">{endAdornment}</div>}
      </div>
      {message && (
        <p id={messageId} className={cn("mt-1 text-xs", error ? "text-red-400" : "text-muted-foreground")}>
          {message}
        </p>
      )}
    </div>
  )
}