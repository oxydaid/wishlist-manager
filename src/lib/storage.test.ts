import test from 'node:test'
import assert from 'node:assert/strict'
import {
  sanitizeAppData,
  validateImportJson,
  isSessionUnlocked,
  setSessionUnlocked,
  isStandalonePwa,
} from './storage.js'

test('sanitizeAppData falls back cleanly when given corrupted or invalid inputs', () => {
  const result = sanitizeAppData(null)
  assert.deepEqual(result, {
    items: [],
    savings: 0,
    pinHash: null,
  })

  const corrupt = sanitizeAppData({
    items: [
      { id: '1', name: 'Valid Item', price: 50000, completed: true },
      { id: '', name: 'Invalid No ID', price: 100 },
      { id: '3', name: '', price: 200 },
      { id: '4', name: 'Negative price', price: -500 },
      'totally not an object',
    ],
    savings: -2000,
    pinHash: '',
  })

  assert.equal(corrupt.items.length, 2)
  assert.equal(corrupt.items[0].name, 'Valid Item')
  assert.equal(corrupt.items[0].price, 50000)
  assert.equal(corrupt.items[0].completed, true)
  assert.equal(corrupt.items[1].name, 'Negative price')
  assert.equal(corrupt.items[1].price, 0)
  assert.equal(corrupt.savings, 0)
  assert.equal(corrupt.pinHash, null)
})

test('validateImportJson validates valid JSON import payload', () => {
  const validJson = JSON.stringify({
    items: [{ id: 'item_1', name: 'MacBook Air', price: 15000000, completed: false }],
    savings: 10000000,
  })

  const res = validateImportJson(validJson)
  assert.equal(res.success, true)
  assert.ok(res.data)
  assert.equal(res.data.items.length, 1)
  assert.equal(res.data.savings, 10000000)
})

test('validateImportJson rejects corrupted or invalid JSON format', () => {
  const invalidJson = '{ bad json syntax '
  const res1 = validateImportJson(invalidJson)
  assert.equal(res1.success, false)

  const missingItems = JSON.stringify({ savings: 5000 })
  const res2 = validateImportJson(missingItems)
  assert.equal(res2.success, false)
})

test('session unlock helpers work safely in non-browser/node environment', () => {
  // In node.js (no window), isStandalonePwa should return false safely
  assert.equal(isStandalonePwa(), false)
  assert.equal(isSessionUnlocked(), false)
  // setSessionUnlocked should not throw
  assert.doesNotThrow(() => {
    setSessionUnlocked(true)
    setSessionUnlocked(false)
  })
})

