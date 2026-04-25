import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-card mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-display font-bold text-lg text-gradient">SMG</span>
          <p className="text-slate-400 text-sm mt-1">Samuel Maina Gachuru · Full Stack Developer</p>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/samuel-maina-n/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><Linkedin size={18} /></a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-electric transition-colors"><Twitter size={18} /></a>
          <a href="mailto:kettwhizzy@gmail.com" className="text-slate-400 hover:text-electric transition-colors"><Mail size={18} /></a>
        </div>
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Samuel Maina Gachuru</p>
      </div>
    </footer>
  )
}
