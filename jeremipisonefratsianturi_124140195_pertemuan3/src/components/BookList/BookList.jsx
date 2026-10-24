import PropTypes from 'prop-types'
import BookItem from '../BookItem/BookItem'
import { bookShape } from '../BookItem/bookShape'
import './BookList.css'

// Tabel daftar buku; menampilkan pesan kosong bila tidak ada data
export default function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty">Belum ada buku yang cocok.</p>
  }

  return (
    <div className="table-wrap">
      <table className="book-table">
        <thead>
          <tr>
            <th className="col-no">#</th>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Status</th>
            <th className="actions">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, i) => (
            <BookItem key={book.id} book={book} index={i} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
