import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('') // CPF ou CNPJ
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Mácara simples para CPF/CNPJ (apenas visual, aceita os números/formato que vier)
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite digitação livre de CPF ou CNPJ - para validação real usaria uma lib como cpf-cnpj-validator
    setDocument(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !document) {
      setError('Por favor, preencha o email e o documento (CPF/CNPJ).')
      return
    }

    setLoading(true)

    try {
      // Aqui entraria a lógica de comunicação com o backend (Supabase edge function ou API própria)
      // para validar se o email e CPF/CNPJ conferem, e então enviar o link.
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulação de network
      
      console.log('[ForgotPasswordForm] Requesting reset for:', { email, document })
      setSuccess(true)
    } catch (err: unknown) {
      setError('Erro ao solicitar recuperação. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center animate-[fadeIn_0.5s_ease-out]">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Solicitação Enviada!</h1>
        <p className="text-gray-400 text-lg">
          Se os dados conferirem com nossa base, enviaremos um link de recuperação para <strong>{email}</strong>.
        </p>
        <div className="pt-6 border-t border-white/10 mt-8">
          <Link to="/login">
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10">
              Voltar para o Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Recuperar acesso</h1>
        <p className="text-gray-400">Informe seu e-mail e documento para redefinir sua senha.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm rounded-xl px-4 py-3 font-medium flex items-center animate-[fadeIn_0.3s_ease-out]">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0"></div>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="group space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email da conta</label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail className="text-gray-400 group-hover:text-blue-400 transition-colors" size={18} />}
            required
            autoComplete="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>

        <div className="group space-y-1.5">
          <label htmlFor="document" className="block text-sm font-medium text-gray-300">CPF ou CNPJ</label>
          <Input
            id="document"
            type="text"
            placeholder="Apenas números ou formato padrão"
            value={document}
            onChange={handleDocumentChange}
            icon={<FileText className="text-gray-400 group-hover:text-blue-400 transition-colors" size={18} />}
            required
            autoComplete="off"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-brand-yellow-dark to-brand-yellow hover:from-brand-yellow hover:to-brand-yellow-light text-brand-black font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-brand-yellow/30 transition-all duration-300 flex items-center justify-center group mt-4" 
        size="lg" 
        loading={loading}
      >
        <span>Solicitar nova senha</span>
        {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </Button>

      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Lembrou a senha?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-brand-yellow transition-colors duration-200 ml-1">
            Fazer login
          </Link>
        </p>
      </div>
    </form>
  )
}
