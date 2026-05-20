import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { user, authorized, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && authorized) {
      navigate('/dashboard')
    }
  }, [user, authorized, loading, navigate])

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <div className="login">
      <div className="login__bg">
        <div className="login__bg-gradient"></div>
        <div className="login__grid"></div>
        <div className="login__orb login__orb--1"></div>
        <div className="login__orb login__orb--2"></div>
      </div>

      <div className="login__container">
        <div className="login__card">
          {/* Header */}
          <div className="login__header">
            <Link to="/" className="login__back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar ao início
            </Link>

            <div className="login__brand">
              <span className="login__brand-w">W1 Goiânia</span>
              <span className="login__brand-divider">·</span>
              <span className="login__brand-name">Sol e Sombra</span>
            </div>

            <h1 className="login__title">Bem-vindo de volta</h1>
            <p className="login__subtitle">
              Acesse o portal de treinamentos com sua conta Google autorizada pelo escritório W1 Goiânia.
            </p>
          </div>

          {/* Login Button */}
          <div className="login__body">
            <button
              className="login__google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              id="btn-google-login"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4c-.23 1.25-.93 2.3-1.96 2.99v2.5h3.18c1.86-1.71 2.98-4.24 2.98-7.28z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.18-2.5c-.89.6-2.02.95-3.43.95-2.64 0-4.87-1.78-5.67-4.17H1.07v2.59C2.72 17.74 6.12 20 10 20z" fill="#34A853"/>
                <path d="M4.33 11.86A6.04 6.04 0 0 1 4 10c0-.65.11-1.28.33-1.86V5.55H1.07A9.99 9.99 0 0 0 0 10c0 1.62.39 3.14 1.07 4.45l3.26-2.59z" fill="#FBBC05"/>
                <path d="M10 3.96c1.47 0 2.8.51 3.83 1.5l2.87-2.87C14.96.98 12.7 0 10 0 6.12 0 2.72 2.26 1.07 5.55l3.26 2.59C5.13 5.74 7.36 3.96 10 3.96z" fill="#EA4335"/>
              </svg>
              {loading ? 'Aguardando...' : 'Entrar com Google'}
            </button>

            <div className="login__divider">
              <span></span>
              <p>Acesso restrito a consultores autorizados</p>
              <span></span>
            </div>

            <div className="login__info">
              <div className="login__info-icon">🔒</div>
              <p>
                Apenas e-mails cadastrados pelo administrador do escritório W1 Goiânia
                têm permissão para acessar o portal.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="login__footer">
            <p>Problemas com acesso? Entre em contato com a equipe W1 Goiânia.</p>
          </div>
        </div>

        {/* Side decoration */}
        <div className="login__decoration">
          <div className="login__decoration-card">
            <div className="login__decoration-icon">🎓</div>
            <h3>Processo Sol e Sombra</h3>
            <p>Trilhas de aprendizado para consultores W1 Goiânia</p>
          </div>
          <div className="login__decoration-stats">
            {[
              { num: '6', label: 'Trilhas disponíveis' },
              { num: '138', label: 'Videoaulas' },
              { num: '48h+', label: 'De conteúdo' },
            ].map((s, i) => (
              <div key={i} className="login__decoration-stat">
                <span>{s.num}</span>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
