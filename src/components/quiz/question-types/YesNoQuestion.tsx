import { Check, X } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { cn } from '@/lib/utils/cn'

interface YesNoQuestionProps {
  question: QuizQuestion
  value: boolean | null
  onChange: (value: QuizAnswer) => void
}

export default function YesNoQuestion({ question, value, onChange }: YesNoQuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-brand-black">{question.question}</h2>
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400">{question.subtitle}</p>
      )}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => onChange(true)}
          className={cn(
            'flex-1 flex items-center justify-center gap-3 py-5 rounded-xl text-lg font-medium transition-all cursor-pointer border-2',
            value === true
              ? 'border-brand-yellow bg-brand-yellow/10 text-brand-black'
              : 'border-brand-gray-200 bg-white text-brand-gray-600 hover:border-brand-yellow/50'
          )}
        >
          <Check size={24} /> Sim
        </button>
        <button
          onClick={() => onChange(false)}
          className={cn(
            'flex-1 flex items-center justify-center gap-3 py-5 rounded-xl text-lg font-medium transition-all cursor-pointer border-2',
            value === false
              ? 'border-brand-yellow bg-brand-yellow/10 text-brand-black'
              : 'border-brand-gray-200 bg-white text-brand-gray-600 hover:border-brand-yellow/50'
          )}
        >
          <X size={24} /> Nao
        </button>
      </div>
    </div>
  )
}
