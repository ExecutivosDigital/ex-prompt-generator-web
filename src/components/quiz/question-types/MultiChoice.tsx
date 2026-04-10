import { Check } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { cn } from '@/lib/utils/cn'

interface MultiChoiceProps {
  question: QuizQuestion
  value: string[]
  onChange: (value: QuizAnswer) => void
  maxSelections?: number
}

export default function MultiChoice({ question, value, onChange, maxSelections }: MultiChoiceProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) return
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-brand-black">{question.question}</h2>
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400">{question.subtitle}</p>
      )}
      <div className="grid gap-2 mt-4">
        {question.options?.map(option => {
          const selected = value.includes(option.value)
          const disabled = !selected && maxSelections ? value.length >= maxSelections : false

          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer border-2',
                selected
                  ? 'border-brand-yellow bg-brand-yellow/10 text-brand-black'
                  : disabled
                    ? 'border-brand-gray-200 bg-brand-gray-200/20 text-brand-gray-400 cursor-not-allowed'
                    : 'border-brand-gray-200 bg-white text-brand-gray-600 hover:border-brand-yellow/50'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                  selected ? 'border-brand-yellow bg-brand-yellow' : 'border-brand-gray-400'
                )}
              >
                {selected && <Check size={12} className="text-brand-black" />}
              </div>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
