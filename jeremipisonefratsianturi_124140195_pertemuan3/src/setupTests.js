import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Bersihkan DOM & localStorage setelah setiap test
afterEach(() => {
  cleanup()
  localStorage.clear()
})
