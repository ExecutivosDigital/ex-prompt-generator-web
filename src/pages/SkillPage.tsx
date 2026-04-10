import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { getLatestSkill } from "@/lib/api/skills";
import { getCategorySummary } from "@/lib/api/prompts";
import type { UserSkill } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  ChevronRight,
  ExternalLink,
  Image,
  Share2,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===== SVG Social Icons ===== */
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="#FF0000"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <defs>
        <radialGradient id="ig-grad-skill" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="url(#ig-grad-skill)"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="#0A66C2"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        fill="#000000"
      />
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#000000"
      />
    </svg>
  );
}

const socialLinks = [
  {
    id: "youtube",
    Icon: YouTubeIcon,
    label: "YouTube",
    handle: "@ExecutivosDigital",
    bg: "bg-red-50 hover:bg-red-100",
    href: "https://www.youtube.com/@ExecutivosDigital",
  },
  {
    id: "instagram",
    Icon: InstagramIcon,
    label: "Instagram",
    handle: "@extecnologia",
    bg: "bg-pink-50 hover:bg-pink-100",
    href: "https://www.instagram.com/extecnologia/",
  },
  {
    id: "linkedin",
    Icon: LinkedInIcon,
    label: "LinkedIn",
    handle: "/executivosdigital",
    bg: "bg-blue-50 hover:bg-blue-100",
    href: "https://www.linkedin.com/company/executivosdigital/",
  },
  {
    id: "site",
    Icon: XTwitterIcon,
    label: "Site",
    handle: "executivosdigital.com.br",
    bg: "bg-gray-50 hover:bg-gray-100",
    href: "https://www.executivosdigital.com.br/",
  },
];

const products = [
  {
    id: "prod-1",
    title: "Gravador de Reunioes EX",
    desc: "Grave reunioes online e saiba quem falou o que, gere relatorio e muito mais usando IA.",
    href: "#",
    image: "/images/meet-fathom.jpeg",
  },
  {
    id: "prod-2",
    title: "App de Reunioes — c/ IA",
    desc: "App que grava e mostra quem falou o que, tudo por app.",
    href: "#",
    image: "/images/6.png",
  },
  {
    id: "prod-3",
    title: "Previsibilidade com Planilhas e IA",
    desc: "Tenha previsoes usando IA e as suas planilhas.",
    href: "#",
    image: "/images/3.png",
  },
];

function handleShare(title: string) {
  const text = `Conheca o ${title} da EXECUTIVOS! https://executivosdigital.com.br/`;
  if (navigator.share) {
    navigator
      .share({ title, text, url: "https://executivosdigital.com.br/" })
      .catch(() => {});
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function RadialChart({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-brand-black">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-brand-gray-600 mt-2 text-center font-medium">
        {label}
      </span>
    </div>
  );
}

function BarStat({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-brand-gray-600 font-medium">{label}</span>
        <span className="text-brand-black font-semibold">
          {value}/{max}
        </span>
      </div>
      <div className="w-full h-2.5 bg-brand-gray-200/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
      </div>
    </div>
  );
}

export default function SkillPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<UserSkill | null>(null);
  const [categorySummary, setCategorySummary] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getLatestSkill(),
      getCategorySummary(),
    ])
      .then(([skillData, summaryData]) => {
        setSkill(skillData);
        setCategorySummary(summaryData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const totalPrompts = categorySummary.reduce((sum, c) => sum + c.count, 0);
  const totalCategories = categorySummary.length;
  const indicators = skill?.competency_indicators || [];
  const chartColors = ['#F5C518', '#FFD84D', '#D4A800', '#FFCC00', '#E5B800'];

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (!skill) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 animate-fade-in">
        <Sparkles size={48} className="text-brand-yellow mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-black mb-2">
          Sua Skill ainda nao foi gerada
        </h2>
        <p className="text-brand-gray-400 mb-6">
          Complete o quiz para a IA criar seu perfil profissional.
        </p>
        <Button onClick={() => navigate("/quiz")}>
          Iniciar Quiz <ArrowRight size={18} />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Hero Card */}
      <motion.div variants={fadeUp}>
        <div className="relative glass-yellow rounded-2xl p-5 lg:p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-yellow/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-yellow/30 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-brand-yellow-dark" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl lg:text-2xl font-bold text-brand-black">
                  {skill.skill_name}
                </h2>
                <Badge variant="dark" size="sm">
                  EX AI
                </Badge>
              </div>
              <p className="text-sm text-brand-gray-600 leading-relaxed">
                {skill.skill_description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Award size={14} className="text-brand-yellow-dark" />
                <span className="text-[11px] text-brand-gray-400">
                  Perfil gerado pela{" "}
                  <strong className="text-brand-black">IA da EXECUTIVOS</strong>{" "}
                  com base nas suas respostas
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-3 gap-3" variants={stagger}>
        {[
          {
            icon: Zap,
            value: String(totalPrompts),
            label: "Prompts Gerados",
            sub: "personalizados",
          },
          { icon: BarChart3, value: String(totalCategories), label: "Categorias", sub: "cobertas" },
          {
            icon: Shield,
            value: "Em breve",
            label: "Tempo Salvo",
            sub: "por semana estimado",
          },
        ].map((kpi, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlassCard padding="sm" className="text-center">
              <kpi.icon
                size={20}
                className="text-brand-yellow-dark mx-auto mb-1.5"
              />
              <p className="text-xl lg:text-2xl font-bold text-brand-black">
                {kpi.value}
              </p>
              <p className="text-[10px] lg:text-xs text-brand-gray-400 font-medium">
                {kpi.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Skill Radar / Radial Charts */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-brand-yellow-dark" />
            <h3 className="font-semibold text-brand-black">
              Indice de Competencia por Area
            </h3>
            <Badge variant="dark" size="sm">
              EX AI
            </Badge>
          </div>
          <div className="flex justify-around flex-wrap gap-4">
            {indicators.map((ind, i) => (
              <RadialChart key={i} value={ind.score} label={ind.name} color={chartColors[i % chartColors.length]} />
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Breakdown Bars */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <h3 className="font-semibold text-brand-black mb-4">
            Distribuicao de Prompts
          </h3>
          <div className="space-y-3">
            {categorySummary.map((cat, i) => (
              <BarStat
                key={cat.category}
                label={cat.category}
                value={cat.count}
                max={Math.max(...categorySummary.map(c => c.count), 1)}
                color={chartColors[i % chartColors.length]}
              />
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Strengths + Growth */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-green-500" />
              <h3 className="font-semibold text-brand-black">Pontos fortes</h3>
            </div>
            <div className="space-y-2">
              {skill.strengths.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-green-600">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-sm text-brand-black font-medium">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-brand-yellow-dark" />
              <h3 className="font-semibold text-brand-black">
                Areas para crescer
              </h3>
            </div>
            <div className="space-y-2">
              {skill.growth_areas.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-yellow/5"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center shrink-0">
                    <Target size={12} className="text-brand-yellow-dark" />
                  </div>
                  <span className="text-sm text-brand-black font-medium">
                    {a}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Recommended Focus */}
      {skill.recommended_focus.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-brand-yellow-dark" />
              <h3 className="font-semibold text-brand-black">
                Foco recomendado pela IA da EX
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.recommended_focus.map((f, i) => (
                <Badge key={i} variant="dark" size="md">
                  {f}
                </Badge>
              ))}
            </div>
            <p className="text-[11px] text-brand-gray-400 mt-3">
              Baseado na analise do seu perfil, desafios e objetivos de negocio.
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* ================================================================ */}
      {/* SECTION: Sobre a EX Tecnologia                                   */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex flex-col lg:flex-row gap-5">
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/images/logo-dark.svg"
                  alt="EX"
                  className="h-6 w-auto"
                />
                <Badge variant="dark" size="sm">
                  Sobre nos
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">
                Quem e a EX Tecnologia
              </h3>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-3">
                A EX Tecnologia e uma empresa focada em transformar a forma como
                empreendedores utilizam inteligencia artificial no dia a dia.
                Nosso objetivo e democratizar o acesso a ferramentas
                profissionais de IA para negocios de todos os tamanhos.
              </p>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-4">
                Com uma equipe apaixonada por inovacao, desenvolvemos solucoes
                que economizam horas de trabalho e geram resultados reais —
                desde prompts personalizados ate dashboards financeiros
                automatizados.
              </p>
              <a
                href="https://executivosdigital.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-yellow-dark hover:underline cursor-pointer"
              >
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
          <h3 className="text-base font-bold text-brand-black">
            Nossos Produtos
          </h3>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-brand-yellow-dark font-medium hover:underline cursor-pointer"
          >
            Ver todos <ChevronRight size={12} className="inline" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((prod) => (
            <div
              key={prod.id}
              data-product-id={prod.id}
              className="block group"
            >
              <GlassCard padding="none" hover className="h-full">
                {/* Product image or placeholder */}
                {prod.image ? (
                  <div className="w-full aspect-[2/1] rounded-t-2xl overflow-hidden border-b border-brand-gray-200/30">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[2/1] rounded-t-2xl bg-gradient-to-br from-brand-yellow/10 via-brand-yellow/5 to-transparent flex items-center justify-center border-b border-brand-gray-200/30">
                    <div className="text-center">
                      <Image
                        size={28}
                        className="text-brand-gray-400/50 mx-auto mb-1"
                      />
                      <span className="text-[9px] text-brand-gray-400">
                        Imagem do produto
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-brand-black">
                    {prod.title}
                  </h4>
                  <p className="text-[11px] text-brand-gray-400 mt-1 leading-snug line-clamp-2">
                    {prod.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleShare(prod.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <Share2 size={12} /> Compartilhar
                    </button>
                    <a
                      href={prod.href}
                      onClick={(e) => e.preventDefault()}
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
          <h3 className="text-base font-bold text-brand-black mb-1">
            Siga a EXECUTIVOS
          </h3>
          <p className="text-xs text-brand-gray-400 mb-4">
            Acompanhe nosso conteudo nas redes sociais
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-social-id={s.id}
                className="flex flex-col items-center gap-1.5 min-w-[72px] group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`}
                >
                  <s.Icon />
                </div>
                <span className="text-[10px] font-semibold text-brand-black">
                  {s.label}
                </span>
                <span className="text-[9px] text-brand-gray-400">
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
