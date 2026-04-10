import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import QuizContainer from '@/components/quiz/QuizContainer'

export default function QuizPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  if (profile?.quiz_completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-brand-black mb-2">Quiz ja concluido!</h2>
        <p className="text-brand-gray-400 mb-6">Voce ja completou o quiz. Seus prompts estao prontos.</p>
        <button
          onClick={() => navigate('/prompts')}
          className="px-6 py-3 bg-brand-yellow text-brand-black font-medium rounded-xl hover:bg-brand-yellow-light transition-colors cursor-pointer"
        >
          Ver meus Prompts
        </button>
      </div>
    )
  }

  return <QuizContainer />
}
