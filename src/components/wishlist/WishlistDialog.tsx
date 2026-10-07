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
import type { WishlistItem } from '@/types/wishlist'

interface WishlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemToEdit?: WishlistItem | null
  onSave: (name: string, price: number) => void
}

export function WishlistDialog({
  open,
  onOpenChange,
  itemToEdit,
  onSave,
}: WishlistDialogProps) {
  const [name, setName] = React.useState('')
  const [priceInput, setPriceInput] = React.useState('')
  const [nameError, setNameError] = React.useState<string | null>(null)
  const [priceError, setPriceError] = React.useState<string | null>(null)

  const isEditing = Boolean(itemToEdit)

  React.useEffect(() => {
    if (open) {
      if (itemToEdit) {
        setName(itemToEdit.name)
        setPriceInput(itemToEdit.price.toString())
      } else {
        setName('')
        setPriceInput('')
      }
      setNameError(null)
      setPriceError(null)
    }
  }, [open, itemToEdit])

  const parsedPrice = React.useMemo(
    () => parseIntegerAmount(priceInput),
    [priceInput],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let hasError = false

    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Nama item wajib diisi')
      hasError = true
    } else {
      setNameError(null)
    }

    if (priceInput.trim() === '') {
      setPriceError('Harga item wajib diisi')
      hasError = true
    } else if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setPriceError('Harga harus berupa angka valid (minimal 0)')
      hasError = true
    } else {
      setPriceError(null)
    }

    if (hasError) return

    onSave(trimmedName, parsedPrice)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Wishlist Item' : 'Tambah Wishlist Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Perbarui nama atau harga target barang wishlist.'
                : 'Catat nama dan perkiraan harga barang yang ingin kamu beli.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Nama item */}
            <div className="space-y-1.5">
              <label
                htmlFor="item-name"
                className="text-sm font-medium text-foreground"
              >
                Nama Barang <span className="text-destructive">*</span>
              </label>
              <Input
                id="item-name"
                type="text"
                autoFocus
                placeholder="Misal: Sony WH-1000XM5"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError(null)
                }}
              />
              {nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
            </div>

            {/* Harga item */}
            <div className="space-y-1.5">
              <label
                htmlFor="item-price"
                className="text-sm font-medium text-foreground"
              >
                Harga Target (Rp) <span className="text-destructive">*</span>
              </label>
              <Input
                id="item-price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Contoh: 4500000"
                value={priceInput}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '')
                  setPriceInput(cleaned)
                  if (priceError) setPriceError(null)
                }}
              />
              {priceError ? (
                <p className="text-xs text-destructive">{priceError}</p>
              ) : (
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <span>Nominal terformat:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(parsedPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
