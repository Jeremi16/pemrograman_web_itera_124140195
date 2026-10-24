import PropTypes from 'prop-types'
import { STATUS_LIST } from '../../context/statusList'
import './StatusBadge.css'

// Badge kecil berbentuk pill untuk menampilkan status buku
export default function StatusBadge({ status }) {
  const label = STATUS_LIST.find((s) => s.value === status)?.label ?? status
  return <span className={`badge badge-${status}`}>{label}</span>
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
}
