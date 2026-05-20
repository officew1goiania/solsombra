import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import TrilhaCard from '../components/TrilhaCard'
import { supabase } from '../lib/supabase'
import './Home.css'

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()
  const heroRef = useRef(null)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [trilhas, setTrilhas] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (location.hash === '#trilhas') {
      const el = document.getElementById('trilhas')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location.hash])

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const { data, error } = await supabase
          .from('trilhas')
          .select('*, modulos(id, aulas(id))')
          .order('created_at', { ascending: true })
        
        if (error) {
          console.error('Erro ao buscar trilhas do Supabase:', error)
          setErrorMsg(error.message)
          setTrilhas([])
        } else {
          setTrilhas(data || [])
          setErrorMsg(null)
        }
      } catch (err) {
        console.error('Erro de exceção ao buscar trilhas:', err)
        setErrorMsg(err.message || String(err))
        setTrilhas([])
      } finally {
        setLoading(false)
      }
    }
    fetchTrilhas()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero__particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="hero__particle" style={{
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${4 + Math.random() * 6}s`,
              '--x': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 4}px`,
              '--opacity': `${0.2 + Math.random() * 0.4}`,
            }} />
          ))}
        </div>

        <div className="hero__bg-gradient"></div>
        <div className="hero__grid"></div>

        <div className="hero__container">
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            W1 Goiânia · Portal de Treinamentos
          </div>

          <h1 className="hero__title">
            <span className="hero__title-sol">Processo</span>
            <br />
            <span className="hero__title-gradient">Sol e Sombra</span>
          </h1>

          <p className="hero__subtitle">
            Trilhas de conhecimento completas para consultores W1 Goiânia.
            Evolua do básico ao avançado com videoaulas, materiais e avaliações.
          </p>

          <div className="hero__cta">
            {user ? (
              <Link to="/dashboard" className="btn-primary" id="hero-cta-dashboard">
                Acessar Meu Painel
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M10.5 5.25L14.25 9 10.5 12.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary" id="hero-cta-login">
                Começar Agora
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M10.5 5.25L14.25 9 10.5 12.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
            <a href="#trilhas" className="btn-secondary" id="hero-cta-trilhas">
              Ver Trilhas
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">{loading ? '-' : trilhas.length}</span>
              <span className="hero__stat-label">Trilhas</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">
                {loading ? '-' : trilhas.reduce((acc, t) => acc + (t.modulos?.reduce((a, m) => a + (m.aulas?.length || 0), 0) || 0), 0)}
              </span>
              <span className="hero__stat-label">Aulas</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">Variável</span>
              <span className="hero__stat-label">Conteúdo</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-wheel"></div>
          </div>
          <span>Explorar</span>
        </div>
      </section>

      {/* About Section */}
      <section
        className={`about ${visibleSections.has('about') ? 'section--visible' : ''}`}
        id="about"
        data-observe
      >
        <div className="about__container">
          <div className="about__content">
            <div className="section-label">Sobre o Projeto</div>
            <h2 className="about__title">
              Conhecimento que transforma <span className="text-accent">resultados</span>
            </h2>
            <p className="about__text">
              O <strong>Processo Sol e Sombra</strong> é a plataforma de desenvolvimento
              profissional do escritório W1 Goiânia. Aqui você encontra trilhas de aprendizado
              estruturadas para acelerar sua evolução como consultor financeiro.
            </p>
            <p className="about__text">
              De Plano de Saúde a Consultoria Patrimonial, cada trilha foi desenhada com
              didática progressiva, materiais de apoio e avaliações para garantir que o
              conhecimento seja fixado na prática.
            </p>
          </div>
          <div className="about__cards">
            {[
              { icon: '🎓', titulo: 'Aprendizado Estruturado', desc: 'Módulos organizados do básico ao avançado' },
              { icon: '🏆', titulo: 'Certificação de Conclusão', desc: 'Comprove seu conhecimento com badges' },
              { icon: '📱', titulo: 'Acesso em Qualquer Lugar', desc: 'Estude no celular, tablet ou computador' },
              { icon: '🔄', titulo: 'Conteúdo Atualizado', desc: 'Material sempre atualizado pelo time W1 Goiânia' },
            ].map((card, i) => (
              <div key={i} className="about__feature-card">
                <span className="about__feature-icon">{card.icon}</span>
                <div>
                  <h4>{card.titulo}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trilhas Section */}
      <section
        className={`trilhas-section ${visibleSections.has('trilhas') ? 'section--visible' : ''}`}
        id="trilhas"
        data-observe
      >
        <div className="trilhas-section__container">
          <div className="trilhas-section__header">
            <div className="section-label">Catálogo de Trilhas</div>
            <h2 className="trilhas-section__title">
              Escolha sua <span className="text-accent">trilha de aprendizado</span>
            </h2>
            <p className="trilhas-section__subtitle">
              {user
                ? 'Bem-vindo(a) de volta! Continue de onde parou ou explore uma nova trilha.'
                : 'Faça login para acessar os conteúdos completos e acompanhar seu progresso.'
              }
            </p>
          </div>

          <div className="trilhas-grid">
            {loading ? <p>Carregando trilhas...</p> : errorMsg ? <p className="error-text">Erro ao carregar: {errorMsg}</p> : trilhas.map((trilha, i) => (
              <TrilhaCard key={trilha.id} trilha={trilha} index={i} />
            ))}
            {!loading && !errorMsg && trilhas.length === 0 && <p>Nenhuma trilha encontrada.</p>}
          </div>

          {!user && (
            <div className="trilhas-section__cta-box">
              <div className="trilhas-section__cta-content">
                <h3>🔐 Acesso Exclusivo para Consultores W1 Goiânia</h3>
                <p>Para acessar os vídeos, materiais e acompanhar seu progresso, você precisa fazer login com sua conta Google autorizada.</p>
              </div>
              <Link to="/login" className="btn-primary" id="trilhas-cta-login">
                Fazer Login com Google
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-w">W1 Goiânia</span>
              <span className="footer__logo-text">Sol e Sombra · Goiânia</span>
            </div>
            <p>Portal de treinamentos do escritório W1 Goiânia. Todos os direitos reservados.</p>
          </div>
          <div className="footer__links">
            <h4>Trilhas</h4>
            {trilhas.slice(0, 4).map(t => (
              <Link key={t.id} to={`/trilha/${t.id}`}>{t.titulo}</Link>
            ))}
          </div>
          <div className="footer__links">
            <h4>Acesso</h4>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Meu Painel</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2025 W1 Consultoria Financeira · Goiânia-GO · Processo Sol e Sombra</p>
        </div>
      </footer>
    </main>
  )
}
