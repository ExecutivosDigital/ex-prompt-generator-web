import { cn } from '@/lib/utils/cn'

interface LogoProps {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  theme?: 'light' | 'dark'
  className?: string
}

export default function Logo({ variant = 'full', size = 'md', theme = 'dark', className }: LogoProps) {
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
  }

  const src = theme === 'light' ? '/images/logo-light.svg' : '/images/logo-dark.svg'

  if (variant === 'icon') {
    return (
      <div className={cn('shrink-0', className)}>
        <img
          src={src}
          alt="EXECUTIVOS"
          className={cn(heights[size], 'w-auto object-contain')}
        />
      </div>
    )
  }

  return (
    <div className={cn('shrink-0', className)}>
      <img
        src={src}
        alt="EXECUTIVOS Digital"
        className={cn(heights[size], 'w-auto object-contain')}
      />
    </div>
  )
}
