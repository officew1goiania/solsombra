import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, authorized } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen" style={{ flexDirection: 'column', gap: '20px' }}>
        <div className="loading-spinner"></div>
        <p>Verificando acesso...</p>
        <button 
          className="btn-secondary btn-sm" 
          onClick={() => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = '/solsombra/'
          }}
          style={{ marginTop: '20px', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          Se travar aqui, clique para Limpar Cache e Sair
        </button>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!authorized) {
    return (
      <div className="unauthorized-screen">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">🔒</div>
          <h2>Acesso Restrito</h2>
          <p>
            Sua conta <strong>{user.email}</strong> não está autorizada a acessar este portal.
          </p>
          <p>
            Entre em contato com a equipe W1 Goiânia para solicitar acesso.
          </p>
          <button onClick={() => window.location.href = '/solsombra/'} className="btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return children
}
