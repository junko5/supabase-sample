import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useInstruments } from '../context/InstrumentContext'
import { useAuth } from '../context/AuthContext'
import { Header } from './Header'

export const CreateInstrument = () => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [nameError, setNameError] = useState('')
  const [numberError, setNumberError] = useState('')
  const { addInstrument } = useInstruments()
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate('/login')
    }
  }, [session, navigate])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    
    setNameError('')
    setNumberError('')

    let hasError = false

    if (name.length > 10) {
      setNameError('名前は10文字以内で入力してください')
      hasError = true
    }

    const numberValue = parseInt(number)
    if (isNaN(numberValue) || numberValue < 1 || numberValue > 200) {
      setNumberError('数は1以上200以下で入力してください')
      hasError = true
    }

    if (!hasError) {
      await addInstrument(name, numberValue)
      navigate('/')
    }
  }


  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>楽器登録フォーム</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              楽器の名前:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
          </div>
          <div>
            <label>
              数:
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                min="1"
                max="200"
                required
              />
            </label>
            {numberError && <div style={{ color: 'red' }}>{numberError}</div>}
          </div>
          <button type="submit">登録</button>
        </form>
        <Link to="/">一覧に戻る</Link>
      </div>
    </div>
  )
}

