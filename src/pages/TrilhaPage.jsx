import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import CertificateGenerator from '../components/CertificateGenerator'
import { trilhas } from '../data/trilhas'
import './TrilhaPage.css'

export default function TrilhaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const trilha = trilhas.find(t => t.id === id)

  const [activeAula, setActiveAula] = useState(null)
  const [activeModulo, setActiveModulo] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedAulas, setCompletedAulas] = useState([])

  // Fetch progress from Supabase
  useEffect(() => {
    if (!user) return
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('aula_id')
        .eq('user_email', user.email)
        .eq('trilha_id', id)
      
      if (data) {
        setCompletedAulas(data.map(d => d.aula_id))
      }
    }
    fetchProgress()
  }, [id, user])

  const toggleAulaConcluida = async (aulaId) => {
    const isCompleted = completedAulas.includes(aulaId)
    
    // Update local state immediately for fast feedback
    if (isCompleted) {
      setCompletedAulas(prev => prev.filter(a => a !== aulaId))
      await supabase
        .from('user_progress')
        .delete()
        .match({ user_email: user.email, trilha_id: id, aula_id: aulaId })
    } else {
      setCompletedAulas(prev => [...prev, aulaId])
      await supabase
        .from('user_progress')
        .insert([{ user_email: user.email, trilha_id: id, aula_id: aulaId }])
    }
  }

  useEffect(() => {
    if (!trilha) {
      navigate('/dashboard')
      return
    }
    // Set first aula as active by default
    if (trilha.modulos_lista?.length > 0) {
      setActiveAula(trilha.modulos_lista[0].aulas[0])
    }
  }, [trilha, navigate])

  if (!trilha) return null

  const allAulas = trilha.modulos_lista?.flatMap(m => m.aulas) || []
  const currentIndex = allAulas.findIndex(a => a.id === activeAula?.id)
  const prevAula = currentIndex > 0 ? allAulas[currentIndex - 1] : null
  const nextAula = currentIndex < allAulas.length - 1 ? allAulas[currentIndex + 1] : null

  const handleQuizAnswer = (idx, answerIdx) => {
    if (quizSubmitted) return
    setQuizAnswers(prev => ({ ...prev, [idx]: answerIdx }))
  }

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true)
    
    // Save quiz result to Supabase
    if (user) {
      const scorePercentage = Math.round((quizScore / trilha.quiz.length) * 100)
      const passed = scorePercentage >= 70
      
      await supabase
        .from('user_quiz_results')
        .insert([{
          user_email: user.email,
          trilha_id: id,
          score_percentage: scorePercentage,
          passed: passed
        }])
    }
  }

  const quizScore = trilha.quiz
    ? trilha.quiz.filter((q, i) => quizAnswers[i] === q.correta).length
    : 0

  return (
    <div className="trilha-page">
      {/* Top Bar */}
      <div className="trilha-page__topbar">
        <div className="trilha-page__topbar-left">
          <Link to="/dashboard" className="trilha-page__back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar
          </Link>
          <div className="trilha-page__breadcrumb">
            <span>{trilha.icon}</span>
            <span>{trilha.titulo}</span>
          </div>
        </div>
        <button
          className="trilha-page__sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          id="sidebar-toggle-btn"
        >
          {sidebarOpen ? '≡ Fechar Lista' : '≡ Ver Aulas'}
        </button>
      </div>

      <div className="trilha-page__layout">
        {/* Sidebar */}
        <aside className={`trilha-page__sidebar ${sidebarOpen ? 'trilha-page__sidebar--open' : ''}`}>
          <div className="trilha-page__sidebar-header">
            <h3>{trilha.titulo}</h3>
            <p>{trilha.modulos} módulos · {allAulas.length} aulas · {trilha.duracao}</p>
          </div>

          <div className="trilha-page__modulos">
            {trilha.modulos_lista?.map((modulo, mi) => (
              <div key={modulo.id} className="trilha-page__modulo">
                <button
                  className={`trilha-page__modulo-header ${activeModulo === mi ? 'active' : ''}`}
                  onClick={() => setActiveModulo(activeModulo === mi ? -1 : mi)}
                  id={`modulo-toggle-${mi}`}
                >
                  <span className="trilha-page__modulo-num">Módulo {mi + 1}</span>
                  <span className="trilha-page__modulo-titulo">{modulo.titulo}</span>
                  <svg
                    className={`trilha-page__modulo-chevron ${activeModulo === mi ? 'rotated' : ''}`}
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                  >
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {activeModulo === mi && (
                  <div className="trilha-page__aulas">
                    {modulo.aulas.map((aula) => (
                      <button
                        key={aula.id}
                        className={`trilha-page__aula-item ${activeAula?.id === aula.id ? 'active' : ''} ${completedAulas.includes(aula.id) ? 'concluida' : ''}`}
                        onClick={() => { setActiveAula(aula); setShowQuiz(false) }}
                        id={`aula-btn-${aula.id}`}
                      >
                        <span className="trilha-page__aula-status">
                          {completedAulas.includes(aula.id) ? '✓' : '▶'}
                        </span>
                        <span className="trilha-page__aula-titulo">{aula.titulo}</span>
                        <span className="trilha-page__aula-dur">{aula.duracao}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quiz button */}
            {trilha.quiz && (
              <button
                className={`trilha-page__quiz-trigger ${showQuiz ? 'active' : ''}`}
                onClick={() => { setShowQuiz(true); setActiveAula(null) }}
                id="quiz-trigger-btn"
              >
                <span>📝</span>
                <span>Avaliação Final</span>
                <span className="trilha-page__quiz-badge">{trilha.quiz.length} questões</span>
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="trilha-page__main">
          {!showQuiz && activeAula && (
            <div className="trilha-page__player-area">
              {/* Video Player */}
              <div className="trilha-page__video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${activeAula.youtube_id}?rel=0&modestbranding=1`}
                  title={activeAula.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="trilha-page__video"
                ></iframe>
              </div>

              {/* Aula Info */}
              <div className="trilha-page__aula-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2>{activeAula.titulo}</h2>
                  <button 
                    className={`btn-sm ${completedAulas.includes(activeAula.id) ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleAulaConcluida(activeAula.id)}
                    style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}
                  >
                    {completedAulas.includes(activeAula.id) ? '✓ Concluída' : 'Marcar como Concluída'}
                  </button>
                </div>
                <div className="trilha-page__aula-meta">
                  <span>⏱️ {activeAula.duracao}</span>
                  <span>📖 {trilha.titulo}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="trilha-page__nav">
                {prevAula ? (
                  <button
                    className="trilha-page__nav-btn trilha-page__nav-btn--prev"
                    onClick={() => setActiveAula(prevAula)}
                    id="btn-prev-aula"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Aula anterior
                  </button>
                ) : <div />}

                {nextAula ? (
                  <button
                    className="trilha-page__nav-btn trilha-page__nav-btn--next"
                    onClick={() => setActiveAula(nextAula)}
                    id="btn-next-aula"
                  >
                    Próxima aula
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    className="trilha-page__nav-btn trilha-page__nav-btn--next trilha-page__nav-btn--quiz"
                    onClick={() => setShowQuiz(true)}
                    id="btn-go-quiz"
                  >
                    Fazer Avaliação 📝
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quiz */}
          {showQuiz && trilha.quiz && (
            <div className="trilha-page__quiz">
              <div className="trilha-page__quiz-header">
                <h2>📝 Avaliação Final — {trilha.titulo}</h2>
                <p>{trilha.quiz.length} questões para validar seu aprendizado</p>
              </div>

              {!quizSubmitted ? (
                <div className="trilha-page__quiz-questions">
                  {trilha.quiz.map((q, qi) => (
                    <div key={qi} className="trilha-page__question">
                      <h3>
                        <span className="question-num">{qi + 1}</span>
                        {q.pergunta}
                      </h3>
                      <div className="trilha-page__options">
                        {q.opcoes.map((opt, oi) => (
                          <button
                            key={oi}
                            className={`trilha-page__option ${quizAnswers[qi] === oi ? 'selected' : ''}`}
                            onClick={() => handleQuizAnswer(qi, oi)}
                            id={`quiz-q${qi}-opt${oi}`}
                          >
                            <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn-primary trilha-page__quiz-submit"
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < trilha.quiz.length}
                    id="quiz-submit-btn"
                  >
                    Enviar Respostas
                  </button>
                </div>
              ) : (
                <div className="trilha-page__quiz-result">
                  <div className={`trilha-page__quiz-score ${quizScore >= trilha.quiz.length * 0.7 ? 'pass' : 'fail'}`}>
                    <span className="score-emoji">
                      {quizScore >= trilha.quiz.length * 0.7 ? '🏆' : '📚'}
                    </span>
                    <h3>
                      {quizScore >= trilha.quiz.length * 0.7 ? 'Parabéns!' : 'Continue estudando!'}
                    </h3>
                    <p className="score-value">{quizScore}/{trilha.quiz.length} questões corretas</p>
                    <p className="score-pct">{Math.round((quizScore / trilha.quiz.length) * 100)}% de acerto</p>
                    
                    {quizScore >= trilha.quiz.length * 0.7 && (
                      <CertificateGenerator 
                        userName={user?.user_metadata?.full_name || user?.email}
                        trilhaName={trilha.titulo}
                        hours={trilha.duracao.replace(/\D/g, '') || '4'}
                      />
                    )}
                  </div>

                  {/* Show answers */}
                  {trilha.quiz.map((q, qi) => (
                    <div key={qi} className="trilha-page__question trilha-page__question--result">
                      <h3>
                        <span className={`question-num ${quizAnswers[qi] === q.correta ? 'correct' : 'wrong'}`}>
                          {quizAnswers[qi] === q.correta ? '✓' : '✗'}
                        </span>
                        {q.pergunta}
                      </h3>
                      <div className="trilha-page__options">
                        {q.opcoes.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`trilha-page__option ${
                              oi === q.correta ? 'correct' : ''
                            } ${quizAnswers[qi] === oi && oi !== q.correta ? 'wrong' : ''}`}
                          >
                            <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="trilha-page__quiz-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }}
                      id="quiz-retry-btn"
                    >
                      Tentar Novamente
                    </button>
                    <Link to="/dashboard" className="btn-primary" id="quiz-back-dashboard">
                      Voltar ao Painel
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
