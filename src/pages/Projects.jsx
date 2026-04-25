import { useEffect, useState } from 'react'
import { ExternalLink, Github, Eye, Star, Search } from 'lucide-react'
import { getProjects } from '../lib/supabase'

const DEMO = [
  { id: 1, title: 'Zemacu Church Website', description: 'Full-stack church management system with admin dashboard, member registration, attendance tracking, and gallery.', tech_stack: ['React', 'Supabase', 'Tailwind', 'Vite'], category: 'Web Dev', featured: true, view_count: 142, github_url: '#', live_url: '#' },
  { id: 2, title: 'Portfolio v2', description: 'Personal developer portfolio with CMS-like admin panel, blog engine powered by Supabase.', tech_stack: ['Vite', 'React', 'Supabase', 'Tailwind'], category: 'Web Dev', featured: true, view_count: 87 },
  { id: 3, title: 'Campus Event App', description: 'Event discovery and RSVP platform for Zetech University. Students can browse, register for and share events.', tech_stack: ['React', 'Node.js', 'PostgreSQL'], category: 'Web Dev', featured: false, view_count: 53 },
  { id: 4, title: 'Kenya Travel Blog', description: 'Photography-first travel blog showcasing Kenyan landscapes, culture and hidden gems.', tech_stack: ['HTML', 'CSS', 'JavaScript'], category: 'Design', featured: false, view_count: 29 },
]

export default function Projects() {
  const [projects, setProjects] = useState(DEMO)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProjects().then(d => d?.length && setProjects(d))
  }, [])

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const shown = projects.filter(p => {
    const matchCat = filter === 'All' || p.category === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-14">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl mb-4">
          My <span className="text-gradient">Projects</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">Things I've built, explored, and shipped.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-sm text-slate-300 placeholder-slate-500 outline-none focus:border-electric/50 border border-slate-card transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c ? 'bg-electric text-white' : 'glass glass-hover text-slate-300'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map(p => (
          <div key={p.id} className="glass glass-hover rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:glow-blue group">
            {/* Thumbnail */}
            <div className="h-44 bg-gradient-to-br from-navy-800 to-slate-card flex items-center justify-center border-b border-slate-card relative overflow-hidden">
              {p.thumbnail_url
                ? <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="text-electric/20 font-display font-extrabold text-6xl select-none">{p.title.charAt(0)}</div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {p.featured && (
                <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                  <Star size={10} fill="currentColor" /> Featured
                </span>
              )}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-slate-300 text-xs">
                <Eye size={10} /> {p.view_count || 0}
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-white leading-tight">{p.title}</h3>
                {p.category && <span className="text-xs px-2 py-0.5 rounded bg-electric/10 text-electric border border-electric/20 whitespace-nowrap">{p.category}</span>}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {(p.tech_stack || []).slice(0, 4).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-navy-800 border border-slate-card text-slate-400 text-xs font-mono">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors"><Github size={13} /> Code</a>}
                {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-electric hover:text-electric-light text-xs transition-colors"><ExternalLink size={13} /> Live demo</a>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="font-display text-lg">No projects found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      )}
    </div>
  )
}
