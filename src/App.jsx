"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import "./App.css"

// Componentes
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Header from "./components/Header"
import { authService } from "./api"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Listen for auth state changes
    window.addEventListener("auth-change", () => {
      setUser(authService.getCurrentUser())
    })

    return () => {
      window.removeEventListener("auth-change", () => {})
    }
  }, [])

  return (
    <Router>
      <div className="app-container">
        <Header user={user} setUser={setUser} />

        <main className="container">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
