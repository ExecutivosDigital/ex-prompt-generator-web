import { motion } from 'framer-motion'
import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/shared/Logo'

export default function TrainingLayout() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: '#FAFAFA' }}
      animate={{ opacity: 1, backgroundColor: '#0A0A0A' }}
      exit={{ opacity: 0, backgroundColor: '#FAFAFA' }}
      transition={{ duration: 0.5 }}
      className="min-h-screen min-h-dvh text-white relative"
    >
      {/* Dot pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5C518 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      {/* Grid / circuit pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#F5C518 1px, transparent 1px), linear-gradient(90deg, #F5C518 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 lg:px-6"
        style={{
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-95"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Voltar</span>
        </button>
        <button onClick={() => navigate('/')} className="cursor-pointer active:scale-95 min-h-auto">
          <Logo variant="icon" size="sm" className="brightness-0 invert" />
        </button>
        <div className="w-16" />
      </header>

      <main className="relative z-10 px-3 py-3 min-[390px]:px-4 min-[390px]:py-4 lg:p-6 pb-[6.5rem]">
        <Outlet />
      </main>
    </motion.div>
  )
}
