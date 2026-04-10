import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, FileText, MessageSquare, GraduationCap, Sparkles, ArrowRight, Zap, Copy, ChevronRight, Check, ExternalLink, Image, Share2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import AdBanner from '@/components/shared/AdBanner'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const fadeRight = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

/* ===== SVG Social Icons (cores oficiais) ===== */
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#ig-grad)"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000000"/>
    </svg>
  )
}

function XTwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
    </svg>
  )
}

const socialLinks = [
  { id: 'youtube', Icon: YouTubeIcon, label: 'YouTube', handle: '@ExecutivosDigital', bg: 'bg-red-50 hover:bg-red-100', href: 'https://www.youtube.com/@ExecutivosDigital' },
  { id: 'instagram', Icon: InstagramIcon, label: 'Instagram', handle: '@extecnologia', bg: 'bg-pink-50 hover:bg-pink-100', href: 'https://www.instagram.com/extecnologia/' },
  { id: 'linkedin', Icon: LinkedInIcon, label: 'LinkedIn', handle: '/executivosdigital', bg: 'bg-blue-50 hover:bg-blue-100', href: 'https://www.linkedin.com/company/executivosdigital/' },
  { id: 'site', Icon: XTwitterIcon, label: 'Site', handle: 'executivosdigital.com.br', bg: 'bg-gray-50 hover:bg-gray-100', href: 'https://www.executivosdigital.com.br/' },
]

const products = [
  { id: 'prod-1', title: 'Gravador de Reunioes EX', desc: 'Grave reunioes online e saiba quem falou o que, gere relatorio e muito mais usando IA.', href: '#', image: '/images/meet-fathom.jpeg' },
  { id: 'prod-2', title: 'App de Reunioes — c/ IA', desc: 'App que grava e mostra quem falou o que, tudo por app.', href: '#', image: '/images/3.png' },
  { id: 'prod-3', title: 'Previsibilidade com Planilhas e IA', desc: 'Tenha previsoes usando IA e as suas planilhas.', href: '#', image: '/images/6.png' },
]



export default function DashboardPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleShareClick = async (prod: any) => {
    const url = 'https://www.executivosdigital.com.br/'
    const text = `Conheca o ${prod.title} da EXECUTIVOS! ${url}`
    
    // Tenta usar a API nativa para mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({ title: prod.title, text, url })
        return
      } catch (err) {
        console.error('Share failed', err)
      }
    }
    
    // Fallback Web Desktop: copia o link
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(prod.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const greeting = profile?.display_name || profile?.full_name || 'Usuario'
  const quizDone = profile?.quiz_completed
  const promptsDone = profile?.prompts_generated

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Welcome */}
      <motion.div variants={fadeRight}>
        <h2 className="text-xl lg:text-2xl font-bold text-brand-black">Ola, {greeting}!</h2>
        <p className="text-brand-gray-400 text-xs sm:text-sm mt-0.5">
          {!quizDone
            ? 'Complete o quiz para receber seus prompts personalizados.'
            : 'Seus prompts estao prontos. Explore e use no seu dia a dia.'}
        </p>
      </motion.div>

      {/* HERO BANNER */}
      <motion.div variants={fadeUp}>
        <div className="w-full overflow-hidden rounded-2xl">
          <img
            src="/images/Especilistas.png"
            alt="Especialistas EX Tecnologia"
            className="w-full h-auto object-cover rounded-2xl"
            loading="eager"
          />
        </div>
      </motion.div>

      {/* Quiz CTA or Completed status */}
      {!quizDone ? (
        <motion.button
          variants={fadeUp}
          onClick={() => navigate('/quiz')}
          className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="relative glass-yellow rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-brand-yellow-dark" />
                <Badge variant="yellow">Proximo passo</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-black mb-1">Complete seu Quiz de Perfil</h3>
              <p className="text-xs sm:text-sm text-brand-gray-600 pr-12">A IA vai gerar prompts personalizados para o seu negocio. Leva 3 minutos.</p>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shadow-sm">
                  <ArrowRight size={20} className="text-brand-black" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      ) : (
        <motion.div variants={fadeUp}>
          <button onClick={() => navigate('/prompts')} className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform">
            <div className="rounded-2xl px-4 py-3 border border-green-200 bg-green-50 flex items-center gap-3" style={{ backdropFilter: 'blur(8px)' }}>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0"><Check size={16} className="text-white" /></div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-green-700">Quiz concluido</span>
                <p className="text-xs text-green-600">{promptsDone ? '37 prompts prontos para usar' : 'Gerando seus prompts...'}</p>
              </div>
              <ChevronRight size={16} className="text-green-400 shrink-0" />
            </div>
          </button>
        </motion.div>
      )}

      {/* Quick Action Grid — gap-2 on tiny screens */}
      <motion.div className="grid grid-cols-2 gap-2 min-[390px]:gap-3" variants={stagger}>
        {[
          { icon: FileText, label: 'Meus Prompts', desc: promptsDone ? '37 prontos para usar' : 'Faca o quiz primeiro', extra: promptsDone ? <span className="flex items-center gap-1 mt-2 text-brand-yellow-dark"><Copy size={12} /><span className="text-[10px] font-medium">Copiar e colar</span></span> : null, to: '/prompts' },
          { icon: MessageSquare, label: 'Prompt Generator', desc: 'Refine e crie novos prompts', extra: null, to: '/chat' },
          { icon: GraduationCap, label: 'Treinamentos', desc: 'Videos, modulos e ferramentas', extra: null, to: '/training' },
          { icon: Sparkles, label: 'Minha Skill', desc: 'Seu perfil profissional IA', extra: null, to: '/skill' },
        ].map((item, i) => (
          <motion.button key={i} variants={fadeUp} onClick={() => navigate(item.to)} className="text-left cursor-pointer active:scale-[0.97] transition-transform">
            <GlassCard padding="none" className="p-3 min-[390px]:p-4 h-full">
              <div className="w-9 h-9 min-[390px]:w-11 min-[390px]:h-11 rounded-2xl bg-brand-yellow/15 flex items-center justify-center mb-2 min-[390px]:mb-3"><item.icon size={20} className="text-brand-yellow-dark" /></div>
              <h3 className="text-[13px] min-[390px]:text-sm font-semibold text-brand-black leading-tight">{item.label}</h3>
              <p className="text-[10px] min-[390px]:text-[11px] text-brand-gray-400 mt-0.5 leading-snug">{item.desc}</p>
              {item.extra}
            </GlassCard>
          </motion.button>
        ))}
      </motion.div>

      {/* Inline ad */}
      <motion.div variants={fadeUp}>
        <AdBanner
          id="ad-previsibilidade"
          title="IA de Previsibilidade de Planilhas"
          description="Tenha previsoes usando IA e as suas planilhas. Saiba mais sobre essa ferramenta."
          ctaText="Conhecer"
          image="/images/meet-fathom.jpeg"
          href="https://www.executivosdigital.com.br/"
        />
      </motion.div>

      {/* Quick access list */}
      <motion.div variants={fadeUp}>
        <GlassCard padding="none">
          <div className="p-4 pb-2"><h3 className="text-sm font-semibold text-brand-black">Acesso rapido</h3></div>
          {[
            { icon: ClipboardList, label: 'Refazer Quiz', desc: 'Gerar novos prompts', to: '/quiz' },
            { icon: FileText, label: 'Baixar PDF', desc: 'Seus prompts em PDF', to: '/prompts' },
            { icon: MessageSquare, label: 'Nova conversa', desc: 'Pergunte a IA', to: '/chat' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.to)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-gray-200/20 transition-colors cursor-pointer active:bg-brand-gray-200/40 border-t border-brand-gray-200/30">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 flex items-center justify-center shrink-0"><item.icon size={18} className="text-brand-yellow-dark" /></div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-brand-black">{item.label}</p>
                <p className="text-[11px] text-brand-gray-400">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-brand-gray-400 shrink-0" />
            </button>
          ))}
        </GlassCard>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Sobre a EX Tecnologia                                   */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Video Player */}
            <div className="lg:w-2/5 shrink-0">
              <div className="relative rounded-xl bg-black overflow-hidden shadow-sm border border-brand-gray-200/50 flex items-center justify-center">
                <video 
                  src="/videos/ex-institucional.mp4" 
                  controls 
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[300px] object-contain" 
                />
              </div>
            </div>
            {/* Text */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/images/logo-dark.svg" alt="EX" className="h-6 w-auto" />
                <Badge variant="dark" size="sm">Sobre nos</Badge>
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">Quem e a EX Tecnologia</h3>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-3">
                A EX Tecnologia e uma empresa focada em transformar a forma como empreendedores utilizam inteligencia artificial no dia a dia. Nosso objetivo e democratizar o acesso a ferramentas profissionais de IA para negocios de todos os tamanhos.
              </p>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-4">
                Com uma equipe apaixonada por inovacao, desenvolvemos solucoes que economizam horas de trabalho e geram resultados reais — desde prompts personalizados ate dashboards financeiros automatizados.
              </p>
              <a href="https://executivosdigital.com.br/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-yellow-dark hover:underline cursor-pointer">
                Saiba mais sobre nos <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Nossos Produtos                                         */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-brand-black">Nossos Produtos</h3>
          <a href="https://www.executivosdigital.com.br/" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-yellow-dark font-medium hover:underline cursor-pointer">
            Ver todos <ChevronRight size={12} className="inline" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map(prod => (
            <div
              key={prod.id}
              data-product-id={prod.id}
              className="block group"
            >
              <GlassCard padding="none" hover className="h-full">
                {/* Product image or placeholder */}
                {prod.image ? (
                  <div className="w-full aspect-[2/1] rounded-t-2xl overflow-hidden border-b border-brand-gray-200/30">
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-full aspect-[2/1] rounded-t-2xl bg-gradient-to-br from-brand-yellow/10 via-brand-yellow/5 to-transparent flex items-center justify-center border-b border-brand-gray-200/30">
                    <div className="text-center">
                      <Image size={28} className="text-brand-gray-400/50 mx-auto mb-1" />
                      <span className="text-[9px] text-brand-gray-400">Imagem do produto</span>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-brand-black">{prod.title}</h4>
                  <p className="text-[11px] text-brand-gray-400 mt-1 leading-snug line-clamp-2">{prod.desc}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleShareClick(prod)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      {copiedId === prod.id ? (
                        <>
                          <Check size={12} /> Copiado link
                        </>
                      ) : (
                        <>
                          <Share2 size={12} /> Compartilhar
                        </>
                      )}
                    </button>
                    <a
                      href={prod.href}
                      onClick={e => e.preventDefault()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-brand-yellow-dark bg-brand-yellow/10 hover:bg-brand-yellow/20 px-3 py-2 rounded-xl transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      Conhecer <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Redes Sociais                                           */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <h3 className="text-base font-bold text-brand-black mb-1">Siga a EXECUTIVOS</h3>
          <p className="text-xs text-brand-gray-400 mb-4">Acompanhe nosso conteudo nas redes sociais</p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {socialLinks.map(s => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-social-id={s.id}
                className="flex flex-col items-center gap-1.5 min-w-[72px] group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`}>
                  <s.Icon />
                </div>
                <span className="text-[10px] font-semibold text-brand-black">{s.label}</span>
                <span className="text-[9px] text-brand-gray-400">{s.handle}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* TWIN BANNERS */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="w-full overflow-hidden rounded-2xl">
          <img
            src="/images/1.png"
            alt="Banner Lateral A"
            className="w-full h-auto object-cover rounded-2xl"
            loading="lazy"
          />
        </div>
        <div className="w-full overflow-hidden rounded-2xl">
          <img
            src="/images/2.png"
            alt="Banner Lateral B"
            className="w-full h-auto object-cover rounded-2xl"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* BOTTOM BANNER */}
      <motion.div variants={fadeUp}>
        <div className="w-full overflow-hidden rounded-2xl">
          <img
            src="/images/Crie sua própia I.a.png"
            alt="Crie sua própria IA"
            className="w-full h-auto object-cover rounded-2xl"
            loading="lazy"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
