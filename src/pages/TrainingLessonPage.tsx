import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, CheckCircle, Circle, Play, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import type { TrainingLesson, UserLessonProgress } from '@/types'
import { DEMO_TRAINING_LESSONS } from '@/config/demo-data'
import Spinner from '@/components/ui/Spinner'

export default function TrainingLessonPage() {
  const { courseId, moduleId, lessonId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<TrainingLesson | null>(null)
  const [progress, setProgress] = useState<UserLessonProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  useEffect(() => {
    if (isDemoMode) {
      const demoLesson = DEMO_TRAINING_LESSONS.find((l) => l.id === lessonId) || null
      setLesson(demoLesson)
      setLoading(false)
      return
    }
    if (!user || !lessonId || !moduleId) return
    Promise.all([
      supabase.from('training_lessons').select('*').eq('id', lessonId).single(),
      supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle(),
    ]).then(([lessonRes, progressRes]) => {
      setLesson(lessonRes.data)
      setProgress(progressRes.data)
      setLoading(false)
    })
  }, [user, lessonId, moduleId])

  const toggleComplete = async () => {
    if (isDemoMode) {
      // Toggle locally in demo
      setProgress((prev) =>
        prev
          ? { ...prev, completed: !prev.completed, completed_at: !prev.completed ? new Date().toISOString() : null }
          : {
              id: 'demo-progress',
              user_id: 'demo-user-001',
              lesson_id: lessonId || '',
              module_id: moduleId || '',
              completed: true,
              completed_at: new Date().toISOString(),
              last_watched_seconds: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
      )
      return
    }
    if (!user || !lessonId || !moduleId) return
    setToggling(true)
    const newCompleted = !progress?.completed

    if (progress) {
      const { data } = await supabase
        .from('user_lesson_progress')
        .update({ completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null })
        .eq('id', progress.id)
        .select()
        .single()
      if (data) setProgress(data)
    } else {
      const { data } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          module_id: moduleId,
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .select()
        .single()
      if (data) setProgress(data)
    }
    setToggling(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="text-center py-20 text-gray-500">Aula nao encontrada.</div>
  }

  const isCompleted = progress?.completed ?? false

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(`/training/${courseId}/${moduleId}`)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> Voltar ao modulo
      </motion.button>

      {/* Video placeholder or actual video */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {lesson.video_url ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center">
              <Play size={28} className="text-[#F5C518]/60 ml-1" />
            </div>
            <p className="text-sm text-gray-500">Video em breve</p>
          </div>
        )}
      </motion.div>

      {/* Title + Complete */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
          {lesson.description && <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>}
        </div>
        <button
          onClick={toggleComplete}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer active:scale-[0.97] shrink-0 min-h-[44px] ${
            isCompleted
              ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#F5C518]/30'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={18} /> Concluida
            </>
          ) : (
            <>
              <Circle size={18} /> Marcar como concluida
            </>
          )}
        </button>
      </motion.div>

      {/* Content HTML */}
      {lesson.content_html && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <div
            className="prose prose-sm prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: lesson.content_html }}
          />
        </motion.div>
      )}

      {/* Downloads */}
      {lesson.downloadable_files?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Download size={16} className="text-[#F5C518]" />
            Materiais para download
          </h3>
          <div className="space-y-2">
            {lesson.downloadable_files.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#F5C518]/20 transition-all cursor-pointer active:scale-[0.97] min-h-[44px]"
              >
                <FileText size={18} className="text-[#F5C518] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.size_bytes >= 1048576
                      ? `${(file.size_bytes / 1048576).toFixed(1)} MB`
                      : `${(file.size_bytes / 1024).toFixed(0)} KB`}
                  </p>
                </div>
                <span className="text-xs text-[#F5C518] font-medium uppercase">{file.type}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
