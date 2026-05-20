import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__container">
        <div className="notfound__code">404</div>
        <h1 className="notfound__title">Página não encontrada</h1>
        <p className="notfound__text">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="btn-primary" id="notfound-home-btn">
            Voltar ao Início
          </Link>
          <Link to="/dashboard" className="btn-secondary" id="notfound-dashboard-btn">
            Meu Painel
          </Link>
        </div>
      </div>
    </div>
  )
}
