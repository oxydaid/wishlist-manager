import * as React from 'react'
import { useWishlist } from '@/hooks/useWishlist'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from '@/components/layout/Navbar'
import { FinancialSummary } from '@/components/financial/FinancialSummary'
import { WishlistToolbar } from '@/components/wishlist/WishlistToolbar'
import { WishlistItemCard } from '@/components/wishlist/WishlistItemCard'
import { WishlistEmptyState } from '@/components/wishlist/WishlistEmptyState'
import { WishlistDialog } from '@/components/wishlist/WishlistDialog'
import { DeleteConfirmDialog } from '@/components/wishlist/DeleteConfirmDialog'
import { PinLockScreen } from '@/components/wishlist/PinLockScreen'
import { PinDialog } from '@/components/wishlist/PinDialog'
import { DataBackupDialog } from '@/components/wishlist/DataBackupDialog'
import type { WishlistItem } from '@/types/wishlist'
import { Plus } from 'lucide-react'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    items,
    savings,
    hasPin,
    isLocked,
    filter,
    sort,
    calculations,
    filteredAndSortedItems,
    setFilter,
    setSort,
    addItem,
    updateItem,
    toggleItemCompleted,
    deleteItem,
    setSavings,
    setupPin,
    removePin,
    unlock,
    lock,
    exportData,
    importData,
  } = useWishlist()

  // Dialog States
  const [wishlistDialogOpen, setWishlistDialogOpen] = React.useState(false)
  const [itemToEdit, setItemToEdit] = React.useState<WishlistItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<WishlistItem | null>(null)

  const [pinDialogOpen, setPinDialogOpen] = React.useState(false)
  const [backupDialogOpen, setBackupDialogOpen] = React.useState(false)

  // Item counts for filter tabs
  const counts = React.useMemo(() => {
    return {
      all: items.length,
      pending: items.filter((i) => !i.completed).length,
      completed: items.filter((i) => i.completed).length,
    }
  }, [items])

  const handleAddNew = () => {
    setItemToEdit(null)
    setWishlistDialogOpen(true)
  }

  const handleEditItem = (item: WishlistItem) => {
    setItemToEdit(item)
    setWishlistDialogOpen(true)
  }

  const handleDeleteItem = (item: WishlistItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleSaveItem = (name: string, price: number) => {
    if (itemToEdit) {
      updateItem(itemToEdit.id, { name, price })
    } else {
      addItem(name, price)
    }
  }

  // If locked, render lock screen
  if (isLocked) {
    return <PinLockScreen onUnlock={unlock} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar
        hasPin={hasPin}
        onOpenPinDialog={() => setPinDialogOpen(true)}
        onOpenBackupDialog={() => setBackupDialogOpen(true)}
        onAddNew={handleAddNew}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-6 pb-24 sm:pb-12">
        {/* Financial Summary & Calculations */}
        <FinancialSummary
          savings={savings}
          calculations={calculations}
          totalItemCount={items.length}
          onUpdateSavings={setSavings}
        />

        {/* Wishlist Header & Filter / Sort Toolbar */}
        <section className="space-y-3" aria-label="Daftar Wishlist">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Daftar Wishlist
              </h2>
              <p className="text-xs text-muted-foreground">
                Centang barang yang sudah berhasil kamu beli.
              </p>
            </div>
          </div>

          <WishlistToolbar
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
            onAddNew={handleAddNew}
            counts={counts}
          />

          {/* List or Empty State */}
          <div className="space-y-2 pt-1">
            {items.length === 0 ? (
              <WishlistEmptyState type="no-data" onAddNew={handleAddNew} />
            ) : filteredAndSortedItems.length === 0 ? (
              filter === 'pending' && counts.all > 0 && counts.pending === 0 ? (
                <WishlistEmptyState type="all-completed" onAddNew={handleAddNew} />
              ) : (
                <WishlistEmptyState type="no-filter-match" />
              )
            ) : (
              filteredAndSortedItems.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  onToggle={toggleItemCompleted}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Floating Add Button for Mobile (PRD section 12) */}
      <div className="sm:hidden fixed bottom-5 right-5 z-20">
        <button
          type="button"
          onClick={handleAddNew}
          aria-label="Tambah item wishlist baru"
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals & Dialogs */}
      <WishlistDialog
        open={wishlistDialogOpen}
        onOpenChange={setWishlistDialogOpen}
        itemToEdit={itemToEdit}
        onSave={handleSaveItem}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={itemToDelete}
        onConfirm={deleteItem}
      />

      <PinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        hasPin={hasPin}
        onSetupPin={setupPin}
        onRemovePin={removePin}
        onManualLock={lock}
      />

      <DataBackupDialog
        open={backupDialogOpen}
        onOpenChange={setBackupDialogOpen}
        onExport={exportData}
        onImport={importData}
      />
    </div>
  )
}
