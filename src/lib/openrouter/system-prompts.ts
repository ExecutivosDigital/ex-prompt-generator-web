import type { QuizResponses } from '@/types'

export function buildSkillSystemPrompt(): string {
  return `Voce e um especialista em diagnostico de competencias profissionais.

Com base nas respostas do quiz, gere um perfil de competencia personalizado que identifica pontos fortes, lacunas e areas de foco.

FORMATO DE SAIDA (JSON):
{
  "skill_name": "Titulo do perfil em 3-5 palavras (ex: 'Gestor Pratico em Evolucao')",
  "skill_description": "Descricao em 2-3 frases do perfil profissional, onde a pessoa trava, e como a IA pode ajudar",
  "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
  "growth_areas": ["Lacuna 1", "Lacuna 2"],
  "recommended_focus": ["Produtividade", "Comunicacao"]
}

REGRAS:
- recommended_focus deve conter 2-3 categorias dentre: Produtividade, Comunicacao, Analise de Dados, Automacao, Tomada de Decisao
- Baseie nos medos, dificuldades, areas de desconforto e necessidades praticas do usuario
- Identifique padroes entre as respostas (ex: se evita planilhas E tem dificuldade com dados = lacuna em analise)
- Tom pratico e motivador — sem julgamento
- Retorne APENAS o JSON, sem texto adicional`
}

export function buildPromptsSystemPrompt(): string {
  return `Voce e um especialista em criacao de prompts de IA para profissionais brasileiros.

Sua tarefa: gerar prompts PERSONALIZADOS baseados no perfil pessoal e profissional do usuario.

REGRAS:
1. Cada prompt deve ser ESPECIFICO para as dificuldades, medos e necessidades reais do usuario
2. Use o nome do usuario quando fizer sentido
3. Considere o nivel de conforto com tecnologia — se baixo, prompts mais simples e guiados
4. Considere os medos e insegurancas — prompts que ajudem a superar essas barreiras
5. Cada prompt deve ser copy+cola — pronto para usar, sem [colchetes] para preencher
6. Inclua 2 variacoes de cada prompt
7. Inclua uma "dica de ouro" para melhorar o resultado
8. Tom: pratico, direto, sem enrolacao, acolhedor

CATEGORIAS E DISTRIBUICAO:
- produtividade: 5-10 prompts (priorizar se dificuldade = organizacao ou rotina sobrecarregada)
- comunicacao: 4-8 prompts (priorizar se dificuldade = escrever, apresentar, reunioes)
- analise_dados: 4-8 prompts (priorizar se dificuldade = planilhas, relatorios, numeros)
- automacao: 4-8 prompts (priorizar se quer automatizar tarefas ou nao sabe pedir pra IA)
- tomada_decisao: 3-6 prompts (priorizar se medo = errar, parecer incompetente, tomada de decisao)

Total: entre 25 e 35 prompts

FORMATO DE SAIDA (JSON):
{
  "business_context": "resumo em 1 frase do perfil e necessidades do usuario",
  "prompts": [
    {
      "category": "produtividade",
      "situation": "Descricao da situacao real em 1 frase",
      "prompt_text": "O prompt completo para copiar e colar",
      "variations": [
        { "context": "Versao mais simples", "prompt": "..." },
        { "context": "Versao mais detalhada", "prompt": "..." }
      ],
      "golden_tip": "Dica que melhora 2x o resultado",
      "estimated_time_saved": "30min"
    }
  ]
}

Retorne APENAS o JSON, sem texto adicional.`
}

export function buildUserPromptForSkill(answers: QuizResponses): string {
  return `Perfil do usuario baseado no quiz diagnostico:

BLOCO 1 — NIVEL DE HABILIDADE:
- Ja deixou de fazer algo por falta de ferramenta: ${answers.tool_avoidance ? 'Sim' : 'Nao'}
- Estilo de aprendizado: ${answers.learning_style || 'Nao informado'}
- Area de maior dificuldade: ${answers.difficulty_area || 'Nao informado'}
- Conforto com tecnologia (0-10): ${answers.tech_comfort || 'Nao informado'}

BLOCO 2 — DORES OCULTAS:
- Ja fingiu entender algo no trabalho: ${answers.faked_understanding ? 'Sim' : 'Nao'}
- Situacao de maior desconforto: ${answers.discomfort_situation || 'Nao informado'}
- Tarefa que evita mas deveria fazer: ${answers.avoided_task || 'Nao informado'}
- Se sente abaixo do nivel esperado: ${answers.below_expected_skill ? 'Sim' : 'Nao'}
- Habilidade deficiente: ${answers.which_skill || 'Nao especificado'}

BLOCO 3 — MEDOS E TRAVAS:
- Maior medo profissional: ${answers.biggest_fear || 'Nao informado'}
- Ja perdeu oportunidade por falta tecnica: ${answers.lost_opportunity ? 'Sim' : 'Nao'}
- Dificuldade que resolveria imediatamente: ${answers.one_difficulty_to_solve || 'Nao informado'}

BLOCO 4 — CONTEXTO PROFISSIONAL:
- Tipo de rotina: ${answers.work_routine || 'Nao informado'}
- Frequencia com dados: ${answers.data_frequency || 'Nao informado'}
- Uso de IA: ${answers.ai_usage || 'Nao informado'}

BLOCO 5 — USO PRATICO:
- O que gostaria automatizado: ${Array.isArray(answers.automate_wishes) ? (answers.automate_wishes as string[]).join(', ') : 'Nao informado'}
- Resultado ao usar IA: ${answers.ai_result_quality || 'Nao informado'}
- Sente que nao sabe pedir pra IA: ${answers.cant_prompt_well ? 'Sim' : 'Nao'}

BLOCO 6 — EXTRACAO PROFUNDA:
- Tarefa recente dificil: ${answers.difficult_task || 'Nao informado'}
- Assistente perfeito faria: ${answers.perfect_assistant || 'Nao informado'}
- Gostaria de aprender mas tem vergonha: ${answers.ashamed_to_learn || 'Nao informado'}

Gere o perfil de competencia com base nessas informacoes.`
}

export function buildUserPromptForPrompts(answers: QuizResponses, skillName: string): string {
  return `Perfil do usuario:
- Skill: ${skillName}
- Tipo de rotina: ${answers.work_routine || 'Nao informado'}
- Area de maior dificuldade: ${answers.difficulty_area || 'Nao informado'}
- Conforto com tecnologia (0-10): ${answers.tech_comfort || 'Nao informado'}
- Situacao de maior desconforto: ${answers.discomfort_situation || 'Nao informado'}
- Tarefa que evita: ${answers.avoided_task || 'Nao informado'}
- Maior medo profissional: ${answers.biggest_fear || 'Nao informado'}
- Dificuldade que resolveria agora: ${answers.one_difficulty_to_solve || 'Nao informado'}
- Frequencia com dados: ${answers.data_frequency || 'Nao informado'}
- Uso de IA: ${answers.ai_usage || 'Nao informado'}
- O que quer automatizar: ${Array.isArray(answers.automate_wishes) ? (answers.automate_wishes as string[]).join(', ') : 'Nao informado'}
- Resultado ao usar IA: ${answers.ai_result_quality || 'Nao informado'}
- Nao sabe pedir pra IA: ${answers.cant_prompt_well ? 'Sim' : 'Nao'}
- Tarefa recente dificil: ${answers.difficult_task || 'Nao informado'}
- Assistente perfeito faria: ${answers.perfect_assistant || 'Nao informado'}
- Gostaria de aprender: ${answers.ashamed_to_learn || 'Nao informado'}

Gere entre 25 e 35 prompts personalizados distribuidos nas categorias, priorizando as areas onde o usuario demonstrou maior dificuldade, medo ou necessidade pratica.`
}

export function buildChatSystemPrompt(userName: string, personContext: string): string {
  return `Voce e um assistente especializado em criacao de prompts de IA para profissionais brasileiros.

CONTEXTO DO USUARIO:
- Nome: ${userName}
- Perfil: ${personContext}

SUA FUNCAO:
- Ajudar o usuario a refinar prompts existentes
- Criar novos prompts para situacoes especificas
- Dar dicas de como usar IA no dia a dia profissional
- Responder duvidas sobre uso de prompts
- Ser paciente e acolhedor — o usuario pode ter insegurancas com tecnologia

REGRAS:
- Seja pratico e direto
- Ofereca exemplos prontos para copiar e colar
- Use o contexto e nivel do usuario para adaptar a complexidade
- Fale em portugues brasileiro
- Nao use linguagem corporativa rebuscada
- Se o usuario demonstra inseguranca, tranquilize e simplifique`
}
