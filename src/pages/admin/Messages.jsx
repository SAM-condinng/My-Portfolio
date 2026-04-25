import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2, X, Reply } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  async function load() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
  }
  useEffect(() => { load() }, [])

  async function markRead(msg, read) {
    const { error } = await supabase.from('contact_messages').update({ read }).eq('id', msg.id)
    if (error) toast.error(error.message)
    else load()
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); setSelected(null); load() }
  }

  async function openMessage(msg) {
    setSelected(msg)
    if (!msg.read) await markRead(msg, true)
  }

  const shown = messages.filter(m => filter === 'all' ? true : filter === 'unread' ? !m.read : m.read)
  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          {unreadCount > 0
            ? <span className="text-electric">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
            : 'All messages read'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: `All (${messages.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: `Read (${messages.length - unreadCount})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'bg-electric text-white' : 'glass glass-hover text-slate-400'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-card">
            <tr className="text-left">
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider w-8"></th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">From</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Message</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-card/50">
            {shown.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No messages found.</td></tr>
            )}
            {shown.map(m => (
              <tr key={m.id} onClick={() => openMessage(m)}
                className={`cursor-pointer transition-colors hover:bg-white/3 ${!m.read ? 'bg-electric/3' : ''}`}>
                <td className="px-5 py-4">
                  {m.read
                    ? <MailOpen size={14} className="text-slate-500" />
                    : <Mail size={14} className="text-electric" />
                  }
                </td>
                <td className="px-5 py-4">
                  <p className={`font-medium text-sm ${m.read ? 'text-slate-300' : 'text-white'}`}>{m.name}</p>
                  <p className="text-slate-500 text-xs">{m.email}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-slate-400 text-xs line-clamp-1">{m.message}</p>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-slate-500 text-xs">
                  {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => markRead(m, !m.read)}
                      className={`text-xs px-2 py-1 rounded-lg transition-colors ${m.read ? 'text-slate-500 hover:text-electric' : 'text-electric hover:text-slate-300'}`}>
                      {m.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button onClick={() => remove(m.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-lg p-7 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-lg text-white">{selected.name}</h2>
                <p className="text-slate-400 text-sm">{selected.email}</p>
                <p className="text-slate-600 text-xs mt-0.5">{new Date(selected.created_at).toLocaleString('en-GB')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white shrink-0"><X size={18} /></button>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: Your message`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm transition-all">
                <Reply size={14} /> Reply via Email
              </a>
              <button onClick={() => remove(selected.id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
