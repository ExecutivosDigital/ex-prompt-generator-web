import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileBottomNav from './MobileBottomNav'
import AdBanner from '@/components/shared/AdBanner'
import PopupAd from '@/components/shared/PopupAd'
import { cn } from '@/lib/utils/cn'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/quiz': 'Quiz de Perfil',
  '/skill': 'Minha Skill',
  '/prompts': 'Meus Prompts',
  '/chat': 'Prompt Generator',
  '/training': 'Treinamentos',
  '/profile': 'Meu Perfil',
}

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  const title = pageTitles[location.pathname] || ''

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Top promotional banner */}
      <AdBanner
        id="top-promo"
        variant="top"
        title="Conheça a IA para Gravações Presenciais e Video Conferências (Revolucionário!)"
        ctaText="Ver planos"
      />

      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <TopBar sidebarCollapsed={sidebarCollapsed} title={title} />

      <main
        className={cn(
          'transition-all duration-300 min-h-[calc(100dvh-3rem)]',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]',
          'lg:p-6',
          // Mobile: tight padding for 360px screens, bottom nav clearance
          'ml-0 px-3 py-3 pb-[6.5rem]',
          // Slightly more padding on larger phones (390px+)
          'min-[390px]:px-4 min-[390px]:py-4',
        )}
      >
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />

      {/* Popup ad - shows after 10s */}
      <PopupAd
        id="welcome-offer"
        delayMs={10000}
        title="Quer dominar IA no seu negocio?"
        description="Acesse nosso curso completo de Funnels com IA e transforme seus resultados em 30 dias."
        ctaText="Quero saber mais"
      />
    </div>
  )
}
