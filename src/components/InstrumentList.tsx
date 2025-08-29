import { Link } from 'react-router-dom'
import { useInstruments } from '../context/InstrumentContext'
import { useAuth } from '../context/AuthContext'
import { Header } from './Header'
import { useEffect } from 'react'

export const InstrumentList = () => {
  const { instruments, loading, error, successMessage, deleteInstrument, clearMessages } = useInstruments()
  const { session } = useAuth()

  const showSpinner = loading && instruments.length === 0

  const handleDelete = async (id: number) => {
    if (window.confirm('この楽器を削除しますか？')) {
      await deleteInstrument(id)
    }
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearMessages()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, clearMessages])

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>楽器一覧</h1>
        
        <div style={{ marginBottom: '20px', minHeight: '18px' }}>
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div style={{ color: 'green', marginBottom: '10px' }}>
              {successMessage}
            </div>
          )}
        </div>
        
        {showSpinner ? (
          <p>読み込み中...</p>
        ) : instruments.length === 0 ? (
          <p>登録された楽器はありません</p>
        ) : (
          <ul>
            {instruments.map(instrument => (
              <li key={instrument.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>{instrument.name} - {instrument.number}個</span>
                {session && (
                  <div>
                    <Link 
                      to={`/edit/${instrument.id}`}
                      style={{ marginRight: '10px', padding: '5px 10px', textDecoration: 'none', border: '1px solid #007bff', color: '#007bff', borderRadius: '4px' }}
                    >
                      編集
                    </Link>
                    <button 
                      onClick={() => handleDelete(instrument.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      削除
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        
        {session ? (
          <Link to="/create">新規作成</Link>
        ) : (
          <div>
            <p>楽器の登録・編集・削除にはログインが必要です</p>
            <Link to="/login">ログイン</Link>
          </div>
        )}
      </div>
    </div>
  )
}

