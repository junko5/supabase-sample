import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useInstruments } from '../context/InstrumentContext'
import { useAuth } from '../context/AuthContext'
import { Header } from './Header'

export const EditInstrument = () => {
  const { id } = useParams<{ id: string }>()
  const { getInstrument, updateInstrument } = useInstruments()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [nameError, setNameError] = useState('')
  const [numberError, setNumberError] = useState('')

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }
    
    if (id) {
      const instrument = getInstrument(parseInt(id))
      if (instrument) {
        setName(instrument.name)
        setNumber(instrument.number.toString())
      } else {
        navigate('/')
      }
    }
  }, [id, getInstrument, navigate, session])

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

    if (!hasError && id) {
      await updateInstrument(parseInt(id), name, numberValue)
      navigate('/')
    }
  }


  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>楽器編集</h1>
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
          <button type="submit">更新</button>
        </form>
        <Link to="/">一覧に戻る</Link>
      </div>
    </div>
  )
}

