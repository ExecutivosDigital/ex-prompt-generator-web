import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import Logo from '@/components/shared/Logo'
import Spinner from '@/components/ui/Spinner'

export default function AuthLayout() {
  const { profile, loading } = useAuth()
  const location = useLocation()
  
  const [imageLoaded, setImageLoaded] = useState(false)
  const [mountAnim, setMountAnim] = useState(false)
  
  // Decide which image to show based on the route
  const isRegister = location.pathname === '/register'
  const isForgot = location.pathname === '/forgot-password'
  
  // Use professional tech background for login/forgot, and workspace for register
  const bgImage = isRegister ? '/images/auth-workspace.png' : '/images/auth-bg.png'

  // Preload image for a better visual transition
  useEffect(() => {
    setImageLoaded(false)
    setMountAnim(false)
    const img = new window.Image()
    img.src = bgImage
    img.onload = () => {
      setImageLoaded(true)
      // Small delay to ensure render is ready before animating
      setTimeout(() => setMountAnim(true), 50)
    }
  }, [bgImage])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080A]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (profile) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full relative bg-[#08080A] overflow-hidden">
      
      {/* Loading overlay that fades out once image is loaded */}
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#08080A] transition-all duration-700 ease-in-out pointer-events-none 
        ${imageLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      >
        <Logo size="lg" theme="light" className="mb-6 animate-pulse opacity-80" />
        <Spinner size="lg" />
      </div>

      <div 
        className={`min-h-screen w-full flex flex-col md:flex-row transition-all duration-1000 ease-out transform ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Visual Section - Hidden on small screens, takes 50% on medium+ */}
        <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src={bgImage} 
              alt="Auth Background" 
              className="w-full h-full object-cover opacity-80 mix-blend-screen scale-105"
              style={{ filter: "brightness(0.8) contrast(1.2)"}}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08080A]/80 to-[#08080A] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Subtle decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-lg p-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
              {isRegister ? 'Revolucione o seu fluxo de trabalho.' : isForgot ? 'Retome o controle da sua tecnologia.' : 'Bem-vindo ao futuro produtivo.'}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {isForgot ? 'É simples recuperar seu acesso. Nossa plataforma garante segurança de ponta a ponta.' : 'Acompanhe o ritmo da inovação. Oferecemos ferramentas de última geração para maximizar sua eficiência.'}
            </p>
          </div>
        </div>

        {/* Form Section - Takes full width on small screens, 50% on medium+ */}
        <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#08080A]">
          {/* Mobile Background */}
          <div className="absolute inset-0 md:hidden z-0">
             <img 
              src={bgImage} 
              alt="Auth Background Mobile" 
              className="w-full h-full object-cover opacity-20 mask-image-linear-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/60 to-[#08080A] pointer-events-none" />
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="mb-10 flex justify-center md:justify-start">
              <Logo size="lg" theme="light" className="drop-shadow-lg" />
            </div>

            <div className="bg-[#121217] md:bg-white/5 border border-white/10 md:backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-cyan-900/10 hover:border-white/15">
              <Outlet />
            </div>

            <p className="text-center md:text-left text-sm text-gray-500 mt-8 font-medium">
              &copy; {new Date().getFullYear()} EXECUTIVOS Digital. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
