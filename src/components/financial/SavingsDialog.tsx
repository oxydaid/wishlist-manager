import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatIDR, parseIntegerAmount } from '@/lib/utils'

interface SavingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentSavings: number
  onSave: (amount: number) => void
}

export function SavingsDialog({
  open,
  onOpenChange,
  currentSavings,
  onSave,
}: SavingsDialogProps) {
  const [value, setValue] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setValue(currentSavings > 0 ? currentSavings.toString() : '')
      setError(null)
    }
  }, [open, currentSavings])

  const numericValue = React.useMemo(() => parseIntegerAmount(value), [value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError('Jumlah tabungan harus berupa angka valid (minimal Rp0)')
      return
    }

    onSave(numericValue)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ubah Tabungan</DialogTitle>
            <DialogDescription>
              Masukkan jumlah dana/tabungan yang tersedia saat ini untuk dialokasikan ke wishlist.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="savings-input"
                className="text-sm font-medium text-foreground"
              >
                Jumlah Tabungan (Rp)
              </label>
              <Input
                id="savings-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                placeholder="Contoh: 2500000"
                value={value}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '')
                  setValue(cleaned)
                  if (error) setError(null)
                }}
              />
            </div>

            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Preview nominal:</span>
                <span className="font-semibold text-foreground">
                  {formatIDR(numericValue)}
                </span>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
