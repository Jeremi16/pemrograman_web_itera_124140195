import { NavLink, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import Stats from './pages/Stats/Stats'

function NotFound() {
  return (
    <section className="card">
      <h2>Halaman tidak ditemukan</h2>
      <p className="hint">
        Kembali ke <Link to="/">daftar buku</Link>.
      </p>
    </section>
  )
}

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="container header-inner">
          <div>
            <h1>Rak Buku Pribadi</h1>
            <p className="subtitle">Catat buku yang dimiliki, sedang dibaca, atau ingin dibeli</p>
          </div>
          {/* Navigasi multi-halaman dengan React Router */}
          <nav className="nav">
            <NavLink to="/" end>Buku</NavLink>
            <NavLink to="/stats">Statistik</NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">Jeremi Pisonefrat Sianturi · 124140195 · Pemrograman Web</footer>
    </>
  )
}
