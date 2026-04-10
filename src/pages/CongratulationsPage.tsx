import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  PartyPopper,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'

const WHATSAPP_NUMBER = '5511999999999' // Substituir pelo número real
const WHATSAPP_MESSAGE = encodeURIComponent('Olá! Fiz a compra do EXECUTIVOS mas preciso de ajuda com meu acesso.')

const confettiColors = ['#F5C518', '#FFD84D', '#FFCC00', '#D4A800', '#0A0A0A']

function ConfettiPiece({ index }: { index: number }) {
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  const size = 6 + Math.random() * 8
  const color = confettiColors[index % confettiColors.length]
  const rotation = Math.random() * 360

  return (
    <motion.div
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: '100vh', opacity: 0, rotate: rotation + 360 }}
      transition={{ duration, delay, ease: 'linear' }}
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
  )
}

const steps = [
  {
    icon: Mail,
    title: 'Verifique seu e-mail',
    description: 'Em alguns minutos você receberá um e-mail com seu login, senha e o link da plataforma.',
    highlight: true,
  },
  {
    icon: ArrowRight,
    title: 'Acesse a plataforma',
    description: 'Use o login e senha recebidos para entrar e começar a usar seus prompts personalizados.',
    highlight: false,
  },
  {
    icon: Sparkles,
    title: 'Responda o quiz de 3 minutos',
    description: 'Dentro da plataforma, o quiz vai mapear seu negócio em 12 dimensões para gerar prompts sob medida.',
    highlight: false,
  },
]

export default function CongratulationsPage() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-dvh bg-brand-white relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      {/* Background decorations */}
      <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] rounded-full bg-brand-yellow/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-brand-gray-200/60 bg-white/80 backdrop-blur-md relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center">
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-14 relative z-10">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-8"
        >
          {/* Celebration icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-brand-yellow/20 flex items-center justify-center mb-5"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <PartyPopper size={40} className="text-brand-yellow-dark" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="yellow" size="md" className="mb-4">Compra confirmada</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-brand-black mb-3"
          >
            Parabéns! Você fez a melhor<br className="hidden sm:block" /> escolha para o seu negócio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-brand-gray-600 max-w-md mx-auto leading-relaxed"
          >
            Agora falta muito pouco para você ter prompts de IA que realmente entendem o <strong>seu</strong> negócio.
          </motion.p>
        </motion.div>

        {/* Steps card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard variant="strong" padding="lg" className="mb-6">
            <h2 className="text-base font-semibold text-brand-black mb-5 flex items-center gap-2">
              <Clock size={18} className="text-brand-yellow-dark" />
              Próximos passos
            </h2>

            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className={cn(
                    'flex gap-4 p-4 rounded-xl transition-colors',
                    step.highlight ? 'bg-brand-yellow/10 border border-brand-yellow/30' : 'bg-brand-gray-200/20'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    step.highlight ? 'bg-brand-yellow text-brand-black' : 'bg-brand-gray-200/50 text-brand-gray-600'
                  )}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-black">{step.title}</h3>
                    <p className="text-sm text-brand-gray-600 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Important notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <GlassCard variant="yellow" padding="md" className="mb-6">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-brand-yellow-dark shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-black">Confira sua caixa de entrada e o spam</p>
                <p className="text-xs text-brand-gray-600 mt-1 leading-relaxed">
                  O e-mail com seus dados de acesso será enviado nos próximos minutos. Se não encontrar, verifique a pasta de spam ou lixo eletrônico.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* WhatsApp support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <GlassCard variant="strong" padding="lg" className="text-center mb-6">
            <h3 className="text-base font-semibold text-brand-black mb-2">Precisa de ajuda?</h3>
            <p className="text-sm text-brand-gray-600 mb-5 leading-relaxed">
              Digitou o e-mail errado ou não recebeu o acesso?<br />
              Nosso suporte resolve em minutos.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl px-6 py-3.5 text-sm transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              Falar com suporte no WhatsApp
            </a>
          </GlassCard>
        </motion.div>

        {/* Image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard variant="strong" padding="lg" className="mb-6">
            <div className="w-full aspect-video rounded-xl border-2 border-dashed border-brand-gray-200 bg-brand-gray-200/20 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-brand-gray-200/50 flex items-center justify-center">
                <Sparkles size={24} className="text-brand-gray-400" />
              </div>
              <p className="text-sm font-medium text-brand-gray-400">Imagem em breve</p>
              <p className="text-xs text-brand-gray-400/70">Placeholder — substituir por imagem final</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-brand-gray-400 mt-8"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-500" />
            <span>Compra protegida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-brand-yellow" />
            <span>Garantia de 7 dias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-yellow-dark" />
            <span>Acesso vitalício</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-gray-200/50 mt-10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-brand-gray-400">EXECUTIVOS Digital &copy; {new Date().getFullYear()} — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}
