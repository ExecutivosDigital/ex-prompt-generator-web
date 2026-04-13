import SectionReveal from "@/components/shared/SectionReveal";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

/* ───────── CONFIG ───────── */
const CONFIG = {
  checkoutUrl: "#PLACEHOLDER_CHECKOUT_URL",

  price: "R$29,90",
  priceNote: "pagamento único",

  totalUsers: "2.847",
  totalSectors: "16",
  avgTimeSaved: "+8h",
  satisfaction: "4.9",
};

/* ───────── CTA BUTTON ───────── */
function CtaButton({
  className,
  size = "lg",
  variant = "yellow",
  children,
}: {
  className?: string;
  size?: "md" | "lg";
  variant?: "yellow" | "dark";
  children?: React.ReactNode;
}) {
  return (
    <a
      href={CONFIG.checkoutUrl}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300",
        "shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        variant === "yellow" &&
          "bg-brand-yellow text-brand-black hover:bg-brand-yellow-light animate-pulse-yellow",
        variant === "dark" && "bg-brand-black text-white hover:bg-brand-dark",
        size === "lg"
          ? "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg gap-2 sm:gap-3"
          : "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base gap-2",
        className,
      )}
    >
      {children || (
        <>
          Quero testar agora
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </a>
  );
}

/* ───────── NAVBAR ───────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/landing-page-1/images/logo-white.svg"
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
  );
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
        poster="/landing-page-1/videos/mobileapp_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/landing-page-1/videos/TLDV.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <source src="/landing-page-1/videos/mobileapp.mp4" type="video/mp4" />
      </video>

      {/* ── Layer 2: Dark overlay + degradê + animated yellow glows ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/92 via-brand-black/85 to-brand-black/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/70 via-brand-black/20 to-brand-black/50" />

      {/* Animated yellow glows */}
      <div className="absolute top-[15%] left-[10%] w-[180px] h-[180px] sm:w-[280px] sm:h-[280px] md:w-[400px] md:h-[400px] xl:w-[550px] xl:h-[550px] rounded-full bg-brand-yellow/10 blur-[60px] sm:blur-[80px] md:blur-[120px] xl:blur-[160px] pointer-events-none animate-glow-drift" />
      <div className="absolute bottom-[10%] right-[5%] w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] md:w-[350px] md:h-[350px] xl:w-[450px] xl:h-[450px] rounded-full bg-brand-yellow/8 blur-[50px] sm:blur-[70px] md:blur-[100px] xl:blur-[130px] pointer-events-none animate-glow-drift-reverse" />
      <div className="absolute top-[60%] left-[50%] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] rounded-full bg-brand-amber/6 blur-[60px] sm:blur-[80px] md:blur-[100px] pointer-events-none animate-glow-drift" />

      {/* ── Layer 3: Content ── */}
      <div className="relative z-10 w-full max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
          {/* LEFT — Text + CTA (alinhado à esquerda) */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/15 border border-brand-yellow/25 text-white/80 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              IA que reflete a sua realidade em detalhes
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] 2xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              A IA não conhece <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10">o seu negócio.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 md:h-4 bg-brand-yellow/40 -z-0 rounded" />
              </span>
              <br />
              <span className="text-white/70 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Isso muda em{" "}
                <span className="text-brand-yellow">3 minutos.</span>
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed"
            >
              Diagnóstico de 3 minutos. Mapeamos{" "}
              <strong className="text-white">
                12 dimensões do seu negócio
              </strong>{" "}
              e geramos prompts sob medida na hora — para você parar de usar IA
              no modo amador.
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
                Aviso: Os resultados são precisos e viciantes.
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10"
            >
              {[
                { value: CONFIG.totalUsers, label: "empresários usando" },
                { value: "94%", label: "completam o quiz" },
                {
                  value: CONFIG.avgTimeSaved,
                  label: "horas salvas na 1ª semana",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Video placeholder (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-black/30 border border-white/10 bg-white/5 aspect-video flex flex-col items-center justify-center gap-3 group hover:border-brand-yellow/30 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center">
                  <Play className="w-6 h-6 text-brand-black ml-1" />
                </div>
              </div>
              <p className="text-sm font-medium text-brand-yellow">
                Assista o diagnóstico ao vivo
              </p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Mobile — Video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="md:hidden"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-brand-yellow/20 bg-brand-yellow/5 aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center">
                <Play className="w-5 h-5 text-brand-black ml-1" />
              </div>
              <p className="text-sm font-medium text-brand-yellow">
                Ver demonstração
              </p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-yellow/20 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Play(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

/* ───────── IDENTIFICACAO ───────── */
function IdentificationSection() {
  const scenarios = [
    "Você faz perguntas pra IA e recebe respostas vagas de Wikipedia",
    "Tenta criar e-mails ou conteúdo e sai parecendo um robô de telemarketing",
    'Sabe que a IA pode automatizar coisas, mas não tem paciência pra "tunar"',
    "Usa sempre os mesmos 3 comandos básicos no ChatGPT todo dia",
    "Já viu gringos ou concorrentes fazendo magia negra com IA na internet",
    'Tenta compartilhar o "jeito de usar" com a equipe e ninguém pega o tranco',
  ];

  const [checked, setChecked] = useState<boolean[]>(
    new Array(scenarios.length).fill(false),
  );
  const checkedCount = checked.filter(Boolean).length;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-white">
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              A FRUSTRAÇÃO
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Você já usou IA e{" "}
              <span className="text-brand-yellow-dark">
                sentiu alguma dessas coisas?
              </span>
            </h2>
          </div>
        </SectionReveal>

        <div className="max-w-2xl mx-auto space-y-3">
          {scenarios.map((scenario, i) => (
            <SectionReveal key={i} delay={i * 0.06}>
              <button
                onClick={() => {
                  const next = [...checked];
                  next[i] = !next[i];
                  setChecked(next);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 min-h-auto",
                  checked[i]
                    ? "bg-brand-yellow/8 border-brand-yellow/30 shadow-sm"
                    : "bg-white border-brand-gray-200/60 hover:border-brand-yellow/20 hover:bg-brand-yellow-50/30",
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                    checked[i]
                      ? "bg-brand-yellow border-brand-yellow"
                      : "border-brand-gray-300",
                  )}
                >
                  {checked[i] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-black" />
                    </motion.div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm md:text-base transition-colors",
                    checked[i]
                      ? "text-brand-black font-medium"
                      : "text-brand-gray-600",
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
            {checkedCount >= 2 ? (
              <motion.div
                key="match"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-8 p-6 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-center"
              >
                <p className="text-lg font-semibold text-brand-black mb-2">
                  Não é você que é ruim com IA. É a IA que não tem contexto.
                </p>
                <p className="text-brand-gray-600 text-sm mb-4">
                  O problema não é a ferramenta, é dar o prompt genérico
                  esperando resultado genial. O diagnóstico vai consertar isso
                  pra você.
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
                Continue marcando para ver a conclusão.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ───────── O QUE E ───────── */
function WhatIsSection() {
  const steps = [
    {
      icon: Target,
      number: "01",
      title: "Diagnóstico de 3 minutos",
      description:
        "Responda sobre seu negócio: setor, nicho, faturamento, time, dores, experiência com IA. O sistema mapeia 12 dimensões do seu negócio.",
    },
    {
      icon: Brain,
      number: "02",
      title: "IA gera prompts sob medida",
      description:
        "25-35 prompts calibrados para a SUA realidade. Cada um com variações contextuais e estimativa de tempo economizado.",
    },
    {
      icon: Zap,
      number: "03",
      title: "Chat que já conhece você",
      description:
        "Peça o que precisar depois. O contexto permanece carregado. A IA já sabe quem você é, o que faz e onde dói.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-gray-100/50">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <SectionReveal>
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              O Fluxo
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Como injetamos contexto da{" "}
              <span className="text-brand-yellow-dark">sua empresa</span> na IA?
            </h2>
          </div>
        </SectionReveal>

        {/* Steps — image left, text right */}
        <div className="space-y-10 md:space-y-16 mt-12">
          {steps.map((step, i) => (
            <SectionReveal key={step.number} delay={i * 0.15}>
              <div
                className={cn(
                  "grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-10 items-center",
                  i % 2 === 1 && "md:grid-cols-[2fr_3fr] md:[direction:rtl]",
                )}
              >
                {/* Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg border border-brand-gray-200/50 hover:shadow-xl transition-shadow md:[direction:ltr]">
                  <img
                    src={`/landing-page-1/images/step-0${i + 1}.png`}
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
                  <h3 className="text-xl md:text-2xl font-bold text-brand-black mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brand-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Cta sub */}
        <SectionReveal delay={0.4}>
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-brand-gray-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-yellow-dark" />
              <p className="text-sm text-brand-gray-600">
                Resultado: Prompt calibrado.{" "}
                <strong className="text-brand-black">
                  A mágica acontece quando o prompt é sob medida.
                </strong>
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ───────── A DIFERENÇA (P1A Específico) ───────── */
function DifferenceSection() {
  const profiles = [
    {
      label: "Empresário A",
      type: "Consultoria Tributária em SP — 15 funcionários",
      prompts: [
        "Analise a margem por cliente segmentada por regime tributário",
        "Crie script de reunião de renovação para cliente com contrato vencendo em 30 dias",
        "Monte proposta para empresa migrando de Simples para Lucro Presumido",
      ],
    },
    {
      label: "Empresário B",
      type: "Rede de Clínicas em MG — 3 unidades",
      prompts: [
        "Calcule taxa de retorno por procedimento por unidade",
        "Crie campanha de reativação para pacientes inativos há 90+ dias",
        "Analise o custo de aquisição por canal de marketing",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-brand-yellow/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="relative max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              A Diferença Real
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Dois empresários.
              <br />
              <span className="text-brand-yellow">
                Resultados completamente diferentes.
              </span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Porque o diagnóstico é diferente, a lógica da ferramenta trabalha
              de formas diferentes para cada empresa.
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {profiles.map((profile, idx) => (
            <SectionReveal key={profile.label} delay={idx * 0.15}>
              <div className="bg-brand-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-brand-yellow/30 transition-all group">
                <div className="bg-brand-black/50 px-6 py-4 border-b border-white/5">
                  <p className="text-brand-yellow font-semibold text-sm">
                    {profile.label}
                  </p>
                  <p className="text-white/60 text-xs mt-1">{profile.type}</p>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs text-brand-gray-400 uppercase tracking-wider font-medium mb-3">
                    Exemplos de Prompts gerados:
                  </p>
                  {profile.prompts.map((prompt, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-brand-yellow/5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-yellow mt-0.5 shrink-0" />
                      <p className="text-sm text-white/80">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── ANTES VS DEPOIS ───────── */
function BeforeAfterSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-white">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Comparação
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black mb-3">
              Fazer sozinho vs{" "}
              <span className="text-brand-yellow-dark">Usar o EXECUTIVOS</span>
            </h2>
            <p className="text-brand-gray-500 max-w-2xl mx-auto">
              Veja a diferença entre usar um "prompt" mental na hora vs um
              framework injetado por json
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* ANTES */}
          <SectionReveal delay={0.1}>
            <div className="relative group">
              <div className="absolute -top-3 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gray-800 text-white text-xs font-semibold shadow-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  ANTES — Prompt Amador
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-brand-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/landing-page-1/images/antes-generico.png"
                  alt="Antes: prompt amador com resposta genérica da IA"
                  className="w-full object-cover grayscale-[20%]"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 px-2">
                <p className="text-sm font-medium text-brand-gray-600 mb-2">
                  Comando vago e direto...
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Sem contexto da empresa",
                    "A IA recita Wikipedia",
                    "Não aplicável na prática",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-brand-gray-400"
                    >
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
                  DEPOIS — Prompt Profissional
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-brand-yellow/40 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/landing-page-1/images/depois-profissional.png"
                  alt="Depois: prompt profissional em JSON com resultado preciso"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 px-2">
                <p className="text-sm font-medium text-brand-black mb-2">
                  Estrutura em JSON e contexto completo
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Contexto formatado tecnicamente",
                    "A IA foca exatamente no KPI",
                    "Entregável pronto em formato tabular",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-brand-yellow-dark"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── PROVA SOCIAL (WhatsApp) ───────── */
function Testimonials() {
  const whatsappScreenshots = [
    {
      src: "/landing-page-1/images/testimonials/wpp-1.jpeg",
      alt: "Feedback WhatsApp — plano ultra",
    },
    {
      src: "/landing-page-1/images/testimonials/wpp-2.jpeg",
      alt: "Feedback WhatsApp — Maria Eduarda",
    },
    {
      src: "/landing-page-1/images/testimonials/wpp-3.jpeg",
      alt: "Feedback WhatsApp — Ana Fragozo",
    },
  ];

  const teamPhotos = [
    {
      src: "/landing-page-1/images/testimonials/wpp-4.jpg",
      alt: "Equipe em ação",
    },
    {
      src: "/landing-page-1/images/testimonials/wpp-5.jpg",
      alt: "Time trabalhando",
    },
    {
      src: "/landing-page-1/images/testimonials/wpp-6.jpg",
      alt: "Produto em uso",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-gray-100/50">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Credibilidade
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black">
              Mais de {CONFIG.totalUsers} empresários{" "}
              <span className="text-brand-yellow-dark">agradecendo</span>
            </h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mb-8 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-brand-black">
              Feedbacks REAIS
            </h3>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FaqSection() {
  const faqs = [
    {
      q: "Preciso saber programar?",
      a: "Não. O sistema faz tudo. Você responde perguntas sobre seu negócio e usa os prompts gerados. Zero conhecimento técnico necessário.",
    },
    {
      q: "Funciona com qual IA?",
      a: "ChatGPT, Claude, Gemini, ou qualquer outra. Os prompts são universais — você copia e usa na IA que preferir.",
    },
    {
      q: "É diferente de um banco de prompts?",
      a: "Completamente. Bancos de prompts são genéricos — o mesmo prompt para todo mundo. Aqui, os prompts são gerados com base no diagnóstico do SEU negócio. Dois usuários diferentes recebem resultados diferentes.",
    },
    {
      q: "É um curso?",
      a: "Não. É um sistema de diagnóstico + geração de inteligência personalizada. O core é resolver seu problema rápido.",
    },
    {
      q: "Quanto tempo leva para usar?",
      a: "3 minutos no diagnóstico. Prompts prontos na hora. Você pode usar o primeiro prompt logo após finalizar.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-white">
      <div className="max-w-3xl 2xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark text-xs font-semibold uppercase tracking-wider mb-4">
              Dúvidas
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black">
              Perguntas Frequentes
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
                  <span className="font-medium text-brand-black pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-brand-gray-400 shrink-0 transition-transform duration-300",
                      open === i && "rotate-180 text-brand-yellow-dark",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-sm text-brand-gray-600 leading-relaxed">
                          {faq.a}
                        </p>
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
  );
}

/* ───────── PREÇO ───────── */
function PricingSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-gray-100/50">
      <div className="max-w-3xl 2xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="relative bg-white rounded-3xl p-8 md:p-12 border-2 border-brand-yellow/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-yellow/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-black" />
                </div>
                <span className="font-bold text-brand-black text-xl tracking-tight">
                  EXECUTIVOS
                </span>
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
                {CONFIG.priceNote} — sem assinatura, sem renovação
              </p>

              <div className="text-left max-w-md mx-auto mb-8 space-y-3">
                {[
                  "Diagnóstico completo (12 dimensões)",
                  "25-35 prompts sob medida",
                  "Chat com IA com contexto do negócio",
                  "Acesso permanente — sem limite",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow-dark mt-0.5 shrink-0" />
                    <span className="text-sm text-brand-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <CtaButton className="w-full md:w-auto">
                Quero meu diagnóstico agora
                <ArrowRight className="w-5 h-5" />
              </CtaButton>

              <div className="mt-8 p-5 rounded-xl bg-brand-yellow/5 border border-brand-yellow/10">
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  <strong className="text-brand-black">
                    O preço é decisão deliberada.
                  </strong>{" "}
                  Julgue pela qualidade. Se não servir, você investiu menos que
                  um almoço.{" "}
                  <strong className="text-brand-black">
                    Se servir — você escalou.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ───────── QUEM ESTÁ POR TRÁS ───────── */
function FounderSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/landing-page-1/images/team/founder-v3.png"
          alt=""
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/80 to-brand-black/40 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-brand-black/60" />
      </div>

      <div className="relative max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="max-w-lg">
          <SectionReveal>
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              A ORIGEM
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Construído por quem entende de IA
                <br />e de{" "}
                <span className="text-brand-yellow">negócios reais</span>
              </h2>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              Eu não sou o desenvolvedor que tenta vender SaaS mágico que não
              serve pra nada prático. O EXECUTIVOS nasceu porque vi que
              empresários são super ocupados e usam o ChatGPT de forma
              extremamente sub aproveitada.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              A barreira é apenas tempo para explicar a IA quem você é. Eu criei
              a ponte.
            </p>
            <CtaButton size="md" />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── PORTFOLIO ───────── */
function PortfolioSection() {
  const projects = [
    {
      title: "Câmara Legislativa",
      description:
        "Sistema de IA para gestão legislativa com dashboard integrado",
      image: "/landing-page-1/images/portfolio/camara-legislativa.png",
      tag: "Governo",
    },
    {
      title: "Sistema Logistico",
      description: "Plataforma inteligente para gestão de frotas e entregas",
      image: "/landing-page-1/images/portfolio/sistema-logistico.png",
      tag: "Logística",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28 bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[450px] md:w-[600px] h-[250px] sm:h-[300px] md:h-[400px] bg-brand-yellow/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
              Nosso portfólio
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Alguns dos softwares que{" "}
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
                  <h3 className="text-lg font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/50 mt-1">
                    {project.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FECHAMENTO EMOCIONAL ───────── */
function EmotionalClose() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-brand-black relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-brand-yellow/8 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl 2xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-black" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              EXECUTIVOS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
            Você pode começar a semana que vem
            <br />
            <span className="text-brand-gray-400">
              exatamente como começou essa.
            </span>
          </h2>
          <p className="text-white/60 mb-3 max-w-xl mx-auto leading-relaxed">
            Ou pode investir 5 minutos hoje e ter, pela primeira vez,
            ferramentas feitas sob medida para os problemas que tiram seu sono.
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
  );
}

/* ───────── URGENCIA LOGICA ───────── */
function UrgencyBanner() {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-brand-yellow">
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <TrendingUp className="w-8 h-8 text-brand-black/30 mx-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-brand-black mb-3">
            Cada semana sem IA personalizada são horas perdidas que não voltam.
          </h3>
          <p className="text-brand-black/70 max-w-xl mx-auto mb-6">
            Gestores do seu porte já estão usando. A diferença entre você e
            eles? 5 minutos de diagnóstico.
          </p>
          <CtaButton variant="dark" />
        </SectionReveal>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="py-8 bg-brand-black border-t border-white/5">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-yellow/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-brand-yellow" />
            </div>
            <span className="font-semibold text-white/40 text-sm">
              EXECUTIVOS
            </span>
          </div>
          <p className="text-white/30 text-sm text-center">
            &copy; 2026 Executivos Negócios Digitais LTDA. Todos os direitos
            reservados.
            <br />
            <span className="text-white/20">
              CNPJ: XX.XXX.XXX/0001-XX | Política de Privacidade | Termos de Uso
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────── APP ───────── */
export default function LandingPage1() {
  return (
    <div className="min-h-screen bg-brand-white">
      <Navbar />
      <Hero />
      <IdentificationSection />
      <WhatIsSection />
      <DifferenceSection />
      <BeforeAfterSection />
      <PortfolioSection />
      <Testimonials />
      <FaqSection />
      <PricingSection />
      <FounderSection />
      <EmotionalClose />
      <UrgencyBanner />
      <Footer />
    </div>
  );
}
