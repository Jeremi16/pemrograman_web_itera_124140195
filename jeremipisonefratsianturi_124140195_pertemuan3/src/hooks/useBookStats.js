import { useMemo } from 'react'
import { STATUS_LIST } from '../context/statusList'

/**
 * Custom hook: menghitung statistik buku (total, jumlah & persentase per status).
 * useMemo agar hanya dihitung ulang ketika daftar buku berubah.
 */
export default function useBookStats(books) {
  return useMemo(() => {
    const total = books.length
    const byStatus = {}
    STATUS_LIST.forEach(({ value }) => {
      const count = books.filter((b) => b.status === value).length
      byStatus[value] = {
        count,
        percent: total === 0 ? 0 : Math.round((count / total) * 100),
      }
    })
    return { total, byStatus }
  }, [books])
}
