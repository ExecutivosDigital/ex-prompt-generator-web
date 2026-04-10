-- ============================================================
-- 007 — DEMO DATA COMPLETA para joao.stel@gmail.com
-- ============================================================

-- Variavel: ID do usuario
DO $$
DECLARE
  uid UUID := 'c26b9459-1c6c-44ec-8491-281076754b92';
  quiz_id UUID := gen_random_uuid();
  skill_id UUID := gen_random_uuid();
  batch_id UUID := gen_random_uuid();
  conv1_id UUID := gen_random_uuid();
  conv2_id UUID := gen_random_uuid();
  course1_id UUID := gen_random_uuid();
  course2_id UUID := gen_random_uuid();
  mod1_id UUID := gen_random_uuid();
  mod2_id UUID := gen_random_uuid();
  mod3_id UUID := gen_random_uuid();
  mod4_id UUID := gen_random_uuid();
  lesson1_id UUID := gen_random_uuid();
  lesson2_id UUID := gen_random_uuid();
  lesson3_id UUID := gen_random_uuid();
  lesson4_id UUID := gen_random_uuid();
  lesson5_id UUID := gen_random_uuid();
  lesson6_id UUID := gen_random_uuid();
BEGIN

-- =========================================================
-- 1. ATUALIZAR PROFILE
-- =========================================================
UPDATE profiles SET
  full_name = 'Joao Stel',
  display_name = 'Joao',
  business_type = 'agency',
  business_niche = 'Agencia de marketing digital para e-commerces',
  revenue_range = '20k_50k',
  team_size = '2_5',
  ai_experience = 'casual',
  communication_tone = 'casual',
  onboarding_completed = TRUE,
  quiz_completed = TRUE,
  prompts_generated = TRUE
WHERE id = uid;

-- =========================================================
-- 2. QUIZ RESPONSES
-- =========================================================
INSERT INTO quiz_responses (id, user_id, responses, pain_points, quiz_version, time_spent_seconds)
VALUES (
  quiz_id,
  uid,
  '{
    "name": "Joao",
    "uses_ai": true,
    "business_type": "agency",
    "niche": "Agencia de marketing digital para e-commerces",
    "revenue": "20k_50k",
    "team_size": "2_5",
    "pain_points": ["sales", "content", "time"],
    "ai_experience": "casual",
    "time_waste": [
      "Criar conteudo para redes sociais",
      "Escrever propostas e orcamentos",
      "Responder clientes (email/WhatsApp)",
      "Tarefas administrativas e relatorios",
      "Planejamento e estrategia"
    ],
    "preferred_ai": "chatgpt",
    "communication_tone": "casual"
  }'::JSONB,
  ARRAY['sales', 'content', 'time'],
  1,
  142
);

-- =========================================================
-- 3. USER SKILL
-- =========================================================
INSERT INTO user_skills (id, user_id, skill_name, skill_description, strengths, growth_areas, recommended_focus, ai_model, raw_response, quiz_response_id)
VALUES (
  skill_id,
  uid,
  'Estrategista Digital de E-commerce',
  'Profissional focado em escalar resultados para lojas online atraves de estrategias de marketing digital, com visao pratica de vendas e conteudo. Tem experiencia em gerir equipes pequenas e busca otimizar tempo com automacoes.',
  ARRAY['Vendas consultivas para e-commerce', 'Criacao de conteudo estrategico', 'Gestao de trafego pago'],
  ARRAY['Automacao de processos internos', 'Controle financeiro detalhado'],
  ARRAY['vendas', 'marketing', 'operacional'],
  'anthropic/claude-3.5-sonnet',
  '{"skill_name":"Estrategista Digital de E-commerce","category_scores":{"vendas":82,"atendimento":68,"marketing":88,"operacional":55,"financeiro":45}}'::JSONB,
  quiz_id
);

-- =========================================================
-- 4. GENERATED PROMPTS (25 prompts, 5 categorias)
-- =========================================================

-- VENDAS (8 prompts)
INSERT INTO generated_prompts (user_id, quiz_response_id, category, prompt_index, situation, prompt_text, variations, golden_tip, estimated_time_saved, ai_model, generation_batch_id) VALUES
(uid, quiz_id, 'vendas', 1,
 'Proposta comercial para novo cliente e-commerce',
 'Voce e o Joao, diretor de uma agencia de marketing digital especializada em e-commerces. Crie uma proposta comercial para um cliente que tem uma loja online de moda feminina faturando R$80k/mes e quer escalar para R$200k. Inclua: diagnostico inicial, pacote de servicos (trafego pago, email marketing, CRO), timeline de 90 dias, investimento sugerido e ROI projetado. Tom casual e direto.',
 '[{"context":"Para cliente iniciante (faturamento < R$10k)","prompt":"Adapte a proposta para um e-commerce iniciante que ainda nao tem trafego pago rodando. Foque em fundacao: pixel, catalogo, primeiras campanhas de conversao com orcamento de R$2k/mes."},{"context":"Para cliente enterprise (faturamento > R$500k)","prompt":"Adapte para um e-commerce grande que ja tem equipe interna de marketing. Foque em consultoria estrategica, auditoria de campanhas e otimizacao de CAC/LTV."}]'::JSONB,
 'Sempre inclua um case study similar na proposta — clientes convertem 3x mais quando veem resultados reais de negocios parecidos.',
 '45min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 2,
 'Follow-up apos reuniao de apresentacao',
 'Escreva um email de follow-up para enviar 24h apos uma reuniao de apresentacao da agencia. O lead e dono de um e-commerce de suplementos que demonstrou interesse mas pediu para "pensar". Inclua: resumo dos pontos discutidos, 3 beneficios-chave, um case rapido, e um CTA com urgencia sutil (sem ser apelativo). Tom casual e profissional.',
 '[{"context":"Follow-up apos 5 dias sem resposta","prompt":"Reescreva como um segundo follow-up mais curto e direto, incluindo um dado novo de mercado que justifique a urgencia de comecar agora."},{"context":"Follow-up via WhatsApp","prompt":"Adapte para uma mensagem curta de WhatsApp (max 3 paragrafos) mantendo o mesmo conteudo essencial."}]'::JSONB,
 'O melhor horario para enviar follow-up e terca ou quarta entre 9h-10h. Evite segundas (caixa cheia) e sextas (modo fim de semana).',
 '20min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 3,
 'Script de qualificacao de leads por telefone',
 'Crie um script de qualificacao para ligacao com leads que preencheram formulario no site da agencia. O script deve cobrir: abertura (criar rapport), perguntas de qualificacao (faturamento, desafios, investimento em marketing atual, objetivo para 6 meses), identificacao de fit, e proximo passo (agendar reuniao). Adapte para leads de e-commerce.',
 '[{"context":"Lead veio do Instagram","prompt":"Adapte o script para ser mais informal, considerando que o lead ja viu conteudo da agencia e tem contexto previo."},{"context":"Lead corporativo","prompt":"Adapte para tom mais formal, adicionando perguntas sobre processo de decisao e stakeholders envolvidos."}]'::JSONB,
 'Faca a primeira pergunta sobre o negocio DELES, nao sobre o que voce oferece. Leads que falam sobre si mesmos nos primeiros 2 minutos tem 40% mais chance de converter.',
 '30min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 4,
 'Apresentacao de resultados mensais',
 'Monte um roteiro de apresentacao de resultados mensais para um cliente de e-commerce. Inclua: metricas-chave (ROAS, CPA, faturamento via ads, taxa de conversao), comparativo com mes anterior, top 3 acoes que deram resultado, 2 pontos de atencao, plano de acao para proximo mes. Formato de slides com bullets objetivos.',
 '[{"context":"Cliente insatisfeito com resultados","prompt":"Adapte incluindo uma sessao de diagnostico honesto do que nao funcionou, com plano de correcao detalhado e timeline."},{"context":"Primeiro mes de contrato","prompt":"Adapte para foco em setup e fundacao, explicando que os primeiros 30 dias sao de aprendizado do algoritmo e otimizacao."}]'::JSONB,
 'Sempre comece com a metrica que o cliente mais se importa. Se ele e focado em faturamento, lidere com receita. Se e focado em crescimento, lidere com novos clientes.',
 '40min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 5,
 'Upsell de servico adicional',
 'Crie um pitch de upsell para oferecer servico de email marketing automation para um cliente que ja contrata trafego pago. Argumente com dados (recuperacao de carrinho abandonado, LTV, custo por email vs custo por clique). Tom conversacional, como se estivesse no WhatsApp.',
 '[{"context":"Upsell de criacao de conteudo","prompt":"Adapte o pitch para oferecer gestao de redes sociais + criacao de conteudo, argumentando com dados de social proof e brand awareness."},{"context":"Upsell de CRO","prompt":"Adapte para oferecer servico de CRO (otimizacao de conversao), argumentando que aumentar taxa de conversao em 1% pode dobrar o ROAS."}]'::JSONB,
 'O melhor momento para fazer upsell e quando voce acabou de entregar um resultado excepcional. O cliente esta no pico de confianca.',
 '15min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 6,
 'Resposta a objecao de preco',
 'Monte 5 respostas para a objecao "ta caro" de um lead que recebeu proposta da agencia no valor de R$5.000/mes. Cada resposta deve usar uma tecnica diferente: ancoragem, ROI, comparacao, escassez, fracionamento. Tom direto e sem enrolacao.',
 '[{"context":"Objecao: ja tenho equipe interna","prompt":"Monte 5 respostas para a objecao de que o lead ja tem alguem interno fazendo marketing, argumentando complementaridade e especializacao."},{"context":"Objecao: preciso consultar meu socio","prompt":"Monte respostas para contornar a objecao de precisar consultar terceiros, facilitando o processo de decisao."}]'::JSONB,
 'Nunca baixe o preco como primeira resposta. Primeiro, aumente o valor percebido. Se precisar negociar, reduza escopo, nunca preco.',
 '20min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 7,
 'Cold email para prospectar e-commerces',
 'Escreva 3 versoes de cold email para prospectar donos de e-commerce que faturam entre R$50k-R$200k/mes. Cada versao deve ter: assunto que gere abertura (max 50 chars), corpo curto (max 100 palavras), dado relevante do setor, e CTA simples. Evite parecer template generico.',
 '[{"context":"Prospectar via LinkedIn","prompt":"Adapte os emails para mensagens de conexao no LinkedIn, mais curtas e pessoais, com referencia ao perfil do lead."},{"context":"Prospectar via Instagram DM","prompt":"Adapte para DMs do Instagram, super curtas e informais, iniciando com elogio ao perfil da loja."}]'::JSONB,
 'Personalize a primeira linha com algo especifico do negocio do lead (produto novo, postagem recente, nota no Reclame Aqui). Isso aumenta taxa de resposta em 65%.',
 '35min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'vendas', 8,
 'Depoimento estruturado de cliente',
 'Crie um roteiro de perguntas para coletar depoimento em video de um cliente satisfeito da agencia. As perguntas devem extrair: situacao antes da agencia, resultados concretos, momento "aha", e recomendacao. Inclua dicas de gravacao (duracao, enquadramento, tom).',
 '[{"context":"Depoimento escrito para site","prompt":"Adapte para um questionario escrito que gere um depoimento formatado para a pagina de cases do site da agencia."},{"context":"Depoimento para Instagram","prompt":"Adapte para formato Reels de 30 segundos com script curto e impactante."}]'::JSONB,
 'O depoimento mais poderoso nao e sobre voce — e sobre a transformacao do cliente. Foque nas perguntas que extraem ANTES vs DEPOIS com numeros.',
 '25min', 'anthropic/claude-3.5-sonnet', batch_id);

-- ATENDIMENTO (5 prompts)
INSERT INTO generated_prompts (user_id, quiz_response_id, category, prompt_index, situation, prompt_text, variations, golden_tip, estimated_time_saved, ai_model, generation_batch_id) VALUES
(uid, quiz_id, 'atendimento', 9,
 'Resposta a cliente insatisfeito',
 'Escreva uma resposta profissional para um cliente de e-commerce que reclamou no WhatsApp que os resultados da campanha de trafego pago estao abaixo do esperado no segundo mes. Reconheca a frustacao, apresente dados concretos do que foi feito, explique o ciclo de aprendizado do algoritmo, e proponha um plano de acao para os proximos 30 dias.',
 '[{"context":"Reclamacao publica no Google","prompt":"Adapte para uma resposta publica no Google Meu Negocio, mais curta e diplomática, convidando para conversa privada."},{"context":"Cliente ameacando cancelar","prompt":"Adapte com tom de retencao, oferecendo uma revisao estrategica gratuita e extensao de 15 dias no contrato."}]'::JSONB,
 'Responda em ate 1 hora. Cada hora de demora reduz a chance de reter o cliente em 15%. E nunca discuta — valide o sentimento primeiro.',
 '20min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'atendimento', 10,
 'Onboarding de novo cliente',
 'Crie um checklist de onboarding para um novo cliente de e-commerce que acabou de fechar contrato com a agencia. Inclua: email de boas-vindas, acessos necessarios (Meta Ads, Google Ads, GA4, Shopify), reuniao de kickoff, timeline dos primeiros 15 dias, expectativas alinhadas.',
 '[{"context":"Onboarding express (cliente com urgencia)","prompt":"Adapte para um onboarding acelerado de 48h para cliente que precisa comecar campanha urgente para Black Friday."},{"context":"Onboarding de cliente grande","prompt":"Adapte incluindo stakeholder mapping, SLA detalhado, e reunioes semanais de alinhamento."}]'::JSONB,
 'Envie o email de boas-vindas com video personalizado de 60 segundos. Clientes que recebem video no onboarding tem NPS 40% maior.',
 '35min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'atendimento', 11,
 'Template de relatorio semanal por WhatsApp',
 'Crie um template de update semanal para enviar aos clientes via WhatsApp toda sexta-feira. Deve ser curto (max 8 linhas), incluir: investimento da semana, ROAS, vendas geradas, top produto, e proximo foco. Use emojis com moderacao.',
 '[{"context":"Semana com resultado ruim","prompt":"Adapte o template para uma semana de resultados abaixo da media, com tom transparente e foco no plano de ajuste."},{"context":"Relatorio mensal completo","prompt":"Expanda para um relatorio mensal mais detalhado com graficos sugeridos e analise comparativa."}]'::JSONB,
 'Envie o update na sexta entre 14h-15h. O cliente termina a semana com sensacao positiva e voce evita cobrancas no fim de semana.',
 '10min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'atendimento', 12,
 'Comunicacao de reajuste de preco',
 'Escreva um email para comunicar reajuste de 15% nos servicos da agencia a partir do proximo mes. Tom transparente, justificando com investimento em novas ferramentas e crescimento da equipe. Inclua opcao de lock de preco por 12 meses para quem renovar ate data X.',
 '[{"context":"Reajuste para cliente antigo (2+ anos)","prompt":"Adapte com tom mais pessoal e oferta exclusiva de upgrade gratuito por 3 meses como reconhecimento da parceria."},{"context":"Comunicacao para base inteira","prompt":"Adapte para email marketing para toda a base, mais institucional e com FAQ das principais duvidas."}]'::JSONB,
 'Comunique o reajuste com 45 dias de antecedencia minima. E sempre apresente o novo valor junto com algo novo que justifique (nova ferramenta, novo servico incluso).',
 '25min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'atendimento', 13,
 'Pesquisa de satisfacao NPS',
 'Crie uma pesquisa NPS (Net Promoter Score) adaptada para clientes de agencia de marketing digital. Inclua: pergunta NPS padrao (0-10), 3 perguntas qualitativas sobre pontos fortes, pontos de melhoria e funcionalidades desejadas. Formato para Google Forms.',
 '[{"context":"Pesquisa pos-projeto pontual","prompt":"Adapte para avaliar um projeto especifico (ex: lancamento de campanha de Black Friday) em vez do servico geral."},{"context":"Pesquisa via WhatsApp","prompt":"Simplifique para 3 perguntas rapidas que possam ser respondidas direto no chat."}]'::JSONB,
 'Envie a pesquisa NPS quando o cliente acabou de receber um resultado bom — o score sera mais justo e voce tera depoimentos positivos para usar.',
 '15min', 'anthropic/claude-3.5-sonnet', batch_id);

-- MARKETING (7 prompts)
INSERT INTO generated_prompts (user_id, quiz_response_id, category, prompt_index, situation, prompt_text, variations, golden_tip, estimated_time_saved, ai_model, generation_batch_id) VALUES
(uid, quiz_id, 'marketing', 14,
 'Calendario de conteudo mensal para Instagram',
 'Crie um calendario de conteudo para o Instagram da agencia para os proximos 30 dias (12 posts). Distribua entre: 4 posts educativos (dicas de e-commerce), 3 posts de autoridade (cases e resultados), 3 posts de bastidores (dia a dia da agencia), 2 posts de venda direta (CTA para agendar reuniao). Inclua: legenda completa, hashtags relevantes, e horario sugerido de postagem.',
 '[{"context":"Conteudo para LinkedIn","prompt":"Adapte o calendario para LinkedIn com tom mais profissional, foco em artigos e carroseis educativos sobre marketing para e-commerce."},{"context":"Conteudo para TikTok/Reels","prompt":"Adapte para formato video curto com hooks de abertura, roteiros de 30-60 segundos e trends aplicaveis ao nicho."}]'::JSONB,
 'O formato que mais engaja em 2025 e o carrossel com storytelling: comece com uma dor, apresente o problema, e termine com a solucao. Taxa de save 3x maior que post unico.',
 '120min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 15,
 'Copy de anuncio para Meta Ads',
 'Escreva 5 variacoes de copy para anuncio no Facebook/Instagram promovendo os servicos da agencia para donos de e-commerce. Cada versao deve ter: headline (max 40 chars), texto principal (max 125 chars), descricao (max 30 chars), e CTA. Varie entre abordagens: dor, resultado, curiosidade, prova social, e urgencia.',
 '[{"context":"Copy para Google Ads","prompt":"Adapte as 5 variacoes para formato de Google Ads responsivo (max 30 chars headline, 90 chars descricao), focando em intencao de busca."},{"context":"Copy para remarketing","prompt":"Adapte para publico que ja visitou o site da agencia, usando familiaridade e ofertas especificas."}]'::JSONB,
 'Teste sempre pelo menos 3 headlines diferentes com o mesmo criativo. A headline e responsavel por 80% da taxa de clique.',
 '30min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 16,
 'Roteiro de video case de sucesso',
 'Crie um roteiro de video de 2 minutos contando o case de um cliente e-commerce de moda que saiu de R$30k/mes para R$150k/mes em 6 meses com a agencia. Estrutura: hook (3s), problema (15s), solucao (30s), resultados (30s), depoimento do cliente (20s), CTA (10s). Inclua indicacoes de B-roll.',
 '[{"context":"Case para apresentacao de vendas","prompt":"Adapte para formato de slide deck com os mesmos dados, para usar em reunioes de vendas."},{"context":"Case para blog/SEO","prompt":"Adapte para artigo de blog com 800 palavras, otimizado para a keyword agencia de marketing para e-commerce."}]'::JSONB,
 'Coloque o resultado numerico nos primeiros 3 segundos do video. "De R$30k para R$150k em 6 meses" no hook aumenta retencao em 60%.',
 '45min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 17,
 'Email marketing para base de leads frios',
 'Crie uma sequencia de 3 emails para reativar leads frios que preencheram formulario ha mais de 60 dias. Email 1: valor gratuito (checklist de e-commerce). Email 2: case study relevante. Email 3: oferta com prazo. Assuntos que gerem abertura, corpo curto.',
 '[{"context":"Sequencia para leads quentes","prompt":"Adapte para leads que acabaram de preencher formulario: agradecimento, apresentacao da agencia, convite para reuniao."},{"context":"Sequencia pos-reuniao sem fechamento","prompt":"Adapte para leads que fizeram reuniao mas nao fecharam: reforco de valor, novo case, ultima chance."}]'::JSONB,
 'O email de reativacao mais eficaz comeca com "Vi que voce se interessou por X..." — personalizacao baseada no interesse original aumenta abertura em 45%.',
 '40min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 18,
 'Bio e descricao para redes sociais',
 'Escreva bio otimizada para o Instagram da agencia (max 150 chars) e descricao completa para LinkedIn (max 2000 chars). Foco: agencia de marketing digital especializada em e-commerce, resultados comprovados, tom casual mas profissional.',
 '[{"context":"Bio para TikTok","prompt":"Adapte para TikTok com tom mais descolado e jovem, usando emojis estrategicos e CTA para link na bio."},{"context":"Descricao para Google Meu Negocio","prompt":"Adapte para Google Meu Negocio com foco em SEO local e palavras-chave de busca."}]'::JSONB,
 'Coloque o resultado mais impactante na primeira linha da bio. Ninguem le alem da segunda linha se a primeira nao prender.',
 '15min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 19,
 'Lead magnet: checklist para e-commerce',
 'Crie o conteudo de um lead magnet em formato de checklist: "15 Pontos que Todo E-commerce Precisa Verificar Antes de Investir em Trafego Pago". Cada ponto com titulo, descricao de 2 linhas, e indicador de prioridade (alta/media/baixa). Inclua CTA final para agendar diagnostico gratuito.',
 '[{"context":"Lead magnet em formato ebook","prompt":"Expanda para um mini ebook de 10 paginas com os mesmos pontos, adicionando exemplos visuais e dados de mercado."},{"context":"Lead magnet em formato video","prompt":"Adapte para roteiro de webinar de 20 minutos cobrindo os 5 pontos mais criticos com exemplos ao vivo."}]'::JSONB,
 'O formato checklist converte 2x mais que ebook como lead magnet porque tem perceived value alto e perceived effort baixo para consumir.',
 '60min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'marketing', 20,
 'Post viral: antes e depois de cliente',
 'Crie um post carrossel de "antes e depois" mostrando a transformacao de um e-commerce cliente. Slide 1: hook visual. Slide 2-3: metricas ANTES (print de dashboard). Slide 4-5: O que fizemos (3 acoes-chave). Slide 6-7: metricas DEPOIS. Slide 8: CTA. Inclua legendas para cada slide.',
 '[{"context":"Formato Reels","prompt":"Adapte para Reels de 30 segundos com transicoes, narrado pelo dono da agencia."},{"context":"Formato Story sequencial","prompt":"Adapte para 8 stories sequenciais com enquete no ultimo para gerar engajamento."}]'::JSONB,
 'Antes e depois com numeros reais gera 5x mais saves que conteudo educativo. Saves = alcance futuro.',
 '25min', 'anthropic/claude-3.5-sonnet', batch_id);

-- OPERACIONAL (3 prompts)
INSERT INTO generated_prompts (user_id, quiz_response_id, category, prompt_index, situation, prompt_text, variations, golden_tip, estimated_time_saved, ai_model, generation_batch_id) VALUES
(uid, quiz_id, 'operacional', 21,
 'SOP de setup de campanha Meta Ads',
 'Crie um SOP (Standard Operating Procedure) passo a passo para configurar uma campanha de conversao no Meta Ads para um novo cliente e-commerce. Inclua: configuracao de pixel, criacao de eventos, estrutura de campanha (CBO vs ABO), publicos (LAL, interesse, retargeting), criativos necessarios, e checklist de revisao pre-lancamento.',
 '[{"context":"SOP para Google Ads Shopping","prompt":"Crie SOP equivalente para configurar campanha de Google Shopping, incluindo feed de produtos, Merchant Center, e estrutura de campanha."},{"context":"SOP para TikTok Ads","prompt":"Adapte para setup de campanha no TikTok Ads Manager, com foco em formatos nativos e spark ads."}]'::JSONB,
 'Crie templates de campanha salvos no Ads Manager. Cada novo setup usando template leva 70% menos tempo que comecar do zero.',
 '90min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'operacional', 22,
 'Modelo de briefing com cliente',
 'Crie um formulario de briefing completo para coletar informacoes de um novo cliente e-commerce antes de iniciar os trabalhos. Secoes: dados do negocio, publico-alvo, concorrentes, historico de marketing, metas, identidade visual, acessos necessarios, e restricoes.',
 '[{"context":"Briefing para campanha pontual","prompt":"Simplifique para um briefing rapido de campanha especifica (Black Friday, lancamento de produto), focando apenas no essencial."},{"context":"Briefing para redesign de loja","prompt":"Adapte para coletar informacoes especificas de UX/UI: referencias visuais, jornada do cliente, pain points da loja atual."}]'::JSONB,
 'Envie o briefing ANTES da reuniao de kickoff para o cliente preencher. Na reuniao voce so valida e aprofunda — economiza 50% do tempo.',
 '30min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'operacional', 23,
 'Automacao de relatorios com templates',
 'Crie templates de relatorio mensal automatizado para clientes, usando Google Sheets como base. Inclua: abas de metricas por canal (Meta, Google, Email), aba de resumo executivo, e aba de plano de acao. Liste as formulas e graficos necessarios para cada KPI.',
 '[{"context":"Dashboard em Google Data Studio","prompt":"Adapte para um dashboard no Looker Studio conectado diretamente ao Meta Ads e Google Ads via conectores nativos."},{"context":"Relatorio para CEO (resumo)","prompt":"Crie um template de 1 pagina com apenas os 5 KPIs que o CEO precisa ver, sem detalhes tecnicos."}]'::JSONB,
 'Conecte o Google Sheets ao Supermetrics ou similar para puxar dados automaticamente. O tempo de montagem de relatorio cai de 3h para 15min.',
 '180min', 'anthropic/claude-3.5-sonnet', batch_id);

-- FINANCEIRO (2 prompts)
INSERT INTO generated_prompts (user_id, quiz_response_id, category, prompt_index, situation, prompt_text, variations, golden_tip, estimated_time_saved, ai_model, generation_batch_id) VALUES
(uid, quiz_id, 'financeiro', 24,
 'Precificacao de servicos da agencia',
 'Analise e sugira uma tabela de precos para os servicos da agencia de marketing para e-commerce. Considere: gestao de trafego pago (Meta + Google), email marketing, criacao de conteudo, e CRO. Para cada servico, defina: preco mensal, escopo incluso, e margem de lucro ideal. Base: equipe de 4 pessoas, custos fixos de R$15k/mes.',
 '[{"context":"Precificacao por performance","prompt":"Crie modelo de preco baseado em performance (fee fixo + % do faturamento gerado), com clausulas de protecao e teto."},{"context":"Precificacao de projeto pontual","prompt":"Adapte para projetos pontuais (setup de loja, lancamento, Black Friday) com preco fixo baseado em escopo."}]'::JSONB,
 'A regra de ouro: seu preco mensal deve ser no minimo 3x o custo direto do servico (salario + ferramentas). Abaixo disso voce esta subsidiando o cliente.',
 '60min', 'anthropic/claude-3.5-sonnet', batch_id),

(uid, quiz_id, 'financeiro', 25,
 'Projecao financeira trimestral',
 'Crie uma planilha de projecao financeira para os proximos 3 meses da agencia. Considere: receita recorrente atual de R$35k/mes (7 clientes), meta de 2 novos clientes/mes, ticket medio de R$5k, churn de 10%, custos fixos de R$15k, custos variaveis de 20% da receita. Projete: receita, lucro, e caixa.',
 '[{"context":"Projecao anual","prompt":"Expanda para 12 meses incluindo sazonalidade (pico em Nov-Dez, queda em Jan-Fev) e plano de contratacao escalonado."},{"context":"Cenario pessimista","prompt":"Crie cenario pessimista com churn de 20%, 1 novo cliente/mes, e aumento de 10% nos custos. Identifique o breakeven."}]'::JSONB,
 'Mantenha sempre 3 meses de custos fixos como reserva de emergencia. E acompanhe MRR (receita recorrente) semanalmente, nao mensalmente.',
 '90min', 'anthropic/claude-3.5-sonnet', batch_id);

-- =========================================================
-- 5. CHAT CONVERSATIONS + MESSAGES
-- =========================================================
INSERT INTO chat_conversations (id, user_id, title, message_count, last_message_at) VALUES
(conv1_id, uid, 'Prompt para proposta comercial', 4, NOW() - INTERVAL '2 hours'),
(conv2_id, uid, 'Copy para campanha Black Friday', 2, NOW() - INTERVAL '1 day');

INSERT INTO chat_messages (conversation_id, user_id, role, content, created_at) VALUES
(conv1_id, uid, 'user', 'Preciso de um prompt para criar uma proposta comercial matadora para um e-commerce de moda', NOW() - INTERVAL '2 hours 10 minutes'),
(conv1_id, uid, 'assistant', '```json
{
  "prompt": "Voce e um consultor de marketing digital especializado em e-commerce de moda. Crie uma proposta comercial para um potencial cliente que fatura R$80k/mes e quer escalar para R$200k em 6 meses. Inclua: 1) Diagnostico inicial do cenario atual, 2) Estrategia de trafego pago (Meta + Google Shopping), 3) Plano de email marketing com automacoes, 4) Calendario de acoes mensais, 5) Investimento sugerido com ROI projetado. Tom profissional mas acessivel.",
  "dica": "Personalize com o nome da loja e 2-3 observacoes especificas sobre o Instagram atual deles"
}
```

Esse prompt gera propostas que convertem muito bem porque inclui ROI projetado — o cliente ve exatamente o retorno esperado.', NOW() - INTERVAL '2 hours 9 minutes'),
(conv1_id, uid, 'user', 'Muito bom! Pode adaptar para um e-commerce de suplementos?', NOW() - INTERVAL '2 hours 5 minutes'),
(conv1_id, uid, 'assistant', '```json
{
  "prompt": "Voce e um consultor de marketing digital especializado em e-commerce de suplementos e saude. Crie uma proposta comercial para uma loja online de suplementos que fatura R$120k/mes com margem de 35% e quer aumentar o LTV dos clientes. Inclua: 1) Analise do funil atual (aquisicao vs retencao), 2) Estrategia de subscricao recorrente, 3) Campanhas segmentadas por objetivo (ganho de massa, emagrecimento, bem-estar), 4) Automacao de recompra (30/60/90 dias), 5) Investimento e projecao de crescimento do LTV em 40%.",
  "dica": "Suplementos tem ciclo de recompra natural — explore isso na proposta como diferencial competitivo"
}
```

Para suplementos, o foco muda de aquisicao pura para retencao e LTV. A recompra recorrente e o ouro desse nicho.', NOW() - INTERVAL '2 hours 4 minutes'),

(conv2_id, uid, 'user', 'Me ajuda a criar copies de anuncio para Black Friday de um cliente e-commerce', NOW() - INTERVAL '1 day'),
(conv2_id, uid, 'assistant', '```json
{
  "copies": [
    {
      "headline": "Black Friday: ate 70% OFF",
      "texto": "So ate meia-noite. Os produtos mais desejados do ano com os menores precos. Frete gratis acima de R$99.",
      "cta": "Comprar agora"
    },
    {
      "headline": "Sua wishlist com desconto",
      "texto": "Aquele produto que voce estava de olho finalmente com o preco que cabe no bolso. Black Friday so acontece 1x por ano.",
      "cta": "Ver ofertas"
    },
    {
      "headline": "Ultimas horas de Black Friday",
      "texto": "Ja vendemos +2.000 produtos hoje. Estoque acabando para as categorias mais procuradas. Nao deixe para depois.",
      "cta": "Garantir desconto"
    }
  ],
  "dica": "Rode a copy 3 (urgencia) nas ultimas 6 horas da Black Friday — CTR sobe 40% com countdown real"
}
```', NOW() - INTERVAL '1 day' + INTERVAL '1 minute');

-- =========================================================
-- 6. TRAINING COURSES + MODULES + LESSONS
-- =========================================================
INSERT INTO training_courses (id, title, description, thumbnail_url, instructor, duration_text, sort_order, module_count, is_published, is_free) VALUES
(course1_id, 'Dominando Prompts para Negocios', 'Aprenda a criar prompts que geram resultados reais para qualquer area do seu negocio. Do basico ao avancado.', NULL, 'EX Tecnologia', '2h 45min', 1, 2, TRUE, TRUE),
(course2_id, 'Funis de Venda com IA', 'Construa funis de venda automatizados usando inteligencia artificial em cada etapa. Prospeccao, qualificacao, fechamento e pos-venda.', NULL, 'EX Tecnologia', '3h 30min', 2, 2, TRUE, FALSE);

INSERT INTO training_modules (id, course_id, title, description, thumbnail_url, sort_order, lesson_count, is_published) VALUES
(mod1_id, course1_id, 'Fundamentos de Prompts', 'Entenda como a IA processa seus prompts e aprenda os principios basicos para resultados consistentes.', NULL, 1, 3, TRUE),
(mod2_id, course1_id, 'Prompts Avancados para Vendas', 'Tecnicas avancadas de prompt engineering aplicadas especificamente a vendas e prospeccao.', NULL, 2, 3, TRUE),
(mod3_id, course2_id, 'Funil de Prospeccao com IA', 'Use IA para gerar listas, qualificar leads e criar abordagens personalizadas em escala.', NULL, 1, 0, TRUE),
(mod4_id, course2_id, 'Automacao de Follow-up', 'Configure sequencias automaticas de follow-up usando IA para nutrir leads ate o fechamento.', NULL, 2, 0, TRUE);

INSERT INTO training_lessons (id, module_id, title, description, video_url, video_duration_seconds, content_html, sort_order, is_published) VALUES
(lesson1_id, mod1_id, 'O que e um prompt e por que importa', 'Entenda o conceito fundamental por tras dos prompts e como eles determinam a qualidade da resposta da IA.', NULL, 480,
 '<h2>O que e um prompt?</h2><p>Um prompt e a instrucao que voce da para a IA. Pense nele como um briefing: quanto mais claro e especifico, melhor o resultado.</p><h3>Por que importa?</h3><p>A diferenca entre um prompt generico e um prompt bem estruturado pode significar horas de trabalho economizadas. Um bom prompt gera respostas que voce pode usar direto, sem edicao.</p><h3>Os 3 pilares de um bom prompt:</h3><ul><li><strong>Contexto:</strong> Quem voce e e qual a situacao</li><li><strong>Instrucao:</strong> O que exatamente voce quer</li><li><strong>Formato:</strong> Como quer receber a resposta</li></ul>',
 1, TRUE),

(lesson2_id, mod1_id, 'Estrutura CTF: Contexto, Tarefa, Formato', 'O framework mais simples e eficaz para criar prompts que funcionam de primeira.',  NULL, 720,
 '<h2>Framework CTF</h2><p>O CTF e a estrutura mais pratica para criar prompts profissionais:</p><h3>C - Contexto</h3><p>Descreva quem voce e, seu negocio, e a situacao. Exemplo: "Sou dono de uma agencia de marketing para e-commerces com 4 funcionarios."</p><h3>T - Tarefa</h3><p>Diga exatamente o que quer. Seja especifico. Exemplo: "Crie uma proposta comercial para um cliente que fatura R$50k/mes."</p><h3>F - Formato</h3><p>Defina como quer a resposta. Exemplo: "Em formato de documento com secoes: diagnostico, estrategia, investimento, timeline."</p>',
 2, TRUE),

(lesson3_id, mod1_id, 'Erros comuns e como evitar', 'Os 5 erros que 90% das pessoas cometem ao usar IA e como corrigi-los instantaneamente.', NULL, 600,
 '<h2>5 Erros Fatais em Prompts</h2><ol><li><strong>Ser vago demais:</strong> "Me ajuda com marketing" → Diga exatamente o que precisa</li><li><strong>Nao dar contexto:</strong> A IA nao sabe quem voce e — conte sobre seu negocio</li><li><strong>Aceitar a primeira resposta:</strong> Itere! Peca ajustes, aprofundamentos</li><li><strong>Nao definir tom:</strong> "Tom casual" vs "tom formal" muda completamente o resultado</li><li><strong>Prompts gigantes:</strong> Quebre em etapas. Prompts menores e sequenciais > 1 prompt enorme</li></ol>',
 3, TRUE),

(lesson4_id, mod2_id, 'Prompts para proposta comercial', 'Aprenda a gerar propostas comerciais completas usando um unico prompt bem estruturado.', NULL, 900, NULL, 1, TRUE),
(lesson5_id, mod2_id, 'Prompts para cold outreach', 'Gere emails frios, mensagens de LinkedIn e DMs que convertem usando IA.', NULL, 840, NULL, 2, TRUE),
(lesson6_id, mod2_id, 'Prompts para follow-up inteligente', 'Nunca mais perca um lead por falta de follow-up. Automatize com prompts estrategicos.', NULL, 780, NULL, 3, TRUE);

-- =========================================================
-- 7. USER LESSON PROGRESS (2 licoes concluidas)
-- =========================================================
INSERT INTO user_lesson_progress (user_id, lesson_id, module_id, completed, completed_at, last_watched_seconds) VALUES
(uid, lesson1_id, mod1_id, TRUE, NOW() - INTERVAL '3 days', 480),
(uid, lesson2_id, mod1_id, TRUE, NOW() - INTERVAL '2 days', 720),
(uid, lesson3_id, mod1_id, FALSE, NULL, 210);

END $$;
