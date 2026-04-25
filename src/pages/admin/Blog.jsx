import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { title: '', slug: '', content: '', excerpt: '', cover_image: '', tags: [], published: false, read_time_min: 3 }

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setTagInput(''); setModal('new') }
  function openEdit(p) { setForm({ ...p, tags: p.tags || [] }); setTagInput(''); setModal(p) }

  function addTag() {
    if (!tagInput.trim()) return
    setForm(f => ({ ...f, tags: [...new Set([...f.tags, tagInput.trim()])] }))
    setTagInput('')
  }

  async function save() {
    if (!form.title) return toast.error('Title is required')
    const data = { ...form, slug: form.slug || slugify(form.title), updated_at: new Date().toISOString() }
    setLoading(true)
    try {
      if (modal === 'new') {
        const { error } = await supabase.from('blog_posts').insert([data])
        if (error) throw error
        toast.success('Post created!')
      } else {
        const { error } = await supabase.from('blog_posts').update(data).eq('id', modal.id)
        if (error) throw error
        toast.success('Post updated!')
      }
      setModal(null); load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  async function togglePublish(p) {
    const { error } = await supabase.from('blog_posts').update({ published: !p.published }).eq('id', p.id)
    if (error) toast.error(error.message)
    else { toast.success(p.published ? 'Unpublished' : 'Published!'); load() }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Blog</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage blog posts</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue">
          <Plus size={15} /> New Post
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-card">
            <tr className="text-left">
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Title</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Tags</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-5 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-card/50">
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No posts yet. Start writing!</td></tr>
            )}
            {posts.map(p => (
              <tr key={p.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{p.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 font-mono">/{p.slug}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {(p.tags || []).slice(0, 3).map(t => (
                      <span key={t} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-electric/10 text-electric text-xs"><Tag size={8} />{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => togglePublish(p)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${p.published ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-slate-card text-slate-400 border border-slate-card'}`}>
                    {p.published ? <Eye size={10} /> : <EyeOff size={10} />}
                    {p.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-slate-500 text-xs">
                  {new Date(p.created_at).toLocaleDateString('en-GB')}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">{modal === 'new' ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            {[
              { key: 'title', label: 'Title *', placeholder: 'Post title' },
              { key: 'slug', label: 'Slug (auto-generated if empty)', placeholder: 'my-post-title' },
              { key: 'excerpt', label: 'Excerpt', placeholder: 'Short summary for blog listing', textarea: true, rows: 2 },
              { key: 'content', label: 'Content (HTML/Markdown)', placeholder: '<p>Write your blog post here…</p>', textarea: true, rows: 8 },
              { key: 'cover_image', label: 'Cover Image URL', placeholder: 'https://...' },
            ].map(({ key, label, placeholder, textarea, rows }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">{label}</label>
                {textarea
                  ? <textarea rows={rows || 4} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none font-mono" />
                  : <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
                }
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Read Time (minutes)</label>
                <input type="number" min={1} value={form.read_time_min} onChange={e => setForm(f => ({ ...f, read_time_min: +e.target.value }))}
                  className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag, Enter"
                    className="flex-1 px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
                  <button onClick={addTag} className="px-3 py-2 bg-electric/10 border border-electric/30 rounded-xl text-electric hover:bg-electric/20 transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(form.tags || []).map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs">
                  {t}<button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))} className="hover:text-red-400 ml-0.5"><X size={10} /></button>
                </span>
              ))}
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${form.published ? 'bg-green-500' : 'bg-slate-card'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.published ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-slate-300">Publish immediately</span>
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
