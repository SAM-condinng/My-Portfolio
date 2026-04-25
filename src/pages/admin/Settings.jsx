import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, GripVertical, Camera, Upload, ExternalLink, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const PLATFORMS = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Website', 'Dribbble', 'Behance', 'Other']

const DEFAULT_PROFILE = {
  bio: "I'm Samuel Maina Gachuru, a passionate Computer Science student at Zetech University, Kenya. Born in 2003 in Nyandarua, I discovered my love for technology in high school and have been building ever since.",
  tagline: 'Full Stack Developer · Student · Entrepreneur',
  education: 'Zetech University — BSc Computer Science (2023–present)',
  avatar_url: '',
  resume_url: '',
  available: true,
}

export default function AdminSettings() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [profileId, setProfileId] = useState(null)
  const [links, setLinks] = useState([])
  const [savingProfile, setSavingProfile] = useState(false)
  const [newLink, setNewLink] = useState({ platform: 'GitHub', url: '' })
  const [photoUploading, setPhotoUploading] = useState(false)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvName, setCvName] = useState('')

  async function load() {
    const { data: p } = await supabase.from('profile').select('*').single()
    if (p) {
      setProfile(p)
      setProfileId(p.id)
      if (p.resume_url) {
        // Extract filename from URL for display
        const parts = p.resume_url.split('/')
        setCvName(decodeURIComponent(parts[parts.length - 1]))
      }
    }
    const { data: l } = await supabase.from('social_links').select('*').order('display_order')
    setLinks(l || [])
  }
  useEffect(() => { load() }, [])

  async function saveProfile() {
    setSavingProfile(true)
    try {
      if (profileId) {
        const { error } = await supabase.from('profile').update({ ...profile }).eq('id', profileId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('profile').insert([{ ...profile }]).select().single()
        if (error) throw error
        setProfileId(data.id)
      }
      toast.success('Profile saved!')
    } catch (e) { toast.error(e.message) } finally { setSavingProfile(false) }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatar/profile.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setProfile(p => ({ ...p, avatar_url: data.publicUrl }))
      toast.success('Photo uploaded! Click Save Profile to apply.')
    } catch (e) { toast.error(e.message) } finally { setPhotoUploading(false) }
  }

  async function handleCvUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // Only allow PDF or Word docs
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large — max 5 MB')
      return
    }
    setCvUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `cv/samuel-gachuru-cv.${ext}`
      const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('documents').getPublicUrl(path)
      setProfile(p => ({ ...p, resume_url: data.publicUrl }))
      setCvName(file.name)
      toast.success('CV uploaded! Click Save Profile to apply.')
    } catch (e) { toast.error(e.message) } finally { setCvUploading(false) }
  }

  async function removeCV() {
    setProfile(p => ({ ...p, resume_url: '' }))
    setCvName('')
    toast.success('CV removed. Click Save Profile to apply.')
  }

  async function addLink() {
    if (!newLink.url) return toast.error('URL is required')
    const { error } = await supabase.from('social_links').insert([{ ...newLink, display_order: links.length }])
    if (error) toast.error(error.message)
    else { toast.success('Link added!'); setNewLink({ platform: 'GitHub', url: '' }); load() }
  }

  async function removeLink(id) {
    const { error } = await supabase.from('social_links').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Link removed'); load() }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Update your profile, photo, and social links</p>
      </div>

      {/* ── Profile Photo ── */}
      <section className="glass rounded-2xl p-7 mb-6">
        <h2 className="font-display font-semibold text-lg text-white mb-5">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden glass border-2 border-electric/30 flex items-center justify-center shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              : <Camera size={28} className="text-electric/40" />
            }
            {photoUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-slate-400 text-sm">Upload your professional photo. Recommended: square, at least 400×400px.</p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 glass glass-hover rounded-xl text-sm text-electric border border-electric/30 cursor-pointer transition-all w-fit">
              <Upload size={14} />
              {photoUploading ? 'Uploading…' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {profile.avatar_url && (
              <div className="flex items-center gap-2">
                <input value={profile.avatar_url} onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))}
                  className="flex-1 px-3 py-2 glass rounded-xl text-xs text-slate-300 outline-none border border-slate-card focus:border-electric/60 font-mono"
                  placeholder="Or paste image URL directly" />
                <a href={profile.avatar_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><ExternalLink size={13} /></a>
              </div>
            )}
            {!profile.avatar_url && (
              <input value={profile.avatar_url} onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))}
                className="px-3 py-2 glass rounded-xl text-xs text-slate-300 outline-none border border-slate-card focus:border-electric/60 font-mono"
                placeholder="Or paste image URL directly" />
            )}
          </div>
        </div>
      </section>

      {/* ── CV / Resume Upload ── */}
      <section className="glass rounded-2xl p-7 mb-6">
        <h2 className="font-display font-semibold text-lg text-white mb-1">CV / Resume</h2>
        <p className="text-slate-400 text-sm mb-5">
          Upload your CV as a PDF or Word doc. It will appear as a download button on your About and Contact pages.
        </p>

        {/* Current CV status */}
        {profile.resume_url ? (
          <div className="flex items-center gap-4 glass rounded-xl px-5 py-4 mb-5 border border-green-500/20">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-green-400 text-sm font-medium">CV uploaded</p>
              <p className="text-slate-400 text-xs truncate mt-0.5 font-mono">{cvName || 'CV file'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 glass glass-hover rounded-lg text-electric text-xs transition-all"
              >
                <ExternalLink size={12} /> Preview
              </a>
              <button
                onClick={removeCV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs transition-all"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 glass rounded-xl px-5 py-4 mb-5 border border-slate-card">
            <AlertCircle size={16} className="text-slate-500 shrink-0" />
            <p className="text-slate-500 text-sm">No CV uploaded yet</p>
          </div>
        )}

        {/* Upload area */}
        <label className={`group flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 px-6 cursor-pointer transition-all
          ${cvUploading ? 'border-electric/40 bg-electric/5' : 'border-slate-card hover:border-electric/40 hover:bg-electric/3'}`}>
          {cvUploading ? (
            <>
              <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
              <p className="text-electric text-sm">Uploading your CV…</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-electric/10 flex items-center justify-center group-hover:bg-electric/15 transition-colors">
                <FileText size={26} className="text-electric" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium">
                  {profile.resume_url ? 'Replace CV' : 'Upload your CV'}
                </p>
                <p className="text-slate-500 text-xs mt-1">PDF, DOC or DOCX · Max 5 MB</p>
              </div>
              <span className="px-4 py-2 bg-electric/10 hover:bg-electric/20 border border-electric/30 rounded-xl text-electric text-sm transition-colors">
                Choose file
              </span>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleCvUpload}
            className="hidden"
            disabled={cvUploading}
          />
        </label>

        {/* Manual URL fallback */}
        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-xs text-slate-500">Or paste a direct link (Google Drive, Dropbox, etc.)</label>
          <div className="flex gap-2">
            <input
              value={profile.resume_url || ''}
              onChange={e => { setProfile(p => ({ ...p, resume_url: e.target.value })); setCvName('') }}
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1 px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors font-mono text-xs"
            />
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer"
                className="px-3 py-2.5 glass glass-hover rounded-xl text-slate-400 hover:text-electric transition-colors">
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Profile Info ── */}
      <section className="glass rounded-2xl p-7 mb-6">
        <h2 className="font-display font-semibold text-lg text-white mb-5">Profile Info</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Tagline</label>
            <input value={profile.tagline || ''} onChange={e => setProfile(p => ({ ...p, tagline: e.target.value }))}
              placeholder="Full Stack Developer · Student · Entrepreneur"
              className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Bio</label>
            <textarea rows={5} value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell visitors about yourself…"
              className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Education</label>
            <input value={profile.education || ''} onChange={e => setProfile(p => ({ ...p, education: e.target.value }))}
              placeholder="Zetech University — BSc Computer Science (2023–present)"
              className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setProfile(p => ({ ...p, available: !p.available }))}
              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${profile.available ? 'bg-green-500' : 'bg-slate-card'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.available ? 'translate-x-4' : ''}`} />
            </div>
            <div>
              <span className="text-sm text-slate-200">Available for hire</span>
              <p className="text-slate-500 text-xs">Shows a green badge on the home page hero</p>
            </div>
          </label>

          <button onClick={saveProfile} disabled={savingProfile}
            className="self-start flex items-center gap-2 px-5 py-2.5 bg-electric hover:bg-electric-light rounded-xl text-white text-sm font-medium transition-all glow-blue disabled:opacity-60">
            {savingProfile ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={14} />Save Profile</>}
          </button>
        </div>
      </section>

      {/* ── Social Links ── */}
      <section className="glass rounded-2xl p-7">
        <h2 className="font-display font-semibold text-lg text-white mb-5">Social Links</h2>

        {/* Existing links */}
        <div className="flex flex-col gap-2 mb-5">
          {links.length === 0 && <p className="text-slate-500 text-sm">No links added yet.</p>}
          {links.map(l => (
            <div key={l.id} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <GripVertical size={14} className="text-slate-600 shrink-0" />
              <span className="text-electric text-xs font-mono w-20 shrink-0">{l.platform}</span>
              <a href={l.url} target="_blank" rel="noreferrer"
                className="flex-1 text-slate-300 text-xs hover:text-electric transition-colors truncate">{l.url}</a>
              <button onClick={() => removeLink(l.id)} className="text-slate-500 hover:text-red-400 transition-colors shrink-0"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>

        {/* Add new link */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Add Link</p>
          <div className="flex gap-3">
            <select value={newLink.platform} onChange={e => setNewLink(l => ({ ...l, platform: e.target.value }))}
              className="px-3 py-2.5 glass rounded-xl text-sm text-slate-200 outline-none border border-slate-card focus:border-electric/60 transition-colors bg-navy-900 w-36 shrink-0">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={newLink.url} onChange={e => setNewLink(l => ({ ...l, url: e.target.value }))}
              placeholder="https://..."
              onKeyDown={e => e.key === 'Enter' && addLink()}
              className="flex-1 px-3 py-2.5 glass rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none border border-slate-card focus:border-electric/60 transition-colors" />
            <button onClick={addLink}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-electric/10 hover:bg-electric/20 border border-electric/30 rounded-xl text-electric text-sm transition-colors shrink-0">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
