import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useInstruments } from '../context/InstrumentContext'

export const Register = () => {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // ★ Supabase認証 - 新規ユーザー登録
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setError(`新規登録に失敗しました: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>新規登録</h1>
      <form onSubmit={handleSignUp}>
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
          {loading ? '登録中...' : '新規登録'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Link to="/login">ログイン画面に戻る</Link>
    </div>
  )
}

