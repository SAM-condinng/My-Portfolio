import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) navigate('/admin/login', { replace: true })
      else setChecking(false)
    })
  }, [navigate])
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return children
}
