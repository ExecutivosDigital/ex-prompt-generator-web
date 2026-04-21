import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Trash2, ArrowLeft, Copy, Check, Sparkles, Bot, User as UserIcon, Wand2, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import * as chatApi from '@/lib/api/chat'
import type { ChatConversation, ChatMessage } from '@/types'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'

function CopyMsg({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer active:scale-90 transition-all">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="text-brand-gray-400" />}
      <span className={copied ? 'text-green-400' : 'text-brand-gray-400'}>{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}

const suggestions = [
  { icon: Wand2, text: 'Criar prompt de proposta comercial', color: 'from-amber-500/20 to-yellow-500/10' },
  { icon: Sparkles, text: 'Melhorar meu follow-up com leads', color: 'from-purple-500/20 to-pink-500/10' },
  { icon: Bot, text: 'Roteiro de Reels para Instagram', color: 'from-blue-500/20 to-cyan-500/10' },
  { icon: Clock, text: 'Automatizar tarefas repetitivas', color: 'from-green-500/20 to-emerald-500/10' },
]

export default function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'chat'>('list')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!user) return
    chatApi.listConversations()
      .then((data) => {
        // TODO (tech-debt): src/lib/api/chat.ts define interfaces locais
        // (camelCase) divergentes de src/types/chat.ts (snake_case). Unificar.
        setConversations((data || []) as unknown as ChatConversation[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!activeConversation) { setMessages([]); return }
    chatApi.getMessages(activeConversation)
      .then((data) => setMessages((data || []) as unknown as ChatMessage[]))
  }, [activeConversation])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamedText])

  const openConversation = (id: string) => {
    setActiveConversation(id)
    setView('chat')
  }

  const createConversation = async () => {
    if (!user) return
    const data = await chatApi.createConversation('Nova conversa')
    // TODO (tech-debt): ver comentário no useEffect acima sobre divergência de tipos
    if (data) { setConversations(prev => [data as unknown as ChatConversation, ...prev]); openConversation(data.id) }
  }

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await chatApi.deleteConversation(id)
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConversation === id) { setActiveConversation(null); setMessages([]); setView('list') }
  }

  const sendMessage = async (text?: string) => {
    const msg = text || input
    if (!msg.trim() || !user || streaming) return
    let convId = activeConversation

    if (!convId) {
      const data = await chatApi.createConversation(msg.slice(0, 50))
      // TODO (tech-debt): ver comentário no useEffect sobre divergência de tipos
      if (!data) return; convId = data.id; setConversations(prev => [data as unknown as ChatConversation, ...prev]); openConversation(data.id)
    }
    const userMsg: ChatMessage = { id: `temp-${Date.now()}`, conversation_id: convId, user_id: user.id, role: 'user', content: msg, tokens_used: null, model: null, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg]); setInput(''); setStreaming(true); setStreamedText('')
    try {
      let full = ''
      for await (const chunk of chatApi.streamMessage(convId, msg)) {
        full += chunk; setStreamedText(full)
      }
      const assistantMsg: ChatMessage = { id: `temp-${Date.now()+1}`, conversation_id: convId, user_id: user.id, role: 'assistant', content: full, tokens_used: null, model: null, created_at: new Date().toISOString() }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) { console.error(err) } finally { setStreaming(false); setStreamedText('') }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>

  // ===== LIST VIEW (conversations + welcome) =====
  if (view === 'list' || (!activeConversation && window.innerWidth >= 1024)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-5 animate-fade-in">
        {/* Hero */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-yellow/10">
            <Wand2 size={28} className="text-brand-yellow-dark" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-brand-black">Prompt Generator</h2>
          <p className="text-xs text-brand-gray-400 mt-1 max-w-sm mx-auto">
            Gere prompts profissionais em JSON, refine existentes ou crie novos para qualquer situacao.
          </p>
        </div>

        {/* Quick suggestions */}
        <div className="grid grid-cols-2 gap-2.5">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => { sendMessage(s.text) }}
              className="text-left glass-strong rounded-2xl p-4 cursor-pointer active:scale-[0.97] transition-all hover:shadow-md group"
            >
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2.5', s.color)}>
                <s.icon size={18} className="text-brand-black/60 group-hover:text-brand-black transition-colors" />
              </div>
              <p className="text-xs font-medium text-brand-black leading-snug">{s.text}</p>
            </motion.button>
          ))}
        </div>

        {/* New conversation button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={createConversation}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-yellow text-brand-black font-semibold text-sm hover:bg-brand-yellow-light transition-all cursor-pointer active:scale-[0.97] shadow-sm"
        >
          <Plus size={18} /> Nova conversa personalizada
        </motion.button>

        {/* History */}
        {conversations.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-brand-gray-400 uppercase tracking-wider mb-2 px-1">Historico</h3>
            <div className="space-y-1.5">
              {conversations.map(conv => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group glass rounded-2xl flex items-center gap-3 px-4 py-3.5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-sm"
                  onClick={() => openConversation(conv.id)}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 flex items-center justify-center shrink-0">
                    <Wand2 size={16} className="text-brand-yellow-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{conv.title}</p>
                    <p className="text-[10px] text-brand-gray-400">{conv.message_count} mensagens</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={e => deleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-brand-gray-400 transition-all cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-brand-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // ===== CHAT VIEW =====
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] -mx-4 lg:mx-0 animate-fade-in">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 glass-strong border-b border-white/20 shrink-0">
        <button onClick={() => { setView('list'); setActiveConversation(null) }}
          className="p-2 rounded-xl hover:bg-brand-gray-200/30 cursor-pointer active:scale-90 transition-all">
          <ArrowLeft size={18} />
        </button>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center">
          <Wand2 size={16} className="text-brand-yellow-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black truncate">
            {conversations.find(c => c.id === activeConversation)?.title || 'Prompt Generator'}
          </p>
          <p className="text-[10px] text-brand-gray-400">Powered by EX AI</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle pattern bg */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #F5C518 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative p-4 lg:p-6 space-y-4 min-h-full">
          {/* Empty state */}
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="glass-strong rounded-3xl p-6 max-w-xs">
                <Wand2 size={28} className="text-brand-yellow-dark mx-auto mb-3" />
                <p className="text-sm font-medium text-brand-black mb-1">Pronto para gerar</p>
                <p className="text-xs text-brand-gray-400">Digite o que voce precisa e receba um prompt JSON profissional.</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center shrink-0 mt-1">
                    <Wand2 size={13} className="text-brand-yellow-dark" />
                  </div>
                )}
                <div className={cn('max-w-[82%] lg:max-w-[70%]')}>
                  <div className={cn('rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand-black text-white rounded-br-md'
                      : 'glass-strong rounded-bl-md text-brand-black shadow-sm border border-white/30')}>
                    {/* Render code blocks nicely */}
                    {msg.content.includes('```') ? (
                      <div className="space-y-2">
                        {msg.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
                          if (part.startsWith('```')) {
                            const code = part.replace(/```\w*\n?/g, '').replace(/```$/g, '')
                            return (
                              <div key={i} className="relative rounded-xl bg-brand-black/[0.04] border border-brand-gray-200/50 overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 border-b border-brand-gray-200/30">
                                  <span className="text-[9px] font-mono text-brand-gray-400">json</span>
                                  <CopyMsg text={code.trim()} />
                                </div>
                                <pre className="px-3 py-2 text-[11px] font-mono text-brand-gray-600 overflow-x-auto whitespace-pre-wrap">{code.trim()}</pre>
                              </div>
                            )
                          }
                          return part ? <span key={i} className="whitespace-pre-wrap">{part}</span> : null
                        })}
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5 ml-1">
                      <CopyMsg text={msg.content} />
                      <span className="text-[9px] text-brand-gray-400">EX AI</span>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-brand-black flex items-center justify-center shrink-0 mt-1">
                    <UserIcon size={13} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming */}
          {streaming && streamedText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center shrink-0 mt-1">
                <Wand2 size={13} className="text-brand-yellow-dark" />
              </div>
              <div className="max-w-[82%] lg:max-w-[70%]">
                <div className="glass-strong rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-white/30">
                  <span className="whitespace-pre-wrap">{streamedText}</span>
                  <span className="inline-block w-1.5 h-4 bg-brand-yellow ml-0.5 animate-pulse rounded-sm" />
                </div>
              </div>
            </motion.div>
          )}

          {streaming && !streamedText && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center shrink-0">
                <Wand2 size={13} className="text-brand-yellow-dark" />
              </div>
              <div className="glass-strong rounded-2xl px-5 py-3.5 flex gap-1.5 shadow-sm border border-white/30">
                <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 glass-strong border-t border-white/20 p-3 lg:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2.5 max-w-3xl mx-auto">
          <div className="flex-1 glass-strong rounded-2xl overflow-hidden border border-brand-gray-200/30 focus-within:border-brand-yellow focus-within:shadow-[0_0_0_3px_rgba(245,197,24,0.1)] transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px' } }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Descreva o prompt que voce precisa..."
              className="w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-none min-h-[44px] max-h-[120px] placeholder:text-brand-gray-400"
              rows={1}
            />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || streaming}
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0',
              input.trim() && !streaming
                ? 'bg-brand-yellow text-brand-black shadow-md shadow-brand-yellow/20 hover:shadow-lg hover:shadow-brand-yellow/30'
                : 'bg-brand-gray-200 text-brand-gray-400'
            )}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
