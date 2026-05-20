import { Link } from 'react-router-dom'
import './TrilhaCard.css'

export default function TrilhaCard({ trilha, index }) {
  const modulosCount = Array.isArray(trilha.modulos) ? trilha.modulos.length : (trilha.modulos || 0);
  const totalAulas = Array.isArray(trilha.modulos) 
    ? trilha.modulos.reduce((acc, m) => acc + (m.aulas?.length || 0), 0) 
    : (trilha.aulas || 0);

  return (
    <div
      className={`trilha-card ${trilha.destaque ? 'trilha-card--destaque' : ''}`}
      style={{ '--card-color': trilha.cor, animationDelay: `${index * 0.1}s` }}
    >
      {trilha.destaque && (
        <div className="trilha-card__badge">⭐ Destaque</div>
      )}

      <div className="trilha-card__header">
        <span className="trilha-card__icon">{trilha.icon}</span>
        <div className="trilha-card__nivel">{trilha.nivel}</div>
      </div>

      <div className="trilha-card__body">
        <h3 className="trilha-card__titulo">{trilha.titulo}</h3>
        <p className="trilha-card__subtitulo">{trilha.subtitulo}</p>
        <p className="trilha-card__descricao">{trilha.descricao}</p>
      </div>

      <div className="trilha-card__stats">
        <div className="trilha-card__stat">
          <span className="trilha-card__stat-icon">📚</span>
          <span>{modulosCount} módulos</span>
        </div>
        <div className="trilha-card__stat">
          <span className="trilha-card__stat-icon">▶️</span>
          <span>{totalAulas} aulas</span>
        </div>
        <div className="trilha-card__stat">
          <span className="trilha-card__stat-icon">⏱️</span>
          <span>{trilha.duracao}</span>
        </div>
      </div>

      <div className="trilha-card__progress">
        <div className="trilha-card__progress-bar">
          <div className="trilha-card__progress-fill" style={{ width: '0%' }}></div>
        </div>
        <span className="trilha-card__progress-text">0% concluído</span>
      </div>

      <Link
        to={`/trilha/${trilha.id}`}
        className="trilha-card__btn"
        id={`trilha-btn-${trilha.id}`}
      >
        Acessar Trilha
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  )
}
