import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { InstrumentProvider } from './context/InstrumentContext'
import { InstrumentList } from './components/InstrumentList'
import { CreateInstrument } from './components/CreateInstrument'
import { EditInstrument } from './components/EditInstrument'
import { Login } from './components/Login'
import { Register } from './components/Register'

const AppContent = () => {
  const { loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>認証状態を確認中...</div>
  }

  return (
    <InstrumentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InstrumentList />} />
          <Route path="/create" element={<CreateInstrument />} />
          <Route path="/edit/:id" element={<EditInstrument />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </InstrumentProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
