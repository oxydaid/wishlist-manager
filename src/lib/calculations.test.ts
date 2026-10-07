import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateFinancials } from './calculations.js'
import type { WishlistItem } from '../types/wishlist.js'

function makeItem(id: string, name: string, price: number, completed = false): WishlistItem {
  return {
    id,
    name,
    price,
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

test('PRD Section 4 example matches calculations', () => {
  const items: WishlistItem[] = [
    makeItem('1', 'Laptop', 5_000_000, true),
    makeItem('2', 'Mouse', 500_000, true),
    makeItem('3', 'Keyboard', 1_000_000, false),
  ]
  const savings = 4_000_000

  const res = calculateFinancials(items, savings)

  assert.equal(res.totalPrice, 6_500_000)
  assert.equal(res.completedPrice, 5_500_000)
  assert.equal(res.remainingPrice, 1_000_000)
  assert.equal(res.shortage, 0)
  assert.equal(res.surplus, 3_000_000)
  assert.equal(res.progress, 84.6)
  assert.equal(res.isFundSufficient, true)
  assert.equal(res.isAllCompleted, false)
})

test('Empty wishlist returns zeroes and 0% progress', () => {
  const res = calculateFinancials([], 2_000_000)
  assert.equal(res.totalPrice, 0)
  assert.equal(res.completedPrice, 0)
  assert.equal(res.remainingPrice, 0)
  assert.equal(res.shortage, 0)
  assert.equal(res.surplus, 2_000_000)
  assert.equal(res.progress, 0)
  assert.equal(res.isAllCompleted, false)
  assert.equal(res.isFundSufficient, true)
})

test('All items completed returns 100% progress and isAllCompleted true', () => {
  const items: WishlistItem[] = [
    makeItem('1', 'Monitor', 3_000_000, true),
    makeItem('2', 'Stand', 500_000, true),
  ]
  const res = calculateFinancials(items, 1_000_000)

  assert.equal(res.totalPrice, 3_500_000)
  assert.equal(res.completedPrice, 3_500_000)
  assert.equal(res.remainingPrice, 0)
  assert.equal(res.shortage, 0)
  assert.equal(res.surplus, 1_000_000)
  assert.equal(res.progress, 100)
  assert.equal(res.isAllCompleted, true)
  assert.equal(res.isFundSufficient, true)
})

test('Shortage correctly calculated when savings < remaining', () => {
  const items: WishlistItem[] = [
    makeItem('1', 'Phone', 10_000_000, false),
  ]
  const savings = 3_000_000

  const res = calculateFinancials(items, savings)

  assert.equal(res.totalPrice, 10_000_000)
  assert.equal(res.completedPrice, 0)
  assert.equal(res.remainingPrice, 10_000_000)
  assert.equal(res.shortage, 7_000_000)
  assert.equal(res.surplus, 0)
  assert.equal(res.progress, 0)
  assert.equal(res.isFundSufficient, false)
  assert.equal(res.isAllCompleted, false)
})

test('Handles invalid and negative values safely', () => {
  const items: WishlistItem[] = [
    makeItem('1', 'Negative', -500),
    makeItem('2', 'NaN', NaN),
  ]
  const res = calculateFinancials(items, -1000)
  assert.equal(res.totalPrice, 0)
  assert.equal(res.completedPrice, 0)
  assert.equal(res.remainingPrice, 0)
  assert.equal(res.shortage, 0)
  assert.equal(res.surplus, 0)
  assert.equal(res.progress, 0)
})
