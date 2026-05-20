import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AdminContentManager from './AdminContentManager'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState('content') // 'users', 'reports', or 'content'

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('authorized_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError('Erro ao carregar usuários. Verifique as permissões (RLS) no Supabase.')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newEmail) return

    const { data, error } = await supabase
      .from('authorized_users')
      .insert([{ email: newEmail.toLowerCase(), nome: newName, is_admin: false }])
      .select()

    if (error) {
      setError(error.message)
    } else {
      setSuccess(`Usuário ${newEmail} adicionado com sucesso!`)
      setNewEmail('')
      setNewName('')
      setUsers([data[0], ...users])
    }
  }

  const handleRemoveUser = async (id, email) => {
    if (email === user.email) {
      setError('Você não pode remover a si mesmo.')
      return
    }

    if (!window.confirm(`Tem certeza que deseja remover o acesso de ${email}?`)) return

    const { error } = await supabase
      .from('authorized_users')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleToggleAdmin = async (id, email, currentStatus) => {
    if (email === user.email) {
      setError('Você não pode alterar seu próprio status de admin.')
      return
    }

    const { error } = await supabase
      .from('authorized_users')
      .update({ is_admin: !currentStatus })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, is_admin: !currentStatus } : u))
    }
  }

  return (
    <div className="admin-dash">
      <div className="admin-dash__container">
        <div className="admin-dash__header">
          <h1>Painel Administrativo W1 Goiânia</h1>
          <p>Faça a gestão de consultores e acompanhe o progresso das trilhas.</p>
        </div>

        <div className="admin-dash__tabs">
          <button 
            className={`admin-dash__tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            📚 Gestão de Conteúdo
          </button>
          <button 
            className={`admin-dash__tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Gestão de Usuários
          </button>
          <button 
            className={`admin-dash__tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📊 Relatórios e Progresso
          </button>
        </div>

        {error && <div className="admin-dash__alert admin-dash__alert--error">{error}</div>}
        {success && <div className="admin-dash__alert admin-dash__alert--success">{success}</div>}

        {activeTab === 'users' && (
          <div className="admin-dash__content">
            <div className="admin-dash__card">
              <h2>Adicionar Consultor</h2>
              <form onSubmit={handleAddUser} className="admin-dash__form">
                <input
                  type="text"
                  placeholder="Nome do consultor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="admin-dash__input"
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="admin-dash__input"
                  required
                />
                <button type="submit" className="btn-primary">Conceder Acesso</button>
              </form>
            </div>

            <div className="admin-dash__card">
              <h2>Usuários Autorizados ({users.length})</h2>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <div className="admin-dash__table-wrapper">
                  <table className="admin-dash__table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data de Cadastro</th>
                        <th>Nível</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.nome || '-'}</td>
                          <td>{u.email}</td>
                          <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <span className={`admin-badge ${u.is_admin ? 'admin-badge--admin' : ''}`}>
                              {u.is_admin ? 'Admin' : 'Consultor'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-dash__actions">
                              <button 
                                onClick={() => handleToggleAdmin(u.id, u.email, u.is_admin)}
                                className="btn-secondary btn-sm"
                                disabled={u.email === user.email}
                              >
                                {u.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                              </button>
                              <button 
                                onClick={() => handleRemoveUser(u.id, u.email)}
                                className="btn-secondary btn-sm btn-danger"
                                disabled={u.email === user.email}
                              >
                                Remover
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-dash__content">
            <div className="admin-dash__card">
              <h2>Progresso dos Consultores</h2>
              <p className="admin-dash__empty">
                Os relatórios de progresso estarão disponíveis assim que os consultores começarem a concluir os módulos.
                (Funcionalidade em desenvolvimento).
              </p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <AdminContentManager />
        )}
      </div>
    </div>
  )
}
