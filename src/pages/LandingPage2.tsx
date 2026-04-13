import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  ClipboardList,
  Zap,
  ChevronDown,
  Shield,
  Timer,
  AlertTriangle,
  TrendingUp,
  Copy,
  MessageCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import SectionReveal from '@/components/shared/SectionReveal'

/* ───────── CONFIG ───────── */
const CONFIG = {
  checkoutUrl: '#PLACEHOLDER_CHECKOUT_URL',

  price: 'R$29,90',
  priceNote: 'pagamento único',

  totalUsers: '1.340',
  totalSectors: '12',
  avgTimeSaved: '+8h',
  satisfaction: '',

  testimonials: [
    {
      name: 'Carlos',
      role: 'Distribuidor de Alimentos — SP',
      text: 'Eu achava que não ia funcionar. Já tinha comprado 2 cursos de IA e não usei. Mas quando vi que o prompt de conferência de estoque economizou 3 horas na primeira semana, entendi a diferença.',
      avatar: '',
    },
    {
      name: 'Fernanda',
      role: 'Coordenadora Financeira — MG',
      text: 'O que mais gostei é que não preciso aprender nada novo. Copio, colo, resultado. Meu time também já está usando.',
      avatar: '',
    },
    {
      name: 'Roberto',
      role: 'Dono de Empresa de Serviços — PR',
      text: 'R$29,90 por algo que me devolveu pelo menos 6 horas por semana. Ainda não acredito que demorei tanto pra fazer.',
      avatar: '',
    },
  ],
}

/* ───────── CTA BUTTON ───────── */
function CtaButton({
  className,
  size = 'lg',
  variant = 'yellow',
  children,
}: {
  className?: string
  size?: 'md' | 'lg'
  variant?: 'yellow' | 'dark'
  children?: React.ReactNode
}) {
  return (
    <a
      href={CONFIG.checkoutUrl}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300',
        'shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
        variant === 'yellow' && 'bg-brand-yellow text-brand-black hover:bg-brand-yellow-light animate-pulse-yellow',
        variant === 'dark' && 'bg-brand-black text-white hover:bg-brand-dark',
        size === 'lg' ? 'px-8 py-4 text-lg gap-3' : 'px-6 py-3 text-base gap-2',
        className
      )}
    >
      {children || (
        <>
          Começar agora
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </a>
  )
}

/* ───────── NAVBAR ───────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/landing-page-2/images/logo-white-brandkit.svg"
            alt="EXECUTIVOS"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </div>
        <a
          href={CONFIG.checkoutUrl}
          className="inline-flex items-center px-5 py-2.5 bg-brand-yellow text-brand-black font-semibold rounded-xl text-sm hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/20"
        >
          Começar agora
        </a>
      </div>
    </nav>
  )
}

/* ───────── HERO ───────── */
function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* ── Layer 1: Background video (looping, muted) ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/landing-page-2/videos/mobileapp_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Desktop: TLDV (smaller file). Mobile: mobileapp */}
        <source src="/landing-page-2/videos/TLDV.mp4" type="video/mp4" media="(min-width: 768px)" />
        <source src="/landing-page-2/videos/mobileapp.mp4" type="video/mp4" />
      </video>

      {/* ── Layer 2: Dark overlay + degradê + animated yellow glows ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/92 via-brand-black/85 to-brand-black/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/70 via-brand-black/20 to-brand-black/50" />

      {/* Animated yellow glows */}
      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-brand-yellow/10 blur-[100px] md:blur-[150px] pointer-events-none animate-glow-drift" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-brand-yellow/8 blur-[80px] md:blur-[120px] pointer-events-none animate-glow-drift-reverse" />
      <div className="absolute top-[60%] left-[50%] w-[200px] h-[200px] rounded-full bg-brand-amber/6 blur-[100px] pointer-events-none animate-glow-drift" />

      {/* ── Layer 3: Content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — Text + CTA (alinhado à esquerda) */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/15 border border-brand-yellow/25 text-white/80 text-sm font-medium mb-6"
            >
              <Timer className="w-4 h-4 text-brand-yellow" />
              5 minutos que mudam sua semana
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight mb-6"
            >
              IA que entende{' '}
              <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10">o seu negócio.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 md:h-4 bg-brand-yellow/40 -z-0 rounded" />
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed"
            >
              Um diagnóstico de 5 minutos que entende{' '}
              <strong className="text-white">você e seu contexto</strong> e gera prompts de IA
              personalizados para os processos que mais consomem seu tempo.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-start gap-3"
            >
              <CtaButton />
              <span className="text-sm text-white/40">
                Pagamento único. Sem assinatura. Garantia de 7 dias.
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-6 md:gap-10"
            >
              {[
                { value: CONFIG.totalUsers, label: 'gestores usando' },
                { value: CONFIG.totalSectors, label: 'setores diferentes' },
                { value: CONFIG.avgTimeSaved, label: 'economizadas/semana' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Video placeholder (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-black/30 border border-white/10 bg-white/5 aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-brand-yellow" />
              </div>
              <p className="text-sm font-medium text-white/40">Video em breve</p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Mobile — Video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:hidden"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5 aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-yellow" />
              </div>
              <p className="text-sm font-medium text-white/40">Video em breve</p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ───────── IDENTIFICACAO (O ESPELHO) ───────── */
function IdentificationSection() {
  const scenarios = [
    'Seu time te pergunta a mesma coisa toda semana',
    'Você gasta mais tempo em planilha do que planejando',
    'Reuniões que poderiam ser um e-mail (ou uma automação)',
    'Se você sai de férias, algo quebra',
    'Já tentou implantar ferramenta e o time não adotou',
    'Toma decisões no feeling porque não tem dados organizados',
    'Trabalha 10+ horas por dia e não sente que rende',
  ]

  const [checked, setChecked] = useState<boolean[]>(new Array(scenarios.length).fill(false))
  const checkedCount = checked.filter(Boolean).length

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Você se reconhece?
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-black mb-4">
              Você se reconhece em pelo menos{' '}
              <span className="text-brand-yellow-dark">3 desses cenários?</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="max-w-2xl mx-auto space-y-3">
          {scenarios.map((scenario, i) => (
            <SectionReveal key={i} delay={i * 0.06}>
              <button
                onClick={() => {
                  const next = [...checked]
                  next[i] = !next[i]
                  setChecked(next)
                }}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 min-h-auto',
                  checked[i]
                    ? 'bg-brand-yellow/8 border-brand-yellow/30 shadow-sm'
                    : 'bg-white border-brand-gray-200/60 hover:border-brand-yellow/20 hover:bg-brand-yellow-50/30'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300',
                    checked[i]
                      ? 'bg-brand-yellow border-brand-yellow'
                      : 'border-brand-gray-300'
                  )}
                >
                  {checked[i] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-black" />
                    </motion.div>
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm md:text-base transition-colors',
                    checked[i] ? 'text-brand-black font-medium' : 'text-brand-gray-600'
                  )}
                >
                  {scenario}
                </span>
              </button>
            </SectionReveal>
          ))}
        </div>

        {/* Resultado dinamico */}
        <SectionReveal delay={0.4}>
          <AnimatePresence mode="wait">
            {checkedCount >= 3 ? (
              <motion.div
                key="match"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-8 p-6 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-center"
              >
                <p className="text-lg font-semibold text-brand-black mb-2">
                  {checkedCount} de 7 — o EXECUTIVOS foi feito para você.
                </p>
                <p className="text-brand-gray-600 text-sm mb-4">
                  Não para te ensinar IA — para te dar ferramentas prontas que resolvem exatamente
                  esses problemas.
                </p>
                <CtaButton size="md" />
              </motion.div>
            ) : checkedCount > 0 ? (
              <motion.p
                key="partial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center text-brand-gray-400 text-sm"
              >
                {checkedCount} de 7 marcados — marque pelo menos 3 para ver o resultado.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── O QUE E ───────── */
function WhatIsSection() {
  const steps = [
    {
      icon: ClipboardList,
      number: '01',
      title: 'Diagnóstico (5 min)',
      description:
        '21 perguntas sobre seu negócio, desafios, time e processos. Responda com calma — a IA precisa te conhecer.',
    },
    {
      icon: Brain,
      number: '02',
      title: 'IA Analisa',
      description:
        'O sistema cruza suas respostas e identifica seus maiores gargalos. Mapeia onde você perde mais tempo.',
    },
    {
      icon: Zap,
      number: '03',
      title: 'Você Recebe',
      description:
        '25-35 prompts personalizados em 5 categorias, prontos pra usar. Copia, cola, resultado.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-brand-gray-100/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Como funciona
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-black mb-4">
              Não é curso. Não é ferramenta.
              <br />
              <span className="text-brand-yellow-dark">É diagnóstico + solução personalizada.</span>
            </h2>
          </div>
        </SectionReveal>

        {/* Steps — image left, text right */}
        <div className="space-y-10 md:space-y-16 mt-12">
          {steps.map((step, i) => (
            <SectionReveal key={step.number} delay={i * 0.15}>
              <div className={cn(
                'grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-10 items-center',
                i % 2 === 1 && 'md:grid-cols-[2fr_3fr] md:[direction:rtl]'
              )}>
                {/* Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg border border-brand-gray-200/50 hover:shadow-xl transition-shadow md:[direction:ltr]">
                  <img
                    src={`/landing-page-2/images/step-0${i + 1}.png`}
                    alt={step.title}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="md:[direction:ltr]">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-yellow/10 text-brand-yellow-dark font-bold text-sm mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-brand-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Suporte */}
        <SectionReveal delay={0.4}>
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-brand-gray-200/50 shadow-sm">
              <Copy className="w-4 h-4 text-brand-yellow-dark" />
              <p className="text-sm text-brand-gray-600">
                Cada prompt vem com instrução clara, variacoes e estimativa de tempo economizado.{' '}
                <strong className="text-brand-black">Você copia, cola e usa. Hoje.</strong>
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── NOSSO TIME ───────── */
function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Image — top */}
        <SectionReveal>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-12">
            <img
              src="/landing-page-2/images/team/especialistas.png"
              alt="Time de especialistas em Inteligência Artificial"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </SectionReveal>

        {/* Text — centered */}
        <SectionReveal delay={0.15}>
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              Nosso time
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Especialistas em{' '}
              <span className="text-brand-yellow">Inteligência Artificial</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Por trás do EXECUTIVOS existe um time dedicado a criar soluções de IA que funcionam
              no mundo real — não em laboratório.
            </p>
            <div className="inline-flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8">
              {[
                'IA sob medida',
                '+ de 20 mil linhas em producao',
                'Do governo a startups',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div>
              <CtaButton size="md" />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── ANTES VS DEPOIS ───────── */
function BeforeAfterSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              O que muda
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-black mb-3">
              O que muda{' '}
              <span className="text-brand-yellow-dark">na prática</span>
            </h2>
            <p className="text-brand-gray-500 max-w-2xl mx-auto">
              A diferença entre pedir algo genérico para a IA e usar um prompt profissional feito sob medida para o seu negócio
            </p>
          </div>
        </SectionReveal>

        {/* Before / After images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ANTES */}
          <SectionReveal delay={0.1}>
            <div className="relative group">
              <div className="absolute -top-3 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gray-800 text-white text-xs font-semibold shadow-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  ANTES — Sem EXECUTIVOS
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-brand-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/landing-page-2/images/antes.png"
                  alt="Antes: prompt amador com resposta generica da IA"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 px-2">
                <p className="text-sm font-medium text-brand-gray-600 mb-2">Você digita um pedido vago...</p>
                <ul className="space-y-1.5">
                  {[
                    'Prompt genérico, sem contexto do seu negócio',
                    'Resposta vaga que não resolve nada',
                    'Horas perdidas tentando ajustar',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-brand-gray-400">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-300 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionReveal>

          {/* DEPOIS */}
          <SectionReveal delay={0.25}>
            <div className="relative group">
              <div className="absolute -top-3 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow text-brand-black text-xs font-semibold shadow-lg">
                  <Zap className="w-3.5 h-3.5" />
                  DEPOIS — Com EXECUTIVOS
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-brand-yellow/40 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/landing-page-2/images/depois.png"
                  alt="Depois: prompt profissional em JSON com resultado preciso"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 px-2">
                <p className="text-sm font-medium text-brand-black mb-2">...a IA entrega resultado cirúrgico</p>
                <ul className="space-y-1.5">
                  {[
                    'Prompt profissional em JSON, feito para o SEU negócio',
                    'Resposta precisa com dados, KPIs e ações claras',
                    'Copia, cola, resultado — em minutos',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-brand-yellow-dark">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Seta central — desktop only */}
        <div className="hidden md:flex justify-center -mt-[280px] mb-[220px] pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center shadow-xl z-10">
            <ArrowRight className="w-6 h-6 text-brand-black" />
          </div>
        </div>

        {/* CTA */}
        <SectionReveal delay={0.4}>
          <div className="mt-10 text-center">
            <p className="text-sm text-brand-gray-500 mb-4">
              A mesma IA. A diferença e o prompt.
            </p>
            <CtaButton size="md" />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── PORTFOLIO ───────── */
function PortfolioSection() {
  const projects = [
    {
      title: 'Câmara Legislativa',
      description: 'Sistema de IA para gestão legislativa com dashboard integrado',
      image: '/landing-page-2/images/portfolio/camara-legislativa.png',
      tag: 'Governo',
    },
    {
      title: 'Sistema Logistico',
      description: 'Plataforma inteligente para gestão de frotas e entregas',
      image: '/landing-page-2/images/portfolio/sistema-logistico.png',
      tag: 'Logística',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              Nosso portfólio
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Alguns dos softwares que{' '}
              <span className="text-brand-yellow">já desenvolvemos</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Solucoes de IA sob medida para empresas de diferentes setores
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <SectionReveal key={i} delay={i * 0.15}>
              <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-brand-yellow/30 transition-all duration-300">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-semibold mb-2">
                    {project.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  <p className="text-sm text-white/50 mt-1">{project.description}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── PROVA SOCIAL ───────── */
function Testimonials() {
  const whatsappScreenshots = [
    { src: '/landing-page-2/images/testimonials/wpp-1.jpeg', alt: 'Feedback WhatsApp — plano ultra' },
    { src: '/landing-page-2/images/testimonials/wpp-2.jpeg', alt: 'Feedback WhatsApp — Maria Eduarda' },
    { src: '/landing-page-2/images/testimonials/wpp-3.jpeg', alt: 'Feedback WhatsApp — Ana Fragozo' },
  ]

  const teamPhotos = [
    { src: '/landing-page-2/images/testimonials/wpp-4.jpg', alt: 'Equipe em acao' },
    { src: '/landing-page-2/images/testimonials/wpp-5.jpg', alt: 'Time trabalhando' },
    { src: '/landing-page-2/images/testimonials/wpp-6.jpg', alt: 'Produto em uso' },
  ]

  return (
    <section className="py-16 md:py-24 bg-brand-gray-100/50">
      <div className="max-w-5xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Quem já usa
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-black">
              Gestores como você{' '}
              <span className="text-brand-yellow-dark">já estão usando</span>
            </h2>
          </div>
        </SectionReveal>

        {/* WhatsApp screenshots */}
        <SectionReveal delay={0.2}>
          <div className="mb-8 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-brand-black">Direto do WhatsApp</h3>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {whatsappScreenshots.map((img, i) => (
            <SectionReveal key={i} delay={0.3 + i * 0.1}>
              <div className="rounded-2xl overflow-hidden border border-brand-gray-200/50 shadow-sm bg-white hover:shadow-md transition-shadow">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Team/Product photos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teamPhotos.map((img, i) => (
            <SectionReveal key={i} delay={0.4 + i * 0.1}>
              <div className="rounded-2xl overflow-hidden border border-brand-gray-200/50 shadow-sm">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Proof bar */}
        <SectionReveal delay={0.5}>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-brand-gray-500">
            <Sparkles className="w-4 h-4 text-brand-yellow-dark" />
            <span>
              Já são <strong className="text-brand-black">{CONFIG.totalUsers} gestores</strong>{' '}
              usando o EXECUTIVOS em{' '}
              <strong className="text-brand-black">{CONFIG.totalSectors} setores</strong>{' '}
              diferentes.
            </span>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── FAQ ───────── */
function FaqSection() {
  const faqs = [
    {
      q: 'Eu já fiz curso de IA e não usei. Por que isso seria diferente?',
      a: 'Porque curso ensina teoria. O EXECUTIVOS entrega ferramenta pronta. Você não precisa aprender nada — so copiar, colar, e usar. Se você sabe usar WhatsApp, sabe usar os prompts.',
    },
    {
      q: 'Preciso trocar de sistema ou ferramenta?',
      a: 'Não. Os prompts funcionam COM o que você já usa: Excel, Google Sheets, ERP, qualquer coisa. Você cola seus dados no prompt e recebe resultado. Sem migração, sem instalação.',
    },
    {
      q: 'Meu time vai conseguir usar?',
      a: 'Sim. Cada prompt vem com instrução passo a passo. Testamos com times que nunca usaram IA antes. Se a pessoa sabe copiar e colar, sabe usar.',
    },
    {
      q: 'R$29,90 e barato. Funciona mesmo?',
      a: 'É barato porque é digital e escalável. O diagnóstico por trás e o mesmo que cobramos R$2.000+ em consultoria. A IA permite entregar na escala, com qualidade.',
    },
    {
      q: 'E se não servir pra minha empresa?',
      a: 'Garantia de 7 dias. Se os prompts não fizerem sentido pro seu contexto, devolvemos 100%. Sem pergunta, sem burocracia.',
    },
    {
      q: 'Quanto tempo leva pra ver resultado?',
      a: 'O diagnóstico leva 5 minutos. Os prompts são entregues imediatamente. A maioria dos gestores usa o primeiro prompt no mesmo dia e economiza tempo na mesma semana.',
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Perguntas frequentes
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-black">
              Perguntas que todo gestor faz{' '}
              <span className="text-brand-yellow-dark">antes de comprar</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <SectionReveal key={i} delay={i * 0.05}>
              <div className="bg-brand-white rounded-xl border border-brand-gray-200/50 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left min-h-auto"
                >
                  <span className="font-medium text-brand-black pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-brand-gray-400 shrink-0 transition-transform duration-300',
                      open === i && 'rotate-180 text-brand-yellow-dark'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-sm text-brand-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── PREÇO + CTA FINAL ───────── */
function PricingSection() {
  return (
    <section className="py-16 md:py-24 bg-brand-gray-100/50">
      <div className="max-w-3xl mx-auto px-4">
        <SectionReveal>
          <div className="relative bg-white rounded-3xl p-8 md:p-12 border-2 border-brand-yellow/30 shadow-xl overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-yellow/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-[40px] pointer-events-none" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-black" />
                </div>
                <span className="font-bold text-brand-black text-xl tracking-tight">EXECUTIVOS</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-3">
                Comece agora por
              </h2>

              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-bold text-brand-black">
                  {CONFIG.price}
                </span>
              </div>
              <p className="text-brand-gray-400 mb-8">
                Pagamento único. Acesso permanente.
              </p>

              {/* Items inclusos */}
              <div className="text-left max-w-md mx-auto mb-8 space-y-3">
                {[
                  'Diagnóstico personalizado (5 minutos)',
                  '25-35 prompts de IA sob medida',
                  '5 categorias: Produtividade, Comunicação, Dados, Automação, Decisão',
                  'Variacoes e dicas para cada prompt',
                  'Estimativa de tempo economizado por prompt',
                  'Funciona com ChatGPT, Claude ou Gemini',
                  'Garantia de 7 dias',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow-dark mt-0.5 shrink-0" />
                    <span className="text-sm text-brand-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <CtaButton className="w-full md:w-auto">
                Começar meu diagnóstico agora
                <ArrowRight className="w-5 h-5" />
              </CtaButton>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-gray-400">
                <Shield className="w-4 h-4" />
                <span>Pagamento seguro. Acesso imediato.</span>
              </div>

              {/* Reframe de preço */}
              <div className="mt-8 p-5 rounded-xl bg-brand-yellow/5 border border-brand-yellow/10">
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  Custa menos que{' '}
                  <strong className="text-brand-black">
                    as horas extras que você paga esse mes
                  </strong>{' '}
                  por processo manual.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── QUEM ESTA POR TRÁS ───────── */
function FounderSection() {
  return (
    <section className="relative py-16 md:py-24 bg-brand-black overflow-hidden">
      {/* Background: a propria foto em full bleed com overlay */}
      <div className="absolute inset-0">
        <img
          src="/landing-page-2/images/team/founder-v3.png"
          alt=""
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-black/40 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-brand-black/60" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="max-w-lg">
          <SectionReveal>
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              Quem criou
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                Feito por quem vive{' '}
                <span className="text-brand-yellow">os mesmos desafios</span>
              </h2>

              {/* Founder badge */}
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="w-11 h-11 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold text-sm">
                  JS
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Joao Stel</p>
                  <p className="text-brand-yellow text-xs font-medium">CEO — Executivo's Digital</p>
                </div>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              Desenvolvemos soluções de IA para empresas reais — de câmaras legislativas a sistemas logísticos.
              O EXECUTIVOS nasceu da nossa experiência ajudando gestores a parar de perder tempo com tarefas
              que a IA resolve melhor e mais rápido.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              Não é teoria. É prática testada com mais de{' '}
              <strong className="text-white">{CONFIG.totalUsers} gestores</strong> em{' '}
              <strong className="text-white">{CONFIG.totalSectors} setores</strong> diferentes.
            </p>
            <CtaButton size="md" />
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

/* ───────── FECHAMENTO EMOCIONAL ───────── */
function EmotionalClose() {
  return (
    <section className="py-20 md:py-28 bg-brand-black relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-yellow/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <SectionReveal>
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-black" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">EXECUTIVOS</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Você pode começar a semana que vem
            <br />
            <span className="text-brand-gray-400">exatamente como começou essa.</span>
          </h2>
          <p className="text-white/60 mb-3 max-w-xl mx-auto leading-relaxed">
            Ou pode investir 5 minutos hoje e ter, pela primeira vez, ferramentas feitas sob medida
            para os problemas que tiram seu sono.
          </p>
          <p className="text-brand-yellow font-semibold text-lg mb-8">
            Não é sobre IA. É sobre recuperar o controle do seu dia.
          </p>

          <CtaButton />

          <p className="text-white/30 text-sm mt-4">
            {CONFIG.price} — {CONFIG.priceNote}. Acesso imediato.
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── URGENCIA LOGICA ───────── */
function UrgencyBanner() {
  return (
    <section className="py-12 md:py-16 bg-brand-yellow">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <SectionReveal>
          <TrendingUp className="w-8 h-8 text-brand-black/30 mx-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-brand-black mb-3">
            Cada semana sem IA personalizada são horas perdidas que não voltam.
          </h3>
          <p className="text-brand-black/70 max-w-xl mx-auto mb-6">
            Gestores do seu porte já estão usando. A diferença entre você e eles?
            5 minutos de diagnóstico.
          </p>
          <CtaButton variant="dark" />
        </SectionReveal>
      </div>
    </section>
  )
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="py-8 bg-brand-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-yellow/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-brand-yellow" />
            </div>
            <span className="font-semibold text-white/40 text-sm">EXECUTIVOS</span>
          </div>
          <p className="text-white/30 text-sm text-center">
            &copy; 2026 Executivos Negócios Digitais LTDA. Todos os direitos reservados.
            <br />
            <span className="text-white/20">
              CNPJ: 43.795.283/0001-18 | Política de Privacidade | Termos de Uso
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ───────── APP ───────── */
export default function LandingPage2() {
  return (
    <div className="min-h-screen bg-brand-white">
      <Navbar />
      <Hero />
      <IdentificationSection />
      <WhatIsSection />
      <TeamSection />
      <BeforeAfterSection />
      <PortfolioSection />
      <Testimonials />
      <FaqSection />
      <PricingSection />
      <FounderSection />
      {/* <CrieSuaIaBanner /> */}
      <EmotionalClose />
      <UrgencyBanner />
      <Footer />
    </div>
  )
}
