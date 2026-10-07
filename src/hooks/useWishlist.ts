import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  WishlistItem,
  FilterType,
  SortType,
  CalculationResult,
  AppData,
} from '@/types/wishlist'
import {
  loadAppData,
  saveAppData,
  hashPin,
  exportAppDataToFile,
  validateImportJson,
} from '@/lib/storage'
import { calculateFinancials } from '@/lib/calculations'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function useWishlist() {
  const [data, setData] = useState<AppData>(() => loadAppData())
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const initial = loadAppData()
    return Boolean(initial.pinHash && initial.pinHash.length > 0)
  })

  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')

  // Auto-persist whenever data changes
  useEffect(() => {
    saveAppData(data)
  }, [data])

  const calculations: CalculationResult = useMemo(() => {
    return calculateFinancials(data.items, data.savings)
  }, [data.items, data.savings])

  const filteredAndSortedItems = useMemo(() => {
    let result = [...data.items]

    if (filter === 'pending') {
      result = result.filter((i) => !i.completed)
    } else if (filter === 'completed') {
      result = result.filter((i) => i.completed)
    }

    result.sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sort === 'price-desc') {
        return b.price - a.price
      }
      if (sort === 'price-asc') {
        return a.price - b.price
      }
      return 0
    })

    return result
  }, [data.items, filter, sort])

  const addItem = useCallback((name: string, price: number) => {
    const trimmed = name.trim()
    if (!trimmed) {
      throw new Error('Nama item tidak boleh kosong')
    }
    const safePrice = Math.max(0, Math.floor(Number.isFinite(price) ? price : 0))

    const now = new Date().toISOString()
    const newItem: WishlistItem = {
      id: generateId(),
      name: trimmed,
      price: safePrice,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    setData((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
    }))
  }, [])

  const updateItem = useCallback(
    (
      id: string,
      updates: Partial<Pick<WishlistItem, 'name' | 'price' | 'completed'>>,
    ) => {
      setData((prev) => {
        const index = prev.items.findIndex((i) => i.id === id)
        if (index === -1) return prev

        const current = prev.items[index]
        const now = new Date().toISOString()

        let nextName = current.name
        if (updates.name !== undefined) {
          const trimmed = updates.name.trim()
          if (!trimmed) throw new Error('Nama item tidak boleh kosong')
          nextName = trimmed
        }

        let nextPrice = current.price
        if (updates.price !== undefined) {
          nextPrice = Math.max(
            0,
            Math.floor(Number.isFinite(updates.price) ? updates.price : 0),
          )
        }

        const nextCompleted =
          updates.completed !== undefined ? updates.completed : current.completed

        const updatedItem: WishlistItem = {
          ...current,
          name: nextName,
          price: nextPrice,
          completed: nextCompleted,
          updatedAt: now,
        }

        const nextItems = [...prev.items]
        nextItems[index] = updatedItem

        return { ...prev, items: nextItems }
      })
    },
    [],
  )

  const toggleItemCompleted = useCallback((id: string) => {
    setData((prev) => {
      const target = prev.items.find((i) => i.id === id)
      if (!target) return prev
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: !item.completed,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      }
    })
  }, [])

  const deleteItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }))
  }, [])

  const setSavings = useCallback((amount: number) => {
    const safeAmount = Math.max(
      0,
      Math.floor(Number.isFinite(amount) ? amount : 0),
    )
    setData((prev) => ({
      ...prev,
      savings: safeAmount,
    }))
  }, [])

  const setupPin = useCallback(async (newPin: string) => {
    const hash = await hashPin(newPin)
    setData((prev) => ({
      ...prev,
      pinHash: hash,
    }))
    setIsLocked(false)
  }, [])

  const removePin = useCallback(() => {
    setData((prev) => ({
      ...prev,
      pinHash: null,
    }))
    setIsLocked(false)
  }, [])

  const unlock = useCallback(
    async (enteredPin: string): Promise<boolean> => {
      if (!data.pinHash) {
        setIsLocked(false)
        return true
      }
      try {
        const hash = await hashPin(enteredPin)
        if (hash === data.pinHash) {
          setIsLocked(false)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    [data.pinHash],
  )

  const lock = useCallback(() => {
    if (data.pinHash) {
      setIsLocked(true)
    }
  }, [data.pinHash])

  const exportData = useCallback(() => {
    exportAppDataToFile(data)
  }, [data])

  const importData = useCallback((jsonString: string) => {
    const result = validateImportJson(jsonString)
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Format file tidak valid')
    }
    setData(result.data)
    if (result.data.pinHash) {
      setIsLocked(true)
    } else {
      setIsLocked(false)
    }
  }, [])

  return {
    items: data.items,
    savings: data.savings,
    hasPin: Boolean(data.pinHash),
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
  }
}
