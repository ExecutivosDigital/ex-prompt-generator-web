import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import type { TrainingCourse, TrainingModule } from '@/types'
import { DEMO_TRAINING_COURSES, DEMO_TRAINING_MODULES } from '@/config/demo-data'
import Spinner from '@/components/ui/Spinner'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export default function TrainingCoursePage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<TrainingCourse | null>(null)
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  useEffect(() => {
    if (isDemoMode) {
      const demoCourse = DEMO_TRAINING_COURSES.find((c) => c.id === courseId) || null
      const demoModules = DEMO_TRAINING_MODULES.filter((m) => m.course_id === courseId)
      setCourse(demoCourse)
      setModules(demoModules)
      setLoading(false)
      return
    }
    if (!user || !courseId) return
    Promise.all([
      supabase.from('training_courses').select('*').eq('id', courseId).single(),
      supabase
        .from('training_modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('sort_order'),
    ]).then(([courseRes, modulesRes]) => {
      setCourse(courseRes.data)
      setModules(modulesRes.data || [])
      setLoading(false)
    })
  }, [user, courseId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-20 text-gray-500">Curso nao encontrado.</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/training')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> Voltar aos cursos
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
      >
        <h2 className="text-2xl font-bold text-white mb-1">{course.title}</h2>
        {course.description && <p className="text-sm text-gray-400 mb-3">{course.description}</p>}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen size={14} />
          <span>{modules.length} modulos</span>
        </div>
      </motion.div>

      {/* Module List */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            variants={item}
            onClick={() => navigate(`/training/${courseId}/${mod.id}`)}
            className="group flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-4 cursor-pointer active:scale-[0.97] transition-all duration-200 hover:border-[#F5C518]/30 hover:shadow-[0_0_20px_rgba(245,197,24,0.05)]"
          >
            {/* Number badge */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center text-[#F5C518] text-sm font-bold">
              {String(idx + 1).padStart(2, '0')}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-[#F5C518] transition-colors truncate">
                {mod.title}
              </h3>
              {mod.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{mod.description}</p>
              )}
              <span className="text-xs text-gray-600 mt-1 inline-block">
                {mod.lesson_count} aulas
              </span>
            </div>

            <ChevronRight
              size={18}
              className="shrink-0 text-gray-600 group-hover:text-[#F5C518] transition-colors"
            />
          </motion.div>
        ))}
      </motion.div>

      {modules.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          Nenhum modulo disponivel neste curso ainda.
        </div>
      )}
    </div>
  )
}
