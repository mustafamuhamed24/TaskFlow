import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { reducer } from '../lib/reducer'
import { buildSeed } from '../data/seed'
import { load, save } from '../services/storage'
import { Toast } from '../components/ui'

const KEY = 'taskflow:v1'
const DataContext = createContext(null)

const isValid = (s) => s && Array.isArray(s.projects) && Array.isArray(s.tasks) && Array.isArray(s.activity)

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const stored = load(KEY)
    return isValid(stored) ? stored : buildSeed()
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!save(KEY, state)) setToast({ type: 'error', message: 'Could not save changes. Browser storage may be full or disabled.' })
  }, [state])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const notify = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const value = useMemo(() => ({ ...state, dispatch, notify }), [state, notify])

  return (
    <DataContext.Provider value={value}>
      {children}
      <Toast toast={toast} />
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
