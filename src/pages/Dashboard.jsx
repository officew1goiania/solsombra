import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [trilhas, setTrilhas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrilhas = async () => {
      const { data } = await supabase
        .from('trilhas')
        .select(`
          *,
          modulos (
            id,
            aulas ( id )
          )
        `)
      
      setTrilhas(data || [])
      setLoading(false)
    }
    fetchTrilhas()
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Consultor'
  const avatar = user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=32DDC9&color=05171E&size=128`

  const totalAulas = trilhas.reduce((acc, t) => {
    return acc + (t.modulos?.reduce((a, m) => a + (m.aulas?.length || 0), 0) || 0)
  }, 0)

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Header */}
        <div className="dashboard__header">
          <div className="dashboard__welcome">
            <img src={avatar} alt={firstName} className="dashboard__avatar" />
            <div>
              <p className="dashboard__greeting">Bem-vindo(a) de volta,</p>
              <h1 className="dashboard__name">{firstName} 👋</h1>
              <p className="dashboard__email">{user?.email}</p>
            </div>
          </div>

          <div className="dashboard__overview">
            {[
              { label: 'Trilhas Disponíveis', value: loading ? '-' : trilhas.length, icon: '📚' },
              { label: 'Total de Aulas', value: loading ? '-' : totalAulas, icon: '▶️' },
              { label: 'Horas de Conteúdo', value: 'Variável', icon: '⏱️' },
              { label: 'Acesso Lib.', value: '100%', icon: '🏆' },
            ].map((stat, i) => (
              <div key={i} className="dashboard__stat-card">
                <span className="dashboard__stat-icon">{stat.icon}</span>
                <span className="dashboard__stat-value">{stat.value}</span>
                <span className="dashboard__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Suas Trilhas de Aprendizado</h2>
            <p>Acompanhe seu progresso em cada trilha</p>
          </div>

          {loading ? <p>Carregando trilhas...</p> : (
            <div className="dashboard__trilhas">
              {trilhas.map((trilha, i) => {
                const totalAulasTrilha = trilha.modulos?.reduce((a, m) => a + (m.aulas?.length || 0), 0) || 0
                const numModulos = trilha.modulos?.length || 0

                return (
                  <div key={trilha.id} className="dashboard__trilha-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="dashboard__trilha-header">
                      <span className="dashboard__trilha-icon">{trilha.icon}</span>
                      <div>
                        <h3>{trilha.titulo}</h3>
                        <p>{trilha.subtitulo}</p>
                      </div>
                    </div>

                    <div className="dashboard__trilha-meta">
                      <span>📖 {numModulos} módulos</span>
                      <span>▶️ {totalAulasTrilha} aulas</span>
                      <span>⏱️ {trilha.duracao}</span>
                      <span className="dashboard__trilha-nivel">{trilha.nivel}</span>
                    </div>

                    <div className="dashboard__trilha-progress">
                      <div className="dashboard__trilha-progress-bar">
                        <div className="dashboard__trilha-progress-fill" style={{ width: '0%', '--bar-color': trilha.cor }}></div>
                      </div>
                      <span>Ver andamento na página</span>
                    </div>

                    <Link
                      to={`/trilha/${trilha.id}`}
                      className="dashboard__trilha-btn"
                      id={`dashboard-trilha-${trilha.id}`}
                    >
                      Iniciar Trilha
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                )
              })}
              {trilhas.length === 0 && <p>Nenhuma trilha encontrada.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
