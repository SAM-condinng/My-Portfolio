import { useEffect, useRef } from 'react'

export default function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const particles = Array.from({ length: 20 }, (_, i) => {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      const left = Math.random() * 100
      const duration = Math.random() * 20 + 15
      const delay = Math.random() * 15
      p.className = 'particle'
      p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;background:rgba(59,130,246,${Math.random() * 0.4 + 0.1});animation-duration:${duration}s;animation-delay:-${delay}s;`
      return p
    })
    particles.forEach(p => container.appendChild(p))
    return () => particles.forEach(p => p.remove())
  }, [])
  return <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />
}
