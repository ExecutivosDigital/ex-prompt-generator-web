import type { QuizQuestion, QuizAnswer } from '@/types'

interface TextQuestionProps {
  question: QuizQuestion
  value: string
  onChange: (value: QuizAnswer) => void
}

export default function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-brand-black">{question.question}</h2>
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400">{question.subtitle}</p>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full rounded-xl border border-brand-gray-200 bg-white px-4 py-4 text-base text-brand-black placeholder:text-brand-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-all"
        autoFocus
      />
    </div>
  )
}
