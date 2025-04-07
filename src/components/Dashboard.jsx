import React, { useState, useEffect } from 'react'
import { authService, fileService } from '../api'

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [user] = useState(authService.getCurrentUser())
  
  useEffect(() => {
    if (user) {
      loadUserFiles()
    }
  }, [user])
  
  const loadUserFiles = async () => {
    setLoading(true)
    
    const { data, error } = await fileService.getUserFiles(user.id)
    
    if (error) {
      console.error('Erro ao carregar arquivos:', error)
    } else {
      setFiles(data || [])
    }
    
    setLoading(false)
  }
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('Selecione um arquivo primeiro')
      setStatusType('error')
      return
    }
    
    setLoading(true)
    setStatus('Enviando arquivo...')
    setStatusType('')
    
    const { data, error } = await fileService.uploadFile(file, user.id)
    
    if (error) {
      console.error('Erro ao enviar arquivo:', error)
      setStatus('Erro ao enviar arquivo: ' + error.message)
      setStatusType('error')
    } else {
      setStatus('Arquivo enviado com sucesso!')
      setStatusType('success')
      setFile(null)
      // Clear file input
      document.getElementById('file-input').value = ''
      // Reload files list
      loadUserFiles()
    }
    
    setLoading(false)
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const renderStatusBadge = (status) => {
    if (status === 'pendente') {
      return <span className="badge badge-pending">Pendente</span>
    } else if (status === 'impresso') {
      return <span className="badge badge-printed">Impresso</span>
    }
    return <span>{status}</span>
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Painel de Impressão</h2>
      </div>
      
      <div className="file-upload-container">
        <h3 className="upload-title">Enviar Arquivo para Impressão</h3>
        
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-input"
            className="form-control file-input"
            onChange={handleFileChange}
            disabled={loading}
          />
          
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? 'Enviando...' : 'Enviar para Impressão'}
          </button>
        </div>
        
        {status && (
          <div className={`status-message ${statusType ? `status-${statusType}` : ''}`}>
            {status}
          </div>
        )}
      </div>
      
      <div className="file-history">
        <h3 className="upload-title">Histórico de Arquivos</h3>
        
        {loading && <p>Carregando...</p>}
        
        {!loading && files.length === 0 && (
          <p>Nenhum arquivo enviado ainda.</p>
        )}
        
        {!loading && files.length > 0 && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Arquivo</th>
                  <th>Data de Envio</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id}>
                    <td>{file.nome}</td>
                    <td>{formatDate(file.created_at)}</td>
                    <td>{renderStatusBadge(file.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}