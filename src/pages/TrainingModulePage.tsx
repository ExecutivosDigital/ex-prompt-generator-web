import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Circle, Download, Play, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import type { TrainingModule, TrainingLesson, UserLessonProgress } from '@/types'
import { DEMO_TRAINING_MODULES, DEMO_TRAINING_LESSONS } from '@/config/demo-data'
import Spinner from '@/components/ui/Spinner'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  return `${m} min`
}

export default function TrainingModulePage() {
  const { courseId, moduleId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [module_, setModule] = useState<TrainingModule | null>(null)
  const [lessons, setLessons] = useState<TrainingLesson[]>([])
  const [progress, setProgress] = useState<UserLessonProgress[]>([])
  const [loading, setLoading] = useState(true)

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  useEffect(() => {
    if (isDemoMode) {
      const demoMod = DEMO_TRAINING_MODULES.find((m) => m.id === moduleId) || null
      const demoLessons = DEMO_TRAINING_LESSONS.filter((l) => l.module_id === moduleId)
      setModule(demoMod)
      setLessons(demoLessons)
      setLoading(false)
      return
    }
    if (!user || !moduleId) return
    Promise.all([
      supabase.from('training_modules').select('*').eq('id', moduleId).single(),
      supabase
        .from('training_lessons')
        .select('*')
        .eq('module_id', moduleId)
        .eq('is_published', true)
        .order('sort_order'),
      supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId),
    ]).then(([modRes, lessonsRes, progressRes]) => {
      setModule(modRes.data)
      setLessons(lessonsRes.data || [])
      setProgress(progressRes.data || [])
      setLoading(false)
    })
  }, [user, moduleId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!module_) {
    return <div className="text-center py-20 text-gray-500">Modulo nao encontrado.</div>
  }

  const completedCount = progress.filter((p) => p.completed).length
  const percentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(`/training/${courseId}`)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> Voltar ao curso
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
      >
        <h2 className="text-xl font-bold text-white mb-1">{module_.title}</h2>
        {module_.description && <p className="text-sm text-gray-400 mb-4">{module_.description}</p>}

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span>{lessons.length} aulas</span>
          <span className="text-[#F5C518] font-medium">{Math.round(percentage)}% concluido</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full bg-[#F5C518] rounded-full"
          />
        </div>
      </motion.div>

      {/* Lessons list */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {lessons.map((lesson, idx) => {
          const isCompleted = progress.some((p) => p.lesson_id === lesson.id && p.completed)
          return (
            <motion.div
              key={lesson.id}
              variants={item}
              onClick={() => navigate(`/training/${courseId}/${moduleId}/${lesson.id}`)}
              className="group flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 cursor-pointer active:scale-[0.97] transition-all duration-200 hover:border-[#F5C518]/30"
            >
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle size={22} className="text-green-500" />
                ) : (
                  <Circle size={22} className="text-gray-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-[#F5C518] transition-colors">
                  {idx + 1}. {lesson.title}
                </p>
                {lesson.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{lesson.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {lesson.video_duration_seconds && (
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock size={12} />
                    {formatDuration(lesson.video_duration_seconds)}
                  </span>
                )}
                {lesson.downloadable_files?.length > 0 && (
                  <Download size={14} className="text-gray-600" />
                )}
                <Play size={16} className="text-[#F5C518]/60 group-hover:text-[#F5C518] transition-colors" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {lessons.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          Nenhuma aula disponivel neste modulo ainda.
        </div>
      )}
    </div>
  )
}
