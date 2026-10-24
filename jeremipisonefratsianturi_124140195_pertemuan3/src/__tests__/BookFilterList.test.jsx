import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BookFilter from '../components/BookFilter/BookFilter'
import BookList from '../components/BookList/BookList'

describe('BookFilter', () => {
  it('memanggil callback pencarian dan filter status', async () => {
    const onSearchChange = vi.fn()
    const onStatusChange = vi.fn()
    render(
      <BookFilter search="" status="semua" onSearchChange={onSearchChange} onStatusChange={onStatusChange} />,
    )

    await userEvent.type(screen.getByLabelText(/cari judul/i), 'a')
    await userEvent.click(screen.getByRole('button', { name: 'Ingin Dibeli' }))

    expect(onSearchChange).toHaveBeenCalledWith('a')
    expect(onStatusChange).toHaveBeenCalledWith('beli')
  })
})

describe('BookList', () => {
  it('menampilkan pesan kosong jika tidak ada buku', () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/belum ada buku/i)).toBeInTheDocument()
  })

  it('menampilkan buku dan memanggil onDelete saat tombol hapus diklik', async () => {
    const onDelete = vi.fn()
    const books = [{ id: 'x1', title: 'Cantik Itu Luka', author: 'Eka Kurniawan', status: 'milik' }]
    render(<BookList books={books} onEdit={vi.fn()} onDelete={onDelete} />)

    expect(screen.getByText('Cantik Itu Luka')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Cantik Itu Luka' }))
    expect(onDelete).toHaveBeenCalledWith('x1')
  })
})
