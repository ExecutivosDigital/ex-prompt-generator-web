import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils/cn'
import Logo from '@/components/shared/Logo'

interface TopBarProps {
  sidebarCollapsed: boolean
  title?: string
}

export default function TopBar({ sidebarCollapsed, title }: TopBarProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-12 lg:h-16 glass-strong border-b border-white/20 flex items-center justify-between px-3 lg:px-6 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]',
        'ml-0'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={() => navigate('/')} className="lg:hidden cursor-pointer active:scale-95 shrink-0 min-h-auto">
          <Logo variant="icon" size="sm" />
        </button>
        {title && (
          <h1 className="text-[13px] lg:text-lg font-semibold text-brand-black truncate">{title}</h1>
        )}
      </div>

      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-brand-gray-200/30 transition-colors cursor-pointer active:scale-95 shrink-0 min-h-auto"
      >
        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center">
          <span className="text-xs lg:text-sm font-semibold text-brand-yellow-dark">
            {(profile?.display_name || profile?.full_name || 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-xs font-medium text-brand-gray-600 hidden sm:block max-w-[100px] truncate">
          {profile?.display_name || profile?.full_name || 'Usuario'}
        </span>
        <User size={12} className="text-brand-gray-400 hidden sm:block" />
      </button>
    </header>
  )
}
