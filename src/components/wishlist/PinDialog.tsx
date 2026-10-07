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
import { Lock, ShieldCheck, Trash2 } from 'lucide-react'

interface PinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hasPin: boolean
  onSetupPin: (pin: string) => Promise<void>
  onRemovePin: () => void
  onManualLock: () => void
}

export function PinDialog({
  open,
  onOpenChange,
  hasPin,
  onSetupPin,
  onRemovePin,
  onManualLock,
}: PinDialogProps) {
  const [pin, setPin] = React.useState('')
  const [confirmPin, setConfirmPin] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [mode, setMode] = React.useState<'view' | 'create'>('view')

  React.useEffect(() => {
    if (open) {
      setPin('')
      setConfirmPin('')
      setError(null)
      setSuccess(null)
      setMode(hasPin ? 'view' : 'create')
    }
  }, [open, hasPin])

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length < 4) {
      setError('PIN minimal 4 digit.')
      return
    }

    if (pin !== confirmPin) {
      setError('Konfirmasi PIN tidak cocok.')
      return
    }

    try {
      await onSetupPin(pin)
      setSuccess('PIN berhasil disimpan!')
      setTimeout(() => {
        setSuccess(null)
        onOpenChange(false)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan PIN')
    }
  }

  const handleRemove = () => {
    onRemovePin()
    setSuccess('PIN berhasil dihapus.')
    setTimeout(() => {
      setSuccess(null)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Keamanan PIN Pribadi
          </DialogTitle>
          <DialogDescription>
            Kunci privasi lokal untuk membatasi akses pada perangkat ini. PIN di-hash dengan aman di browser.
          </DialogDescription>
        </DialogHeader>

        {hasPin && mode === 'view' ? (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-sm font-semibold">PIN Telah Aktif</p>
                <p className="text-xs opacity-80">
                  Aplikasi akan otomatis terkunci saat halaman dimuat ulang.
                </p>
              </div>
            </div>

            {success && (
              <p className="text-xs text-emerald-400 font-medium">{success}</p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                onClick={() => {
                  onManualLock()
                  onOpenChange(false)
                }}
                className="w-full font-semibold"
              >
                <Lock className="w-4 h-4 mr-1.5" />
                Kunci Aplikasi Sekarang
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMode('create')
                    setPin('')
                    setConfirmPin('')
                  }}
                  className="flex-1"
                >
                  Ubah PIN
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemove}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Hapus PIN
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePin}>
            <div className="py-4 space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="new-pin-input"
                  className="text-sm font-medium text-foreground"
                >
                  {hasPin ? 'PIN Baru (min. 4 digit)' : 'Buat PIN (min. 4 digit)'}
                </label>
                <Input
                  id="new-pin-input"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/[^0-9]/g, ''))
                    if (error) setError(null)
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-pin-input"
                  className="text-sm font-medium text-foreground"
                >
                  Konfirmasi PIN
                </label>
                <Input
                  id="confirm-pin-input"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))
                    if (error) setError(null)
                  }}
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              {success && (
                <p className="text-xs text-emerald-400 font-medium">{success}</p>
              )}
            </div>

            <DialogFooter>
              {hasPin && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode('view')}
                >
                  Batal
                </Button>
              )}
              <Button type="submit">
                {hasPin ? 'Perbarui PIN' : 'Aktifkan PIN'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
