import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { STATUS_LIST } from '../../context/statusList'
import './BookForm.css'

const EMPTY = { title: '', author: '', status: '' }

// Validasi kolom wajib isi, mengembalikan objek pesan error per kolom
function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Judul buku wajib diisi'
  if (!values.author.trim()) errors.author = 'Nama penulis wajib diisi'
  if (!values.status) errors.status = 'Pilih status buku'
  return errors
}

/**
 * Form tambah / edit buku.
 * Jika initialData diberikan, form berada dalam mode edit.
 */
export default function BookForm({ initialData = null, onSubmit, onCancel = () => {} }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  // Isi ulang form setiap kali buku yang diedit berganti
  useEffect(() => {
    setValues(
      initialData
        ? { title: initialData.title, author: initialData.author, status: initialData.status }
        : EMPTY,
    )
    setErrors({})
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Hapus error kolom tersebut begitu pengguna mulai mengisi
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    onSubmit(values)
    if (!initialData) setValues(EMPTY)
  }

  const isEdit = Boolean(initialData)

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Judul</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className={errors.title ? 'invalid' : ''}
          placeholder="cth. Laskar Pelangi"
          aria-invalid={Boolean(errors.title)}
        />
        <span className="error-msg">{errors.title}</span>
      </div>

      <div className="field">
        <label htmlFor="author">Penulis</label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          className={errors.author ? 'invalid' : ''}
          placeholder="cth. Andrea Hirata"
          aria-invalid={Boolean(errors.author)}
        />
        <span className="error-msg">{errors.author}</span>
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          className={errors.status ? 'invalid' : ''}
          aria-invalid={Boolean(errors.status)}
        >
          <option value="">-- Pilih status --</option>
          {STATUS_LIST.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <span className="error-msg">{errors.status}</span>
      </div>

      <div className="btn-row">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {isEdit && (
          <button type="button" className="btn" onClick={onCancel}>Batal</button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}
