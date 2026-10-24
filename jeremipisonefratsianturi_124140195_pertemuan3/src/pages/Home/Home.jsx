import { useEffect, useState } from 'react'
import { useBooks } from '../../context/BookContext'
import BookForm from '../../components/BookForm/BookForm'
import BookFilter from '../../components/BookFilter/BookFilter'
import BookList from '../../components/BookList/BookList'
import './Home.css'

export default function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('semua')
  const [editing, setEditing] = useState(null)

  // Judul tab browser ikut menampilkan jumlah buku
  useEffect(() => {
    document.title = `Rak Buku (${books.length})`
  }, [books.length])

  // Filter berdasarkan status, lalu cari pada judul atau penulis
  const keyword = search.trim().toLowerCase()
  const visible = books.filter((b) => {
    const matchStatus = status === 'semua' || b.status === status
    const matchSearch =
      !keyword || b.title.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword)
    return matchStatus && matchSearch
  })

  const handleSubmit = (values) => {
    if (editing) {
      updateBook(editing.id, values)
      setEditing(null)
    } else {
      addBook(values)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Hapus buku ini?')) {
      deleteBook(id)
      if (editing?.id === id) setEditing(null)
    }
  }

  return (
    <>
      <div className="grid">
        <section className="card">
          <h2>{editing ? 'Edit Buku' : 'Tambah Buku'}</h2>
          <BookForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
        </section>

        <section className="card">
          <h2>Cari &amp; Filter</h2>
          <BookFilter search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
          <p className="hint">Menampilkan {visible.length} dari {books.length} buku.</p>
        </section>
      </div>

      <section className="card">
        <div className="table-head">
          <h2>Daftar Buku</h2>
          <span className="count">{visible.length} buku</span>
        </div>
        <BookList books={visible} onEdit={setEditing} onDelete={handleDelete} />
      </section>
    </>
  )
}
