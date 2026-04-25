import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/public/Navbar'
import Footer from './components/public/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/Layout'
import AdminOverview from './pages/admin/Overview'
import AdminProjects from './pages/admin/Projects'
import AdminSkills from './pages/admin/Skills'
import AdminTimeline from './pages/admin/Timeline'
import AdminBlog from './pages/admin/Blog'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminMessages from './pages/admin/Messages'
import AdminSettings from './pages/admin/Settings'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Particles from './components/shared/Particles'

function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen grid-bg">
      <Particles />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin (protected) */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="timeline" element={<AdminTimeline />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', fontFamily: 'DM Sans, sans-serif' },
          success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  )
}
