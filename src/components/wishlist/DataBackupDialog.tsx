import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface DataBackupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: () => void
  onImport: (jsonString: string) => void
}

export function DataBackupDialog({
  open,
  onOpenChange,
  onExport,
  onImport,
}: DataBackupDialogProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pendingContent, setPendingContent] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setSuccess(null)
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setPendingContent(content)
        setConfirmOpen(true)
      }
    }
    reader.onerror = () => {
      setError('Gagal membaca file yang dipilih')
    }
    reader.readAsText(file)

    // Reset input value so same file can be selected again
    e.target.value = ''
  }

  const handleConfirmImport = () => {
    if (!pendingContent) return
    try {
      onImport(pendingContent)
      setSuccess('Data berhasil dipulihkan dari backup!')
      setPendingContent(null)
      setTimeout(() => {
        setSuccess(null)
        onOpenChange(false)
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengimpor file data.')
      setPendingContent(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Backup & Pemulihan Data</DialogTitle>
            <DialogDescription>
              Karena data disimpan di browser Anda (localStorage), lakukan backup secara berkala agar data tetap aman saat berganti perangkat atau membersihkan browser.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Export Section */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Export Data (Download)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Unduh file JSON berisi semua wishlist dan tabungan Anda.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onExport}
                  variant="outline"
                  size="sm"
                  className="shrink-0 font-medium"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Export
                </Button>
              </div>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Import Data (Pulihkan)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pulihkan data dari file JSON hasil export sebelumnya.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="shrink-0 font-medium"
                  >
                    <Upload className="w-4 h-4 mr-1.5" />
                    Pilih File
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog before Overwrite */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Konfirmasi Import Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              Data saat ini akan digantikan dengan data dari file{' '}
              <strong className="text-foreground">{fileName}</strong>. Pastikan Anda telah mengamankan data penting sebelumnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmOpen(false)
                setPendingContent(null)
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false)
                handleConfirmImport()
              }}
            >
              Import Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
