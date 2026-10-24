import { useEffect, useState } from 'react'

/**
 * Custom hook: state yang otomatis tersimpan di localStorage.
 * Nilai awal dibaca sekali dari localStorage (lazy initializer),
 * lalu setiap perubahan disimpan kembali lewat useEffect.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      // Data rusak atau localStorage tidak tersedia: pakai nilai awal
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Abaikan jika storage penuh atau diblokir browser
    }
  }, [key, value])

  return [value, setValue]
}
