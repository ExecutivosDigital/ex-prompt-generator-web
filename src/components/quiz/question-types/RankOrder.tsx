import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import type { QuizQuestion, QuizAnswer } from '@/types'
import { cn } from '@/lib/utils/cn'

interface RankOrderProps {
  question: QuizQuestion
  value: string[]
  onChange: (value: QuizAnswer) => void
}

export default function RankOrder({ question, value, onChange }: RankOrderProps) {
  const items = value.length > 0 ? value : question.items || []

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    const temp = newItems[index - 1]
    newItems[index - 1] = newItems[index]
    newItems[index] = temp
    onChange(newItems)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    const temp = newItems[index + 1]
    newItems[index + 1] = newItems[index]
    newItems[index] = temp
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-brand-black">{question.question}</h2>
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400">{question.subtitle}</p>
      )}
      <div className="space-y-2 mt-4">
        {items.map((item, index) => (
          <div
            key={item}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-brand-gray-200 bg-white transition-all'
            )}
          >
            <GripVertical size={18} className="text-brand-gray-400 shrink-0" />
            <span className="w-7 h-7 rounded-full bg-brand-yellow/20 text-brand-yellow-dark text-xs font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <span className="flex-1 text-sm text-brand-black font-medium">{item}</span>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 rounded hover:bg-brand-gray-200/50 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ArrowUp size={16} className="text-brand-gray-600" />
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="p-1 rounded hover:bg-brand-gray-200/50 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ArrowDown size={16} className="text-brand-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
