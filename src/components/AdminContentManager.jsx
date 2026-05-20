import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './AdminContentManager.css'

export default function AdminContentManager() {
  const [trilhas, setTrilhas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrilha, setSelectedTrilha] = useState(null)
  
  // States for specific editing modes
  const [isEditingTrilha, setIsEditingTrilha] = useState(false)
  
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchTrilhas()
  }, [])

  const fetchTrilhas = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('trilhas').select('*').order('created_at', { ascending: true })
    if (error) {
      showMessage('error', 'Erro ao carregar trilhas: ' + error.message)
    } else {
      setTrilhas(data || [])
    }
    setLoading(false)
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  // --- Trilha Handlers ---
  const handleSaveTrilha = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newTrilha = {
      id: formData.get('id'),
      titulo: formData.get('titulo'),
      subtitulo: formData.get('subtitulo'),
      descricao: formData.get('descricao'),
      icon: formData.get('icon'),
      cor: formData.get('cor'),
      nivel: formData.get('nivel'),
      duracao: formData.get('duracao'),
    }

    const { error } = await supabase.from('trilhas').upsert([newTrilha])
    
    if (error) {
      showMessage('error', error.message)
    } else {
      showMessage('success', 'Trilha salva com sucesso!')
      setIsEditingTrilha(false)
      fetchTrilhas()
      if (!selectedTrilha || selectedTrilha.id !== newTrilha.id) {
        setSelectedTrilha(newTrilha)
      } else {
        setSelectedTrilha({ ...selectedTrilha, ...newTrilha })
      }
    }
  }

  const handleDeleteTrilha = async (id) => {
    if (!window.confirm('Tem certeza? Isso apagará a trilha, todos os módulos, aulas e provas vinculados a ela!')) return
    const { error } = await supabase.from('trilhas').delete().eq('id', id)
    if (error) {
      showMessage('error', error.message)
    } else {
      showMessage('success', 'Trilha excluída!')
      setSelectedTrilha(null)
      fetchTrilhas()
    }
  }

  return (
    <div className="admin-content">
      {message.text && (
        <div className={`admin-content__alert admin-content__alert--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-content__layout">
        {/* Sidebar - List of Trilhas */}
        <div className="admin-content__sidebar">
          <div className="admin-content__sidebar-header">
            <h3>Cursos & Trilhas</h3>
            <button 
              className="btn-primary btn-sm"
              onClick={() => {
                setSelectedTrilha(null)
                setIsEditingTrilha(true)
              }}
            >
              + Nova Trilha
            </button>
          </div>
          
          {loading ? <p>Carregando...</p> : (
            <div className="admin-content__list">
              {trilhas.map(t => (
                <div 
                  key={t.id} 
                  className={`admin-content__item ${selectedTrilha?.id === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTrilha(t)
                    setIsEditingTrilha(false)
                  }}
                >
                  <span>{t.icon} {t.titulo}</span>
                </div>
              ))}
              {trilhas.length === 0 && <p className="admin-content__empty">Nenhuma trilha encontrada.</p>}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="admin-content__main">
          {!selectedTrilha && !isEditingTrilha ? (
            <div className="admin-content__welcome">
              <span className="welcome-icon">📚</span>
              <h2>Gestão de Conteúdo</h2>
              <p>Selecione uma trilha ao lado para editar módulos, aulas e avaliações, ou crie uma nova trilha.</p>
            </div>
          ) : (
            <div className="admin-content__editor">
              {/* Trilha Form */}
              <div className="admin-content__card">
                <div className="admin-content__card-header">
                  <h2>{selectedTrilha ? 'Editar Trilha' : 'Nova Trilha'}</h2>
                  {selectedTrilha && (
                    <button className="btn-secondary btn-sm btn-danger" onClick={() => handleDeleteTrilha(selectedTrilha.id)}>
                      Excluir Trilha
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSaveTrilha} className="admin-form">
                  <div className="admin-form__row">
                    <div className="admin-form__group">
                      <label>ID (Slug sem espaços)</label>
                      <input name="id" defaultValue={selectedTrilha?.id} required placeholder="ex: vendas-avancadas" readOnly={!!selectedTrilha} className={selectedTrilha ? 'readonly' : ''} />
                    </div>
                    <div className="admin-form__group">
                      <label>Título</label>
                      <input name="titulo" defaultValue={selectedTrilha?.titulo} required placeholder="Nome do Treinamento" />
                    </div>
                  </div>

                  <div className="admin-form__row">
                    <div className="admin-form__group">
                      <label>Subtítulo</label>
                      <input name="subtitulo" defaultValue={selectedTrilha?.subtitulo} placeholder="Breve frase de efeito" />
                    </div>
                    <div className="admin-form__group">
                      <label>Ícone (Emoji)</label>
                      <input name="icon" defaultValue={selectedTrilha?.icon} required placeholder="🚀" />
                    </div>
                  </div>

                  <div className="admin-form__group">
                    <label>Descrição Completa</label>
                    <textarea name="descricao" defaultValue={selectedTrilha?.descricao} required rows="3"></textarea>
                  </div>

                  <div className="admin-form__row">
                    <div className="admin-form__group">
                      <label>Cor do Card (Hexadecimal)</label>
                      <input name="cor" type="color" defaultValue={selectedTrilha?.cor || '#32DDC9'} required />
                    </div>
                    <div className="admin-form__group">
                      <label>Nível</label>
                      <select name="nivel" defaultValue={selectedTrilha?.nivel} required>
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                        <option value="Todos os níveis">Todos os níveis</option>
                      </select>
                    </div>
                    <div className="admin-form__group">
                      <label>Duração Total Estimada</label>
                      <input name="duracao" defaultValue={selectedTrilha?.duracao} required placeholder="ex: 10h 30min" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">Salvar Informações da Trilha</button>
                </form>
              </div>

              {selectedTrilha && (
                <>
                  <ModulosManager trilhaId={selectedTrilha.id} showMessage={showMessage} />
                  <QuizManager trilhaId={selectedTrilha.id} showMessage={showMessage} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Módulos e Aulas Manager
// ==========================================
function ModulosManager({ trilhaId, showMessage }) {
  const [modulos, setModulos] = useState([])
  const [aulas, setAulas] = useState({}) // mapped by modulo_id

  useEffect(() => {
    fetchModulosEAulas()
  }, [trilhaId])

  const fetchModulosEAulas = async () => {
    const { data: modData } = await supabase.from('modulos').select('*').eq('trilha_id', trilhaId).order('ordem')
    const { data: aulaData } = await supabase.from('aulas').select('*, modulos!inner(trilha_id)').eq('modulos.trilha_id', trilhaId).order('ordem')
    
    setModulos(modData || [])
    
    const aulasMap = {}
    if (aulaData) {
      aulaData.forEach(a => {
        if (!aulasMap[a.modulo_id]) aulasMap[a.modulo_id] = []
        aulasMap[a.modulo_id].push(a)
      })
    }
    setAulas(aulasMap)
  }

  const handleAddModulo = async () => {
    const titulo = window.prompt('Nome do Módulo:')
    if (!titulo) return
    const { error } = await supabase.from('modulos').insert([{ trilha_id: trilhaId, titulo, ordem: modulos.length + 1 }])
    if (error) showMessage('error', error.message)
    else fetchModulosEAulas()
  }

  const handleDeleteModulo = async (id) => {
    if (!window.confirm('Excluir módulo e TODAS as aulas dentro dele?')) return
    await supabase.from('modulos').delete().eq('id', id)
    fetchModulosEAulas()
  }

  const handleAddAula = async (moduloId) => {
    const titulo = window.prompt('Título da Aula:')
    if (!titulo) return
    const youtube_id = window.prompt('ID do Vídeo no YouTube (ex: dQw4w9WgXcQ):')
    if (!youtube_id) return
    const duracao = window.prompt('Duração (ex: 15min):', '15min')
    
    const { error } = await supabase.from('aulas').insert([{ 
      modulo_id: moduloId, titulo, youtube_id, duracao, ordem: (aulas[moduloId]?.length || 0) + 1 
    }])
    if (error) showMessage('error', error.message)
    else fetchModulosEAulas()
  }

  const handleDeleteAula = async (id) => {
    if (!window.confirm('Excluir esta aula?')) return
    await supabase.from('aulas').delete().eq('id', id)
    fetchModulosEAulas()
  }

  return (
    <div className="admin-content__card">
      <div className="admin-content__card-header">
        <h2>Módulos e Aulas</h2>
        <button className="btn-secondary btn-sm" onClick={handleAddModulo}>+ Novo Módulo</button>
      </div>
      
      {modulos.length === 0 && <p className="admin-content__empty">Nenhum módulo criado nesta trilha.</p>}
      
      <div className="admin-modulos">
        {modulos.map((mod, i) => (
          <div key={mod.id} className="admin-modulo">
            <div className="admin-modulo__header">
              <h3>{i + 1}. {mod.titulo}</h3>
              <div>
                <button className="btn-secondary btn-sm" onClick={() => handleAddAula(mod.id)}>+ Aula</button>
                <button className="btn-danger-icon" onClick={() => handleDeleteModulo(mod.id)}>🗑️</button>
              </div>
            </div>
            
            <div className="admin-aulas">
              {aulas[mod.id]?.map((aula, j) => (
                <div key={aula.id} className="admin-aula">
                  <span>{j + 1}. {aula.titulo} ({aula.duracao}) - YouTube ID: <code>{aula.youtube_id}</code></span>
                  <button className="btn-danger-icon" onClick={() => handleDeleteAula(aula.id)}>🗑️</button>
                </div>
              ))}
              {!aulas[mod.id]?.length && <p className="admin-content__empty" style={{fontSize: '0.8rem'}}>Sem aulas neste módulo.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// Quizzes Manager
// ==========================================
function QuizManager({ trilhaId, showMessage }) {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    fetchQuizzes()
  }, [trilhaId])

  const fetchQuizzes = async () => {
    const { data } = await supabase.from('quizzes').select('*').eq('trilha_id', trilhaId).order('ordem')
    setQuizzes(data || [])
  }

  const handleAddQuiz = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const pergunta = formData.get('pergunta')
    const opcoes = [
      formData.get('op1'),
      formData.get('op2'),
      formData.get('op3'),
      formData.get('op4')
    ].filter(Boolean)
    const correta = parseInt(formData.get('correta'))

    if (opcoes.length < 2) return showMessage('error', 'Forneça pelo menos 2 opções.')

    const { error } = await supabase.from('quizzes').insert([{ 
      trilha_id: trilhaId, pergunta, opcoes, correta, ordem: quizzes.length + 1 
    }])
    if (error) showMessage('error', error.message)
    else {
      showMessage('success', 'Questão adicionada!')
      e.target.reset()
      fetchQuizzes()
    }
  }

  const handleDeleteQuiz = async (id) => {
    await supabase.from('quizzes').delete().eq('id', id)
    fetchQuizzes()
  }

  return (
    <div className="admin-content__card">
      <div className="admin-content__card-header">
        <h2>Avaliação Final (Quiz)</h2>
      </div>

      <div className="admin-quizzes">
        {quizzes.map((q, i) => (
          <div key={q.id} className="admin-quiz-item">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <strong>{i + 1}. {q.pergunta}</strong>
              <button className="btn-danger-icon" onClick={() => handleDeleteQuiz(q.id)}>🗑️</button>
            </div>
            <ul>
              {q.opcoes.map((opt, j) => (
                <li key={j} style={{ color: j === q.correta ? '#32DDC9' : 'inherit' }}>
                  {String.fromCharCode(65 + j)}. {opt} {j === q.correta && '✓'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddQuiz} className="admin-form" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Adicionar Nova Questão</h4>
        <div className="admin-form__group">
          <label>Pergunta</label>
          <input name="pergunta" required />
        </div>
        <div className="admin-form__row">
          <div className="admin-form__group">
            <label>Opção A</label>
            <input name="op1" required />
          </div>
          <div className="admin-form__group">
            <label>Opção B</label>
            <input name="op2" required />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="admin-form__group">
            <label>Opção C</label>
            <input name="op3" />
          </div>
          <div className="admin-form__group">
            <label>Opção D</label>
            <input name="op4" />
          </div>
        </div>
        <div className="admin-form__group">
          <label>Qual é a correta?</label>
          <select name="correta" required>
            <option value="0">Opção A</option>
            <option value="1">Opção B</option>
            <option value="2">Opção C</option>
            <option value="3">Opção D</option>
          </select>
        </div>
        <button type="submit" className="btn-secondary btn-sm">Salvar Questão</button>
      </form>
    </div>
  )
}
