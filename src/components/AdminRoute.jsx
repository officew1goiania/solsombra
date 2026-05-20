import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { user, authorized, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verificando permissões administrativas...</p>
      </div>
    )
  }

  if (!user || !authorized || !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
