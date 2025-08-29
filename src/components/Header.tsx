import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export const Header = () => {
  const { session } = useAuth()

  const handleLogout = async () => {
    // ★ Supabase認証 - ログアウト処理
    await supabase.auth.signOut()
  }

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px',
      borderBottom: '1px solid #ccc'
    }}>
      <h2>楽器管理システム</h2>
      {session ? (
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          ログアウト
        </button>
      ) : (
        <Link 
          to="/login"
          style={{ 
            padding: '5px 10px',
            textDecoration: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          ログイン
        </Link>
      )}
    </header>
  )
}

