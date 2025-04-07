import { supabase } from './supabaseClient'

// Authentication Services
export const authService = {
  // Register a new user
  async register(email, password, nome) {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single()
      
      if (existingUser) {
        return { error: { message: 'Email já cadastrado' } }
      }
      
      // Insert new user
      const { data, error } = await supabase
        .from('usuarios')
        .insert({ email, senha: password, nome }) // In production, use proper password hashing
        .select()
        .single()
      
      if (error) throw error
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(data))
      return { user: data }
    } catch (error) {
      return { error }
    }
  },
  
  // Login user
  async login(email, password) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password) // In production, implement proper password verification
        .single()
      
      if (error || !data) {
        return { error: { message: 'Credenciais inválidas' } }
      }
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(data))
      return { user: data }
    } catch (error) {
      return { error }
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('user')
  },
  
  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

// File Services
export const fileService = {
  // Upload file
  async uploadFile(file, userId) {
    try {
      const nome = `${Date.now()}_${file.name}`
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(nome, file)
      
      if (uploadError) throw uploadError
      
      // Save file reference in database
      const { data, error } = await supabase
        .from('arquivos')
        .insert({
          nome: file.name,
          path: nome,
          status: 'pendente',
          usuario_id: userId
        })
        .select()
        .single()
      
      if (error) throw error
      
      return { data }
    } catch (error) {
      return { error }
    }
  },
  
  // Get user file history
  async getUserFiles(userId) {
    try {
      const { data, error } = await supabase
        .from('arquivos')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { data }
    } catch (error) {
      return { error }
    }
  }
}