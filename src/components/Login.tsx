import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useInstruments } from '../context/InstrumentContext'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()
  const { setSuccessMessage } = useInstruments()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      setSuccessMessage('ログインしました')
      navigate('/')
    }
  }, [session, navigate, setSuccessMessage])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // ★ Supabase認証 - メール/パスワードでログイン
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(`ログインに失敗しました: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            メールアドレス:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            パスワード:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Link to="/register">新規登録はこちら</Link>
    </div>
  )
}

