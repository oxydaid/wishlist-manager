import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { formatIDR } from '@/lib/utils'
import type { WishlistItem } from '@/types/wishlist'
import { Pencil, Trash2 } from 'lucide-react'

interface WishlistItemCardProps {
  item: WishlistItem
  onToggle: (id: string) => void
  onEdit: (item: WishlistItem) => void
  onDelete: (item: WishlistItem) => void
}

export function WishlistItemCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}: WishlistItemCardProps) {
  return (
    <Card
      className={`transition-all duration-200 border ${
        item.completed
          ? 'bg-card/40 opacity-75 border-border/40'
          : 'bg-card hover:border-border/90'
      }`}
    >
      <CardContent className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
        {/* Left: Checkbox & Name / Price */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <Checkbox
            id={`item-check-${item.id}`}
            checked={item.completed}
            onCheckedChange={() => onToggle(item.id)}
            aria-label={`Tandai ${item.name} sebagai ${item.completed ? 'belum selesai' : 'selesai'}`}
          />

          <div className="min-w-0 flex-1">
            <label
              htmlFor={`item-check-${item.id}`}
              className={`block text-sm font-semibold truncate cursor-pointer transition-colors ${
                item.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {item.name}
            </label>

            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs font-semibold ${
                  item.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-primary'
                }`}
              >
                {formatIDR(item.price)}
              </span>

              {item.completed && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-medium px-1.5 py-0.2 rounded">
                  Sudah Terbeli
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label={`Hapus ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
