import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo">
            <span className="navbar__logo-w">W1</span>
            <div className="navbar__logo-divider"></div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-sol">Sol</span>
              <span className="navbar__logo-amp">&</span>
              <span className="navbar__logo-sombra">Sombra</span>
            </div>
          </div>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link
            to="/"
            className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Início
          </Link>
          <Link
            to="/#trilhas"
            className="navbar__link"
            onClick={() => setMenuOpen(false)}
          >
            Trilhas
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`navbar__link ${location.pathname === '/dashboard' ? 'navbar__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Meu Painel
              </Link>
              <div className="navbar__user">
                <img
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=32DDC9&color=05171E`}
                  alt="Avatar"
                  className="navbar__avatar"
                />
                <button onClick={handleSignOut} className="navbar__signout">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Entrar
            </Link>
          )}
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
          id="navbar-hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
