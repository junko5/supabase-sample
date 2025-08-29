import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
interface Instrument {
  id: number
  name: string
  number: number
  created_at: string
}

interface InstrumentContextType {
  instruments: Instrument[]
  loading: boolean
  error: string | null
  successMessage: string | null
  addInstrument: (name: string, number: number) => Promise<void>
  updateInstrument: (id: number, name: string, number: number) => Promise<void>
  deleteInstrument: (id: number) => Promise<void>
  getInstrument: (id: number) => Instrument | undefined
  fetchInstruments: () => Promise<void>
  clearMessages: () => void
  setSuccessMessage: (message: string) => void
}

const InstrumentContext = createContext<InstrumentContextType | undefined>(undefined)

interface InstrumentProviderProps {
  children: ReactNode
}

export const InstrumentProvider = ({ children }: InstrumentProviderProps) => {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { session } = useAuth()

  const clearMessages = () => {
    setError(null)
    setSuccessMessage(null)
  }


  const fetchInstruments = async () => {
    setLoading(true)
    
    // ★ Supabaseから楽器データを取得（新しい順にソート）
    const { data, error } = await supabase
      .from('instruments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Detailed error:', error)
      setError(`楽器一覧の取得に失敗しました: ${error.message} (Code: ${error.code})`)
    } else {
      setInstruments(data || [])
    }
    setLoading(false)
  }

  const addInstrument = async (name: string, number: number) => {
    if (!session) return
    
    setLoading(true)
    
    // ★ Supabaseに新しい楽器データを挿入
    const { error } = await supabase
      .from('instruments')
      .insert([
        { name, number }
      ])

    if (error) {
      setError(`楽器の登録に失敗しました: ${error.message}`)
    } else {
      setSuccessMessage('楽器を登録しました')
    }
    setLoading(false)
  }

  const updateInstrument = async (id: number, name: string, number: number) => {
    if (!session) return
    
    setLoading(true)
    
    // ★ Supabaseで指定IDの楽器データを更新
    const { error } = await supabase
      .from('instruments')
      .update({ name, number })
      .eq('id', id)

    if (error) {
      setError(`楽器の更新に失敗しました: ${error.message}`)
    } else {
      setSuccessMessage('楽器を更新しました')
    }
    setLoading(false)
  }

  const deleteInstrument = async (id: number) => {
    if (!session) return
    
    setLoading(true)
    
    // ★ Supabaseから指定IDの楽器データを削除
    const { error } = await supabase
      .from('instruments')
      .delete()
      .eq('id', id)

    if (error) {
      setError(`楽器の削除に失敗しました: ${error.message}`)
    } else {
      setSuccessMessage('楽器を削除しました')
    }
    setLoading(false)
  }

  const getInstrument = (id: number) => {
    return instruments.find(instrument => instrument.id === id)
  }

  useEffect(() => {
    fetchInstruments()
  }, [])
  
  useEffect(() => {
    // ★ Supabaseリアルタイム機能 - instrumentsテーブルの変更を監視
    const subscription = supabase
      .channel('instruments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'instruments' 
      }, () => {
        fetchInstruments() 
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    instruments,
    loading,
    error,
    successMessage,
    addInstrument,
    updateInstrument,
    deleteInstrument,
    getInstrument,
    fetchInstruments,
    clearMessages,
    setSuccessMessage
  }

  return (
    <InstrumentContext.Provider value={value}>
      {children}
    </InstrumentContext.Provider>
  )
}

export const useInstruments = () => {
  const context = useContext(InstrumentContext)
  if (context === undefined) {
    throw new Error('useInstruments must be used within an InstrumentProvider')
  }
  return context
}