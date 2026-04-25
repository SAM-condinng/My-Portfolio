import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Star, ExternalLink, Github, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { title: '', description: '', tech_stack: [], github_url: '', live_url: '', thumbnail_url: '', category: '', featured: false }
const CATEGORIES = ['Web Dev', 'Mobile', 'Design', 'Backend', 'AI/ML', 'Other']

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(null) // null | 'new' | project
  const [form, setForm] = useState(EMPTY)
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setTechInput(''); setModal('new') }
  function openEdit(p) { setForm({ ...p, tech_stack: p.tech_stack || [] }); setTechInput(''); setModal(p) }

  function addTag() {
    if (!techInput.trim()) return
    setForm(f => ({ ...f, tech_stack: [...new Set([...f.tech_stack, techInput.trim()])] }))
    setTechInput('')
  }
  function removeTag(t) { setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(x => x !== t) })) }

  async function save() {
    if (!form.title) return toast.error('Title is required')
    setLoading(true)
    try {
      if (modal === 'new') {
        const { error } = await supabase.from('projects').insert([{ ...form }])
        if (error) throw error
        toast.success('Project added!')
      } else {
        const { error } = await supabase.from('projects').update({ ...form }).eq('id', modal.id)
        if (error) throw error
        toast.success('Project updated!')
      }
      setModal(null); load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-card">
            <tr className="text-left">
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Title</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Stack</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Featured</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-card/50">
            {projects.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No projects yet. Click "Add Project" to start.</td></tr>
            )}
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{p.title}</p>
                  <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{p.description}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs">{p.category || '—'}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {(p.tech_stack || []).slice(0, 3).map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-navy-800 text-slate-400 text-xs font-mono">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {p.featured ? <Star size={14} className="text-yellow-400" fill="currentColor" /> : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><ExternalLink size={14} /></a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><Github size={14} /></a>}
                    <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">{modal === 'new' ? 'Add Project' : 'Edit Project'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            {[
              { key: 'title', label: 'Title *', placeholder: 'My Awesome Project' },
              { key: 'description', label: 'Description', placeholder: 'What does this project do?', textarea: true },
              { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/...' },
              { key: 'live_url', label: 'Live URL', placeholder: 'https://...' },
              { key: 'thumbnail_url', label: 'Thumbnail URL', placeholder: 'https://... (image link)' },
            ].map(({ key, label, placeholder, textarea }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">{label}</label>
                {textarea
                  ? <textarea rows={3} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none" />
                  : <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
                }
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Category</label>
              <select value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 outline-none border border-slate-card focus:border-electric/60 transition-colors bg-navy-900">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Tech Stack</label>
              <div className="flex gap-2">
                <input value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="React, Node.js… press Enter"
                  className="flex-1 px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
                <button onClick={addTag} className="px-3 py-2.5 bg-electric/10 border border-electric/30 rounded-xl text-electric text-sm hover:bg-electric/20 transition-colors"><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.tech_stack.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs">
                    {t}<button onClick={() => removeTag(t)} className="hover:text-red-400 ml-0.5"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${form.featured ? 'bg-electric' : 'bg-slate-card'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-slate-300">Featured project</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 glass rounded-xl text-slate-300 text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={save} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm transition-all disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={14} />Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
