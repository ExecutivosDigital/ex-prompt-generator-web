import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle,
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  AlertCircle,
  Zap,
  Star,
  X,
  ArrowRight,
  User,
  Pencil,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createPayment, validateCoupon as apiValidateCoupon } from '@/lib/api/checkout'
import Logo from '@/components/shared/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import GlassCard from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils/cn'

type PaymentMethod = 'pix' | 'credit_card'

interface FormData {
  name: string
  email: string
  cpf: string
  phone: string
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  installments: string
}

interface FormErrors {
  [key: string]: string
}

// --- Masks ---
function maskCPFCNPJ(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function maskCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})/g, '$1 ')
    .trim()
}

function maskExpiry(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, '$1/$2')
}

// --- Validators ---
function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  if (rest !== parseInt(cleaned[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  return rest === parseInt(cleaned[10])
}

function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) return false
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(cleaned[i]) * weights1[i]
  let rest = sum % 11
  if (parseInt(cleaned[12]) !== (rest < 2 ? 0 : 11 - rest)) return false
  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(cleaned[i]) * weights2[i]
  rest = sum % 11
  return parseInt(cleaned[13]) === (rest < 2 ? 0 : 11 - rest)
}

function validateCPFOrCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) return validateCPF(value)
  return validateCNPJ(value)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// --- Product Config ---
const PRODUCT = {
  name: 'EXECUTIVOS — Kit de Prompts IA',
  description: 'Prompts personalizados para o SEU negócio',
  price: 29.90,
  originalPrice: 97.00,
}

const ORDER_BUMP = {
  name: 'Módulo Avançado — Prompts de Escala',
  description: 'Pacote extra com prompts para quem quer escalar de R$100k para R$500k/mês',
  price: 19.90,
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { profile, refreshProfile } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [orderBump, setOrderBump] = useState(false)
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pixGenerated, setPixGenerated] = useState(false)
  const [pixCode, setPixCode] = useState('')
  const [pixImage, setPixImage] = useState('')
  const [countdown, setCountdown] = useState(15 * 60) // 15 min
  const [errors, setErrors] = useState<FormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const [showErrorBanner, setShowErrorBanner] = useState(false)
  const [devMode] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'data' | 'payment'>('data')
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    name: profile?.full_name || '',
    email: profile?.email || '',
    cpf: '',
    phone: profile?.phone || '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: '1',
  })

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const formatCountdown = () => {
    const min = Math.floor(countdown / 60)
    const sec = countdown % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  // Totals
  const subtotal = PRODUCT.price + (orderBump ? ORDER_BUMP.price : 0)
  const discount = couponApplied ? couponDiscount : 0
  const total = Math.max(subtotal - discount, 0)

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const errorMessages: Record<string, { label: string; fix: string }> = {
    name: { label: 'Nome completo', fix: 'Digite seu nome e sobrenome' },
    email: { label: 'E-mail', fix: 'Digite um e-mail válido (ex: joao@empresa.com)' },
    cpf: { label: 'CPF ou CNPJ', fix: 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido' },
    phone: { label: 'Telefone', fix: 'Digite seu telefone com DDD (ex: 11 99999-9999)' },
    cardNumber: { label: 'Número do cartão', fix: 'Digite os 16 dígitos do cartão' },
    cardName: { label: 'Nome no cartão', fix: 'Digite o nome exatamente como está impresso' },
    cardExpiry: { label: 'Validade', fix: 'Digite mês e ano (ex: 12/28)' },
    cardCvv: { label: 'CVV', fix: 'Digite os 3 ou 4 dígitos do verso do cartão' },
  }

  const validatePersonalData = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório'
    if (!validateEmail(form.email)) errs.email = 'E-mail inválido'
    if (!validateCPFOrCNPJ(form.cpf)) errs.cpf = 'CPF ou CNPJ inválido'
    if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Telefone inválido'
    setErrors(errs)
    setShowErrorBanner(Object.keys(errs).length > 0)
    return Object.keys(errs).length === 0
  }

  const validatePayment = (): boolean => {
    if (paymentMethod !== 'credit_card') return true
    const errs: FormErrors = {}
    if (form.cardNumber.replace(/\D/g, '').length < 16) errs.cardNumber = 'Número do cartão inválido'
    if (!form.cardName.trim()) errs.cardName = 'Nome no cartão é obrigatório'
    if (form.cardExpiry.replace(/\D/g, '').length < 4) errs.cardExpiry = 'Validade inválida'
    if (form.cardCvv.length < 3) errs.cardCvv = 'CVV inválido'
    setErrors(errs)
    setShowErrorBanner(Object.keys(errs).length > 0)
    return Object.keys(errs).length === 0
  }

  const applyCoupon = async () => {
    try {
      const result = await apiValidateCoupon(couponCode.trim())
      setCouponApplied(true)
      setCouponDiscount(result.discount)
      toast('Cupom aplicado com sucesso!', 'success')
    } catch {
      toast('Cupom inválido', 'error')
    }
  }

  const removeCoupon = () => {
    setCouponApplied(false)
    setCouponDiscount(0)
    setCouponCode('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (checkoutStep === 'data') {
      if (!validatePersonalData()) {
        setTimeout(() => {
          document.getElementById('error-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
        return
      }
      // Data is valid — advance to payment step
      setCheckoutStep('payment')
      setShowErrorBanner(false)
      setErrors({})
      setTimeout(() => {
        document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
      return
    }

    // Step 2: payment
    if (!validatePayment()) {
      setTimeout(() => {
        document.getElementById('error-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
      return
    }
    processPayment()
  }

  const skipValidation = () => {
    setShowErrorBanner(false)
    setErrors({})
    setCheckoutStep('payment')
    processPayment()
  }

  const processPayment = async () => {
    setLoading(true)

    try {
      const expiry = form.cardExpiry.replace(/\D/g, '')
      const cardNumber = form.cardNumber.replace(/\D/g, '')
      const cpfClean = form.cpf.replace(/\D/g, '')
      const phoneClean = form.phone.replace(/\D/g, '')

      const installmentCount = parseInt(form.installments, 10) || 1
      const result = await createPayment({
        billingType: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
        name: form.name,
        email: form.email,
        cpfCnpj: cpfClean,
        phone: phoneClean,
        amount: total,
        orderBump,
        couponCode: couponApplied ? couponCode : undefined,
        ...(paymentMethod === 'credit_card' ? {
          installmentCount,
          creditCard: {
            holderName: form.cardName,
            number: cardNumber,
            expiryMonth: expiry.slice(0, 2),
            expiryYear: '20' + expiry.slice(2, 4),
            ccv: form.cardCvv,
          },
          creditCardHolderInfo: {
            name: form.name,
            email: form.email,
            cpfCnpj: cpfClean,
            postalCode: '00000000',
            addressNumber: '0',
            phone: phoneClean,
          },
        } : {}),
      })

      setPaymentId(result.payment_id)

      if (paymentMethod === 'pix' && result.pix) {
        setPixCode(result.pix.payload)
        setPixImage(result.pix.encoded_image)
        setPixGenerated(true)
        setLoading(false)
      } else {
        // Cartão: se confirmado, ativar e ir para home
        await refreshProfile()
        setLoading(false)
        navigate('/')
        toast('Pagamento confirmado! Bem-vindo ao EXECUTIVOS.', 'success')
      }
    } catch (err) {
      setLoading(false)
      const message = err instanceof Error ? err.message : 'Erro ao processar pagamento'
      toast(message, 'error')
    }
  }

  const copyPixCode = async () => {
    await navigator.clipboard.writeText(pixCode)
    toast('Código PIX copiado!', 'success')
  }

  // Polling automático após PIX gerado — detecta quando o webhook confirma
  useEffect(() => {
    if (!pixGenerated || !paymentId) return

    let active = true
    const poll = async () => {
      if (!active) return
      try {
        const { getPaymentStatus } = await import('@/lib/api/checkout')
        const status = await getPaymentStatus(paymentId)
        if (status.status === 'confirmed') {
          await refreshProfile()
          navigate('/')
          toast('Pagamento confirmado! Bem-vindo ao EXECUTIVOS.', 'success')
          return
        }
      } catch { /* ignore */ }
      if (active) setTimeout(poll, 3000)
    }
    poll()

    return () => { active = false }
  }, [pixGenerated, paymentId])

  return (
    <div className="min-h-dvh bg-brand-white">
      {/* Top urgency bar */}
      <div className="bg-brand-black text-brand-white py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock size={14} className="text-brand-yellow" />
          <span>Oferta expira em</span>
          <span className="font-bold text-brand-yellow tabular-nums">{formatCountdown()}</span>
          <span className="hidden sm:inline">— garanta seu preço especial</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-brand-gray-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2 text-xs text-brand-gray-400">
            <Lock size={14} />
            <span>Pagamento 100% seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
              checkoutStep === 'payment' ? 'bg-green-500 text-white' : 'bg-brand-yellow text-brand-black'
            )}>
              {checkoutStep === 'payment' ? <CheckCircle size={16} /> : '1'}
            </div>
            <span className={cn('text-sm font-medium hidden sm:inline', checkoutStep === 'payment' ? 'text-green-600' : 'text-brand-black')}>Dados</span>
          </div>
          <div className={cn('w-8 sm:w-16 h-0.5 transition-colors', checkoutStep === 'payment' ? 'bg-green-300' : 'bg-brand-gray-200')} />
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
              checkoutStep === 'payment' ? 'bg-brand-yellow text-brand-black' : 'bg-brand-gray-200 text-brand-gray-400'
            )}>2</div>
            <span className={cn('text-sm font-medium hidden sm:inline', checkoutStep === 'payment' ? 'text-brand-black' : 'text-brand-gray-400')}>Pagamento</span>
          </div>
          <div className="w-8 sm:w-16 h-0.5 bg-brand-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-gray-200 text-brand-gray-400 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-sm font-medium text-brand-gray-400 hidden sm:inline">Acesso</span>
          </div>

          {/* Top CTA button */}
          {!pixGenerated && (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={loading}
              onClick={() => formRef.current?.requestSubmit()}
              className="animate-pulse-yellow font-semibold"
            >
              <Lock size={16} />
              Concluir e acessar
            </Button>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* LEFT COLUMN — Form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Error banner */}
              <AnimatePresence>
                {showErrorBanner && Object.keys(errors).length > 0 && (
                  <motion.div
                    id="error-banner"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-red-700">
                          {Object.keys(errors).length === 1
                            ? 'Corrija 1 campo para continuar'
                            : `Corrija ${Object.keys(errors).length} campos para continuar`}
                        </h3>
                        <p className="text-xs text-red-500 mt-0.5">
                          Os campos destacados em vermelho precisam da sua atenção
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowErrorBanner(false)}
                        className="ml-auto p-1 rounded-lg hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.keys(errors).map(key => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => document.getElementById(key)?.focus()}
                          className="w-full flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-red-200 hover:bg-white hover:border-red-300 transition-all cursor-pointer text-left"
                        >
                          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-red-500">!</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-red-700">{errorMessages[key]?.label || key}</p>
                            <p className="text-xs text-red-400 mt-0.5">{errorMessages[key]?.fix || errors[key]}</p>
                          </div>
                          <ArrowRight size={14} className="text-red-300 shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dev mode bypass */}
              {devMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-orange-500" />
                    <span className="text-xs font-medium text-orange-700">Modo de teste ativo</span>
                  </div>
                  <button
                    type="button"
                    onClick={skipValidation}
                    className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Pular validação e pagar
                  </button>
                </motion.div>
              )}

              {/* Personal data — accordion */}
              <div className="rounded-2xl transition-all duration-500">
                <GlassCard
                  variant="strong"
                  padding={checkoutStep === 'payment' ? 'md' : 'lg'}
                  className={cn(
                    'transition-all duration-300',
                    checkoutStep === 'payment' && 'cursor-pointer border border-green-200'
                  )}
                  onClick={checkoutStep === 'payment' ? () => { setCheckoutStep('data'); setShowErrorBanner(false); setErrors({}) } : undefined}
                >
                  {/* Header — always visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                        checkoutStep === 'payment' ? 'bg-green-100' : 'bg-brand-yellow/20'
                      )}>
                        {checkoutStep === 'payment'
                          ? <CheckCircle size={18} className="text-green-600" />
                          : <User size={18} className="text-brand-yellow-dark" />
                        }
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-brand-black">Seus dados</h2>
                        {checkoutStep === 'payment' && (
                          <p className="text-xs text-brand-gray-400 mt-0.5">
                            {form.name} &bull; {form.email}
                          </p>
                        )}
                      </div>
                    </div>
                    {checkoutStep === 'payment' && (
                      <div className="flex items-center gap-1.5 text-xs text-brand-yellow-dark font-medium">
                        <Pencil size={14} />
                        <span className="hidden sm:inline">Editar</span>
                      </div>
                    )}
                  </div>

                  {/* Form fields — collapsible */}
                  <AnimatePresence initial={false}>
                    {checkoutStep === 'data' && (
                      <motion.div
                        key="personal-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-brand-gray-400 mt-2 mb-5">Preencha para liberar seu acesso após o pagamento</p>
                        <div className="space-y-4">
                          <Input
                            id="name"
                            label="Nome completo"
                            placeholder="João da Silva"
                            autoComplete="name"
                            value={form.name}
                            onChange={e => updateField('name', e.target.value)}
                            error={errors.name}
                          />
                          <Input
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="joao@empresa.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={e => updateField('email', e.target.value)}
                            error={errors.email}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              id="cpf"
                              label="CPF ou CNPJ"
                              placeholder="000.000.000-00 ou 00.000.000/0000-00"
                              autoComplete="off"
                              value={form.cpf}
                              onChange={e => updateField('cpf', maskCPFCNPJ(e.target.value))}
                              error={errors.cpf}
                              inputMode="numeric"
                            />
                            <Input
                              id="phone"
                              label="Telefone / WhatsApp"
                              placeholder="(11) 99999-9999"
                              autoComplete="tel"
                              value={form.phone}
                              onChange={e => updateField('phone', maskPhone(e.target.value))}
                              error={errors.phone}
                              inputMode="numeric"
                            />
                          </div>
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-6 font-semibold"
                          >
                            Continuar para pagamento
                            <ArrowRight size={18} />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </div>

              {/* Payment method selector — accordion */}
              <div id="payment-section" className="rounded-2xl transition-all duration-500">
              <GlassCard
                variant="strong"
                padding={checkoutStep === 'data' ? 'md' : 'lg'}
                className={cn(
                  'transition-all duration-300',
                  checkoutStep === 'data' && 'cursor-pointer',
                  checkoutStep === 'payment' && 'ring-2 ring-brand-yellow/50 shadow-lg'
                )}
                onClick={checkoutStep === 'data' ? () => {
                  if (validatePersonalData()) {
                    setCheckoutStep('payment')
                    setShowErrorBanner(false)
                    setErrors({})
                  }
                } : undefined}
              >
                {/* Payment header — always visible */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      checkoutStep === 'payment' ? 'bg-brand-yellow/20' : 'bg-brand-gray-200/50'
                    )}>
                      <CreditCard size={18} className={checkoutStep === 'payment' ? 'text-brand-yellow-dark' : 'text-brand-gray-400'} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-black">Forma de pagamento</h2>
                      {checkoutStep === 'data' && (
                        <p className="text-xs text-brand-gray-400 mt-0.5">Preencha seus dados primeiro</p>
                      )}
                    </div>
                  </div>
                  {checkoutStep === 'data' && (
                    <Lock size={16} className="text-brand-gray-300" />
                  )}
                </div>

                {/* Payment content — collapsible */}
                <AnimatePresence initial={false}>
                  {checkoutStep === 'payment' && (
                    <motion.div
                      key="payment-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5">

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* PIX option */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('pix'); setPixGenerated(false) }}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                      paymentMethod === 'pix'
                        ? 'border-brand-yellow bg-brand-yellow/5 shadow-sm'
                        : 'border-brand-gray-200 hover:border-brand-gray-400'
                    )}
                  >
                    {paymentMethod === 'pix' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={16} className="text-brand-yellow-dark" />
                      </div>
                    )}
                    <QrCode size={24} className={paymentMethod === 'pix' ? 'text-brand-yellow-dark' : 'text-brand-gray-400'} />
                    <span className={cn('text-sm font-medium', paymentMethod === 'pix' ? 'text-brand-black' : 'text-brand-gray-600')}>
                      PIX
                    </span>
                    <Badge variant="yellow" size="sm">Aprovação imediata</Badge>
                  </button>

                  {/* Credit Card option */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('credit_card'); setPixGenerated(false) }}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                      paymentMethod === 'credit_card'
                        ? 'border-brand-yellow bg-brand-yellow/5 shadow-sm'
                        : 'border-brand-gray-200 hover:border-brand-gray-400'
                    )}
                  >
                    {paymentMethod === 'credit_card' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={16} className="text-brand-yellow-dark" />
                      </div>
                    )}
                    <CreditCard size={24} className={paymentMethod === 'credit_card' ? 'text-brand-yellow-dark' : 'text-brand-gray-400'} />
                    <span className={cn('text-sm font-medium', paymentMethod === 'credit_card' ? 'text-brand-black' : 'text-brand-gray-600')}>
                      Cartão de Crédito
                    </span>
                    <Badge variant="default" size="sm">Até 3x sem juros</Badge>
                  </button>
                </div>

                {/* Credit card fields */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'credit_card' && (
                    <motion.div
                      key="card-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-2">
                        <Input
                          id="cardNumber"
                          label="Número do cartão"
                          placeholder="0000 0000 0000 0000"
                          autoComplete="cc-number"
                          value={form.cardNumber}
                          onChange={e => updateField('cardNumber', maskCardNumber(e.target.value))}
                          error={errors.cardNumber}
                          inputMode="numeric"
                          icon={<CreditCard size={18} />}
                        />
                        <Input
                          id="cardName"
                          label="Nome impresso no cartão"
                          placeholder="JOAO DA SILVA"
                          autoComplete="cc-name"
                          value={form.cardName}
                          onChange={e => updateField('cardName', e.target.value.toUpperCase())}
                          error={errors.cardName}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            id="cardExpiry"
                            label="Validade"
                            placeholder="MM/AA"
                            autoComplete="cc-exp"
                            value={form.cardExpiry}
                            onChange={e => updateField('cardExpiry', maskExpiry(e.target.value))}
                            error={errors.cardExpiry}
                            inputMode="numeric"
                          />
                          <Input
                            id="cardCvv"
                            label="CVV"
                            placeholder="000"
                            autoComplete="cc-csc"
                            value={form.cardCvv}
                            onChange={e => updateField('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            error={errors.cardCvv}
                            inputMode="numeric"
                            maxLength={4}
                          />
                        </div>

                        {/* Installments */}
                        <div className="w-full">
                          <label className="block text-sm font-medium text-brand-gray-600 mb-1.5">Parcelas</label>
                          <select
                            value={form.installments}
                            onChange={e => updateField('installments', e.target.value)}
                            className="w-full rounded-xl border border-brand-gray-200 bg-white px-4 py-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-all duration-200 cursor-pointer"
                          >
                            <option value="1">1x de R$ {total.toFixed(2)} (sem juros)</option>
                            <option value="2">2x de R$ {(total / 2).toFixed(2)} (sem juros)</option>
                            <option value="3">3x de R$ {(total / 3).toFixed(2)} (sem juros)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PIX generated area */}
                  {paymentMethod === 'pix' && pixGenerated && (
                    <motion.div
                      key="pix-code"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <CheckCircle size={20} />
                          <span className="font-semibold">PIX gerado com sucesso!</span>
                        </div>

                        {/* QR Code PIX */}
                        <div className="mx-auto w-48 h-48 bg-white rounded-xl border border-green-200 flex items-center justify-center overflow-hidden">
                          {pixImage ? (
                            <img src={`data:image/png;base64,${pixImage}`} alt="QR Code PIX" className="w-full h-full" />
                          ) : (
                            <div className="text-center">
                              <QrCode size={64} className="text-brand-black mx-auto mb-2" />
                              <span className="text-xs text-brand-gray-400">QR Code PIX</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-brand-gray-600">Ou copie o código abaixo:</p>

                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <p className="text-xs text-brand-gray-600 break-all font-mono leading-relaxed">{pixCode.slice(0, 60)}...</p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button type="button" variant="secondary" onClick={copyPixCode} className="w-full">
                            <Copy size={16} />
                            Copiar código PIX
                          </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-brand-gray-600">
                          <Spinner size="sm" />
                          <span>Aguardando confirmação do pagamento...</span>
                        </div>

                        <p className="text-xs text-brand-gray-400 flex items-center justify-center gap-1">
                          <Clock size={12} />
                          O código expira em 30 minutos
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
              </div>

              {/* Coupon */}
              <GlassCard variant="strong" padding="md">
                <button
                  type="button"
                  onClick={() => setCouponOpen(!couponOpen)}
                  className="w-full flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-brand-gray-400" />
                    <span className="text-sm text-brand-gray-600">Tem um cupom de desconto?</span>
                  </div>
                  {couponOpen ? <ChevronUp size={16} className="text-brand-gray-400" /> : <ChevronDown size={16} className="text-brand-gray-400" />}
                </button>

                <AnimatePresence>
                  {couponOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        {couponApplied ? (
                          <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-600" />
                              <span className="text-sm text-green-700 font-medium">{couponCode.toUpperCase()} — -R$ {couponDiscount.toFixed(2)}</span>
                            </div>
                            <button type="button" onClick={removeCoupon} className="text-xs text-red-500 hover:underline cursor-pointer">Remover</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              id="coupon"
                              placeholder="Digite o código"
                              value={couponCode}
                              onChange={e => setCouponCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="button" variant="secondary" onClick={applyCoupon} size="md">
                              Aplicar
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>

              {/* Submit — mobile only (desktop uses sidebar) */}
              {!pixGenerated && (
                <div className="lg:hidden">
                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full animate-pulse-yellow text-base font-semibold">
                    <Lock size={18} />
                    Concluir e acessar
                  </Button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Order Summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-20 space-y-5">

                {/* Order summary */}
                <GlassCard variant="strong" padding="lg">
                  <h3 className="text-base font-semibold text-brand-black mb-4">Resumo do pedido</h3>

                  {/* Product */}
                  <div className="flex gap-3 pb-4 border-b border-brand-gray-200/50">
                    <div className="w-16 h-16 rounded-xl bg-brand-yellow/10 flex items-center justify-center shrink-0">
                      <Zap size={28} className="text-brand-yellow-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-brand-black leading-tight">{PRODUCT.name}</h4>
                      <p className="text-xs text-brand-gray-400 mt-0.5">{PRODUCT.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-brand-gray-400 line-through">R$ {PRODUCT.originalPrice.toFixed(2)}</span>
                        <span className="text-sm font-bold text-brand-black">R$ {PRODUCT.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order bump */}
                  <div className="mt-4 mb-4">
                    <motion.div
                      className={cn(
                        'rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer',
                        orderBump
                          ? 'border-brand-yellow bg-brand-yellow/5'
                          : 'border-dashed border-brand-gray-200 hover:border-brand-yellow/50'
                      )}
                      onClick={() => setOrderBump(!orderBump)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          orderBump ? 'bg-brand-yellow border-brand-yellow' : 'border-brand-gray-400'
                        )}>
                          {orderBump && <CheckCircle size={12} className="text-brand-black" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="yellow" size="sm">OFERTA ESPECIAL</Badge>
                          </div>
                          <h4 className="text-sm font-semibold text-brand-black mt-1.5">{ORDER_BUMP.name}</h4>
                          <p className="text-xs text-brand-gray-400 mt-0.5">{ORDER_BUMP.description}</p>
                          <p className="text-sm font-bold text-brand-yellow-dark mt-1.5">+ R$ {ORDER_BUMP.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t border-brand-gray-200/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-400">Subtotal</span>
                      <span className="text-brand-black">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Desconto</span>
                        <span className="text-green-600">- R$ {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-brand-gray-200/50">
                      <span className="text-base font-semibold text-brand-black">Total</span>
                      <span className="text-xl font-bold text-brand-black">R$ {total.toFixed(2)}</span>
                    </div>
                    {paymentMethod === 'credit_card' && parseInt(form.installments) > 1 && (
                      <p className="text-xs text-brand-gray-400 text-right">
                        ou {form.installments}x de R$ {(total / parseInt(form.installments)).toFixed(2)} sem juros
                      </p>
                    )}
                  </div>

                  {/* Submit — desktop */}
                  {!pixGenerated && (
                    <div className="hidden lg:block mt-5">
                      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full animate-pulse-yellow text-base font-semibold">
                        <Lock size={18} />
                        Concluir e acessar
                      </Button>
                    </div>
                  )}
                </GlassCard>

                {/* Trust signals */}
                <GlassCard variant="default" padding="md">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-green-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-brand-black">Compra 100% segura</p>
                        <p className="text-xs text-brand-gray-400">Seus dados protegidos com criptografia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star size={18} className="text-brand-yellow shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-brand-black">Garantia de 7 dias</p>
                        <p className="text-xs text-brand-gray-400">Não gostou? Devolvemos 100% do valor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap size={18} className="text-brand-yellow-dark shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-brand-black">Acesso imediato</p>
                        <p className="text-xs text-brand-gray-400">Receba seu login por e-mail na hora</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Testimonial */}
                <GlassCard variant="yellow" padding="md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-yellow/30 flex items-center justify-center shrink-0 text-sm font-bold text-brand-yellow-dark">
                      RL
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-600 italic leading-relaxed">
                        "Em 3 minutos mapeou meu negócio melhor do que consultoria de R$5 mil. Os prompts são absurdamente precisos."
                      </p>
                      <p className="text-xs font-medium text-brand-black mt-1.5">Rafael Lima</p>
                      <p className="text-xs text-brand-gray-400">Founder, fatura R$80k/mês</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-gray-200/50 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-gray-400">EXECUTIVOS Digital &copy; {new Date().getFullYear()} — Todos os direitos reservados</p>
          <div className="flex items-center gap-1 text-xs text-brand-gray-400">
            <Lock size={12} />
            <span>Ambiente seguro — Pagamento via Asaas</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
