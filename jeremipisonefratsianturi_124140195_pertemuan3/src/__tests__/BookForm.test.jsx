import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BookForm from '../components/BookForm/BookForm'

describe('BookForm', () => {
  it('menampilkan pesan error dan tidak submit saat kolom kosong', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /tambah buku/i }))

    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Pilih status buku')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveClass('invalid')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('memanggil onSubmit dengan data valid lalu mengosongkan form', async () => {
    const onSubmit = vi.fn()
    render(<BookForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Judul'), 'Bumi Manusia')
    await userEvent.type(screen.getByLabelText('Penulis'), 'Pramoedya')
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'baca')
    await userEvent.click(screen.getByRole('button', { name: /tambah buku/i }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Bumi Manusia', author: 'Pramoedya', status: 'baca' })
    expect(screen.getByLabelText('Judul')).toHaveValue('')
  })

  it('mengisi data awal saat mode edit', () => {
    render(
      <BookForm initialData={{ title: 'Laut Bercerita', author: 'Leila', status: 'milik' }} onSubmit={vi.fn()} />,
    )
    expect(screen.getByLabelText('Judul')).toHaveValue('Laut Bercerita')
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeInTheDocument()
  })
})
