import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Wrench, BookOpen, Mail, Settings, LogOut, ChevronLeft, ChevronRight, Users, GitCommitHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/skills', icon: Wrench, label: 'Skills' },
  { to: '/admin/timeline', icon: GitCommitHorizontal, label: 'Timeline' },
  { to: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { to: '/admin/testimonials', icon: Users, label: 'Testimonials' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Sidebar */}
      <aside className={`admin-sidebar flex flex-col bg-navy-900 border-r border-slate-card shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}>
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-slate-card px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <span className="font-display font-bold text-lg text-gradient">SMG Admin</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-electric/10 text-electric border border-electric/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-slate-card">
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
        <Outlet />
      </main>
    </div>
  )
}
