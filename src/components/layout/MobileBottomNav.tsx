import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, GraduationCap, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/shared/Logo'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/prompts', icon: FileText, label: 'Prompts' },
  { to: '/chat', icon: MessageSquare, label: 'Gerador' },
  { to: '/training', icon: GraduationCap, label: 'Treinar' },
]

const drawerLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/quiz', label: 'Quiz de Perfil' },
  { to: '/skill', label: 'Minha Skill' },
  { to: '/prompts', label: 'Meus Prompts' },
  { to: '/chat', label: 'Prompt Generator' },
  { to: '/training', label: 'Treinamentos' },
  { to: '/profile', label: 'Meu Perfil' },
]

export default function MobileBottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const { profile } = useAuth()

  // Hide on scroll down, show on any scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  return (
    <>
      {/* ===== BOTTOM NAV BAR ===== */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div
          className="border-t border-brand-gray-200/40 bg-white/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around h-[64px] px-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-[60px] rounded-2xl transition-all active:scale-90 min-h-auto"
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      'flex items-center justify-center w-12 h-8 rounded-full transition-all',
                      isActive ? 'bg-brand-yellow shadow-md shadow-brand-yellow/30' : ''
                    )}>
                      <item.icon
                        size={isActive ? 20 : 22}
                        strokeWidth={isActive ? 2.5 : 1.7}
                        className={isActive ? 'text-brand-black' : 'text-brand-gray-400'}
                      />
                    </div>
                    <span className={cn(
                      'text-center leading-none',
                      isActive
                        ? 'text-[11px] font-bold text-brand-black'
                        : 'text-[11px] font-medium text-brand-gray-400'
                    )}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Menu button (replaces Skill) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-[60px] rounded-2xl transition-all active:scale-90 cursor-pointer min-h-auto"
            >
              <div className="flex items-center justify-center w-12 h-8">
                <Menu size={22} strokeWidth={1.7} className="text-brand-gray-400" />
              </div>
              <span className="text-[11px] font-medium text-brand-gray-400 leading-none">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-brand-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] z-[61] bg-white shadow-2xl lg:hidden flex flex-col"
              style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-brand-gray-200/50">
                <Logo variant="icon" size="sm" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl hover:bg-brand-gray-200/30 cursor-pointer active:scale-90 min-h-auto"
                >
                  <X size={20} className="text-brand-gray-600" />
                </button>
              </div>

              {/* User info */}
              <div className="px-5 py-4 border-b border-brand-gray-200/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-yellow-dark">
                      {(profile?.display_name || profile?.full_name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">
                      {profile?.display_name || profile?.full_name || 'Usuario'}
                    </p>
                    <p className="text-[11px] text-brand-gray-400">EXECUTIVOS Digital</p>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {drawerLinks.map(link => {
                  const isActive = location.pathname === link.to
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all min-h-auto',
                        isActive
                          ? 'bg-brand-yellow/15 text-brand-black font-semibold'
                          : 'text-brand-gray-600 hover:bg-brand-gray-200/30 active:bg-brand-gray-200/50'
                      )}
                    >
                      {link.label}
                    </NavLink>
                  )
                })}
              </nav>

              {/* Footer spacer for safe area */}
              <div className="px-3 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
