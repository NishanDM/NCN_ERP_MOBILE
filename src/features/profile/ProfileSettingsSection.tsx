import { useId, type ReactNode } from "react"

interface ProfileSettingsSectionProps {
  title: string
  children: ReactNode
}

export default function ProfileSettingsSection({ title, children }: ProfileSettingsSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
        {children}
      </div>
    </section>
  )
}