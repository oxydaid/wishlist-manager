import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatIDR(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return 'Rp0'
  }
  return idrFormatter.format(amount)
}

export function parseIntegerAmount(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0
  }
  const clean = value.replace(/[^0-9]/g, '')
  if (!clean) return 0
  const parsed = parseInt(clean, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}
