import type { AppData, WishlistItem } from '@/types/wishlist'

export const STORAGE_KEY = 'wishlist-manager:data'

export const INITIAL_DATA: AppData = {
  items: [],
  savings: 0,
  pinHash: null,
}

// In-memory fallback if localStorage is blocked (e.g. strict private mode)
let memoryFallback: string | null = null

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function sanitizeItem(raw: unknown): WishlistItem | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<WishlistItem>

  if (typeof item.id !== 'string' || !item.id.trim()) return null
  if (typeof item.name !== 'string' || !item.name.trim()) return null

  const price = typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
    ? Math.floor(item.price)
    : 0

  return {
    id: String(item.id),
    name: String(item.name).trim(),
    price,
    completed: Boolean(item.completed),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
  }
}

export function sanitizeAppData(raw: unknown): AppData {
  if (!raw || typeof raw !== 'object') {
    return { ...INITIAL_DATA }
  }

  const data = raw as Partial<AppData>
  const rawItems = Array.isArray(data.items) ? data.items : []
  const items: WishlistItem[] = []

  for (const item of rawItems) {
    const sanitized = sanitizeItem(item)
    if (sanitized) {
      items.push(sanitized)
    }
  }

  const savings =
    typeof data.savings === 'number' && Number.isFinite(data.savings) && data.savings >= 0
      ? Math.floor(data.savings)
      : 0

  const pinHash =
    typeof data.pinHash === 'string' && data.pinHash.trim().length > 0
      ? data.pinHash.trim()
      : null

  return {
    items,
    savings,
    pinHash,
  }
}

export function loadAppData(): AppData {
  try {
    let rawJson: string | null = null
    if (isLocalStorageAvailable()) {
      rawJson = window.localStorage.getItem(STORAGE_KEY)
    } else {
      rawJson = memoryFallback
    }

    if (!rawJson) {
      return { ...INITIAL_DATA }
    }

    const parsed = JSON.parse(rawJson)
    return sanitizeAppData(parsed)
  } catch (error) {
    console.warn('Gagal memuat data dari localStorage, menggunakan initial state:', error)
    return { ...INITIAL_DATA }
  }
}

export function saveAppData(data: AppData): boolean {
  try {
    const sanitized = sanitizeAppData(data)
    const jsonString = JSON.stringify(sanitized)

    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, jsonString)
    } else {
      memoryFallback = jsonString
    }
    return true
  } catch (error) {
    console.error('Gagal menyimpan data ke localStorage:', error)
    return false
  }
}

/**
 * Hash PIN using Web Crypto API SHA-256
 */
export async function hashPin(pin: string): Promise<string> {
  const trimmed = pin.trim()
  if (trimmed.length < 4) {
    throw new Error('PIN minimal 4 digit')
  }

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(`salt_wishlist_${trimmed}`)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  // Fallback for non-crypto environments
  let hash = 0
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i)
    hash |= 0
  }
  return `fallback_${Math.abs(hash)}`
}

export function validateImportJson(jsonString: string): { success: boolean; data?: AppData; error?: string } {
  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Format JSON tidak valid atau bukan objek.' }
    }

    if (!('items' in parsed) || !Array.isArray(parsed.items)) {
      return { success: false, error: 'Data tidak memiliki daftar item yang valid (properti "items" hilang atau bukan array).' }
    }

    const sanitized = sanitizeAppData(parsed)
    return { success: true, data: sanitized }
  } catch (err) {
    return { success: false, error: `Gagal membaca file JSON: ${err instanceof Error ? err.message : 'Format rusak'}` }
  }
}

export function exportAppDataToFile(data: AppData): void {
  const exportPayload = {
    app: 'Wishlist Manager',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    ...sanitizeAppData(data),
  }

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `wishlist-manager-backup-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const SESSION_UNLOCKED_KEY = 'wishlist-manager:session-unlocked'

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as unknown as { standalone?: boolean }).standalone)
  )
}

export function isSessionUnlocked(): boolean {
  if (typeof window === 'undefined') return false
  // For PWA: never trust persistent session unlock across app restarts/closes
  if (isStandalonePwa()) return false
  try {
    return window.sessionStorage?.getItem(SESSION_UNLOCKED_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSessionUnlocked(unlocked: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (unlocked) {
      if (!isStandalonePwa()) {
        window.sessionStorage?.setItem(SESSION_UNLOCKED_KEY, 'true')
      }
    } else {
      window.sessionStorage?.removeItem(SESSION_UNLOCKED_KEY)
    }
  } catch {
    // ignore
  }
}

