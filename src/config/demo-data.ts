import type { GeneratedPrompt, UserSkill, ChatConversation, ChatMessage, TrainingCourse, TrainingModule, TrainingLesson } from '@/types'

export const DEMO_SKILL: UserSkill = {
  id: 'demo-skill-1',
  user_id: 'demo-user-001',
  skill_name: 'Gestor Pratico em Evolucao',
  skill_description: 'Profissional com perfil orientado a resultados, forte em lideranca e tomada de decisao. Trava em analise de dados e automacao. A IA pode potencializar sua produtividade e resolver lacunas tecnicas.',
  competency_indicators: [
    { name: 'Lideranca', score: 85 },
    { name: 'Comunicacao', score: 80 },
    { name: 'Tomada de Decisao', score: 78 },
    { name: 'Analise de Dados', score: 45 },
    { name: 'Automacao', score: 40 },
    { name: 'Uso de IA', score: 55 },
  ],
  strengths: ['Lideranca pratica', 'Tomada de decisao rapida', 'Gestao de equipe', 'Comunicacao direta'],
  growth_areas: ['Analise de dados e planilhas', 'Automacao de processos', 'Uso estrategico de IA'],
  recommended_focus: ['Produtividade', 'Analise de Dados', 'Automacao'],
  ai_model: 'anthropic/claude-3.5-sonnet',
  raw_response: null,
  quiz_response_id: null,
  created_at: new Date().toISOString(),
}

export const DEMO_PROMPTS: GeneratedPrompt[] = [
  {
    id: 'dp-1', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'comunicacao', prompt_index: 1,
    situation: 'Proposta comercial personalizada para cliente',
    prompt_text: 'Aja como um consultor de vendas especializado em agencias de marketing digital. Escreva uma proposta comercial para um potencial cliente que tem uma loja online de moda feminina, fatura aproximadamente R$80k/mes e quer aumentar o retorno sobre investimento em midia paga. O tom deve ser profissional mas direto. Estruture com: diagnostico do cenario atual, solucao proposta com escopo, cronograma, investimento com justificativa de valor e proximos passos. Maximo 1 pagina.',
    variations: [
      { context: 'Para projeto pontual', prompt: 'Adapte a proposta para um projeto de escopo fechado com entrega em 30 dias...' },
      { context: 'Para contrato recorrente', prompt: 'Adapte a proposta para um modelo de mensalidade com resultados progressivos...' }
    ],
    golden_tip: 'Copie 2-3 frases que o cliente usou na conversa inicial e cole no inicio da proposta. Quando ele le as proprias palavras, a taxa de fechamento sobe.',
    estimated_time_saved: '45min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-2', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'comunicacao', prompt_index: 2,
    situation: 'Responder pedido de desconto sem perder o cliente',
    prompt_text: 'Um cliente pediu desconto no pacote de R$2.500/mes. Escreva uma resposta que: (1) valide a preocupacao dele sem concordar, (2) reforce o valor do que ele recebe comparado ao resultado que vai gerar, (3) ofereca uma alternativa — ajustar o escopo em vez do preco, (4) feche com um proximo passo claro. Tom: profissional e firme, nunca agressivo. Canal: WhatsApp, entao seja breve — maximo 8 linhas.',
    variations: [
      { context: 'Para cliente novo', prompt: 'Foco em construir confianca e mostrar resultados de outros clientes...' },
      { context: 'Para cliente antigo', prompt: 'Foco em reter sem desvalorizar, mencionando historico de resultados...' }
    ],
    golden_tip: 'Nunca diga "nao posso dar desconto". Diga "posso ajustar o escopo para caber nesse valor".',
    estimated_time_saved: '20min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-3', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'comunicacao', prompt_index: 3,
    situation: 'Follow-up para lead que nao respondeu',
    prompt_text: 'Sou consultor de marketing digital. Um lead pediu orcamento por WhatsApp ha 6 dias e nao respondeu. Escreva uma mensagem de follow-up que: (1) nao pareca desesperada, (2) agregue valor — mencione algo util, (3) deixe a porta aberta sem pressionar, (4) tenha um motivo real para o contato. Tom: casual e direto. Maximo 5 linhas.',
    variations: [
      { context: 'Pos-reuniao', prompt: 'Follow-up apos ter enviado proposta e estar esperando retorno...' },
      { context: 'Lead de 30+ dias', prompt: 'Reativacao de lead antigo com abordagem leve...' }
    ],
    golden_tip: 'O melhor follow-up nao pergunta "e ai, pensou?". Ele entrega algo: um dado novo, um case relevante.',
    estimated_time_saved: '15min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-4', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'produtividade', prompt_index: 4,
    situation: 'Responder reclamacao de cliente com empatia',
    prompt_text: 'Um cliente reclamou que o relatorio mensal atrasou 3 dias. Escreva uma resposta profissional que: (1) reconheca o erro sem desculpas excessivas, (2) explique o que aconteceu de forma transparente, (3) apresente uma solucao concreta, (4) ofereca algo extra como compensacao. Tom: empatico e resolutivo. Canal: email.',
    variations: [
      { context: 'Reclamacao publica', prompt: 'Adapte para resposta em rede social, mais concisa e direcionando para DM...' },
      { context: 'Cliente VIP', prompt: 'Adapte com tom mais pessoal, oferecendo call para alinhar...' }
    ],
    golden_tip: 'Sempre responda reclamacoes em menos de 2 horas. A velocidade da resposta importa mais que a perfeicao do texto.',
    estimated_time_saved: '25min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-5', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'automacao', prompt_index: 5,
    situation: 'Criar 10 ideias de post para Instagram',
    prompt_text: 'Sou dono de uma agencia de marketing digital para e-commerces. Crie 10 ideias de post para Instagram que: (1) misturem educacao e entretenimento, (2) usem formatos variados (carrossel, reels, stories, post unico), (3) tenham hooks fortes na primeira frase, (4) incluam CTA claro. Nicho: marketing para lojas online. Tom: casual-profissional.',
    variations: [
      { context: 'Para LinkedIn', prompt: 'Adapte para formato mais longo e profissional do LinkedIn...' },
      { context: 'Para semana de lancamento', prompt: 'Adapte focando em urgencia e escassez para semana de lancamento...' }
    ],
    golden_tip: 'Poste o conteudo educativo entre 11h-13h. Conteudo de entretenimento performa melhor apos 18h.',
    estimated_time_saved: '60min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-6', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'automacao', prompt_index: 6,
    situation: 'Roteiro de Reels de 30 segundos',
    prompt_text: 'Crie um roteiro de Reels de 30 segundos sobre "3 erros que e-commerces cometem com trafego pago". Estrutura: gancho nos primeiros 3 segundos, 3 erros rapidos com solucao, CTA final. Tom: direto, sem enrolacao. Formato: texto para eu gravar falando.',
    variations: [
      { context: 'Formato texto na tela', prompt: 'Adapte para formato so com texto na tela e musica de fundo...' },
      { context: 'Formato mais longo (60s)', prompt: 'Expanda para 60 segundos com mais detalhes em cada erro...' }
    ],
    golden_tip: 'Os primeiros 3 segundos definem se a pessoa assiste. Comece com "Voce esta jogando dinheiro fora se..." em vez de "Oi gente, hoje eu vou falar sobre...".',
    estimated_time_saved: '30min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-7', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'produtividade', prompt_index: 7,
    situation: 'Transformar reuniao em ata com acoes claras',
    prompt_text: 'Transforme esta transcricao de reuniao em uma ata estruturada com: (1) Resumo executivo (3 linhas), (2) Decisoes tomadas, (3) Acoes com responsavel e prazo, (4) Proximos passos. Formato: markdown limpo para colar no Notion. [Cole a transcricao aqui]',
    variations: [
      { context: 'Reuniao de kick-off', prompt: 'Adapte para formato de kick-off com escopo, cronograma e expectativas...' },
      { context: 'Reuniao rapida (15min)', prompt: 'Formato ultra-resumido: so decisoes e acoes, sem resumo...' }
    ],
    golden_tip: 'Sempre envie a ata em ate 1 hora apos a reuniao. Depois disso, as pessoas esquecem o contexto.',
    estimated_time_saved: '40min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
  {
    id: 'dp-8', user_id: 'demo-user-001', quiz_response_id: null,
    category: 'analise_dados', prompt_index: 8,
    situation: 'Analise de precificacao do servico',
    prompt_text: 'Sou dono de uma agencia de marketing digital com 5 funcionarios. Faturamento: R$60k/mes. Custos fixos: R$28k. Ajude-me a analisar se meu preco de R$2.500/cliente esta adequado. Considere: margem de lucro ideal (30-40%), tempo gasto por cliente (20h/mes), valor de mercado na regiao, e sugestao de pacotes (basico, intermediario, premium).',
    variations: [
      { context: 'Para freelancer solo', prompt: 'Adapte calculo considerando que o unico custo e o proprio tempo...' },
      { context: 'Para escalar', prompt: 'Adapte considerando contratacao de mais 2 pessoas e meta de 20 clientes...' }
    ],
    golden_tip: 'Nunca precifique pelo tempo. Precifique pelo resultado. Se voce gera R$50k de faturamento para o cliente, R$2.500 e barato.',
    estimated_time_saved: '50min', ai_model: 'claude-3.5-sonnet', generation_batch_id: null, created_at: new Date().toISOString(),
  },
]

export const DEMO_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'demo-conv-1',
    user_id: 'demo-user-001',
    title: 'Melhorar prompt de vendas',
    model: 'anthropic/claude-3.5-sonnet',
    message_count: 2,
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-msg-1', conversation_id: 'demo-conv-1', user_id: 'demo-user-001',
    role: 'user', content: 'Como posso melhorar o prompt de proposta comercial para ficar mais persuasivo?',
    tokens_used: null, model: null, created_at: new Date().toISOString(),
  },
  {
    id: 'demo-msg-2', conversation_id: 'demo-conv-1', user_id: 'demo-user-001',
    role: 'assistant',
    content: 'Para tornar seu prompt de proposta comercial mais persuasivo, adicione estas 3 melhorias:\n\n1. **Inclua numeros concretos** — "aumentou o ROAS de 2.1x para 4.7x em 90 dias" e mais forte que "melhorou os resultados"\n\n2. **Use a tecnica de ancoragem** — Antes de revelar o investimento, mencione quanto o cliente perderia sem a solucao\n\n3. **Adicione prova social** — "Esse mesmo framework gerou R$180k para a [cliente similar]"\n\nQuer que eu reescreva o prompt completo com essas melhorias?',
    tokens_used: 150, model: 'anthropic/claude-3.5-sonnet', created_at: new Date().toISOString(),
  },
]

export const DEMO_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'course-1', title: 'IA na Pratica para Negocios', description: 'Domine o uso de inteligencia artificial no seu dia a dia profissional. Do basico ao avancado.',
    thumbnail_url: null, sort_order: 1, module_count: 3, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'course-2', title: 'Funnels de Vendas com IA', description: 'Construa funis de vendas automatizados usando IA para cada etapa do processo.',
    thumbnail_url: null, sort_order: 2, module_count: 4, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const DEMO_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'demo-mod-1', course_id: 'course-1', title: 'Introducao ao uso de IA', description: 'Aprenda os fundamentos de como usar IA no seu negocio para economizar tempo e aumentar resultados.',
    thumbnail_url: null, sort_order: 1, lesson_count: 4, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-mod-2', course_id: 'course-1', title: 'Dominando Prompts de Vendas', description: 'Tecnicas avancadas para criar prompts que convertem leads em clientes.',
    thumbnail_url: null, sort_order: 2, lesson_count: 3, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-mod-3', course_id: 'course-1', title: 'Automacoes com ChatGPT', description: 'Como automatizar tarefas repetitivas usando IA e integracoes simples.',
    thumbnail_url: null, sort_order: 3, lesson_count: 5, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const DEMO_TRAINING_LESSONS: TrainingLesson[] = [
  { id: 'lesson-1', module_id: 'demo-mod-1', title: 'O que e IA e por que importa', description: 'Conceitos fundamentais de inteligencia artificial', video_url: null, video_duration_seconds: 720, content_html: null, downloadable_files: [{ name: 'Slides da aula', url: '#', size_bytes: 2048000, type: 'pdf' }], sort_order: 1, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-2', module_id: 'demo-mod-1', title: 'Configurando ChatGPT e Claude', description: 'Passo a passo para configurar as principais IAs', video_url: null, video_duration_seconds: 540, content_html: null, downloadable_files: [], sort_order: 2, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-3', module_id: 'demo-mod-1', title: 'Seu primeiro prompt profissional', description: 'Criando prompts que realmente funcionam', video_url: null, video_duration_seconds: 900, content_html: null, downloadable_files: [{ name: 'Template de prompts', url: '#', size_bytes: 512000, type: 'pdf' }], sort_order: 3, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-4', module_id: 'demo-mod-1', title: 'Erros comuns e como evitar', description: 'Os 10 erros que todo iniciante comete', video_url: null, video_duration_seconds: 660, content_html: null, downloadable_files: [], sort_order: 4, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]
