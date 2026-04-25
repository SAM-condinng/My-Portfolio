import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      navigate('/admin', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-3xl text-gradient">SMG</span>
          <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="glass rounded-2xl p-8 flex flex-col gap-5 glow-blue">
          <h1 className="font-display font-semibold text-xl text-white">Sign in</h1>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors"
                placeholder="admin@example.com" required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-3 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors"
                placeholder="••••••••" required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-electric hover:bg-electric-light rounded-xl text-white font-medium text-sm transition-all glow-blue disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-slate-600 text-xs mt-6">Portfolio admin access only</p>
      </div>
    </div>
  )
}
