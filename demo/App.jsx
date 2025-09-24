import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Interview from './components/Interview.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [currentView, setCurrentView] = useState('login')
  const [interviewConfig, setInterviewConfig] = useState(null)

  useEffect(() => {
    // Kiểm tra token đã lưu trong localStorage
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setCurrentView('dashboard')
    }
  }, [])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setCurrentView('login')
    setInterviewConfig(null)
  }

  const handleStartInterview = (specialization, difficulty) => {
    setInterviewConfig({ specialization, difficulty })
    setCurrentView('interview')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setInterviewConfig(null)
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        user={user}
        token={token}
        onLogout={handleLogout}
        onStartInterview={handleStartInterview}
      />
    )
  }

  if (currentView === 'interview' && interviewConfig) {
    return (
      <Interview
        user={user}
        token={token}
        specialization={interviewConfig.specialization}
        difficulty={interviewConfig.difficulty}
        onBack={handleBackToDashboard}
      />
    )
  }

  return <div>Loading...</div>
}

export default App
