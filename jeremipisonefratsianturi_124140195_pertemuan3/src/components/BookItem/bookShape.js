import PropTypes from 'prop-types'

// Bentuk data satu buku, dipakai ulang oleh BookItem dan BookList
export const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
})
