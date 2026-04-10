import { Image, Video } from 'lucide-react'
import type { QuizQuestion } from '@/types'

interface MediaSlideProps {
  question: QuizQuestion
}

export default function MediaSlide({ question }: MediaSlideProps) {
  const isVideo = question.mediaType === 'video'

  return (
    <div className="text-center space-y-6 py-4">
      {question.title && (
        <h2 className="text-xl font-bold text-brand-black">{question.title}</h2>
      )}

      {/* Media placeholder */}
      <div className="w-full aspect-video rounded-xl bg-brand-gray-200/30 border-2 border-dashed border-brand-gray-200 flex items-center justify-center overflow-hidden">
        {question.mediaUrl ? (
          isVideo ? (
            <video src={question.mediaUrl} controls className="w-full h-full object-cover rounded-xl" />
          ) : (
            <img src={question.mediaUrl} alt={question.title || ''} className="w-full h-full object-cover rounded-xl" />
          )
        ) : (
          <div className="text-center text-brand-gray-400">
            {isVideo ? <Video size={48} className="mx-auto mb-2" /> : <Image size={48} className="mx-auto mb-2" />}
            <p className="text-sm">Placeholder para {isVideo ? 'video' : 'imagem'}</p>
          </div>
        )}
      </div>

      {question.subtitle && (
        <p className="text-sm text-brand-gray-400 max-w-md mx-auto">{question.subtitle}</p>
      )}
    </div>
  )
}
