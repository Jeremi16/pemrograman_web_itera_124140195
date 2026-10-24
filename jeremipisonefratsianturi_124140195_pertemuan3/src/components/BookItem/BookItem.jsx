import PropTypes from 'prop-types'
import StatusBadge from '../StatusBadge/StatusBadge'
import { bookShape } from './bookShape'

// Satu baris buku di dalam tabel
export default function BookItem({ book, index, onEdit, onDelete }) {
  return (
    <tr>
      <td className="col-no">{index + 1}</td>
      <td><strong>{book.title}</strong></td>
      <td>{book.author}</td>
      <td><StatusBadge status={book.status} /></td>
      <td className="actions">
        <button
          type="button"
          className="btn btn-small"
          onClick={() => onEdit(book)}
          aria-label={`Edit ${book.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={() => onDelete(book.id)}
          aria-label={`Hapus ${book.title}`}
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}

BookItem.propTypes = {
  book: bookShape.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
