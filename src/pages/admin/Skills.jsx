import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { name: '', category: 'Web Dev', proficiency: 75 }
const CATEGORIES = ['Web Dev', 'Backend', 'Design', 'Tools', 'Soft Skills', 'Other']

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('skills').select('*').order('category')
    setSkills(data || [])
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('new') }
  function openEdit(s) { setForm({ ...s }); setModal(s) }

  async function save() {
    if (!form.name) return toast.error('Name is required')
    setLoading(true)
    try {
      if (modal === 'new') {
        const { error } = await supabase.from('skills').insert([{ ...form }])
        if (error) throw error
        toast.success('Skill added!')
      } else {
        const { error } = await supabase.from('skills').update({ ...form }).eq('id', modal.id)
        if (error) throw error
        toast.success('Skill updated!')
      }
      setModal(null); load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this skill?')) return
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  const grouped = skills.reduce((acc, s) => { acc[s.category] = [...(acc[s.category] || []), s]; return acc }, {})

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Skills</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your skills and proficiency levels</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue">
          <Plus size={15} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-card">
              <h2 className="font-display font-semibold text-sm text-electric uppercase tracking-wider">{cat}</h2>
            </div>
            <div className="divide-y divide-slate-card/50">
              {items.map(s => (
                <div key={s.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{s.name}</p>
                    <div className="mt-1.5 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-electric to-purple-500 rounded-full" style={{ width: `${s.proficiency}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-electric w-8 text-right shrink-0">{s.proficiency}%</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-blue-400 transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => remove(s.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="col-span-2 glass rounded-2xl p-12 text-center text-slate-500">No skills yet. Click "Add Skill" to start.</div>
        )}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-md p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">{modal === 'new' ? 'Add Skill' : 'Edit Skill'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Skill Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React"
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 outline-none border border-slate-card focus:border-electric/60 transition-colors bg-navy-900">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Proficiency: <span className="text-electric font-mono">{form.proficiency}%</span></label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={e => setForm(f => ({ ...f, proficiency: +e.target.value }))}
                className="w-full accent-electric" />
              <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-gradient-to-r from-electric to-purple-500 rounded-full transition-all" style={{ width: `${form.proficiency}%` }} />
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
