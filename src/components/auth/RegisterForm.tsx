import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { signUp } from '@/lib/api/auth'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validação manual aprimorada
    if (!fullName || !email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios para continuar.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const result = await signUp(fullName, email, password)
      setProfile(result.profile)
      navigate('/checkout')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Criar sua conta</h1>
        <p className="text-gray-400">Junte-se à nova era de ferramentas otimizadas.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm rounded-xl px-4 py-3 font-medium flex items-center animate-[fadeIn_0.3s_ease-out]">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0"></div>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="group space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome completo</label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome verdadeiro"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            icon={<User className="text-gray-400 group-hover:text-blue-400 transition-colors" size={18} />}
            required
            autoComplete="name"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>

        <div className="group space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email corporativo ou pessoal</label>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha segura</label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<Lock className="text-gray-400 group-hover:text-blue-400 transition-colors" size={18} />}
            minLength={6}
            required
            autoComplete="new-password"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-brand-yellow-dark to-brand-yellow hover:from-brand-yellow hover:to-brand-yellow-light text-brand-black font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-brand-yellow/30 transition-all duration-300 flex items-center justify-center group mt-2" 
        size="lg" 
        loading={loading}
      >
        <span>Criar nova conta</span>
        {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </Button>

      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Já faz parte da plataforma?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-blue-400 transition-colors duration-200 ml-1">
            Fazer login
          </Link>
        </p>
      </div>
    </form>
  )
}
