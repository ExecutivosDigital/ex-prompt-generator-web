import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'yellow' | 'dark' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-brand-gray-200/50 text-brand-gray-600',
    yellow: 'bg-brand-yellow/20 text-brand-yellow-dark',
    dark: 'bg-brand-dark text-brand-white',
    outline: 'border border-brand-gray-200 text-brand-gray-600',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
