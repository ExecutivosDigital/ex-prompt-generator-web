-- ============================================================
-- 002 — BACKEND COMPLETO: Funcionalidades + Analytics
-- ============================================================
-- Rodar no SQL Editor do Supabase APOS o 001_full_schema.sql
--
-- Este script adiciona:
--   PARTE 1: Novas tabelas de funcionalidade
--   PARTE 2: Alteracoes em tabelas existentes
--   PARTE 3: Tabelas de analytics
--   PARTE 4: Storage buckets
--   PARTE 5: Functions e RPCs
--   PARTE 6: Views SQL para KPIs
--   PARTE 7: Funcao de limpeza/agregacao
-- ============================================================


-- =========================================================
-- PARTE 1: NOVAS TABELAS DE FUNCIONALIDADE
-- =========================================================

-- -------------------------------------------------------
-- 1.1 training_courses (FALTA no schema original)
-- O frontend usa training_courses mas nao existe no banco
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  instructor    TEXT,
  duration_text TEXT,
  sort_order    INTEGER DEFAULT 0,
  module_count  INTEGER DEFAULT 0,
  is_published  BOOLEAN DEFAULT FALSE,
  is_free       BOOLEAN DEFAULT FALSE,
  required_plan TEXT DEFAULT 'free' CHECK (required_plan IN ('free', 'pro', 'enterprise')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published courses"
  ON training_courses FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = TRUE);

CREATE TRIGGER training_courses_updated_at
  BEFORE UPDATE ON training_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- 1.2 Adicionar course_id em training_modules
-- -------------------------------------------------------
ALTER TABLE training_modules
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES training_courses(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_training_modules_course_id ON training_modules(course_id);

-- -------------------------------------------------------
-- 1.3 Trigger para atualizar module_count automaticamente
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_module_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE training_courses SET module_count = module_count + 1
    WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE training_courses SET module_count = module_count - 1
    WHERE id = OLD.course_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_module_change
  AFTER INSERT OR DELETE ON training_modules
  FOR EACH ROW
  EXECUTE FUNCTION handle_module_count();

-- -------------------------------------------------------
-- 1.4 training_certificates
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT,
  UNIQUE(user_id, course_id)
);

ALTER TABLE training_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON training_certificates FOR SELECT
  USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 1.5 prompt_favorites
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS prompt_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id   UUID NOT NULL REFERENCES generated_prompts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prompt_id)
);

ALTER TABLE prompt_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own favorites"
  ON prompt_favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- 1.6 prompt_usage_log
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS prompt_usage_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id   UUID NOT NULL REFERENCES generated_prompts(id) ON DELETE CASCADE,
  action      TEXT NOT NULL CHECK (action IN ('copy', 'export_pdf', 'view_variation', 'share')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompt_usage_user ON prompt_usage_log(user_id);
CREATE INDEX idx_prompt_usage_prompt ON prompt_usage_log(prompt_id);
CREATE INDEX idx_prompt_usage_created ON prompt_usage_log(created_at);

ALTER TABLE prompt_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log own prompt usage"
  ON prompt_usage_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own prompt usage"
  ON prompt_usage_log FOR SELECT
  USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 1.7 ad_banners (banners dinamicos)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_banners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement     TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  cta_text      TEXT DEFAULT 'Saiba mais',
  cta_url       TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  priority      INTEGER DEFAULT 0,
  target_plans  TEXT[] DEFAULT '{free,pro,enterprise}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ad_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active banners"
  ON ad_banners FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND is_active = TRUE
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  );

CREATE INDEX idx_ad_banners_placement ON ad_banners(placement, priority DESC);

-- -------------------------------------------------------
-- 1.8 products (produtos a venda)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  price_cents   INTEGER NOT NULL,
  currency      TEXT DEFAULT 'BRL',
  checkout_url  TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  category      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active products"
  ON products FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- -------------------------------------------------------
-- 1.9 user_purchases (compras e assinaturas)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_purchases (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  plan             TEXT CHECK (plan IN ('pro', 'enterprise')),
  payment_provider TEXT,
  payment_id       TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'refunded')),
  amount_cents     INTEGER,
  purchased_at     TIMESTAMPTZ DEFAULT NOW(),
  expires_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchases_user ON user_purchases(user_id, status);

ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON user_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 1.10 system_prompts (prompts IA gerenciaveis)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_prompts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  content     TEXT NOT NULL,
  variables   TEXT[] DEFAULT '{}',
  model       TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
  temperature NUMERIC(3,2) DEFAULT 0.70,
  max_tokens  INTEGER DEFAULT 4096,
  is_active   BOOLEAN DEFAULT TRUE,
  version     INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;

-- Apenas service_role pode ler (Edge Functions)
CREATE POLICY "Service role read system prompts"
  ON system_prompts FOR SELECT
  USING (auth.role() = 'service_role');

-- -------------------------------------------------------
-- 1.11 ai_models (modelos IA disponiveis)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_models (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider           TEXT NOT NULL,
  model_id           TEXT UNIQUE NOT NULL,
  name               TEXT NOT NULL,
  is_primary         BOOLEAN DEFAULT FALSE,
  is_fallback        BOOLEAN DEFAULT FALSE,
  is_active          BOOLEAN DEFAULT TRUE,
  cost_per_1k_input  NUMERIC(10,6),
  cost_per_1k_output NUMERIC(10,6),
  max_tokens         INTEGER,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active models"
  ON ai_models FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- -------------------------------------------------------
-- 1.12 ai_usage_log (log de chamadas IA)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model           TEXT NOT NULL,
  prompt_type     TEXT NOT NULL,
  input_tokens    INTEGER,
  output_tokens   INTEGER,
  total_tokens    INTEGER,
  cost_usd        NUMERIC(10,6),
  latency_ms      INTEGER,
  success         BOOLEAN DEFAULT TRUE,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user ON ai_usage_log(user_id, created_at);
CREATE INDEX idx_ai_usage_model ON ai_usage_log(model, created_at);

ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role insert ai usage"
  ON ai_usage_log FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can view own ai usage"
  ON ai_usage_log FOR SELECT
  USING (auth.uid() = user_id);


-- =========================================================
-- PARTE 2: ALTERACOES EM TABELAS EXISTENTES
-- =========================================================

-- -------------------------------------------------------
-- 2.1 Novos campos em profiles
-- -------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_ai_model TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- -------------------------------------------------------
-- 2.2 Novo campo em user_skills
-- -------------------------------------------------------
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS category_scores JSONB DEFAULT '{}';

-- -------------------------------------------------------
-- 2.3 Policy de INSERT em profiles (para criacao manual)
-- -------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- -------------------------------------------------------
-- 2.4 Policies de admin para training
-- -------------------------------------------------------
CREATE POLICY "Admins can manage courses"
  ON training_courses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage modules"
  ON training_modules FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage lessons"
  ON training_lessons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage banners"
  ON ad_banners FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage system prompts"
  ON system_prompts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can manage ai models"
  ON ai_models FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can view all ai usage"
  ON ai_usage_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Admins can view all purchases"
  ON user_purchases FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );


-- =========================================================
-- PARTE 3: TABELAS DE ANALYTICS
-- =========================================================

-- -------------------------------------------------------
-- 3.1 analytics_sessions
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token   TEXT UNIQUE NOT NULL,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_count      INTEGER DEFAULT 0,
  event_count     INTEGER DEFAULT 0,
  entry_page      TEXT,
  exit_page       TEXT,
  device_type     TEXT,
  screen_width    INTEGER,
  screen_height   INTEGER,
  user_agent      TEXT,
  browser         TEXT,
  os              TEXT,
  referrer        TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  utm_content     TEXT,
  ip_country      TEXT,
  ip_city         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON analytics_sessions(user_id, started_at DESC);
CREATE INDEX idx_sessions_started ON analytics_sessions(started_at);
CREATE INDEX idx_sessions_token ON analytics_sessions(session_token);
CREATE INDEX idx_sessions_device ON analytics_sessions(device_type);

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

-- -------------------------------------------------------
-- 3.2 analytics_page_views
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id      UUID REFERENCES analytics_sessions(id) ON DELETE SET NULL,
  page_path       TEXT NOT NULL,
  page_title      TEXT,
  referrer_path   TEXT,
  duration_ms     INTEGER,
  viewport_width  INTEGER,
  viewport_height INTEGER,
  scroll_depth_percent INTEGER,
  is_mobile       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_user ON analytics_page_views(user_id, created_at);
CREATE INDEX idx_page_views_page ON analytics_page_views(page_path, created_at);
CREATE INDEX idx_page_views_session ON analytics_page_views(session_id);
CREATE INDEX idx_page_views_created ON analytics_page_views(created_at);

ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own page views"
  ON analytics_page_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own page views"
  ON analytics_page_views FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- -------------------------------------------------------
-- 3.3 analytics_button_clicks
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_button_clicks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id      UUID,
  button_id       TEXT NOT NULL,
  button_label    TEXT,
  button_type     TEXT,
  page_path       TEXT NOT NULL,
  component       TEXT,
  section         TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_button_clicks_user ON analytics_button_clicks(user_id);
CREATE INDEX idx_button_clicks_session ON analytics_button_clicks(session_id);
CREATE INDEX idx_button_clicks_button ON analytics_button_clicks(button_id);
CREATE INDEX idx_button_clicks_page ON analytics_button_clicks(page_path);
CREATE INDEX idx_button_clicks_created ON analytics_button_clicks(created_at);
CREATE INDEX idx_button_clicks_type ON analytics_button_clicks(button_type);

ALTER TABLE analytics_button_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own button clicks"
  ON analytics_button_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all button clicks"
  ON analytics_button_clicks FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- -------------------------------------------------------
-- 3.4 analytics_feature_usage
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_feature_usage (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id       UUID,
  feature_name     TEXT NOT NULL,
  feature_category TEXT,
  action           TEXT NOT NULL,
  page_path        TEXT,
  metadata         JSONB DEFAULT '{}',
  duration_ms      INTEGER,
  success          BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_usage_user ON analytics_feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature ON analytics_feature_usage(feature_name);
CREATE INDEX idx_feature_usage_category ON analytics_feature_usage(feature_category);
CREATE INDEX idx_feature_usage_created ON analytics_feature_usage(created_at);

ALTER TABLE analytics_feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feature usage"
  ON analytics_feature_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feature usage"
  ON analytics_feature_usage FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- -------------------------------------------------------
-- 3.5 analytics_ai_generations
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_ai_generations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  generation_type     TEXT NOT NULL,
  model_used          TEXT NOT NULL,
  input_tokens        INTEGER,
  output_tokens       INTEGER,
  total_tokens        INTEGER,
  estimated_cost_usd  NUMERIC(10,6),
  duration_ms         INTEGER,
  success             BOOLEAN DEFAULT TRUE,
  error_message       TEXT,
  prompt_category     TEXT,
  prompts_count       INTEGER,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_gen_user ON analytics_ai_generations(user_id);
CREATE INDEX idx_ai_gen_type ON analytics_ai_generations(generation_type);
CREATE INDEX idx_ai_gen_model ON analytics_ai_generations(model_used);
CREATE INDEX idx_ai_gen_created ON analytics_ai_generations(created_at);

ALTER TABLE analytics_ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI generations"
  ON analytics_ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all AI generations"
  ON analytics_ai_generations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Service role can insert AI generations"
  ON analytics_ai_generations FOR INSERT
  WITH CHECK (TRUE);

-- -------------------------------------------------------
-- 3.6 analytics_ad_interactions
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_ad_interactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id    UUID,
  ad_id         TEXT NOT NULL,
  ad_type       TEXT NOT NULL,
  ad_placement  TEXT,
  interaction   TEXT NOT NULL,
  page_path     TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_interactions_user ON analytics_ad_interactions(user_id);
CREATE INDEX idx_ad_interactions_ad ON analytics_ad_interactions(ad_id);
CREATE INDEX idx_ad_interactions_interaction ON analytics_ad_interactions(interaction);
CREATE INDEX idx_ad_interactions_created ON analytics_ad_interactions(created_at);

ALTER TABLE analytics_ad_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own ad interactions"
  ON analytics_ad_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ad interactions"
  ON analytics_ad_interactions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- -------------------------------------------------------
-- 3.7 analytics_daily_stats (tabela de agregacao)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date             DATE NOT NULL UNIQUE,
  new_users             INTEGER DEFAULT 0,
  active_users          INTEGER DEFAULT 0,
  returning_users       INTEGER DEFAULT 0,
  total_sessions        INTEGER DEFAULT 0,
  avg_session_duration  INTEGER DEFAULT 0,
  bounce_rate           NUMERIC(5,2) DEFAULT 0,
  total_page_views      INTEGER DEFAULT 0,
  quiz_starts           INTEGER DEFAULT 0,
  quiz_completions      INTEGER DEFAULT 0,
  quiz_abandons         INTEGER DEFAULT 0,
  avg_quiz_time         INTEGER DEFAULT 0,
  prompts_generated     INTEGER DEFAULT 0,
  prompts_copied        INTEGER DEFAULT 0,
  pdf_exports           INTEGER DEFAULT 0,
  conversations_created INTEGER DEFAULT 0,
  messages_sent         INTEGER DEFAULT 0,
  lessons_started       INTEGER DEFAULT 0,
  lessons_completed     INTEGER DEFAULT 0,
  ad_impressions        INTEGER DEFAULT 0,
  ad_clicks             INTEGER DEFAULT 0,
  ad_ctr                NUMERIC(5,2) DEFAULT 0,
  ai_calls              INTEGER DEFAULT 0,
  ai_tokens_used        BIGINT DEFAULT 0,
  ai_cost_usd           NUMERIC(10,4) DEFAULT 0,
  ai_avg_latency_ms     INTEGER DEFAULT 0,
  mobile_sessions       INTEGER DEFAULT 0,
  desktop_sessions      INTEGER DEFAULT 0,
  tablet_sessions       INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_stats_date ON analytics_daily_stats(stat_date DESC);

ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage daily stats"
  ON analytics_daily_stats FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );


-- =========================================================
-- PARTE 4: STORAGE BUCKETS
-- =========================================================

-- Avatars (publico para leitura)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Training materials (privado, so autenticados)
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-materials', 'training-materials', FALSE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated read training materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'training-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Admins upload training materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'training-materials' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Training thumbnails (publico)
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-thumbnails', 'training-thumbnails', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read training thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'training-thumbnails');

CREATE POLICY "Admins upload training thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'training-thumbnails' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Banner images (publico)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- Product images (publico)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');


-- =========================================================
-- PARTE 5: FUNCTIONS E RPCs
-- =========================================================

-- -------------------------------------------------------
-- 5.1 Salvar quiz response + atualizar profile
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION save_quiz_response(
  p_responses JSONB,
  p_pain_points TEXT[],
  p_time_spent INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  DELETE FROM quiz_responses WHERE user_id = auth.uid();

  INSERT INTO quiz_responses (user_id, responses, pain_points, time_spent_seconds)
  VALUES (auth.uid(), p_responses, p_pain_points, p_time_spent)
  RETURNING id INTO v_id;

  UPDATE profiles
  SET quiz_completed = TRUE,
      business_type = p_responses->>'business_type',
      business_niche = p_responses->>'business_niche',
      revenue_range = p_responses->>'revenue_range',
      team_size = p_responses->>'team_size',
      ai_experience = p_responses->>'ai_experience',
      communication_tone = p_responses->>'communication_tone',
      display_name = COALESCE(p_responses->>'display_name', display_name)
  WHERE id = auth.uid();

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.2 Resetar quiz (refazer)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_quiz()
RETURNS VOID AS $$
BEGIN
  DELETE FROM generated_prompts WHERE user_id = auth.uid();
  DELETE FROM user_skills WHERE user_id = auth.uid();
  DELETE FROM quiz_responses WHERE user_id = auth.uid();
  UPDATE profiles
  SET quiz_completed = FALSE,
      prompts_generated = FALSE
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.3 Verificar limite de chat por plano
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION check_chat_limit()
RETURNS JSONB AS $$
DECLARE
  v_plan TEXT;
  v_today_count INTEGER;
  v_limit INTEGER;
BEGIN
  SELECT plan INTO v_plan FROM profiles WHERE id = auth.uid();

  SELECT COUNT(*) INTO v_today_count
  FROM chat_messages
  WHERE user_id = auth.uid()
    AND role = 'user'
    AND created_at >= CURRENT_DATE;

  v_limit := CASE v_plan
    WHEN 'free' THEN 10
    WHEN 'pro' THEN 100
    ELSE 999999
  END;

  RETURN jsonb_build_object(
    'allowed', v_today_count < v_limit,
    'used', v_today_count,
    'limit', v_limit,
    'plan', v_plan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.4 Verificar limite de geracao por plano
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION check_generation_limit()
RETURNS BOOLEAN AS $$
DECLARE
  v_plan TEXT;
  v_count INTEGER;
BEGIN
  SELECT plan INTO v_plan FROM profiles WHERE id = auth.uid();
  SELECT COUNT(*) INTO v_count FROM user_skills WHERE user_id = auth.uid();

  IF v_plan = 'free' AND v_count >= 2 THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.5 Renomear conversa
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION rename_conversation(p_id UUID, p_title TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_conversations
  SET title = p_title
  WHERE id = p_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.6 Progresso de curso
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION get_course_progress(p_course_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total INTEGER;
  v_completed INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM training_lessons l
  JOIN training_modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id AND l.is_published = TRUE;

  SELECT COUNT(*) INTO v_completed
  FROM user_lesson_progress p
  JOIN training_lessons l ON p.lesson_id = l.id
  JOIN training_modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id
    AND p.user_id = auth.uid()
    AND p.completed = TRUE;

  RETURN jsonb_build_object(
    'total_lessons', v_total,
    'completed_lessons', v_completed,
    'percentage', CASE WHEN v_total > 0 THEN ROUND((v_completed::NUMERIC / v_total) * 100) ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.7 Verificar acesso a curso por plano
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION can_access_course(p_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_required TEXT;
  v_user_plan TEXT;
  v_plans TEXT[] := ARRAY['free', 'pro', 'enterprise'];
BEGIN
  SELECT required_plan INTO v_required FROM training_courses WHERE id = p_course_id;
  SELECT plan INTO v_user_plan FROM profiles WHERE id = auth.uid();

  RETURN array_position(v_plans, v_user_plan) >= array_position(v_plans, v_required);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 5.8 Calcular custo IA
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_ai_cost(
  p_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER
) RETURNS NUMERIC(10,6) AS $$
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

-- -------------------------------------------------------
-- 5.9 Deletar conta (LGPD)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_user_data()
RETURNS VOID AS $$
BEGIN
  -- Anonimizar analytics (manter dados agregados)
  UPDATE analytics_sessions SET user_id = NULL WHERE user_id = auth.uid();
  UPDATE analytics_page_views SET user_id = NULL WHERE user_id = auth.uid();
  UPDATE analytics_button_clicks SET user_id = NULL WHERE user_id = auth.uid();
  UPDATE analytics_feature_usage SET user_id = NULL WHERE user_id = auth.uid();
  UPDATE analytics_ai_generations SET user_id = NULL WHERE user_id = auth.uid();
  UPDATE analytics_ad_interactions SET user_id = NULL WHERE user_id = auth.uid();

  -- Deletar dados pessoais (CASCADE cuida de filhos)
  DELETE FROM prompt_favorites WHERE user_id = auth.uid();
  DELETE FROM prompt_usage_log WHERE user_id = auth.uid();
  DELETE FROM generated_prompts WHERE user_id = auth.uid();
  DELETE FROM user_skills WHERE user_id = auth.uid();
  DELETE FROM quiz_responses WHERE user_id = auth.uid();
  DELETE FROM chat_messages WHERE user_id = auth.uid();
  DELETE FROM chat_conversations WHERE user_id = auth.uid();
  DELETE FROM user_lesson_progress WHERE user_id = auth.uid();
  DELETE FROM training_certificates WHERE user_id = auth.uid();
  DELETE FROM user_purchases WHERE user_id = auth.uid();
  DELETE FROM ai_usage_log WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();

  -- Nota: a exclusao do auth.users deve ser feita via Edge Function com service_role
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================
-- PARTE 6: VIEWS SQL PARA KPIs
-- =========================================================

-- -------------------------------------------------------
-- 6.1 DAU (Daily Active Users)
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_daily_active_users AS
SELECT
  DATE(created_at) AS date,
  COUNT(DISTINCT user_id) AS dau,
  COUNT(*) AS total_events
FROM analytics_page_views
WHERE user_id IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- -------------------------------------------------------
-- 6.2 Atividade por hora
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_hourly_activity AS
SELECT
  DATE(created_at) AS date,
  EXTRACT(HOUR FROM created_at) AS hour,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(*) AS total_page_views
FROM analytics_page_views
WHERE user_id IS NOT NULL
GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
ORDER BY date DESC, hour;

-- -------------------------------------------------------
-- 6.3 Paginas mais visitadas
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_top_pages AS
SELECT
  page_path,
  COUNT(*) AS total_views,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(duration_ms) AS avg_duration_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) AS median_duration_ms
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY total_views DESC;

-- -------------------------------------------------------
-- 6.4 Botoes mais clicados
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_top_buttons AS
SELECT
  button_id,
  button_label,
  button_type,
  page_path,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT user_id) AS unique_users
FROM analytics_button_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY button_id, button_label, button_type, page_path
ORDER BY total_clicks DESC;

-- -------------------------------------------------------
-- 6.5 Funil de conversao
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_conversion_funnel AS
WITH steps AS (
  SELECT
    p.id AS user_id,
    p.created_at AS registered_at,
    p.quiz_completed,
    p.prompts_generated,
    qr.completed_at AS quiz_completed_at,
    (SELECT MIN(created_at) FROM chat_conversations cc WHERE cc.user_id = p.id) AS first_chat_at,
    (SELECT COUNT(*) FROM chat_messages cm WHERE cm.user_id = p.id) AS total_messages
  FROM profiles p
  LEFT JOIN quiz_responses qr ON qr.user_id = p.id
)
SELECT
  COUNT(*) AS total_users,
  COUNT(CASE WHEN quiz_completed THEN 1 END) AS completed_quiz,
  COUNT(CASE WHEN prompts_generated THEN 1 END) AS generated_prompts,
  COUNT(CASE WHEN first_chat_at IS NOT NULL THEN 1 END) AS used_chat,
  COUNT(CASE WHEN total_messages >= 5 THEN 1 END) AS active_chat_users,
  ROUND(COUNT(CASE WHEN quiz_completed THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 1) AS quiz_rate,
  ROUND(COUNT(CASE WHEN prompts_generated THEN 1 END)::DECIMAL / NULLIF(COUNT(CASE WHEN quiz_completed THEN 1 END), 0) * 100, 1) AS prompt_rate,
  ROUND(COUNT(CASE WHEN first_chat_at IS NOT NULL THEN 1 END)::DECIMAL / NULLIF(COUNT(CASE WHEN prompts_generated THEN 1 END), 0) * 100, 1) AS chat_rate
FROM steps;

-- -------------------------------------------------------
-- 6.6 Retencao diaria
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_daily_retention AS
SELECT
  DATE(p.created_at) AS signup_date,
  COUNT(DISTINCT p.id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv
    WHERE pv.user_id = p.id
    AND DATE(pv.created_at) = DATE(p.created_at) + 1
  ) THEN p.id END) AS day_1,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv
    WHERE pv.user_id = p.id
    AND DATE(pv.created_at) = DATE(p.created_at) + 7
  ) THEN p.id END) AS day_7,
  COUNT(DISTINCT CASE WHEN EXISTS (
    SELECT 1 FROM analytics_page_views pv
    WHERE pv.user_id = p.id
    AND DATE(pv.created_at) = DATE(p.created_at) + 30
  ) THEN p.id END) AS day_30
FROM profiles p
GROUP BY DATE(p.created_at)
ORDER BY signup_date DESC;

-- -------------------------------------------------------
-- 6.7 Uso de features
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_feature_usage_summary AS
SELECT
  feature_name,
  feature_category,
  DATE(created_at) AS date,
  COUNT(*) AS total_uses,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(duration_ms) AS avg_duration_ms,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) AS success_count,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) AS failure_count
FROM analytics_feature_usage
GROUP BY feature_name, feature_category, DATE(created_at)
ORDER BY date DESC, total_uses DESC;

-- -------------------------------------------------------
-- 6.8 Custos IA por dia
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_ai_costs AS
SELECT
  DATE(created_at) AS date,
  generation_type,
  model_used,
  COUNT(*) AS total_calls,
  SUM(total_tokens) AS total_tokens,
  SUM(estimated_cost_usd) AS estimated_cost_usd,
  AVG(duration_ms) AS avg_duration_ms,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) AS errors
FROM analytics_ai_generations
GROUP BY DATE(created_at), generation_type, model_used
ORDER BY date DESC;

-- -------------------------------------------------------
-- 6.9 Sessoes por dispositivo
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_sessions_by_device AS
SELECT
  DATE(started_at) AS date,
  device_type,
  browser,
  os,
  COUNT(*) AS session_count,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(duration_seconds) AS avg_duration_seconds,
  AVG(page_count) AS avg_pages_per_session
FROM analytics_sessions
GROUP BY DATE(started_at), device_type, browser, os
ORDER BY date DESC, session_count DESC;

-- -------------------------------------------------------
-- 6.10 Heatmap de cliques por hora/dia
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_button_heatmap AS
SELECT
  EXTRACT(DOW FROM created_at) AS day_of_week,
  EXTRACT(HOUR FROM created_at) AS hour,
  COUNT(*) AS click_count
FROM analytics_button_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at)
ORDER BY day_of_week, hour;

-- -------------------------------------------------------
-- 6.11 Acessos por dia/mes/ano
-- -------------------------------------------------------
CREATE OR REPLACE VIEW vw_access_daily AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS total_views,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS sessions
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW vw_access_monthly AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_views,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS sessions
FROM analytics_page_views
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

CREATE OR REPLACE VIEW vw_access_yearly AS
SELECT
  EXTRACT(YEAR FROM created_at) AS year,
  COUNT(*) AS total_views,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS sessions
FROM analytics_page_views
GROUP BY EXTRACT(YEAR FROM created_at)
ORDER BY year DESC;


-- =========================================================
-- PARTE 7: FUNCOES DE AGREGACAO E LIMPEZA
-- =========================================================

-- -------------------------------------------------------
-- 7.1 Agregar stats diarios
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION aggregate_daily_stats(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics_daily_stats (
    stat_date,
    new_users,
    active_users,
    total_sessions,
    avg_session_duration,
    bounce_rate,
    total_page_views,
    quiz_completions,
    prompts_generated,
    prompts_copied,
    conversations_created,
    messages_sent,
    lessons_completed,
    ad_impressions,
    ad_clicks,
    ai_calls,
    ai_tokens_used,
    ai_cost_usd,
    ai_avg_latency_ms,
    mobile_sessions,
    desktop_sessions,
    tablet_sessions
  )
  VALUES (
    p_date,
    (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = p_date),
    (SELECT COUNT(DISTINCT user_id) FROM analytics_sessions WHERE DATE(started_at) = p_date AND user_id IS NOT NULL),
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = p_date),
    (SELECT COALESCE(AVG(duration_seconds), 0)::INTEGER FROM analytics_sessions WHERE DATE(started_at) = p_date),
    (SELECT ROUND(COUNT(*) FILTER (WHERE page_count <= 1)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 2) FROM analytics_sessions WHERE DATE(started_at) = p_date),
    (SELECT COUNT(*) FROM analytics_page_views WHERE DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM quiz_responses WHERE DATE(completed_at) = p_date),
    (SELECT COUNT(*) FROM generated_prompts WHERE DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM prompt_usage_log WHERE action = 'copy' AND DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM chat_conversations WHERE DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM chat_messages WHERE DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM user_lesson_progress WHERE completed = TRUE AND DATE(completed_at) = p_date),
    (SELECT COUNT(*) FROM analytics_ad_interactions WHERE interaction = 'view' AND DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM analytics_ad_interactions WHERE interaction = 'click' AND DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM analytics_ai_generations WHERE DATE(created_at) = p_date),
    (SELECT COALESCE(SUM(total_tokens), 0) FROM analytics_ai_generations WHERE DATE(created_at) = p_date),
    (SELECT COALESCE(SUM(estimated_cost_usd), 0) FROM analytics_ai_generations WHERE DATE(created_at) = p_date),
    (SELECT COALESCE(AVG(duration_ms), 0)::INTEGER FROM analytics_ai_generations WHERE DATE(created_at) = p_date),
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = p_date AND device_type = 'mobile'),
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = p_date AND device_type = 'desktop'),
    (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = p_date AND device_type = 'tablet')
  )
  ON CONFLICT (stat_date) DO UPDATE SET
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    total_sessions = EXCLUDED.total_sessions,
    avg_session_duration = EXCLUDED.avg_session_duration,
    bounce_rate = EXCLUDED.bounce_rate,
    total_page_views = EXCLUDED.total_page_views,
    quiz_completions = EXCLUDED.quiz_completions,
    prompts_generated = EXCLUDED.prompts_generated,
    prompts_copied = EXCLUDED.prompts_copied,
    conversations_created = EXCLUDED.conversations_created,
    messages_sent = EXCLUDED.messages_sent,
    lessons_completed = EXCLUDED.lessons_completed,
    ad_impressions = EXCLUDED.ad_impressions,
    ad_clicks = EXCLUDED.ad_clicks,
    ai_calls = EXCLUDED.ai_calls,
    ai_tokens_used = EXCLUDED.ai_tokens_used,
    ai_cost_usd = EXCLUDED.ai_cost_usd,
    ai_avg_latency_ms = EXCLUDED.ai_avg_latency_ms,
    mobile_sessions = EXCLUDED.mobile_sessions,
    desktop_sessions = EXCLUDED.desktop_sessions,
    tablet_sessions = EXCLUDED.tablet_sessions,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- 7.2 Limpeza automatica de dados antigos
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS VOID AS $$
BEGIN
  -- Page views: manter ultimos 12 meses
  DELETE FROM analytics_page_views
  WHERE created_at < NOW() - INTERVAL '12 months';

  -- Sessions: manter ultimos 12 meses
  DELETE FROM analytics_sessions
  WHERE created_at < NOW() - INTERVAL '12 months';

  -- Button clicks: manter ultimos 6 meses
  DELETE FROM analytics_button_clicks
  WHERE created_at < NOW() - INTERVAL '6 months';

  -- Feature usage: manter ultimos 24 meses
  DELETE FROM analytics_feature_usage
  WHERE created_at < NOW() - INTERVAL '24 months';

  -- Ad interactions: manter ultimos 12 meses
  DELETE FROM analytics_ad_interactions
  WHERE created_at < NOW() - INTERVAL '12 months';
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- 7.3 Resumo diario (para API do dashboard admin)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION get_daily_summary(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'date', p_date,
    'new_users', (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = p_date),
    'active_sessions', (SELECT COUNT(*) FROM analytics_sessions WHERE DATE(started_at) = p_date),
    'unique_users', (SELECT COUNT(DISTINCT user_id) FROM analytics_sessions WHERE DATE(started_at) = p_date AND user_id IS NOT NULL),
    'page_views', (SELECT COUNT(*) FROM analytics_page_views WHERE DATE(created_at) = p_date),
    'total_events', (SELECT COUNT(*) FROM analytics_button_clicks WHERE DATE(created_at) = p_date),
    'quizzes_completed', (SELECT COUNT(*) FROM quiz_responses WHERE DATE(completed_at) = p_date),
    'prompts_generated', (SELECT COUNT(*) FROM generated_prompts WHERE DATE(created_at) = p_date),
    'prompts_copied', (SELECT COUNT(*) FROM prompt_usage_log WHERE action = 'copy' AND DATE(created_at) = p_date),
    'chat_messages', (SELECT COUNT(*) FROM chat_messages WHERE DATE(created_at) = p_date),
    'ad_views', (SELECT COUNT(*) FROM analytics_ad_interactions WHERE interaction = 'view' AND DATE(created_at) = p_date),
    'ad_clicks', (SELECT COUNT(*) FROM analytics_ad_interactions WHERE interaction = 'click' AND DATE(created_at) = p_date),
    'lessons_completed', (SELECT COUNT(*) FROM user_lesson_progress WHERE completed = TRUE AND DATE(completed_at) = p_date)
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================
-- DADOS INICIAIS
-- =========================================================

-- System prompts padrao
INSERT INTO system_prompts (slug, name, content, variables, model, max_tokens) VALUES
('skill-generation', 'Geracao de Skill do Usuario',
 'Voce e um especialista em perfis profissionais de empreendedores brasileiros.

Com base nas respostas do quiz, gere um perfil "Skill" personalizado.

FORMATO DE SAIDA (JSON):
{
  "skill_name": "Titulo do perfil em 3-5 palavras",
  "skill_description": "Descricao em 2-3 frases",
  "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
  "growth_areas": ["Area para crescer 1", "Area para crescer 2"],
  "recommended_focus": ["Vendas", "Marketing"],
  "category_scores": {"vendas": 80, "atendimento": 70, "marketing": 65, "operacional": 55, "financeiro": 60}
}

REGRAS:
- recommended_focus: 2-3 categorias dentre: Vendas, Atendimento, Marketing, Operacional, Financeiro
- category_scores: 0-100 para cada categoria
- Baseie nos pain_points e business_type do usuario
- Tom pratico e motivador
- Retorne APENAS o JSON, sem texto adicional',
 ARRAY['user_name', 'business_type', 'business_niche', 'revenue_range', 'team_size', 'pain_points', 'ai_experience'],
 'anthropic/claude-3.5-sonnet', 1024),

('prompt-generation', 'Geracao de Prompts Personalizados',
 'Sua tarefa: gerar prompts PERSONALIZADOS baseados no perfil do usuario.

REGRAS:
1. Cada prompt deve ser ESPECIFICO para o nicho/negocio
2. Use o nome do usuario quando fizer sentido
3. Use vocabulario do setor dele
4. Inclua contexto real (faturamento, equipe, desafios)
5. Cada prompt copy+cola — sem [colchetes]
6. 2 variacoes por prompt
7. "dica de ouro" para melhorar resultado
8. Tom: pratico, direto

CATEGORIAS E DISTRIBUICAO:
- vendas: 5-12 prompts
- atendimento: 3-7 prompts
- marketing: 5-12 prompts
- operacional: 3-6 prompts
- financeiro: 2-4 prompts

Total: 25-35 prompts

FORMATO SAIDA (JSON):
{
  "business_context": "resumo do negocio",
  "prompts": [{
    "category": "vendas",
    "situation": "Descricao da situacao real",
    "prompt_text": "Prompt completo",
    "variations": [
      { "context": "Para cliente novo", "prompt": "..." }
    ],
    "golden_tip": "Dica de ouro",
    "estimated_time_saved": "30min"
  }]
}',
 ARRAY['user_name', 'business_type', 'business_niche', 'revenue_range', 'team_size', 'pain_points', 'skill_name', 'strengths'],
 'anthropic/claude-3.5-sonnet', 16000),

('chat-assistant', 'Assistente de Chat',
 'Voce e o Prompt Generator da EXECUTIVOS, um assistente especializado em criacao de prompts de IA para empreendedores brasileiros.

CONTEXTO DO USUARIO:
- Nome: {{user_name}}
- Negocio: {{business_type}} no nicho {{business_niche}}

SUA FUNCAO:
- Ajudar a refinar prompts existentes
- Criar novos prompts para situacoes especificas
- Dar dicas de uso de IA no negocio
- Responder duvidas sobre prompts
- Gerar prompts em formato JSON profissional

REGRAS:
- Pratico e direto
- Exemplos prontos para copiar
- Use contexto do negocio
- Portugues brasileiro
- Sem linguagem corporativa rebuscada',
 ARRAY['user_name', 'business_type', 'business_niche'],
 'anthropic/claude-3.5-sonnet', 4096)
ON CONFLICT (slug) DO NOTHING;

-- Modelos IA padrao
INSERT INTO ai_models (provider, model_id, name, is_primary, is_fallback, cost_per_1k_input, cost_per_1k_output, max_tokens) VALUES
('openrouter', 'anthropic/claude-3.5-sonnet', 'Claude 3.5 Sonnet', TRUE, FALSE, 0.003, 0.015, 8192),
('openrouter', 'openai/gpt-4o-mini', 'GPT-4o Mini', FALSE, TRUE, 0.00015, 0.0006, 16384)
ON CONFLICT (model_id) DO NOTHING;


-- =========================================================
-- FIM DO SCRIPT
-- =========================================================
--
-- Resumo do que foi criado:
--
-- TABELAS NOVAS (12):
--   training_courses, training_certificates,
--   prompt_favorites, prompt_usage_log,
--   ad_banners, products, user_purchases,
--   system_prompts, ai_models, ai_usage_log,
--   analytics_sessions, analytics_page_views,
--   analytics_button_clicks, analytics_feature_usage,
--   analytics_ai_generations, analytics_ad_interactions,
--   analytics_daily_stats
--
-- CAMPOS NOVOS em tabelas existentes:
--   profiles: is_admin, plan, plan_expires_at, preferred_ai_model,
--             last_login_at, login_count, is_active
--   user_skills: category_scores
--   training_modules: course_id
--
-- FUNCTIONS/RPCs (9):
--   save_quiz_response, reset_quiz, check_chat_limit,
--   check_generation_limit, rename_conversation,
--   get_course_progress, can_access_course,
--   calculate_ai_cost, delete_user_data
--
-- VIEWS SQL (11):
--   vw_daily_active_users, vw_hourly_activity,
--   vw_top_pages, vw_top_buttons,
--   vw_conversion_funnel, vw_daily_retention,
--   vw_feature_usage_summary, vw_ai_costs,
--   vw_sessions_by_device, vw_button_heatmap,
--   vw_access_daily, vw_access_monthly, vw_access_yearly
--
-- FUNCTIONS DE MANUTENCAO (3):
--   aggregate_daily_stats, cleanup_old_analytics,
--   get_daily_summary
--
-- STORAGE BUCKETS (5):
--   avatars, training-materials, training-thumbnails,
--   banners, product-images
--
-- DADOS INICIAIS:
--   3 system_prompts, 2 ai_models
-- =========================================================
