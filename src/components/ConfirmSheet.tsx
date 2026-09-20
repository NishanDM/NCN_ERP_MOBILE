import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  busyLabel: string
  onConfirm: () => void
  busy?: boolean
}

export default function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  busyLabel,
  onConfirm,
  busy = false,
}: ConfirmSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] rounded-t-2xl border border-border bg-card px-4 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">{description}</Dialog.Description>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="destructive" disabled={busy} onClick={onConfirm}>
              {busy ? busyLabel : confirmLabel}
            </Button>
            <Dialog.Close asChild>
              <Button variant="ghost" disabled={busy}>
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}