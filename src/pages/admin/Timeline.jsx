import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { year: '', event: '', display_order: 0 }

export default function AdminTimeline() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null) // null | 'new' | item
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('timeline')
      .select('*')
      .order('display_order', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  function openNew() {
    setForm({ ...EMPTY, display_order: items.length })
    setModal('new')
  }
  function openEdit(item) {
    setForm({ ...item })
    setModal(item)
  }

  async function save() {
    if (!form.year || !form.event) return toast.error('Year and event are required')
    setLoading(true)
    try {
      if (modal === 'new') {
        const { error } = await supabase.from('timeline').insert([{ ...form }])
        if (error) throw error
        toast.success('Entry added!')
      } else {
        const { error } = await supabase.from('timeline').update({ ...form }).eq('id', modal.id)
        if (error) throw error
        toast.success('Entry updated!')
      }
      setModal(null)
      load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this timeline entry?')) return
    const { error } = await supabase.from('timeline').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  async function moveItem(index, direction) {
    const newItems = [...items]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newItems.length) return

    // Swap display_order values
    const aId = newItems[index].id
    const bId = newItems[swapIndex].id
    const aOrder = newItems[swapIndex].display_order
    const bOrder = newItems[index].display_order

    await supabase.from('timeline').update({ display_order: aOrder }).eq('id', aId)
    await supabase.from('timeline').update({ display_order: bOrder }).eq('id', bId)
    load()
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">My Journey Timeline</h1>
          <p className="text-slate-400 text-sm mt-1">Add and edit the milestones shown on your About page</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue"
        >
          <Plus size={15} /> Add Entry
        </button>
      </div>

      {/* Preview hint */}
      <div className="glass rounded-xl px-5 py-3 mb-6 border border-electric/20 flex items-center gap-3">
        <div className="w-2 h-2 bg-electric rounded-full shrink-0" />
        <p className="text-slate-400 text-sm">
          Entries are displayed chronologically on your <span className="text-electric">/about</span> page. Use the arrows to reorder them.
        </p>
      </div>

      {/* Timeline list */}
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">
            <p className="font-display text-lg mb-1">No entries yet</p>
            <p className="text-sm">Click "Add Entry" to build your journey timeline.</p>
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={item.id}
            className="glass glass-hover rounded-2xl px-5 py-4 flex items-center gap-4 transition-all group"
          >
            {/* Reorder arrows */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronUp size={13} />
              </button>
              <button
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Timeline dot + line visual */}
            <div className="flex flex-col items-center shrink-0 self-stretch py-1">
              <div className="w-3 h-3 rounded-full bg-electric ring-4 ring-electric/20 shrink-0" />
              {index < items.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-electric/40 to-transparent mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="font-mono text-electric text-xs font-semibold">{item.year}</span>
              <p className="text-slate-300 text-sm mt-0.5 leading-relaxed">{item.event}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(item)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => remove(item.id)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-md p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">
                {modal === 'new' ? 'Add Timeline Entry' : 'Edit Timeline Entry'}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Year *</label>
              <input
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                placeholder="e.g. 2024"
                maxLength={9}
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors font-mono"
              />
              <p className="text-slate-600 text-xs">You can also write a range like "2022–2023"</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400">Event *</label>
              <textarea
                rows={3}
                value={form.event}
                onChange={e => setForm(f => ({ ...f, event: e.target.value }))}
                placeholder="What happened this year? e.g. Built Zemacu Church Website — first full-stack production project."
                className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none"
              />
            </div>

            {/* Live preview */}
            {(form.year || form.event) && (
              <div className="glass rounded-xl px-4 py-3 border border-electric/20">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-electric ring-3 ring-electric/20 mt-1 shrink-0" />
                  <div>
                    <span className="font-mono text-electric text-xs">{form.year || 'Year'}</span>
                    <p className="text-slate-300 text-sm mt-0.5">{form.event || 'Event description…'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 glass rounded-xl text-slate-300 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm transition-all disabled:opacity-60"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Check size={14} /> Save Entry</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
