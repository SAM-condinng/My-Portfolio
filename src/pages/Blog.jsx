import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Tag, Heart, ArrowLeft, Search } from 'lucide-react'
import { getBlogPosts } from '../lib/supabase'

const DEMO_POSTS = [
  { id: 1, title: 'Building My First Full-Stack App', slug: 'first-full-stack-app', excerpt: 'What I learned building the Zemacu Church Website — from Supabase schema design to deploying on Netlify.', tags: ['React', 'Supabase', 'Beginners'], read_time_min: 6, likes: 24, published: true, created_at: '2025-03-10' },
  { id: 2, title: 'Why Every Student Should Learn to Code', slug: 'students-should-code', excerpt: "Coding is not just for CS students. Here's why I believe every university student in Kenya should learn to code.", tags: ['Opinion', 'Tech', 'Kenya'], read_time_min: 4, likes: 38, published: true, created_at: '2025-02-20' },
  { id: 3, title: 'My Photography Journey Across Kenya', slug: 'photography-kenya', excerpt: 'From the Rift Valley to the Coast — how my love for photography grew alongside my love for travel.', tags: ['Photography', 'Kenya', 'Travel'], read_time_min: 5, likes: 17, published: true, created_at: '2025-01-15' },
]

export function Blog() {
  const [posts, setPosts] = useState(DEMO_POSTS)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')

  useEffect(() => { getBlogPosts().then(d => d?.length && setPosts(d)) }, [])

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))]
  const shown = posts.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
    (!tag || (p.tags || []).includes(tag))
  )

  return (
    <div className="page-enter max-w-4xl mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-14">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl mb-4">
          My <span className="text-gradient">Blog</span>
        </h1>
        <p className="text-slate-400">Thoughts on tech, life, and building things in Kenya.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-sm text-slate-300 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/50 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTag('')} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${!tag ? 'bg-electric text-white' : 'glass glass-hover text-slate-400'}`}>All</button>
          {allTags.slice(0, 5).map(t => (
            <button key={t} onClick={() => setTag(t === tag ? '' : t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${tag === t ? 'bg-electric text-white' : 'glass glass-hover text-slate-400'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {shown.map(p => (
          <Link to={`/blog/${p.slug}`} key={p.id} className="glass glass-hover rounded-2xl p-6 flex flex-col sm:flex-row gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:glow-blue group">
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="font-display font-semibold text-lg text-white group-hover:text-electric transition-colors">{p.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{p.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(p.tags || []).map(t => (
                  <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs"><Tag size={9} />{t}</span>
                ))}
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
              <span className="flex items-center gap-1 text-slate-500 text-xs"><Clock size={11} />{p.read_time_min} min</span>
              <span className="flex items-center gap-1 text-slate-500 text-xs"><Heart size={11} />{p.likes || 0}</span>
              <span className="text-slate-600 text-xs">{new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    getBlogPosts().then(posts => {
      const found = posts?.find(p => p.slug === slug)
      setPost(found || DEMO_POSTS.find(p => p.slug === slug) || DEMO_POSTS[0])
    })
  }, [slug])

  if (!post) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 pt-32 pb-20">
      <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-10 transition-colors">
        <ArrowLeft size={15} /> Back to blog
      </Link>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(post.tags || []).map(t => (
          <span key={t} className="px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs">{t}</span>
        ))}
      </div>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-6">{post.title}</h1>
      <div className="flex items-center gap-5 text-slate-500 text-sm mb-10 pb-6 border-b border-slate-card">
        <span className="flex items-center gap-1"><Clock size={13} />{post.read_time_min} min read</span>
        <span className="flex items-center gap-1"><Heart size={13} />{post.likes || 0} likes</span>
        <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      {post.content
        ? <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        : <div className="space-y-4 text-slate-300 leading-relaxed">
            <p className="text-lg">{post.excerpt}</p>
            <p className="text-slate-400 text-sm italic">Full article content will appear here once published via the admin dashboard.</p>
          </div>
      }
    </div>
  )
}

export default Blog
