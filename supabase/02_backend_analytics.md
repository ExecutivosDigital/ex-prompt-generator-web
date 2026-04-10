# 📊 Backend Supabase — Analytics Completo

> Mapeamento **detalhado** de todas as métricas, eventos e dados de analytics que precisam ser coletados no Supabase para o app **EXECUTIVOS**.

---

## 📋 Índice

1. [Visão Geral do Sistema de Analytics](#1-visão-geral-do-sistema-de-analytics)
2. [Tabelas de Analytics](#2-tabelas-de-analytics)
3. [Eventos de Page View](#3-eventos-de-page-view)
4. [Eventos de Sessão](#4-eventos-de-sessão)
5. [Eventos de Clique em Botão](#5-eventos-de-clique-em-botão)
6. [Eventos de Feature Usage](#6-eventos-de-feature-usage)
7. [Eventos de Geração IA](#7-eventos-de-geração-ia)
8. [Eventos de Anúncios](#8-eventos-de-anúncios)
9. [Views SQL para KPIs](#9-views-sql-para-kpis)
10. [Implementação Frontend](#10-implementação-frontend)
11. [Políticas RLS e Performance](#11-políticas-rls-e-performance)
12. [Limpeza e Retenção de Dados](#12-limpeza-e-retenção-de-dados)
13. [Checklist de Implementação](#13-checklist-de-implementação)

---

## 1. Visão Geral do Sistema de Analytics

### Tipos de Dados Coletados

| Categoria | O que rastreia | Granularidade | Volume Estimado |
|-----------|---------------|---------------|-----------------|
| **Page Views** | Cada visita a uma página | Por página, por usuário | Alto |
| **Sessões** | Início/fim de uso do app | Por sessão | Médio |
| **Cliques em Botão** | Cada clique em botão/link interativo | Por elemento, por página | Muito Alto |
| **Feature Usage** | Uso de funcionalidades (copiar prompt, gerar PDF, etc.) | Por ação | Médio |
| **Geração IA** | Cada chamada à IA (skill, prompts, chat) | Por chamada | Baixo |
| **Anúncios** | Views e cliques em banners/popups | Por anúncio | Médio |

### Dimensões de Análise

Cada evento deve poder ser cruzado pelas seguintes dimensões:

- **Temporal:** hora, dia, semana, mês, ano
- **Usuário:** quem fez a ação (user_id)
- **Página:** onde aconteceu
- **Dispositivo:** mobile vs desktop, browser, OS
- **Sessão:** agrupar ações por sessão de uso

---

## 2. Tabelas de Analytics

### 2.1 Tabela: `analytics_page_views`

Cada vez que o usuário navega para uma página.

```sql
CREATE TABLE analytics_page_views (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id    UUID,                           -- Agrupa por sessão
  page_path     TEXT NOT NULL,                   -- "/dashboard", "/quiz", "/prompts"
  page_title    TEXT,                            -- "Dashboard", "Quiz"
  referrer_path TEXT,                            -- Página anterior (de onde veio)
  duration_ms   INTEGER,                         -- Tempo na página em ms
  viewport_width  INTEGER,                       -- Largura da tela
  viewport_height INTEGER,                       -- Altura da tela
  is_mobile     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_user_id ON analytics_page_views(user_id);
CREATE INDEX idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX idx_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX idx_page_views_created_at ON analytics_page_views(created_at);
-- Índice composto para queries temporais
CREATE INDEX idx_page_views_user_date ON analytics_page_views(user_id, created_at);

ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Políticas: Usuário pode inserir seus, admin pode ler tudo
CREATE POLICY "Users can insert own page views"
  ON analytics_page_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

#### Páginas Rastreadas

| Rota | `page_path` | `page_title` | Notas |
|------|-------------|--------------|-------|
| `/` | `/dashboard` | `Dashboard` | Página principal |
| `/login` | `/login` | `Login` | Pública |
| `/register` | `/register` | `Registro` | Pública |
| `/quiz` | `/quiz` | `Quiz` | Fluxo de onboarding |
| `/skill` | `/skill` | `Minha Skill` | Pós-quiz |
| `/prompts` | `/prompts` | `Meus Prompts` | Pós-quiz |
| `/chat` | `/chat` | `Prompt Generator` | Chat com IA |
| `/profile` | `/profile` | `Perfil` | Edição |
| `/training` | `/training` | `Treinamentos` | Lista de cursos |
| `/training/:id` | `/training/{courseId}` | `Curso: {title}` | Detalhe do curso |
| `/training/:id/:id` | `/training/{courseId}/{moduleId}` | `Modulo: {title}` | Detalhe do módulo |
| `/training/:id/:id/:id` | `/training/{courseId}/{moduleId}/{lessonId}` | `Aula: {title}` | Player de aula |

---

### 2.2 Tabela: `analytics_sessions`

Uma sessão = período contínuo de uso da aplicação.

```sql
CREATE TABLE analytics_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,                    -- Atualizado no unload/heartbeat
  duration_seconds INTEGER,                       -- Calculado: ended_at - started_at
  page_count       INTEGER DEFAULT 0,             -- Total de páginas visitadas
  event_count      INTEGER DEFAULT 0,             -- Total de eventos na sessão
  entry_page       TEXT,                           -- Primeira página visitada
  exit_page        TEXT,                           -- Última página visitada
  device_type      TEXT,                           -- "mobile", "desktop", "tablet"
  browser          TEXT,                           -- "Chrome 120", "Safari 17"
  os               TEXT,                           -- "macOS", "iOS", "Windows", "Android"
  screen_width     INTEGER,
  screen_height    INTEGER,
  user_agent       TEXT,                           -- User agent completo
  ip_country       TEXT,                           -- País do IP (se disponível)
  ip_city          TEXT,                           -- Cidade (se disponível)
  utm_source       TEXT,                           -- UTM source
  utm_medium       TEXT,                           -- UTM medium
  utm_campaign     TEXT,                           -- UTM campaign
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX idx_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX idx_sessions_device_type ON analytics_sessions(device_type);

ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own sessions"
  ON analytics_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON analytics_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
  ON analytics_sessions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

---

### 2.3 Tabela: `analytics_button_clicks`

**Cada clique em qualquer botão/link/elemento interativo.**

```sql
CREATE TABLE analytics_button_clicks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id      UUID,
  button_id       TEXT NOT NULL,                  -- ID único do botão
  button_label    TEXT,                           -- Texto visível do botão
  button_type     TEXT,                           -- "cta", "nav", "action", "social", "ad", "copy"
  page_path       TEXT NOT NULL,                  -- Em qual página o clique aconteceu
  component       TEXT,                           -- Componente React onde está
  section         TEXT,                           -- Seção da página
  metadata        JSONB DEFAULT '{}',             -- Dados extras específicos do clique
  position_x      INTEGER,                        -- Posição X do clique na tela
  position_y      INTEGER,                        -- Posição Y do clique na tela
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_button_clicks_user_id ON analytics_button_clicks(user_id);
CREATE INDEX idx_button_clicks_session_id ON analytics_button_clicks(session_id);
CREATE INDEX idx_button_clicks_button_id ON analytics_button_clicks(button_id);
CREATE INDEX idx_button_clicks_page_path ON analytics_button_clicks(page_path);
CREATE INDEX idx_button_clicks_created_at ON analytics_button_clicks(created_at);
CREATE INDEX idx_button_clicks_button_type ON analytics_button_clicks(button_type);

ALTER TABLE analytics_button_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own clicks"
  ON analytics_button_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all clicks"
  ON analytics_button_clicks FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

---

### 2.4 Tabela: `analytics_feature_usage`

Rastreia uso de funcionalidades específicas (não apenas cliques, mas ações completas).

```sql
CREATE TABLE analytics_feature_usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id    UUID,
  feature_name  TEXT NOT NULL,                   -- "copy_prompt", "generate_pdf", "send_chat_message"
  feature_category TEXT,                          -- "prompts", "chat", "training", "quiz", "profile"
  action        TEXT NOT NULL,                    -- "started", "completed", "failed", "copied", "downloaded"
  page_path     TEXT,
  metadata      JSONB DEFAULT '{}',              -- Dados contextuais
  duration_ms   INTEGER,                         -- Quanto tempo a ação levou
  success       BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_usage_user_id ON analytics_feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature_name ON analytics_feature_usage(feature_name);
CREATE INDEX idx_feature_usage_created_at ON analytics_feature_usage(created_at);
CREATE INDEX idx_feature_usage_category ON analytics_feature_usage(feature_category);

ALTER TABLE analytics_feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feature usage"
  ON analytics_feature_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feature usage"
  ON analytics_feature_usage FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

---

### 2.5 Tabela: `analytics_ai_generations`

Log de cada chamada à IA (custos, tokens, tempo).

```sql
CREATE TABLE analytics_ai_generations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  generation_type   TEXT NOT NULL,                -- "skill", "prompts", "chat_message"
  model_used        TEXT NOT NULL,                -- "anthropic/claude-3.5-sonnet"
  input_tokens      INTEGER,
  output_tokens     INTEGER,
  total_tokens      INTEGER,
  estimated_cost_usd DECIMAL(10,6),               -- Custo estimado em USD
  duration_ms       INTEGER,                      -- Tempo total de geração
  success           BOOLEAN DEFAULT TRUE,
  error_message     TEXT,
  prompt_category   TEXT,                         -- Para prompts: "vendas", "marketing", etc.
  prompts_count     INTEGER,                      -- Para batch: quantos prompts gerados
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_gen_user_id ON analytics_ai_generations(user_id);
CREATE INDEX idx_ai_gen_type ON analytics_ai_generations(generation_type);
CREATE INDEX idx_ai_gen_model ON analytics_ai_generations(model_used);
CREATE INDEX idx_ai_gen_created_at ON analytics_ai_generations(created_at);

ALTER TABLE analytics_ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI generations"
  ON analytics_ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all AI generations"
  ON analytics_ai_generations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Insert via Edge Function (SECURITY DEFINER)
CREATE POLICY "Service role can insert AI generations"
  ON analytics_ai_generations FOR INSERT
  WITH CHECK (TRUE);
```

---

### 2.6 Tabela: `analytics_ad_interactions`

Rastreia visualizações e cliques em banners e popups de anúncio.

```sql
CREATE TABLE analytics_ad_interactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id    UUID,
  ad_id         TEXT NOT NULL,                   -- ID do anúncio
  ad_type       TEXT NOT NULL,                   -- "banner_inline", "banner_top", "banner_hero", "popup"
  ad_placement  TEXT,                            -- "dashboard", "prompts", "global"
  interaction   TEXT NOT NULL,                   -- "view", "click", "dismiss", "cta_click"
  page_path     TEXT,
  metadata      JSONB DEFAULT '{}',              -- {title, description, ctaText, href}
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_interactions_user_id ON analytics_ad_interactions(user_id);
CREATE INDEX idx_ad_interactions_ad_id ON analytics_ad_interactions(ad_id);
CREATE INDEX idx_ad_interactions_interaction ON analytics_ad_interactions(interaction);
CREATE INDEX idx_ad_interactions_created_at ON analytics_ad_interactions(created_at);

ALTER TABLE analytics_ad_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own ad interactions"
  ON analytics_ad_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ad interactions"
  ON analytics_ad_interactions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

---

## 3. Eventos de Page View

### Todos os Page Views a Rastrear

| # | Página | `page_path` | Gatilho | Informações Extras |
|---|--------|-------------|---------|-------------------|
| 1 | Dashboard | `/dashboard` | Entrar na rota `/` | Verificar se quiz_completed |
| 2 | Login | `/login` | Entrar na rota `/login` | — |
| 3 | Registro | `/register` | Entrar na rota `/register` | — |
| 4 | Quiz | `/quiz` | Entrar na rota `/quiz` | Slide atual em metadata |
| 5 | Minha Skill | `/skill` | Entrar na rota `/skill` | — |
| 6 | Meus Prompts | `/prompts` | Entrar na rota `/prompts` | Categoria ativa |
| 7 | Chat (lista) | `/chat` | Entrar na rota `/chat` | Quantidade de conversas |
| 8 | Chat (conversa) | `/chat/{convId}` | Abrir conversa | ID da conversa |
| 9 | Perfil | `/profile` | Entrar na rota `/profile` | — |
| 10 | Treinamentos | `/training` | Entrar na rota `/training` | Quantidade de cursos |
| 11 | Curso | `/training/{courseId}` | Abrir curso | ID do curso, título |
| 12 | Módulo | `/training/{courseId}/{moduleId}` | Abrir módulo | ID do módulo |
| 13 | Aula | `/training/{courseId}/{moduleId}/{lessonId}` | Abrir aula | ID da aula, tem vídeo? |
| 14 | 404 | `/404` ou qualquer | Rota não encontrada | URL que tentou acessar |

### Métrica: `duration_ms`

Para calcular quanto tempo o usuário ficou em cada página:
- **Início:** `performance.now()` no mount do componente
- **Fim:** `useEffect` cleanup ou `visibilitychange` event
- **Gravar:** No unmount ou quando sair da página

---

## 4. Eventos de Sessão

### Como Determinar uma Sessão

```
1. Gerar session_id ao entrar no app (UUID no sessionStorage)
2. Gravar `started_at` na primeira interação
3. Heartbeat a cada 30s atualizando `ended_at`
4. No beforeunload/visibilitychange → gravar `ended_at` e `exit_page`
5. Sessão expira se inativo por 30min → nova session
```

### Dados da Sessão

| Campo | Como Obter |
|-------|------------|
| `device_type` | `navigator.userAgent` + `window.innerWidth` |
| `browser` | Parser de `navigator.userAgent` |
| `os` | Parser de `navigator.userAgent` |
| `screen_width/height` | `window.screen.width/height` |
| `entry_page` | Primeira página visitada na sessão |
| `exit_page` | Última página atualizada pelo heartbeat |
| `utm_source/medium/campaign` | `URLSearchParams` do primeiro acesso |
| `ip_country/city` | Resolvido via Edge Function ou header Supabase |

---

## 5. Eventos de Clique em Botão

### 5.1 Mapeamento Completo de Botões por Página

#### Dashboard (`/dashboard`)

| `button_id` | `button_label` | `button_type` | `section` | `component` |
|-------------|---------------|---------------|-----------|-------------|
| `dash-quiz-cta` | Iniciar Quiz | `cta` | `quiz_cta` | `DashboardPage` |
| `dash-quiz-completed` | Ver Prompts | `nav` | `quiz_status` | `DashboardPage` |
| `dash-nav-prompts` | Meus Prompts | `nav` | `quick_actions` | `DashboardPage` |
| `dash-nav-chat` | Prompt Generator | `nav` | `quick_actions` | `DashboardPage` |
| `dash-nav-training` | Treinamentos | `nav` | `quick_actions` | `DashboardPage` |
| `dash-nav-skill` | Minha Skill | `nav` | `quick_actions` | `DashboardPage` |
| `dash-quick-refazer-quiz` | Refazer Quiz | `nav` | `quick_access` | `DashboardPage` |
| `dash-quick-download-pdf` | Baixar PDF | `action` | `quick_access` | `DashboardPage` |
| `dash-quick-nova-conversa` | Nova conversa | `nav` | `quick_access` | `DashboardPage` |
| `dash-banner-hero` | Banner Principal | `ad` | `hero_banner` | `BannerPlaceholder` |
| `dash-banner-twin-left` | Banner Lateral A | `ad` | `twin_banners` | `BannerPlaceholder` |
| `dash-banner-twin-right` | Banner Lateral B | `ad` | `twin_banners` | `BannerPlaceholder` |
| `dash-banner-bottom` | Banner Rodapé | `ad` | `bottom_banner` | `BannerPlaceholder` |
| `dash-ad-inline` | Ad Inline (Painel Financeiro) | `ad` | `inline_ad` | `AdBanner` |
| `dash-social-youtube` | YouTube | `social` | `social_links` | `DashboardPage` |
| `dash-social-instagram` | Instagram | `social` | `social_links` | `DashboardPage` |
| `dash-social-linkedin` | LinkedIn | `social` | `social_links` | `DashboardPage` |
| `dash-social-tiktok` | TikTok | `social` | `social_links` | `DashboardPage` |
| `dash-social-twitter` | X (Twitter) | `social` | `social_links` | `DashboardPage` |
| `dash-product-{id}` | Produto: {title} | `ad` | `products` | `DashboardPage` |
| `dash-video-institucional` | Vídeo Institucional | `action` | `about` | `DashboardPage` |
| `dash-saiba-mais` | Saiba mais sobre nós | `nav` | `about` | `DashboardPage` |
| `dash-ver-todos-produtos` | Ver todos produtos | `nav` | `products_header` | `DashboardPage` |

#### Prompts Page (`/prompts`)

| `button_id` | `button_label` | `button_type` | `section` | `metadata` |
|-------------|---------------|---------------|-----------|------------|
| `prompts-download-pdf` | Baixar PDF | `action` | `header` | — |
| `prompts-filter-{cat}` | Filtro: {categoria} | `action` | `filters` | `{category}` |
| `prompts-copy-{id}` | Copiar prompt | `copy` | `prompt_card` | `{promptId, category}` |
| `prompts-copy-json-{id}` | Copiar JSON | `copy` | `json_preview` | `{promptId}` |
| `prompts-copy-full-{id}` | Copiar JSON Completo | `copy` | `prompt_card` | `{promptId}` |
| `prompts-show-json-{id}` | Mostrar JSON | `action` | `json_toggle` | `{promptId}` |
| `prompts-toggle-variations-{id}` | Expandir variações | `action` | `variations` | `{promptId}` |
| `prompts-copy-variation-{id}-{i}` | Copiar variação | `copy` | `variation` | `{promptId, index}` |
| `prompts-ad-inline` | Ad Inline | `ad` | `inline_ad` | — |

#### Chat Page (`/chat`)

| `button_id` | `button_label` | `button_type` | `section` | `metadata` |
|-------------|---------------|---------------|-----------|------------|
| `chat-new-conversation` | Nova conversa | `cta` | `list_view` | — |
| `chat-suggestion-{i}` | Sugestão: {text} | `cta` | `suggestions` | `{suggestionText}` |
| `chat-open-conversation` | Abrir conversa | `nav` | `history` | `{conversationId}` |
| `chat-delete-conversation` | Deletar conversa | `action` | `history` | `{conversationId}` |
| `chat-send-message` | Enviar mensagem | `action` | `input` | `{conversationId, messageLength}` |
| `chat-copy-message` | Copiar mensagem | `copy` | `message` | `{messageId}` |
| `chat-copy-code` | Copiar código | `copy` | `code_block` | — |
| `chat-back-list` | Voltar à lista | `nav` | `header` | — |

#### Quiz Page (`/quiz`)

| `button_id` | `button_label` | `button_type` | `section` | `metadata` |
|-------------|---------------|---------------|-----------|------------|
| `quiz-next` | Continuar/Gerar prompts | `cta` | `navigation` | `{currentSlide, totalSlides}` |
| `quiz-prev` | Voltar | `nav` | `navigation` | `{currentSlide}` |
| `quiz-answer-{qId}-{value}` | Resposta do quiz | `action` | `question` | `{questionId, value, type}` |

#### Skill Page (`/skill`)

| `button_id` | `button_label` | `button_type` | `section` |
|-------------|---------------|---------------|-----------|
| `skill-iniciar-quiz` | Iniciar Quiz | `cta` | `empty_state` |

#### Training Pages (`/training/*`)

| `button_id` | `button_label` | `button_type` | `section` | `metadata` |
|-------------|---------------|---------------|-----------|------------|
| `training-open-course` | Abrir curso | `nav` | `course_list` | `{courseId}` |
| `training-open-module` | Abrir módulo | `nav` | `module_list` | `{courseId, moduleId}` |
| `training-open-lesson` | Abrir aula | `nav` | `lesson_list` | `{courseId, moduleId, lessonId}` |
| `training-toggle-complete` | Marcar completa | `action` | `lesson_detail` | `{lessonId, completed}` |
| `training-download-file` | Download material | `action` | `downloads` | `{lessonId, fileName, fileType}` |
| `training-back-course` | Voltar ao curso | `nav` | `breadcrumb` | — |
| `training-back-module` | Voltar ao módulo | `nav` | `breadcrumb` | — |
| `training-back-courses` | Voltar aos cursos | `nav` | `breadcrumb` | — |

#### Profile Page (`/profile`)

| `button_id` | `button_label` | `button_type` | `section` |
|-------------|---------------|---------------|-----------|
| `profile-save` | Salvar alterações | `action` | `form` |
| `profile-logout` | Sair da conta | `action` | `footer` |

#### Navigation (Global)

| `button_id` | `button_label` | `button_type` | `component` |
|-------------|---------------|---------------|-------------|
| `nav-sidebar-{item}` | Item do sidebar | `nav` | `Sidebar` |
| `nav-mobile-{item}` | Item do bottom nav | `nav` | `MobileBottomNav` |
| `nav-topbar-profile` | Abrir perfil (topbar) | `nav` | `TopBar` |

#### Auth Pages

| `button_id` | `button_label` | `button_type` | `component` |
|-------------|---------------|---------------|-------------|
| `auth-login-submit` | Entrar | `cta` | `LoginForm` |
| `auth-register-submit` | Criar conta | `cta` | `RegisterForm` |
| `auth-forgot-password` | Esqueceu a senha? | `nav` | `LoginForm` |
| `auth-goto-register` | Criar conta (link) | `nav` | `LoginForm` |
| `auth-goto-login` | Fazer login (link) | `nav` | `RegisterForm` |

---

## 6. Eventos de Feature Usage

### Todas as Features Rastreáveis

| `feature_name` | `feature_category` | `action` | Quando Ocorre | `metadata` |
|----------------|--------------------|---------|----|-----------|
| `quiz_start` | `quiz` | `started` | Entrar no quiz (slide 0) | `{quizVersion}` |
| `quiz_answer` | `quiz` | `completed` | Responder uma pergunta | `{questionId, answerType, slideNumber}` |
| `quiz_complete` | `quiz` | `completed` | Finalizar quiz | `{timeSpentSeconds, totalAnswers}` |
| `quiz_abandon` | `quiz` | `failed` | Sair do quiz antes de completar | `{lastSlide, percentComplete}` |
| `skill_generated` | `quiz` | `completed` | Skill gerada com sucesso | `{skillName, model}` |
| `prompts_generated` | `quiz` | `completed` | Prompts gerados com sucesso | `{promptCount, categories, batchId}` |
| `prompt_copy` | `prompts` | `copied` | Copiar um prompt (texto ou JSON) | `{promptId, category, format: "text"/"json"}` |
| `prompt_copy_variation` | `prompts` | `copied` | Copiar variação de prompt | `{promptId, variationIndex}` |
| `prompt_expand` | `prompts` | `completed` | Expandir JSON completo de prompt | `{promptId}` |
| `prompt_variations_view` | `prompts` | `completed` | Abrir variações de prompt | `{promptId, variationCount}` |
| `prompt_filter_change` | `prompts` | `completed` | Trocar filtro de categoria | `{from, to}` |
| `pdf_download` | `prompts` | `downloaded` | Baixar PDF de prompts | `{promptCount}` |
| `chat_message_sent` | `chat` | `completed` | Enviar mensagem no chat | `{conversationId, messageLength, isFirst}` |
| `chat_response_received` | `chat` | `completed` | Receber resposta da IA | `{conversationId, tokenCount, responseTime}` |
| `chat_conversation_created` | `chat` | `completed` | Criar nova conversa | `{conversationId}` |
| `chat_conversation_deleted` | `chat` | `completed` | Deletar conversa | `{conversationId}` |
| `chat_message_copy` | `chat` | `copied` | Copiar mensagem do chat | `{messageId, role}` |
| `chat_code_copy` | `chat` | `copied` | Copiar bloco de código | `{conversationId}` |
| `chat_suggestion_used` | `chat` | `completed` | Clicar em sugestão rápida | `{suggestionIndex, text}` |
| `lesson_started` | `training` | `started` | Abrir uma aula | `{lessonId, moduleId, courseId}` |
| `lesson_completed` | `training` | `completed` | Marcar aula como concluída | `{lessonId, moduleId}` |
| `lesson_uncompleted` | `training` | `completed` | Desmarcar aula como concluída | `{lessonId}` |
| `material_downloaded` | `training` | `downloaded` | Baixar material de aula | `{lessonId, fileName, fileSize}` |
| `video_started` | `training` | `started` | Iniciar vídeo de aula | `{lessonId, videoUrl}` |
| `video_progress` | `training` | `completed` | Marco de progresso do vídeo | `{lessonId, percent: 25/50/75/100}` |
| `profile_updated` | `profile` | `completed` | Salvar alterações do perfil | `{fieldsChanged: [...]}` |
| `profile_avatar_uploaded` | `profile` | `completed` | Upload de avatar | `{fileSize}` |
| `ad_banner_view` | `ads` | `completed` | Banner apareceu na tela | `{adId, adType, placement}` |
| `ad_banner_click` | `ads` | `completed` | Clique no CTA do banner | `{adId, adType, placement}` |
| `ad_banner_dismiss` | `ads` | `completed` | Fechar banner | `{adId, adType}` |
| `ad_popup_view` | `ads` | `completed` | Popup apareceu | `{adId, title}` |
| `ad_popup_click` | `ads` | `completed` | Clique no CTA do popup | `{adId, title}` |
| `ad_popup_dismiss` | `ads` | `completed` | Fechar popup | `{adId}` |
| `login_success` | `auth` | `completed` | Login com sucesso | — |
| `login_failed` | `auth` | `failed` | Falha no login | `{errorMessage}` |
| `register_success` | `auth` | `completed` | Registro com sucesso | — |
| `register_failed` | `auth` | `failed` | Falha no registro | `{errorMessage}` |
| `logout` | `auth` | `completed` | Logout | — |

---

## 7. Eventos de Geração IA

### O que Rastrear em Cada Chamada IA

| Evento | Tipo | Dados |
|--------|------|-------|
| Geração de Skill | `skill` | model, tokens, custo, duração, sucesso/erro |
| Geração de Prompts | `prompts` | model, tokens, custo, duração, quantidade, categorias |
| Mensagem de Chat | `chat_message` | model, tokens, custo, duração, conversation_id |

### Cálculo de Custo Estimado

```sql
-- Preços aproximados por modelo (por 1M tokens)
-- anthropic/claude-3.5-sonnet: $3 input / $15 output
-- openai/gpt-4o-mini: $0.15 input / $0.60 output

CREATE OR REPLACE FUNCTION calculate_ai_cost(
  p_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER
) RETURNS DECIMAL(10,6) AS $$
BEGIN
  CASE p_model
    WHEN 'anthropic/claude-3.5-sonnet' THEN
      RETURN (p_input_tokens * 3.0 / 1000000) + (p_output_tokens * 15.0 / 1000000);
    WHEN 'openai/gpt-4o-mini' THEN
      RETURN (p_input_tokens * 0.15 / 1000000) + (p_output_tokens * 0.60 / 1000000);
    ELSE
      RETURN (p_input_tokens * 3.0 / 1000000) + (p_output_tokens * 15.0 / 1000000);
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

## 8. Eventos de Anúncios

### Anúncios Existentes no App

| `ad_id` | `ad_type` | Componente | Página | Notas |
|---------|-----------|------------|--------|-------|
| `hero-banner` | `banner_hero` | `BannerPlaceholder` | Dashboard | 1200x400 |
| `twin-left` | `banner_inline` | `BannerPlaceholder` | Dashboard | 600x340 |
| `twin-right` | `banner_inline` | `BannerPlaceholder` | Dashboard | 600x340 |
| `bottom-banner` | `banner_footer` | `BannerPlaceholder` | Dashboard | 1200x200 |
| `dashboard-inline` | `banner_inline` | `AdBanner` | Dashboard | Painel Financeiro R$97 |
| `prompts-inline` | `banner_inline` | `AdBanner` | Prompts | "Quer mais prompts?" |
| `popup-offer` | `popup` | `PopupAd` | Global | Aparece após 8s |

### Métricas de Anúncios

| Métrica | Cálculo |
|---------|---------|
| **Impressões** | COUNT de `interaction = 'view'` por ad_id |
| **CTR (Click-Through Rate)** | clicks / impressions * 100 |
| **Dismiss Rate** | dismisses / impressions * 100 |
| **CTA Click Rate** | cta_clicks / clicks * 100 |

---

## 9. Views SQL para KPIs

### 9.1 Usuários Ativos por Dia (DAU)

```sql
CREATE OR REPLACE VIEW vw_daily_active_users AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as dau,
  COUNT(*) as total_events
FROM analytics_page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 9.2 Usuários Ativos por Hora

```sql
CREATE OR REPLACE VIEW vw_hourly_activity AS
SELECT 
  DATE(created_at) as date,
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_page_views
FROM analytics_page_views
GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
ORDER BY date DESC, hour;
```

### 9.3 Páginas Mais Visitadas

```sql
CREATE OR REPLACE VIEW vw_top_pages AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(duration_ms) as avg_duration_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) as median_duration_ms
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY total_views DESC;
```

### 9.4 Botões Mais Clicados

```sql
CREATE OR REPLACE VIEW vw_top_buttons AS
SELECT 
  button_id,
  button_label,
  button_type,
  page_path,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT user_id) as unique_users
FROM analytics_button_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY button_id, button_label, button_type, page_path
ORDER BY total_clicks DESC;
```

### 9.5 Funil de Conversão (Register → Quiz → Prompts)

```sql
CREATE OR REPLACE VIEW vw_conversion_funnel AS
WITH steps AS (
  SELECT 
    p.id as user_id,
    p.created_at as registered_at,
    p.quiz_completed,
    p.prompts_generated,
    qr.completed_at as quiz_completed_at,
    (SELECT MIN(created_at) FROM chat_conversations cc WHERE cc.user_id = p.id) as first_chat_at,
    (SELECT COUNT(*) FROM chat_messages cm WHERE cm.user_id = p.id) as total_messages
  FROM profiles p
  LEFT JOIN quiz_responses qr ON qr.user_id = p.id
)
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN quiz_completed THEN 1 END) as completed_quiz,
  COUNT(CASE WHEN prompts_generated THEN 1 END) as generated_prompts,
  COUNT(CASE WHEN first_chat_at IS NOT NULL THEN 1 END) as used_chat,
  COUNT(CASE WHEN total_messages >= 5 THEN 1 END) as active_chat_users,
  ROUND(COUNT(CASE WHEN quiz_completed THEN 1 END)::decimal / NULLIF(COUNT(*), 0) * 100, 1) as quiz_rate,
  ROUND(COUNT(CASE WHEN prompts_generated THEN 1 END)::decimal / NULLIF(COUNT(CASE WHEN quiz_completed THEN 1 END), 0) * 100, 1) as prompt_rate,
  ROUND(COUNT(CASE WHEN first_chat_at IS NOT NULL THEN 1 END)::decimal / NULLIF(COUNT(CASE WHEN prompts_generated THEN 1 END), 0) * 100, 1) as chat_rate
FROM steps;
```

### 9.6 Retenção por Dia (Cohort Simplificado)

```sql
CREATE OR REPLACE VIEW vw_daily_retention AS
SELECT 
  DATE(p.created_at) as signup_date,
  COUNT(DISTINCT p.id) as cohort_size,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv 
    WHERE pv.user_id = p.id 
    AND DATE(pv.created_at) = DATE(p.created_at) + 1
  ) THEN p.id END) as day_1,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv 
    WHERE pv.user_id = p.id 
    AND DATE(pv.created_at) = DATE(p.created_at) + 7
  ) THEN p.id END) as day_7,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv 
    WHERE pv.user_id = p.id 
    AND DATE(pv.created_at) = DATE(p.created_at) + 30
  ) THEN p.id END) as day_30
FROM profiles p
GROUP BY DATE(p.created_at)
ORDER BY signup_date DESC;
```

### 9.7 Uso de Features por Período

```sql
CREATE OR REPLACE VIEW vw_feature_usage_summary AS
SELECT 
  feature_name,
  feature_category,
  DATE(created_at) as date,
  COUNT(*) as total_uses,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(duration_ms) as avg_duration_ms,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failure_count
FROM analytics_feature_usage
GROUP BY feature_name, feature_category, DATE(created_at)
ORDER BY date DESC, total_uses DESC;
```

### 9.8 Custos de IA por Dia

```sql
CREATE OR REPLACE VIEW vw_ai_costs AS
SELECT 
  DATE(created_at) as date,
  generation_type,
  model_used,
  COUNT(*) as total_calls,
  SUM(total_tokens) as total_tokens,
  SUM(estimated_cost_usd) as estimated_cost_usd,
  AVG(duration_ms) as avg_duration_ms,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as errors
FROM analytics_ai_generations
GROUP BY DATE(created_at), generation_type, model_used
ORDER BY date DESC;
```

### 9.9 Sessões por Dispositivo

```sql
CREATE OR REPLACE VIEW vw_sessions_by_device AS
SELECT 
  DATE(started_at) as date,
  device_type,
  browser,
  os,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(duration_seconds) as avg_duration_seconds,
  AVG(page_count) as avg_pages_per_session
FROM analytics_sessions
GROUP BY DATE(started_at), device_type, browser, os
ORDER BY date DESC, session_count DESC;
```

### 9.10 Heatmap de Botões por Hora

```sql
CREATE OR REPLACE VIEW vw_button_heatmap AS
SELECT 
  EXTRACT(DOW FROM created_at) as day_of_week,  -- 0=Sunday
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as click_count
FROM analytics_button_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at)
ORDER BY day_of_week, hour;
```

### 9.11 Acessos por Dia/Mês/Ano

```sql
-- Por dia (últimos 90 dias)
CREATE OR REPLACE VIEW vw_access_daily AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Por mês
CREATE OR REPLACE VIEW vw_access_monthly AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_page_views
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Por ano
CREATE OR REPLACE VIEW vw_access_yearly AS
SELECT 
  EXTRACT(YEAR FROM created_at) as year,
  COUNT(*) as total_views,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_page_views
GROUP BY EXTRACT(YEAR FROM created_at)
ORDER BY year DESC;
```

---

## 10. Implementação Frontend

### 10.1 Hook `useAnalytics`

```typescript
// src/hooks/useAnalytics.ts
import { useCallback, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'

const SESSION_KEY = 'ex_session_id'

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getDeviceInfo() {
  const ua = navigator.userAgent
  const isMobile = /Mobi|Android/i.test(ua)
  const isTablet = /Tablet|iPad/i.test(ua)
  return {
    device_type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    browser: extractBrowser(ua),
    os: extractOS(ua),
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    is_mobile: isMobile,
  }
}

export function useAnalytics() {
  const { user } = useAuth()
  const sessionId = useRef(getSessionId())

  const trackPageView = useCallback(async (
    pagePath: string, 
    pageTitle?: string,
    referrerPath?: string
  ) => {
    if (!user) return
    const device = getDeviceInfo()
    await supabase.from('analytics_page_views').insert({
      user_id: user.id,
      session_id: sessionId.current,
      page_path: pagePath,
      page_title: pageTitle,
      referrer_path: referrerPath,
      viewport_width: device.viewport_width,
      viewport_height: device.viewport_height,
      is_mobile: device.is_mobile,
    })
  }, [user])

  const trackClick = useCallback(async (
    buttonId: string,
    buttonLabel: string,
    buttonType: string,
    pagePath: string,
    options?: { component?: string; section?: string; metadata?: Record<string, unknown> }
  ) => {
    if (!user) return
    await supabase.from('analytics_button_clicks').insert({
      user_id: user.id,
      session_id: sessionId.current,
      button_id: buttonId,
      button_label: buttonLabel,
      button_type: buttonType,
      page_path: pagePath,
      component: options?.component,
      section: options?.section,
      metadata: options?.metadata || {},
    })
  }, [user])

  const trackFeature = useCallback(async (
    featureName: string,
    featureCategory: string,
    action: string,
    options?: { pagePath?: string; metadata?: Record<string, unknown>; durationMs?: number; success?: boolean }
  ) => {
    if (!user) return
    await supabase.from('analytics_feature_usage').insert({
      user_id: user.id,
      session_id: sessionId.current,
      feature_name: featureName,
      feature_category: featureCategory,
      action,
      page_path: options?.pagePath,
      metadata: options?.metadata || {},
      duration_ms: options?.durationMs,
      success: options?.success ?? true,
    })
  }, [user])

  const trackAdInteraction = useCallback(async (
    adId: string,
    adType: string,
    interaction: 'view' | 'click' | 'dismiss' | 'cta_click',
    options?: { adPlacement?: string; pagePath?: string; metadata?: Record<string, unknown> }
  ) => {
    if (!user) return
    await supabase.from('analytics_ad_interactions').insert({
      user_id: user.id,
      session_id: sessionId.current,
      ad_id: adId,
      ad_type: adType,
      interaction,
      ad_placement: options?.adPlacement,
      page_path: options?.pagePath,
      metadata: options?.metadata || {},
    })
  }, [user])

  return { trackPageView, trackClick, trackFeature, trackAdInteraction }
}
```

### 10.2 Hook `usePageTracking`

Para uso automático em cada página:

```typescript
// src/hooks/usePageTracking.ts
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalytics } from './useAnalytics'

export function usePageTracking(pageTitle?: string) {
  const location = useLocation()
  const { trackPageView, trackFeature } = useAnalytics()
  const pageStartTime = useRef(Date.now())
  const prevPath = useRef('')

  useEffect(() => {
    const referrer = prevPath.current
    trackPageView(location.pathname, pageTitle, referrer)
    prevPath.current = location.pathname
    pageStartTime.current = Date.now()

    return () => {
      const duration = Date.now() - pageStartTime.current
      // Gravar duração ao sair da página
      trackFeature('page_duration', 'navigation', 'completed', {
        pagePath: location.pathname,
        durationMs: duration,
        metadata: { pageTitle },
      })
    }
  }, [location.pathname])
}
```

### 10.3 Uso nos Componentes

```typescript
// Em qualquer página:
export default function DashboardPage() {
  usePageTracking('Dashboard')
  const { trackClick, trackFeature } = useAnalytics()
  
  const handleQuizCta = () => {
    trackClick('dash-quiz-cta', 'Iniciar Quiz', 'cta', '/dashboard', {
      section: 'quiz_cta', component: 'DashboardPage'
    })
    navigate('/quiz')
  }

  const handleCopyPrompt = (promptId: string) => {
    trackFeature('prompt_copy', 'prompts', 'copied', {
      pagePath: '/prompts',
      metadata: { promptId, format: 'json' }
    })
  }
}
```

---

## 11. Políticas RLS e Performance

### Performance Tips

> [!TIP]
> **Batch inserts:** Para eventos de alta frequência (button clicks), use um buffer local e envie em batch a cada 5 segundos:

```typescript
const eventBuffer: any[] = []

function flushBuffer() {
  if (eventBuffer.length === 0) return
  const batch = [...eventBuffer]
  eventBuffer.length = 0
  supabase.from('analytics_button_clicks').insert(batch)
}

// Flush a cada 5s
setInterval(flushBuffer, 5000)
// Flush no unload
window.addEventListener('beforeunload', flushBuffer)
```

> [!WARNING]
> **Índices:** As tabelas de analytics podem crescer rapidamente. Os índices definidos cobrem as queries mais comuns, mas monitore o desempenho e adicione particionamento por mês se necessário.

### Particionamento (Futuro — Alto Volume)

```sql
-- Quando o volume crescer, particionar por mês:
CREATE TABLE analytics_page_views (
  ...
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_page_views_2025_01 
  PARTITION OF analytics_page_views 
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## 12. Limpeza e Retenção de Dados

### Política de Retenção

| Tabela | Retenção | Justificativa |
|--------|----------|---------------|
| `analytics_page_views` | 12 meses | Dados detalhados, alto volume |
| `analytics_sessions` | 12 meses | Dados detalhados |
| `analytics_button_clicks` | 6 meses | Altíssimo volume |
| `analytics_feature_usage` | 24 meses | Dados valiosos para produto |
| `analytics_ai_generations` | Permanente | Custos e uso, baixo volume |
| `analytics_ad_interactions` | 12 meses | Métricas de receita |

### Função de Limpeza Automática

```sql
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Page views: manter últimos 12 meses
  DELETE FROM analytics_page_views 
  WHERE created_at < NOW() - INTERVAL '12 months';
  
  -- Sessions: manter últimos 12 meses
  DELETE FROM analytics_sessions 
  WHERE created_at < NOW() - INTERVAL '12 months';
  
  -- Button clicks: manter últimos 6 meses
  DELETE FROM analytics_button_clicks 
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  -- Feature usage: manter últimos 24 meses
  DELETE FROM analytics_feature_usage 
  WHERE created_at < NOW() - INTERVAL '24 months';
  
  -- Ad interactions: manter últimos 12 meses
  DELETE FROM analytics_ad_interactions 
  WHERE created_at < NOW() - INTERVAL '12 months';
END;
$$ LANGUAGE plpgsql;

-- Agendar via pg_cron (ativar extensão no Supabase)
SELECT cron.schedule(
  'cleanup-analytics',
  '0 3 1 * *',  -- Primeiro dia de cada mês às 3h
  'SELECT cleanup_old_analytics()'
);
```

---

## 13. Checklist de Implementação

### Fase 1: Tabelas de Analytics

- [ ] Criar tabela `analytics_page_views`
- [ ] Criar tabela `analytics_sessions`
- [ ] Criar tabela `analytics_button_clicks`
- [ ] Criar tabela `analytics_feature_usage`
- [ ] Criar tabela `analytics_ai_generations`
- [ ] Criar tabela `analytics_ad_interactions`
- [ ] Criar todos os índices listados
- [ ] Habilitar RLS em todas as tabelas
- [ ] Criar policies (insert = own, select = admin)
- [ ] Adicionar `is_admin` na tabela `profiles` (se não feito)

### Fase 2: Views SQL

- [ ] Criar `vw_daily_active_users`
- [ ] Criar `vw_hourly_activity`
- [ ] Criar `vw_top_pages`
- [ ] Criar `vw_top_buttons`
- [ ] Criar `vw_conversion_funnel`
- [ ] Criar `vw_daily_retention`
- [ ] Criar `vw_feature_usage_summary`
- [ ] Criar `vw_ai_costs`
- [ ] Criar `vw_sessions_by_device`
- [ ] Criar `vw_button_heatmap`
- [ ] Criar `vw_access_daily`, `vw_access_monthly`, `vw_access_yearly`
- [ ] Criar função `calculate_ai_cost()`

### Fase 3: Implementação Frontend

- [ ] Criar hook `useAnalytics`
- [ ] Criar hook `usePageTracking`
- [ ] Implementar session management (sessionId no sessionStorage)
- [ ] Implementar buffer de eventos para batch inserts
- [ ] Adicionar `usePageTracking` em TODAS as páginas
- [ ] Adicionar `trackClick` em TODOS os botões mapeados
- [ ] Adicionar `trackFeature` em TODAS as features mapeadas
- [ ] Adicionar tracking de anúncios em `AdBanner.tsx` e `PopupAd.tsx`

### Fase 4: Botões — Implementação por Página

- [ ] Dashboard: 22+ botões mapeados
- [ ] Prompts: 8+ botões mapeados
- [ ] Chat: 8+ botões mapeados
- [ ] Quiz: 3+ botões mapeados
- [ ] Skill: 1+ botão mapeado
- [ ] Training: 7+ botões mapeados
- [ ] Profile: 2+ botões mapeados
- [ ] Navigation (global): 3+ botões mapeados
- [ ] Auth pages: 5+ botões mapeados

### Fase 5: Edge Functions para Analytics de IA

- [ ] Adicionar tracking de tokens/custo na Edge Function `generate-skill`
- [ ] Adicionar tracking de tokens/custo na Edge Function `generate-prompts`
- [ ] Adicionar tracking de tokens/custo na Edge Function `chat`
- [ ] Inserir logs na tabela `analytics_ai_generations`

### Fase 6: Manutenção

- [ ] Ativar extensão `pg_cron` no Supabase
- [ ] Agendar `cleanup_old_analytics()` mensal
- [ ] Monitorar tamanho das tabelas de analytics
- [ ] Dashboards admin (futuro): criar interface de visualização

---

> [!IMPORTANT]
> **Ordem de prioridade:**  
> 1️⃣ Tabelas + RLS (fundação)  
> 2️⃣ Hooks frontend (`useAnalytics`, `usePageTracking`)  
> 3️⃣ Page views + sessões (métricas básicas)  
> 4️⃣ Button clicks (métricas de engajamento)  
> 5️⃣ Feature usage + AI logs (métricas de produto)  
> 6️⃣ Views SQL + dashboard admin (visualização)
