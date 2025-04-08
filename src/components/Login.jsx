"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "../api"

export default function Login({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { user, error } = await authService.login(credentials.email, credentials.password)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      // Update user state in parent component
      setUser(user)

      // Dispatch custom event for auth change
      window.dispatchEvent(new Event("auth-change"))

      navigate("/dashboard")
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Acesso ao Sistema</h2>

      {error && <div className="status-message status-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="auth-footer">
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </div>
    </div>
  )
}
