import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../api'

export default function Header({ user, setUser }) {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }
  
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to={user ? '/dashboard' : '/login'}>
              Autoatendimento de Impressão
            </Link>
          </div>
          
          {user && (
            <div className="user-info">
              <span>Olá, {user.nome}</span>
              <button 
                className="btn btn-primary"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}