import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, authorized } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verificando acesso...</p>
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
