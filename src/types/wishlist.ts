export interface WishlistItem {
  id: string
  name: string
  price: number
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface FinancialState {
  savings: number
}

export type FilterType = 'all' | 'pending' | 'completed'

export type SortType = 'newest' | 'price-desc' | 'price-asc'

export interface CalculationResult {
  totalPrice: number
  completedPrice: number
  remainingPrice: number
  shortage: number
  surplus: number
  progress: number
  isAllCompleted: boolean
  isFundSufficient: boolean
}

export interface AppData {
  items: WishlistItem[]
  savings: number
  pinHash?: string | null
}
