import PropTypes from 'prop-types'
import { STATUS_LIST } from '../../context/statusList'
import './BookFilter.css'

const OPTIONS = [{ value: 'semua', label: 'Semua' }, ...STATUS_LIST]

// Kolom pencarian + tombol filter status
export default function BookFilter({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="book-filter">
      <div className="field">
        <label htmlFor="search">Cari judul / penulis</label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ketik kata kunci..."
        />
      </div>

      <div className="field">
        <span className="filter-label">Filter status</span>
        <div className="pills" role="group" aria-label="Filter status">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`pill ${status === opt.value ? 'active' : ''}`}
              aria-pressed={status === opt.value}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

BookFilter.propTypes = {
  search: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}
