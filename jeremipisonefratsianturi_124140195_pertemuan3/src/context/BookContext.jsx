import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '../hooks/useLocalStorage'

const BookContext = createContext(null)

/**
 * Provider untuk state management buku (Context API).
 * Data disimpan persisten di localStorage melalui useLocalStorage.
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('books', [])

  const addBook = (data) => {
    const book = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: data.title.trim(),
      author: data.author.trim(),
      status: data.status,
      createdAt: new Date().toISOString(),
    }
    setBooks((prev) => [book, ...prev])
  }

  const updateBook = (id, data) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, title: data.title.trim(), author: data.author.trim(), status: data.status } : b,
      ),
    )
  }

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  )
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Hook pembantu untuk mengakses context buku
// eslint-disable-next-line react-refresh/only-export-components
export function useBooks() {
  const ctx = useContext(BookContext)
  if (!ctx) throw new Error('useBooks harus dipakai di dalam <BookProvider>')
  return ctx
}
