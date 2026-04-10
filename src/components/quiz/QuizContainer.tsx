import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { submitQuiz } from '@/lib/api/quiz'
import { generateSkills } from '@/lib/api/skills'
import { generatePrompts } from '@/lib/api/prompts'
import { quizQuestions } from '@/config/quiz-questions'
import type { QuizResponses, QuizAnswer, PromptCategory } from '@/types'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'

// Question type components
import InfoSlide from './question-types/InfoSlide'
import TextQuestion from './question-types/TextQuestion'
import YesNoQuestion from './question-types/YesNoQuestion'
import SingleChoice from './question-types/SingleChoice'
import MultiChoice from './question-types/MultiChoice'
import RankOrder from './question-types/RankOrder'
import MediaSlide from './question-types/MediaSlide'
import BlockHeader from './question-types/BlockHeader'

export default function QuizContainer() {
  const { user, refreshProfile, setProfile } = useAuth()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [answers, setAnswers] = useState<QuizResponses>({})
  const [direction, setDirection] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const visibleQuestions = useMemo(
    () => quizQuestions.filter(q => !q.showIf || q.showIf(answers)),
    [answers]
  )

  const question = visibleQuestions[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === visibleQuestions.length - 1
  // Block headers don't count toward progress
  const questionSlides = visibleQuestions.filter(q => q.type !== 'block_header')
  const currentQuestionIndex = questionSlides.indexOf(question)
  const progress = question?.type === 'block_header'
    ? ((currentQuestionIndex >= 0 ? currentQuestionIndex : questionSlides.indexOf(visibleQuestions[currentSlide - 1])) + 1) / questionSlides.length * 100
    : ((currentQuestionIndex + 1) / questionSlides.length) * 100

  const canAdvance = useCallback(() => {
    if (!question) return false
    if (!question.required && ['info', 'media', 'block_header'].includes(question.type)) return true
    const answer = answers[question.id]
    if (question.type === 'info' || question.type === 'media' || question.type === 'block_header') return true
    if (question.type === 'text') return typeof answer === 'string' && answer.trim().length > 0
    if (question.type === 'yes_no') return answer !== undefined && answer !== null
    if (question.type === 'single_choice') return !!answer
    if (question.type === 'multi_choice') return Array.isArray(answer) && answer.length > 0
    if (question.type === 'rank_order') return true
    return true
  }, [question, answers])

  const setAnswer = (value: QuizAnswer) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const goNext = async () => {
    // Auto-save default order for rank_order if user didn't interact
    if (question.type === 'rank_order' && !answers[question.id] && question.items) {
      setAnswers(prev => ({ ...prev, [question.id]: question.items! }))
    }

    if (isLast) {
      await processQuiz()
      return
    }
    setDirection(1)
    setCurrentSlide(prev => Math.min(prev + 1, visibleQuestions.length - 1))
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const processQuiz = async () => {
    console.log('[QuizContainer] processQuiz called, user:', user)
    if (!user) {
      console.error('[QuizContainer] No user found, aborting')
      return
    }
    setProcessing(true)

    try {
      // Step 1: Save quiz responses
      setProcessingStep('Salvando suas respostas...')
      console.log('[QuizContainer] Step 1: Saving quiz...')
      const painPoints = Array.isArray(answers.automate_wishes) ? answers.automate_wishes as string[] : []
      const quizResponse = await submitQuiz(answers, painPoints)
      console.log('[QuizContainer] Quiz saved:', quizResponse.id)

      // Step 2: Generate skills (backend calls AI)
      setProcessingStep('Analisando seu perfil...')
      console.log('[QuizContainer] Step 2: Generating skills...')
      await generateSkills(quizResponse.id)
      console.log('[QuizContainer] Skills generated')

      // Step 3: Generate prompts (backend calls AI using skills)
      setProcessingStep('Gerando seus prompts personalizados...')
      console.log('[QuizContainer] Step 3: Generating prompts...')
      await generatePrompts(quizResponse.id)
      console.log('[QuizContainer] Prompts generated')

      // Step 4: Refresh profile (backend already updated quiz_completed + prompts_generated)
      setProcessingStep('Finalizando...')
      await refreshProfile()
      console.log('[QuizContainer] Done! Navigating to /prompts')
      navigate('/prompts')
    } catch (error) {
      console.error('[QuizContainer] Error:', error)
      setProcessingStep('Ocorreu um erro. Tente novamente.')
      setTimeout(() => setProcessing(false), 3000)
    }
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'info':
        return <InfoSlide question={question} />
      case 'text':
        return <TextQuestion question={question} value={(answers[question.id] as string) || ''} onChange={setAnswer} />
      case 'yes_no':
        return <YesNoQuestion question={question} value={answers[question.id] as boolean | null} onChange={setAnswer} />
      case 'single_choice':
        return <SingleChoice question={question} value={(answers[question.id] as string) || ''} onChange={setAnswer} />
      case 'multi_choice':
        return <MultiChoice question={question} value={(answers[question.id] as string[]) || []} onChange={setAnswer} maxSelections={question.maxSelections} />
      case 'rank_order':
        return <RankOrder question={question} value={(answers[question.id] as string[]) || question.items || []} onChange={setAnswer} />
      case 'media':
        return <MediaSlide question={question} />
      case 'block_header':
        return <BlockHeader question={question} />
      default:
        return null
    }
  }

  // Enter para avancar
  const goNextRef = useRef(goNext)
  const canAdvanceRef = useRef(canAdvance)
  goNextRef.current = goNext
  canAdvanceRef.current = canAdvance

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !processing && canAdvanceRef.current()) {
        e.preventDefault()
        goNextRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [processing])

  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GlassCard variant="strong" padding="lg" className="max-w-md w-full text-center">
          <Loader2 size={48} className="text-brand-yellow animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-brand-black mb-2">Processando...</h2>
          <p className="text-sm text-brand-gray-400">{processingStep}</p>
          <div className="mt-6">
            <Progress value={
              processingStep.includes('Salvando') ? 25 :
              processingStep.includes('Analisando') ? 50 :
              processingStep.includes('Gerando') ? 75 :
              processingStep.includes('Finalizando') ? 95 : 10
            } />
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-4 min-[390px]:mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-brand-gray-400">
            {currentSlide + 1} de {visibleQuestions.length}
          </span>
          <span className="text-[11px] text-brand-gray-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} size="sm" />
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <GlassCard variant="strong" padding="none" className="p-4 min-[390px]:p-5 lg:p-8 min-h-[260px] min-[390px]:min-h-[300px] flex flex-col justify-center">
            {renderQuestion()}
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 min-[390px]:mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={isFirst}
          className={isFirst ? 'invisible' : ''}
        >
          <ArrowLeft size={16} /> <span className="hidden min-[390px]:inline">Voltar</span>
        </Button>

        <Button
          onClick={goNext}
          disabled={!canAdvance()}
          size="md"
          className="min-[390px]:!text-base min-[390px]:!px-6 min-[390px]:!py-3"
        >
          {isLast ? 'Gerar prompts' : 'Continuar'} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
