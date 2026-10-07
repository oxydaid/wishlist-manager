import { Button } from '@/components/ui/button'
import { Sparkles, Lock, Shield, Database, Plus } from 'lucide-react'

interface NavbarProps {
  hasPin: boolean
  onOpenPinDialog: () => void
  onOpenBackupDialog: () => void
  onAddNew: () => void
}

export function Navbar({
  hasPin,
  onOpenPinDialog,
  onOpenBackupDialog,
  onAddNew,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-tight">
              Wishlist Manager
            </h1>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Perencana Belanja & Kebutuhan Finansial
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenBackupDialog}
            className="text-xs h-9 px-2 sm:px-3 text-muted-foreground hover:text-foreground"
            title="Backup & Restore Data JSON"
          >
            <Database className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Data</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenPinDialog}
            className={`text-xs h-9 px-2 sm:px-3 ${
              hasPin
                ? 'text-primary hover:text-primary/90 hover:bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={hasPin ? 'PIN Aktif (Kelola / Kunci)' : 'Pasang Kunci PIN'}
          >
            {hasPin ? (
              <Lock className="w-4 h-4 sm:mr-1.5" />
            ) : (
              <Shield className="w-4 h-4 sm:mr-1.5" />
            )}
            <span className="hidden sm:inline">
              {hasPin ? 'PIN Aktif' : 'PIN'}
            </span>
          </Button>

          <Button
            type="button"
            onClick={onAddNew}
            size="sm"
            className="h-9 px-3 font-semibold hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Tambah Item</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
