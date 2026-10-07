import { Button } from '@/components/ui/button'
import { Sparkles, Plus, SearchX } from 'lucide-react'

interface WishlistEmptyStateProps {
  type: 'no-data' | 'all-completed' | 'no-filter-match'
  onAddNew?: () => void
}

export function WishlistEmptyState({
  type,
  onAddNew,
}: WishlistEmptyStateProps) {
  if (type === 'all-completed') {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          Semua wishlist sudah terpenuhi 🎉
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          Luar biasa! Semua barang yang kamu catat berhasil kamu beli. Ingin membuat wishlist baru?
        </p>
        {onAddNew && (
          <Button
            type="button"
            onClick={onAddNew}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Wishlist Baru
          </Button>
        )}
      </div>
    )
  }

  if (type === 'no-filter-match') {
    return (
      <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-card/40">
        <div className="w-10 h-10 mx-auto rounded-full bg-secondary text-muted-foreground flex items-center justify-center mb-2.5">
          <SearchX className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Tidak ada item
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tidak ada item wishlist yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/40">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3">
        <Plus className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        Wishlist masih kosong
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
        Tambahkan sesuatu yang ingin kamu capai atau beli dalam waktu dekat.
      </p>
      {onAddNew && (
        <Button
          type="button"
          onClick={onAddNew}
          className="mt-4 font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Wishlist
        </Button>
      )}
    </div>
  )
}
