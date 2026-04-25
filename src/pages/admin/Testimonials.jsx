import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { name: '', role: '', company: '', quote: '', avatar_url: '', rating: 5 }

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('new') }
  function openEdit(t) { setForm({ ...t }); setModal(t) }

  async function save() {
    if (!form.name || !form.quote) return toast.error('Name and quote are required')
    setLoading(true)
    try {
      if (modal === 'new') {
        const { error } = await supabase.from('testimonials').insert([{ ...form }])
        if (error) throw error
        toast.success('Testimonial added!')
      } else {
        const { error } = await supabase.from('testimonials').update({ ...form }).eq('id', modal.id)
        if (error) throw error
        toast.success('Testimonial updated!')
      }
      setModal(null); load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this testimonial?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Testimonials</h1>
          <p className="text-slate-400 text-sm mt-1">Manage client and colleague testimonials</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.length === 0 && (
          <div className="col-span-2 glass rounded-2xl p-12 text-center text-slate-500">No testimonials yet.</div>
        )}
        {items.map(t => (
          <div key={t.id} className="glass rounded-2xl p-6 flex flex-col gap-3 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center text-electric font-display font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(t)} className="text-slate-400 hover:text-blue-400 transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < (t.rating || 5) ? 'text-yellow-400' : 'text-slate-700'} fill={i < (t.rating || 5) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic line-clamp-3">"{t.quote}"</p>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-lg p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">{modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            {[
              { key: 'name', label: 'Name *', placeholder: 'Jane Doe' },
              { key: 'role', label: 'Role', placeholder: 'Project Manager' },
              { key: 'company', label: 'Company', placeholder: 'TechKenya' },
              { key: 'avatar_url', label: 'Avatar URL', placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">{label}</label>
                <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                  className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Quote *</label>
              <textarea rows={3} value={form.quote || ''} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="What did they say about working with you?"
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))}
                    className="transition-transform hover:scale-110">
                    <Star size={22} className={n <= form.rating ? 'text-yellow-400' : 'text-slate-600'} fill={n <= form.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

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
