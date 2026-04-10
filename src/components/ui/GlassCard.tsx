import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'dark' | 'yellow'
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export default function GlassCard({
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'glass',
    strong: 'glass-strong',
    dark: 'glass-dark',
    yellow: 'glass-yellow',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'rounded-2xl',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-lg hover:scale-[1.01] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
