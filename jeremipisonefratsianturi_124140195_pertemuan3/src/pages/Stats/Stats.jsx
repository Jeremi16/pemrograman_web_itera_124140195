import { useEffect } from 'react'
import { useBooks } from '../../context/BookContext'
import { STATUS_LIST } from '../../context/statusList'
import useBookStats from '../../hooks/useBookStats'
import './Stats.css'

export default function Stats() {
  const { books } = useBooks()
  const { total, byStatus } = useBookStats(books)

  useEffect(() => {
    document.title = 'Statistik · Rak Buku'
  }, [])

  return (
    <div className="grid">
      <section className="card">
        <h2>Ringkasan</h2>
        <dl className="summary">
          {STATUS_LIST.map((s) => (
            <div className="row" key={s.value}>
              <dt>{s.label}</dt>
              <dd>{byStatus[s.value].count}</dd>
            </div>
          ))}
          <div className="row grand">
            <dt>Total buku</dt>
            <dd>{total}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2>Persentase</h2>
        {total === 0 ? (
          <p className="empty">Belum ada data buku.</p>
        ) : (
          STATUS_LIST.map((s) => (
            <div className="bar-item" key={s.value}>
              <div className="bar-label">
                <span>{s.label}</span>
                <span>{byStatus[s.value].percent}%</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${byStatus[s.value].percent}%` }} />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
