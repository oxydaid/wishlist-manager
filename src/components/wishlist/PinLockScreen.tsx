import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ShieldAlert, Sparkles } from 'lucide-react'

interface PinLockScreenProps {
  onUnlock: (pin: string) => Promise<boolean>
}

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin) {
      setError('Masukkan PIN Anda')
      return
    }

    setIsSubmitting(true)
    setError(null)
    const success = await onUnlock(pin)
    setIsSubmitting(false)

    if (!success) {
      setError('PIN salah. Silakan coba lagi.')
      setPin('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm border-border shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl flex items-center justify-center gap-1.5">
            <span>Wishlist Manager</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </CardTitle>
          <CardDescription>
            Aplikasi terkunci. Masukkan PIN keamanan untuk mengakses catatan dan data keuangan Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="lock-pin-input"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block text-center"
              >
                Masukkan PIN
              </label>
              <Input
                id="lock-pin-input"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                placeholder="••••"
                className="text-center text-2xl tracking-[0.3em] h-12 font-bold"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/[^0-9]/g, ''))
                  if (error) setError(null)
                }}
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !pin}
              className="w-full h-11 text-base font-semibold"
            >
              {isSubmitting ? 'Memverifikasi...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
