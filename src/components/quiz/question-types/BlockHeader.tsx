import type { QuizQuestion } from '@/types'

interface BlockHeaderProps {
  question: QuizQuestion
}

export default function BlockHeader({ question }: BlockHeaderProps) {
  return (
    <div className="text-center py-6">
      {question.blockEmoji && (
        <span className="text-4xl mb-4 block">{question.blockEmoji}</span>
      )}
      {question.blockTitle && (
        <h2 className="text-xl font-bold text-brand-black mb-2">
          {question.blockTitle}
        </h2>
      )}
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400 max-w-md mx-auto">
          {question.subtitle}
        </p>
      )}
    </div>
  )
}
