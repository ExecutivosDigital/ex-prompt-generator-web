import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AdBannerProps {
  id: string
  title?: string
  description?: string
  ctaText?: string
  variant?: 'inline' | 'top' | 'fullwidth'
  image?: string
  href?: string
  className?: string
}

export default function AdBanner({
  id,
  title = 'Espaco para anuncio',
  description = 'Banner publicitario — placeholder',
  ctaText = 'Saiba mais',
  variant = 'inline',
  image,
  href,
  className,
}: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
  }

  if (variant === 'top') {
    return (
      <div className={cn(
        'relative bg-gradient-to-r from-brand-black to-brand-gray-800 text-white px-4 py-3 flex items-center justify-center gap-3',
        className
      )}>
        <p className="text-xs sm:text-sm font-medium">{title}</p>
        <button className="text-xs bg-brand-yellow text-brand-black px-3 py-1 rounded-full font-semibold hover:bg-brand-yellow-light transition-colors shrink-0 cursor-pointer">
          {ctaText}
        </button>
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className={cn(
      'relative glass-yellow rounded-2xl p-4 sm:p-5 overflow-hidden',
      variant === 'fullwidth' && 'rounded-none sm:rounded-2xl',
      className
    )}>
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 hover:bg-brand-black/10 rounded-full transition-colors cursor-pointer z-10"
      >
        <X size={14} className="text-brand-gray-600" />
      </button>

      <div className="flex items-center gap-4">
        {/* Ad image */}
        {image ? (
          <a href={href || '#'} target="_blank" rel="noopener noreferrer" className="hidden sm:block w-16 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </a>
        ) : (
          <div className="hidden sm:flex w-16 h-16 rounded-xl bg-brand-yellow/30 border-2 border-dashed border-brand-yellow-dark/30 items-center justify-center shrink-0">
            <span className="text-xs text-brand-yellow-dark font-medium text-center leading-tight">AD<br />IMG</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black truncate">{title}</p>
          <p className="text-xs text-brand-gray-600 mt-0.5 line-clamp-2">{description}</p>
        </div>

        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-brand-black text-white px-3 py-2 rounded-xl font-medium hover:bg-brand-gray-800 transition-colors shrink-0 cursor-pointer active:scale-95">
            {ctaText} <ExternalLink size={12} />
          </a>
        ) : (
          <button className="flex items-center gap-1 text-xs bg-brand-black text-white px-3 py-2 rounded-xl font-medium hover:bg-brand-gray-800 transition-colors shrink-0 cursor-pointer active:scale-95">
            {ctaText} <ExternalLink size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
