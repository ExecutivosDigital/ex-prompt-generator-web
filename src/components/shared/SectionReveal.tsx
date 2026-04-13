import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
