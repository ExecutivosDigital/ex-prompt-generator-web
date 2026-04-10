import { cn } from '@/lib/utils/cn'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export default function Progress({ value, max = 100, size = 'md', showLabel = false, className }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-brand-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-brand-gray-200/50 rounded-full overflow-hidden', sizes[size])}>
        <div
          className="bg-brand-yellow rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
