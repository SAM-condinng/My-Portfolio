import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { sendMessage, getProfile } from '../lib/supabase'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => { getProfile().then(d => d && setProfile(d)) }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      await sendMessage(form)
      toast.success('Message sent! I\'ll get back to you soon.')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed to send. Please try again or email directly.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-14">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl mb-4">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">Have a project in mind? Let's talk. I usually respond within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 flex flex-col gap-5">
          <h2 className="font-display font-semibold text-lg text-white">Send a message</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Your Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Samuel Doe"
              className="px-4 py-3 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
              className="px-4 py-3 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Message</label>
            <textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me about your project…"
              className="px-4 py-3 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-electric hover:bg-electric-light rounded-xl text-white font-medium text-sm transition-all glow-blue disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={15} />Send message</>}
          </button>
        </form>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-2xl p-7 flex flex-col gap-5">
            <h2 className="font-display font-semibold text-lg text-white">Contact info</h2>
            {[
              { icon: Mail, label: 'Email', value: 'kettwhizzy@gmail.com', href: 'mailto:kettwhizzy@gmail.com' },
              { icon: Phone, label: 'Phone', value: '+254 708 816 796', href: 'tel:+254708816796' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-electric" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{label}</p>
                  {href
                    ? <a href={href} className="text-slate-200 text-sm hover:text-electric transition-colors">{value}</a>
                    : <p className="text-slate-200 text-sm">{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-7 flex flex-col gap-4">
            <h2 className="font-display font-semibold text-lg text-white">Find me online</h2>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/in/samuel-maina-n/', label: 'LinkedIn' },
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: 'https://x.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 glass glass-hover rounded-xl text-slate-300 hover:text-electric text-sm transition-all">
                  <Icon size={15} />{label}
                </a>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-green-500/20">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              Available for freelance & full-time opportunities
            </p>
          </div>

          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center justify-center gap-2 py-3 glass glass-hover rounded-2xl text-electric border border-electric/30 text-sm font-medium transition-all hover:glow-blue"
            >
              <Download size={15} /> Download My CV
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
