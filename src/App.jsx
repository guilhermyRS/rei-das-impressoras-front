import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'

// Importar o cliente Supabase do arquivo correto
import { supabase } from './supabaseClient'

// Componentes
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import { authService } from './api'

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
  }, [])
  
  return (
    <Router>
      <div className="app-container">
        <Header user={user} setUser={setUser} />
        
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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