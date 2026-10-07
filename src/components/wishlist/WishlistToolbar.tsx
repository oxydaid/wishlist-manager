import { Button } from '@/components/ui/button'
import type { FilterType, SortType } from '@/types/wishlist'
import { Plus, ArrowUpDown } from 'lucide-react'

interface WishlistToolbarProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  sort: SortType
  onSortChange: (sort: SortType) => void
  onAddNew: () => void
  counts: {
    all: number
    pending: number
    completed: number
  }
}

export function WishlistToolbar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onAddNew,
  counts,
}: WishlistToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-secondary/60 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            filter === 'all'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Semua</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('pending')}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            filter === 'pending'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Belum dibeli</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
            {counts.pending}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('completed')}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            filter === 'completed'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Sudah dibeli</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Sorting & Add Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:flex-initial">
          <label htmlFor="sort-select" className="sr-only">
            Urutkan berdasarkan
          </label>
          <div className="flex items-center h-9 px-2.5 rounded-lg border border-input bg-card text-xs font-medium text-foreground gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1 w-full"
            >
              <option value="newest" className="bg-card text-foreground">
                Terbaru
              </option>
              <option value="price-desc" className="bg-card text-foreground">
                Harga tertinggi
              </option>
              <option value="price-asc" className="bg-card text-foreground">
                Harga terendah
              </option>
            </select>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAddNew}
          size="sm"
          className="h-9 px-3.5 font-semibold shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Tambah</span>
        </Button>
      </div>
    </div>
  )
}
