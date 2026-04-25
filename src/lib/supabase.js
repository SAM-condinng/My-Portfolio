import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = url && key
  ? createClient(url, key)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// ─── helpers ───────────────────────────────────────────────
export async function getProfile() {
  const { data } = await supabase.from('profile').select('*').single()
  return data
}
export async function getProjects(featured = false) {
  let q = supabase.from('projects').select('*').order('created_at', { ascending: false })
  if (featured) q = q.eq('featured', true)
  const { data } = await q
  return data || []
}
export async function getSkills() {
  const { data } = await supabase.from('skills').select('*').order('category')
  return data || []
}
export async function getBlogPosts(publishedOnly = true) {
  let q = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (publishedOnly) q = q.eq('published', true)
  const { data } = await q
  return data || []
}
export async function getTestimonials() {
  const { data } = await supabase.from('testimonials').select('*')
  return data || []
}
export async function getSocialLinks() {
  const { data } = await supabase.from('social_links').select('*').order('display_order')
  return data || []
}
export async function getMessages() {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  return data || []
}
export async function sendMessage(payload) {
  const { error } = await supabase.from('contact_messages').insert([payload])
  if (error) throw error
}
