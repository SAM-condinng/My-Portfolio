import { useEffect, useState } from 'react'
import { FolderKanban, BookOpen, Mail, Users, TrendingUp, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, posts: 0, messages: 0, unread: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: projects }, { count: posts }, { count: messages }, { count: unread }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
      ])
      setStats({ projects: projects || 0, posts: posts || 0, messages: messages || 0, unread: unread || 0 })
    }
    load().catch(() => {})
  }, [])

  const CARDS = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-500/10', to: '/admin/projects' },
    { label: 'Blog Posts', value: stats.posts, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', to: '/admin/blog' },
    { label: 'Total Messages', value: stats.messages, icon: Mail, color: 'text-green-400', bg: 'bg-green-500/10', to: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', to: '/admin/messages' },
  ]

  const QUICK_ACTIONS = [
    { label: 'Add Project', to: '/admin/projects', icon: Plus, desc: 'Showcase new work' },
    { label: 'Write Blog Post', to: '/admin/blog', icon: Plus, desc: 'Share your thoughts' },
    { label: 'Update Skills', to: '/admin/skills', icon: Plus, desc: 'Keep skills current' },
    { label: 'Edit Profile', to: '/admin/settings', icon: Plus, desc: 'Update your info' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all your portfolio content from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CARDS.map(c => (
          <Link to={c.to} key={c.label} className="glass glass-hover rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
              <c.icon size={18} className={c.color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{c.value}</p>
              <p className="text-slate-400 text-xs">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="font-display font-semibold text-lg text-white mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link to={a.to} key={a.label} className="glass glass-hover rounded-xl p-4 flex flex-col gap-1 transition-all hover:-translate-y-0.5">
              <span className="font-display font-semibold text-sm text-electric">{a.label}</span>
              <span className="text-slate-500 text-xs">{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="glass rounded-2xl p-6 border border-electric/20">
        <p className="text-slate-300 text-sm leading-relaxed">
          <span className="text-electric font-semibold">Getting started:</span> Use the sidebar to manage your portfolio content. 
          Add your Supabase credentials in <code className="text-electric bg-electric/10 px-1 rounded font-mono text-xs">.env</code> to connect the database. 
          All changes reflect on the public site instantly.
        </p>
      </div>
    </div>
  )
}
