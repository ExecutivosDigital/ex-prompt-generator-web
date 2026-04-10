import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && <div className="mb-4 text-brand-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-brand-black mb-1">{title}</h3>
      {description && <p className="text-sm text-brand-gray-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}
