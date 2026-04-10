import { Sparkles, Loader2 } from 'lucide-react'
import type { QuizQuestion } from '@/types'

interface InfoSlideProps {
  question: QuizQuestion
}

export default function InfoSlide({ question }: InfoSlideProps) {
  const Icon = question.icon === 'loader' ? Loader2 : Sparkles
  const isLoading = question.icon === 'loader'

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <Icon
          size={56}
          className={`text-brand-yellow mx-auto ${isLoading ? 'animate-spin' : ''}`}
        />
      </div>
      <h2 className="text-2xl font-bold text-brand-black mb-3">
        {question.title}
      </h2>
      {question.subtitle && (
        <p className="text-brand-gray-400 max-w-md mx-auto">
          {question.subtitle}
        </p>
      )}
    </div>
  )
}
