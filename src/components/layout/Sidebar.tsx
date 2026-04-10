import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  FileText,
  MessageSquare,
  GraduationCap,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/shared/Logo'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quiz', icon: ClipboardList, label: 'Quiz' },
  { to: '/skill', icon: Sparkles, label: 'Minha Skill' },
  { to: '/prompts', icon: FileText, label: 'Prompts' },
  { to: '/chat', icon: MessageSquare, label: 'Prompt Generator' },
  { to: '/training', icon: GraduationCap, label: 'Treinamentos' },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen glass-strong z-40 flex-col transition-all duration-300 border-r border-white/20',
        'hidden lg:flex',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-16 px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <button onClick={() => navigate('/')} className="cursor-pointer active:scale-95">
          {collapsed ? <Logo variant="icon" size="sm" /> : <Logo size="sm" />}
        </button>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-brand-gray-200/50 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} className="text-brand-gray-600" /> : <ChevronLeft size={16} className="text-brand-gray-600" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-yellow/15 text-brand-black'
                  : 'text-brand-gray-600 hover:bg-brand-gray-200/30 hover:text-brand-black',
                collapsed && 'justify-center px-0'
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive ? 'bg-brand-yellow/15 text-brand-black' : 'text-brand-gray-600 hover:bg-brand-gray-200/30',
              collapsed && 'justify-center px-0'
            )
          }
        >
          <User size={20} className="shrink-0" />
          {!collapsed && <span>{profile?.display_name || profile?.full_name || 'Perfil'}</span>}
        </NavLink>
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-gray-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
