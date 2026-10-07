import type { WishlistItem, CalculationResult } from '@/types/wishlist'

export function calculateFinancials(
  items: WishlistItem[],
  savings: number,
): CalculationResult {
  const safeSavings = Math.max(0, Number.isFinite(savings) ? savings : 0)

  let totalPrice = 0
  let completedPrice = 0
  let remainingPrice = 0

  for (const item of items) {
    const price = Math.max(0, Number.isFinite(item.price) ? item.price : 0)
    totalPrice += price
    if (item.completed) {
      completedPrice += price
    } else {
      remainingPrice += price
    }
  }

  const shortage = Math.max(0, remainingPrice - safeSavings)
  const surplus = Math.max(0, safeSavings - remainingPrice)

  const progress =
    totalPrice > 0 ? Math.min(100, Math.max(0, (completedPrice / totalPrice) * 100)) : 0

  const isAllCompleted = items.length > 0 && items.every((i) => i.completed)
  const isFundSufficient = safeSavings >= remainingPrice

  return {
    totalPrice,
    completedPrice,
    remainingPrice,
    shortage,
    surplus,
    progress: Number(progress.toFixed(1)),
    isAllCompleted,
    isFundSufficient,
  }
}
