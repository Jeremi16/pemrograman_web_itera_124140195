import { act, renderHook } from '@testing-library/react'
import useLocalStorage from '../hooks/useLocalStorage'
import useBookStats from '../hooks/useBookStats'

describe('useLocalStorage', () => {
  it('membaca nilai tersimpan dan menyimpan perubahan', () => {
    localStorage.setItem('test-key', JSON.stringify(['a']))
    const { result } = renderHook(() => useLocalStorage('test-key', []))
    expect(result.current[0]).toEqual(['a'])

    act(() => result.current[1](['a', 'b']))
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual(['a', 'b'])
  })

  it('memakai nilai awal jika data di localStorage rusak', () => {
    localStorage.setItem('rusak', '{bukan json')
    const { result } = renderHook(() => useLocalStorage('rusak', 'default'))
    expect(result.current[0]).toBe('default')
  })
})

describe('useBookStats', () => {
  it('menghitung total, jumlah, dan persentase per status', () => {
    const books = [
      { id: '1', status: 'milik' },
      { id: '2', status: 'milik' },
      { id: '3', status: 'baca' },
      { id: '4', status: 'beli' },
    ]
    const { result } = renderHook(() => useBookStats(books))
    expect(result.current.total).toBe(4)
    expect(result.current.byStatus.milik).toEqual({ count: 2, percent: 50 })
    expect(result.current.byStatus.baca.count).toBe(1)
    expect(result.current.byStatus.beli.percent).toBe(25)
  })
})
