import type { QuizQuestion } from '@/types/quiz'

export const quizQuestions: QuizQuestion[] = [
  // Slide 1 - Welcome
  {
    id: 'welcome',
    type: 'info',
    title: 'Vamos descobrir como a IA pode te ajudar',
    subtitle:
      'Responda algumas perguntas sobre voce e sua rotina. Leva cerca de 5 minutos.',
    icon: 'sparkles',
  },

  // ========================================
  // BLOCO 1 — NIVEL REAL DE HABILIDADE
  // ========================================
  {
    id: 'block_1',
    type: 'block_header',
    blockEmoji: '🧠',
    blockTitle: 'Nivel Real de Habilidade',
    subtitle: 'Sem maquiagem — queremos entender de verdade onde voce esta.',
  },

  {
    id: 'tool_avoidance',
    type: 'yes_no',
    question: 'Voce ja deixou de fazer algo importante por nao saber como usar alguma ferramenta (Excel, sistema, IA, etc)?',
  },

  {
    id: 'learning_style',
    type: 'single_choice',
    question: 'Quando voce precisa aprender algo novo no trabalho, voce normalmente:',
    options: [
      { value: 'self_taught', label: 'Aprende sozinho testando', icon: 'flask-conical' },
      { value: 'tutorial', label: 'Procura tutorial', icon: 'youtube' },
      { value: 'asks_help', label: 'Pede ajuda', icon: 'hand-helping' },
      { value: 'avoids', label: 'Evita fazer', icon: 'circle-x' },
    ],
  },

  {
    id: 'difficulty_area',
    type: 'single_choice',
    question: 'Qual dessas areas voce sente mais dificuldade hoje?',
    options: [
      { value: 'organization', label: 'Organizacao de tarefas', icon: 'list-checks' },
      { value: 'data_analysis', label: 'Analise de dados (Excel, numeros, relatorios)', icon: 'bar-chart-3' },
      { value: 'communication', label: 'Comunicacao (escrever, explicar, apresentar)', icon: 'message-square' },
      { value: 'technology', label: 'Tecnologia (sistemas, IA, ferramentas)', icon: 'monitor-smartphone' },
      { value: 'decision_making', label: 'Tomada de decisao', icon: 'scale' },
    ],
  },

  {
    id: 'tech_comfort',
    type: 'text',
    question: 'De 0 a 10, quanto voce se considera confortavel com tecnologia?',
    placeholder: 'Ex: 7',
    subtitle: '0 = nenhum conforto, 10 = totalmente confortavel.',
  },

  // ========================================
  // BLOCO 2 — DORES QUE NORMALMENTE NAO SAO DITAS
  // ========================================
  {
    id: 'block_2',
    type: 'block_header',
    blockEmoji: '😬',
    blockTitle: 'Dores que Normalmente Nao Sao Ditas',
    subtitle: 'Aqui e so entre nos. Suas respostas sao confidenciais.',
  },

  {
    id: 'faked_understanding',
    type: 'yes_no',
    question: 'Voce ja fingiu que entendeu algo no trabalho quando na verdade nao entendeu?',
  },

  {
    id: 'discomfort_situation',
    type: 'single_choice',
    question: 'Qual situacao mais te causa desconforto hoje?',
    options: [
      { value: 'spreadsheets', label: 'Trabalhar com planilhas', icon: 'table-2' },
      { value: 'meetings', label: 'Falar em reunioes', icon: 'users' },
      { value: 'writing', label: 'Escrever algo importante', icon: 'pen-line' },
      { value: 'documents', label: 'Analisar documentos/contratos', icon: 'file-search' },
      { value: 'new_tools', label: 'Usar ferramentas novas', icon: 'puzzle' },
    ],
  },

  {
    id: 'avoided_task',
    type: 'text',
    question: 'O que voce mais evita fazer, mas sabe que deveria?',
    placeholder: 'Descreva com suas palavras...',
    subtitle: 'Pode ser qualquer coisa — uma tarefa, uma conversa, uma decisao.',
  },

  {
    id: 'below_expected_skill',
    type: 'yes_no',
    question: 'Voce sente que esta abaixo do nivel esperado em alguma habilidade profissional?',
  },

  {
    id: 'which_skill',
    type: 'text',
    question: 'Qual habilidade voce sente que esta abaixo do esperado?',
    placeholder: 'Ex: Excel, apresentacoes, gestao de tempo...',
    showIf: (answers) => answers.below_expected_skill === true,
  },

  // ========================================
  // BLOCO 3 — TRAVAS E MEDOS REAIS
  // ========================================
  {
    id: 'block_3',
    type: 'block_header',
    blockEmoji: '🚧',
    blockTitle: 'Travas e Medos Reais',
    subtitle: 'Entender o que te trava e o primeiro passo para destravar.',
  },

  {
    id: 'biggest_fear',
    type: 'single_choice',
    question: 'Qual e o seu maior medo no ambiente profissional hoje?',
    options: [
      { value: 'judged', label: 'Errar e ser julgado', icon: 'eye' },
      { value: 'behind', label: 'Nao conseguir acompanhar os outros', icon: 'timer' },
      { value: 'replaced', label: 'Ser substituido', icon: 'user-x' },
      { value: 'incompetent', label: 'Parecer incompetente', icon: 'alert-triangle' },
    ],
  },

  {
    id: 'lost_opportunity',
    type: 'yes_no',
    question: 'Voce ja perdeu uma oportunidade por nao saber fazer algo tecnico?',
  },

  {
    id: 'one_difficulty_to_solve',
    type: 'text',
    question: 'Se voce pudesse resolver UMA dificuldade imediatamente, qual seria?',
    placeholder: 'Descreva a dificuldade que mais te atrapalha...',
  },

  // ========================================
  // BLOCO 4 — CONTEXTO PROFISSIONAL
  // ========================================
  {
    id: 'block_4',
    type: 'block_header',
    blockEmoji: '💼',
    blockTitle: 'Contexto Profissional',
    subtitle: 'Para entender melhor a sua realidade no dia a dia.',
  },

  {
    id: 'work_routine',
    type: 'single_choice',
    question: 'Qual melhor descreve sua rotina?',
    options: [
      { value: 'administrative', label: 'Administrativo', icon: 'clipboard-list' },
      { value: 'sales', label: 'Comercial/Vendas', icon: 'handshake' },
      { value: 'technical', label: 'Tecnico/Operacional', icon: 'wrench' },
      { value: 'management', label: 'Gestao/Lideranca', icon: 'crown' },
      { value: 'entrepreneur', label: 'Autonomo/Empreendedor', icon: 'rocket' },
    ],
  },

  {
    id: 'data_frequency',
    type: 'single_choice',
    question: 'Com que frequencia voce precisa lidar com dados (numeros, relatorios, planilhas)?',
    options: [
      { value: 'never', label: 'Nunca', icon: 'circle-off' },
      { value: 'sometimes', label: 'As vezes', icon: 'clock' },
      { value: 'frequently', label: 'Frequentemente', icon: 'flame' },
      { value: 'daily', label: 'Todos os dias', icon: 'calendar-check' },
    ],
  },

  {
    id: 'ai_usage',
    type: 'single_choice',
    question: 'Voce ja usa IA (como ChatGPT) no seu trabalho?',
    options: [
      { value: 'frequently', label: 'Sim, frequentemente', icon: 'brain' },
      { value: 'sometimes', label: 'Sim, as vezes', icon: 'zap' },
      { value: 'tried_poorly', label: 'Ja tentei, mas nao sei usar direito', icon: 'circle-help' },
      { value: 'never', label: 'Nunca usei', icon: 'circle-x' },
    ],
  },

  // ========================================
  // BLOCO 5 — USO PRATICO
  // ========================================
  {
    id: 'block_5',
    type: 'block_header',
    blockEmoji: '⚙️',
    blockTitle: 'Uso Pratico',
    subtitle: 'Aqui e onde seus prompts personalizados comecam a tomar forma.',
  },

  {
    id: 'automate_wishes',
    type: 'multi_choice',
    question: 'O que voce gostaria que fosse feito automaticamente pra voce?',
    subtitle: 'Selecione quantos quiser',
    options: [
      { value: 'spreadsheets', label: 'Criar planilhas' },
      { value: 'texts_emails', label: 'Escrever textos/e-mails' },
      { value: 'documents', label: 'Analisar documentos' },
      { value: 'reports', label: 'Gerar relatorios' },
      { value: 'technical', label: 'Resolver problemas tecnicos' },
      { value: 'everything', label: 'Tudo isso 😅' },
    ],
  },

  {
    id: 'ai_result_quality',
    type: 'single_choice',
    question: 'Quando voce tenta usar IA hoje, o que mais acontece?',
    options: [
      { value: 'works_well', label: 'Funciona bem', icon: 'check-circle' },
      { value: 'sometimes_works', label: 'As vezes funciona', icon: 'minus-circle' },
      { value: 'bad_results', label: 'Respostas ruins/genericas', icon: 'x-circle' },
      { value: 'dont_know_what', label: 'Nao sei o que pedir', icon: 'help-circle' },
    ],
  },

  {
    id: 'cant_prompt_well',
    type: 'yes_no',
    question: 'Voce sente que nao sabe "pedir direito" para a IA?',
  },

  // ========================================
  // BLOCO 6 — EXTRACAO PROFUNDA
  // ========================================
  {
    id: 'block_6',
    type: 'block_header',
    blockEmoji: '🧩',
    blockTitle: 'Extracao Profunda',
    subtitle: 'Suas respostas aqui sao ouro — quanto mais detalhe, melhor o resultado.',
  },

  {
    id: 'difficult_task',
    type: 'text',
    question: 'Descreva uma tarefa recente que voce teve dificuldade em fazer:',
    placeholder: 'Ex: Montar um relatorio financeiro para o chefe...',
  },

  {
    id: 'perfect_assistant',
    type: 'text',
    question: 'Se voce tivesse um "assistente perfeito", o que ele faria por voce no dia a dia?',
    placeholder: 'Descreva as tarefas que voce delegaria...',
  },

  {
    id: 'ashamed_to_learn',
    type: 'text',
    question: 'O que voce gostaria de aprender, mas tem vergonha de admitir?',
    placeholder: 'Aqui nao tem julgamento. Pode ser sincero.',
  },

  // Slide Final - Completion
  {
    id: 'completion',
    type: 'info',
    title: 'Preparando seus resultados...',
    subtitle:
      'A IA esta analisando seu perfil e criando prompts personalizados para voce.',
    icon: 'loader',
  },
]
