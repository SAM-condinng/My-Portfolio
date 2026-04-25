import { useEffect, useState, useRef } from 'react'
import { MapPin, GraduationCap, Download, Camera } from 'lucide-react'
import { getProfile, getSkills, supabase } from '../lib/supabase'

const DEMO_PROFILE = {
  bio: "I'm Samuel Maina Gachuru, a passionate Computer Science student at Zetech University, Kenya. Born in 2003 in Nyandarua, I discovered my love for technology in high school and have been building ever since. I'm driven by curiosity, a love for problem-solving, and a belief that technology can transform lives across Africa.",
  tagline: 'Building the future, one line at a time.',
  education: 'Zetech University — BSc Computer Science (2023–present)',
  available: true,
}
const DEMO_SKILLS = [
  { id: 1, name: 'React / JavaScript', category: 'Web Dev', proficiency: 85 },
  { id: 2, name: 'Python', category: 'Web Dev', proficiency: 75 },
  { id: 3, name: 'HTML / CSS', category: 'Web Dev', proficiency: 90 },
  { id: 4, name: 'Supabase / PostgreSQL', category: 'Backend', proficiency: 70 },
  { id: 5, name: 'Tailwind CSS', category: 'Web Dev', proficiency: 88 },
  { id: 6, name: 'Photography', category: 'Design', proficiency: 72 },
  { id: 7, name: 'Node.js', category: 'Backend', proficiency: 65 },
  { id: 8, name: 'Git / GitHub', category: 'Tools', proficiency: 80 },
]
const DEMO_TIMELINE = [
  { id: 1, year: '2003', event: 'Born in Nyandarua, Kenya, raised in a loving, faith-driven home.' },
  { id: 2, year: '2018', event: 'Joined high school and discovered a passion for computers and technology.' },
  { id: 3, year: '2022', event: 'Completed high school with distinction; built first website as a personal project.' },
  { id: 4, year: '2023', event: 'Enrolled at Zetech University to study Computer Science.' },
  { id: 5, year: '2024', event: 'Built Zemacu Church Website — first full-stack production project.' },
  { id: 6, year: '2025', event: 'Continuing to build, learn, and grow as a developer and entrepreneur.' },
]

function SkillBar({ name, proficiency, category }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setWidth(proficiency); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [proficiency])
  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300 font-body">{name}</span>
        <span className="text-xs text-electric font-mono">{width}%</span>
      </div>
      <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
        <div className="skill-bar h-full bg-gradient-to-r from-electric to-purple-500 rounded-full" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export default function About() {
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [skills, setSkills] = useState(DEMO_SKILLS)
  const [timeline, setTimeline] = useState(DEMO_TIMELINE)

  useEffect(() => {
    getProfile().then(d => d && setProfile(d))
    getSkills().then(d => d?.length && setSkills(d))
    supabase
      .from('timeline')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => data?.length && setTimeline(data))
  }, [])

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = [...(acc[s.category] || []), s]
    return acc
  }, {})

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl mb-4">
          About <span className="text-gradient">Me</span>
        </h1>
        <p className="text-slate-400 text-lg italic">"{profile.tagline}"</p>
      </div>

      {/* Profile section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        {/* Photo placeholder */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-64 h-80 rounded-3xl glass glow-blue flex flex-col items-center justify-center border-2 border-electric/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric/20 via-transparent to-purple-500/20" />
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="Samuel" className="w-full h-full object-cover" />
                : <>
                    <Camera size={48} className="text-electric/50 mb-3 relative z-10" />
                    <p className="text-xs text-slate-400 text-center px-6 relative z-10">Professional photo<br/>placeholder — update in admin</p>
                  </>
              }
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border border-electric/20 -z-10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-electric/10 border border-electric/20 -z-10" />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-6">
          <p className="text-slate-300 leading-relaxed text-base">{profile.bio}</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <MapPin size={15} className="text-electric shrink-0" />
              <span>Nairobi, Kenya</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <GraduationCap size={15} className="text-electric shrink-0" />
              <span>{profile.education}</span>
            </div>
          </div>
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue w-fit"
            >
              <Download size={15} /> Download My CV
            </a>
          )}
        </div>
      </div>

      {/* Skills */}
      <section className="mb-20">
        <h2 className="font-display font-bold text-3xl mb-10">
          Skills & <span className="text-gradient">Expertise</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="glass rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="font-display font-semibold text-electric text-sm tracking-widest uppercase">{cat}</h3>
              {items.map(s => <SkillBar key={s.id} {...s} />)}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="font-display font-bold text-3xl mb-10">
          My <span className="text-gradient">Journey</span>
        </h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-electric to-purple-500/30" />
          <div className="flex flex-col gap-8 pl-16">
            {timeline.map((item, i) => (
              <div key={item.id || i} className="relative">
                <div className="absolute -left-11 top-1 w-3 h-3 rounded-full bg-electric ring-4 ring-navy-950" />
                <span className="font-mono text-electric text-xs font-medium mb-1 block">{item.year}</span>
                <p className="text-slate-300 text-sm leading-relaxed glass rounded-xl px-4 py-3">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
