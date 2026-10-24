import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BookProvider } from '../context/BookContext'
import App from '../App'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BookProvider>
        <App />
      </BookProvider>
    </MemoryRouter>,
  )
}

async function addBook(title, author, status) {
  await userEvent.type(screen.getByLabelText('Judul'), title)
  await userEvent.type(screen.getByLabelText('Penulis'), author)
  await userEvent.selectOptions(screen.getByLabelText('Status'), status)
  await userEvent.click(screen.getByRole('button', { name: /tambah buku/i }))
}

describe('App (integrasi)', () => {
  it('menambah buku, menyimpan ke localStorage, lalu filter & cari', async () => {
    renderApp()
    await addBook('Negeri 5 Menara', 'Ahmad Fuadi', 'milik')
    await addBook('Filosofi Teras', 'Henry Manampiring', 'beli')

    const table = screen.getByRole('table')
    expect(within(table).getByText('Negeri 5 Menara')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('books'))).toHaveLength(2)

    // Filter status "Ingin Dibeli"
    await userEvent.click(screen.getByRole('button', { name: 'Ingin Dibeli' }))
    expect(screen.queryByText('Negeri 5 Menara')).not.toBeInTheDocument()
    expect(screen.getByText('Filosofi Teras')).toBeInTheDocument()

    // Kembali ke semua, lalu cari berdasarkan nama penulis
    await userEvent.click(screen.getByRole('button', { name: 'Semua' }))
    await userEvent.type(screen.getByLabelText(/cari judul/i), 'fuadi')
    expect(screen.getByText('Negeri 5 Menara')).toBeInTheDocument()
    expect(screen.queryByText('Filosofi Teras')).not.toBeInTheDocument()
  })

  it('mengedit buku yang sudah ada', async () => {
    renderApp()
    await addBook('Judul Lama', 'Penulis', 'milik')

    await userEvent.click(screen.getByRole('button', { name: 'Edit Judul Lama' }))
    const title = screen.getByLabelText('Judul')
    await userEvent.clear(title)
    await userEvent.type(title, 'Judul Baru')
    await userEvent.click(screen.getByRole('button', { name: /simpan perubahan/i }))

    expect(screen.getByText('Judul Baru')).toBeInTheDocument()
    expect(screen.queryByText('Judul Lama')).not.toBeInTheDocument()
  })

  it('navigasi ke halaman statistik', async () => {
    renderApp()
    await addBook('Satu', 'A', 'baca')
    await userEvent.click(screen.getByRole('link', { name: 'Statistik' }))
    expect(screen.getByText('Ringkasan')).toBeInTheDocument()
    expect(screen.getByText('Total buku').nextSibling).toHaveTextContent('1')
  })
})
