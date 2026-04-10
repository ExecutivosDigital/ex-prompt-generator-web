import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PopupAdProps {
  id: string
  delayMs?: number
  title?: string
  description?: string
  ctaText?: string
  imageUrl?: string
}

export default function PopupAd({
  id,
  delayMs = 8000,
  title = 'Oferta Especial',
  description = 'Aproveite esta oportunidade exclusiva para membros EXECUTIVOS.',
  ctaText = 'Quero aproveitar',
  imageUrl,
}: PopupAdProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(`popup-seen-${id}`)
    if (alreadySeen) return

    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [id, delayMs])

  const handleClose = () => {
    sessionStorage.setItem(`popup-seen-${id}`, 'true')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-sm glass-strong rounded-t-3xl sm:rounded-2xl overflow-hidden pb-[env(safe-area-inset-bottom)]"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 bg-brand-black/10 hover:bg-brand-black/20 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} className="text-brand-gray-600" />
            </button>

            {/* Image placeholder */}
            <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Gift size={48} className="text-brand-yellow mx-auto mb-2" />
                  <span className="text-xs text-brand-gray-400">Placeholder para imagem do anuncio</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 text-center">
              <h3 className="text-lg font-bold text-brand-black mb-2">{title}</h3>
              <p className="text-sm text-brand-gray-600 mb-5">{description}</p>

              <Button size="lg" className="w-full" onClick={handleClose}>
                {ctaText}
              </Button>

              <button
                onClick={handleClose}
                className="mt-3 text-xs text-brand-gray-400 hover:text-brand-gray-600 transition-colors cursor-pointer"
              >
                Nao, obrigado
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
