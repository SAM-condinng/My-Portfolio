import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Camera, Cpu, Briefcase, Star } from 'lucide-react'
import { getProfile, getProjects, getTestimonials } from '../lib/supabase'

// ── Demo data (used when Supabase is not connected) ──────────────
const DEMO_PROFILE = {
  tagline: 'Full Stack Developer · Student · Entrepreneur',
  bio: "I'm Samuel, a Computer Science student from Kenya with a deep passion for building digital products that solve real problems.",
  available: true,
}
const DEMO_PROJECTS = [
  { id: 1, title: 'Zemacu Church Website', description: 'Full-stack church management system with admin dashboard, attendance tracking, and member registration.', tech_stack: ['React', 'Supabase', 'Tailwind'], category: 'Web Dev', featured: true },
  { id: 2, title: 'Portfolio v2', description: 'Personal portfolio with CMS-like admin panel, blog engine, and Supabase backend.', tech_stack: ['Vite', 'React', 'Supabase'], category: 'Web Dev', featured: true },
  { id: 3, title: 'Campus Event App', description: 'Event discovery and registration platform for Zetech University students.', tech_stack: ['React', 'Node.js', 'PostgreSQL'], category: 'Web Dev', featured: true },
]
const DEMO_TESTIMONIALS = [
  { id: 1, name: 'Jane Wanjiku', role: 'Project Manager', company: 'TechKenya', quote: 'Samuel delivered a world-class website that exceeded all our expectations. Highly professional!', rating: 5 },
  { id: 2, name: 'David Ochieng', role: 'CEO', company: 'StartupNairobi', quote: 'An incredibly talented developer with a great eye for design. Would work with him again in a heartbeat.', rating: 5 },
]
const SKILLS_HIGHLIGHT = [
  { icon: Code2, label: 'Full Stack Dev', desc: 'React, Node.js, Python' },
  { icon: Cpu, label: 'Cloud & Backend', desc: 'Supabase, PostgreSQL' },
  { icon: Camera, label: 'Photography', desc: 'Travel & Event shots' },
  { icon: Briefcase, label: 'Entrepreneurship', desc: 'Startup mindset' },
]

export default function Home() {
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [projects, setProjects] = useState(DEMO_PROJECTS)
  const [testimonials, setTestimonials] = useState(DEMO_TESTIMONIALS)

  useEffect(() => {
    getProfile().then(d => d && setProfile(d))
    getProjects(true).then(d => d?.length && setProjects(d))
    getTestimonials().then(d => d?.length && setTestimonials(d))
  }, [])

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 relative">
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric/10 rounded-full blur-3xl pointer-events-none" />

        {profile.available && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-green-500/30 text-green-400 text-xs font-mono mb-8 animate-pulse-slow">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            Available for hire
          </span>
        )}

        <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-none mb-6">
          <span className="block text-white">Samuel</span>
          <span className="block text-gradient">Maina Gachuru</span>
        </h1>

        <p className="font-body text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          {profile.tagline || DEMO_PROFILE.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/projects" className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-light rounded-xl font-body font-medium text-white transition-all duration-200 glow-blue hover:glow-blue-lg">
            Explore Projects <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="flex items-center gap-2 px-6 py-3 glass glass-hover rounded-xl font-body font-medium text-slate-200 transition-all duration-200">
            Contact Me
          </Link>
        </div>

        {/* Profile photo */}
        <div className="relative animate-float">
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl glass glow-blue border-2 border-electric/30 overflow-hidden flex flex-col items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Samuel Maina Gachuru"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-electric/20 to-purple-500/20" />
                <Camera size={40} className="text-electric/60 mb-2 relative z-10" />
                <p className="text-xs text-slate-400 relative z-10 text-center px-4">Add your professional<br/>photo here</p>
              </>
            )}
          </div>
          <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl border border-electric/20 -z-10" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── SKILLS HIGHLIGHT ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display font-bold text-3xl text-center mb-12">
          What I <span className="text-gradient">bring to the table</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKILLS_HIGHLIGHT.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass glass-hover rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:glow-blue">
              <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center">
                <Icon size={22} className="text-electric" />
              </div>
              <h3 className="font-display font-semibold text-sm text-white">{label}</h3>
              <p className="text-slate-400 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display font-bold text-3xl">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <Link to="/projects" className="flex items-center gap-1 text-electric text-sm font-medium hover:gap-2 transition-all">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map(p => (
            <div key={p.id} className="glass glass-hover rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:glow-blue group">
              {/* Thumbnail placeholder */}
              <div className="h-40 bg-gradient-to-br from-navy-800 to-slate-card flex items-center justify-center border-b border-slate-card relative overflow-hidden">
                {p.thumbnail_url
                  ? <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="text-electric/30 font-display font-bold text-4xl">{p.title.charAt(0)}</div>
                }
                {p.featured && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-display font-semibold text-white">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(p.tech_stack || []).slice(0, 3).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-electric/10 border border-electric/20 text-electric text-xs font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display font-bold text-3xl text-center mb-12">
            What people <span className="text-gradient">say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map(t => (
              <div key={t.id} className="glass rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-electric/10 font-display text-7xl leading-none select-none">"</div>
                <div className="flex gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-electric/20 flex items-center justify-center text-electric text-sm font-display font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-purple-500/5" />
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 relative z-10">
            Let's build something <span className="text-gradient">amazing</span>
          </h2>
          <p className="text-slate-400 mb-8 relative z-10">Open to freelance projects, collaborations, and full-time opportunities.</p>
          <Link to="/contact" className="relative z-10 inline-flex items-center gap-2 px-8 py-3 bg-electric hover:bg-electric-light rounded-xl font-body font-medium text-white transition-all duration-200 glow-blue">
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
