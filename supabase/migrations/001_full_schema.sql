-- ============================================================
-- Full database schema for the application
-- ============================================================

-- -------------------------------------------------------
-- 0. Utility: reusable updated_at trigger function
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- 1. profiles (extends auth.users)
-- -------------------------------------------------------
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  display_name    TEXT,
  avatar_url      TEXT,
  phone           TEXT,
  business_type   TEXT,
  business_niche  TEXT,
  revenue_range   TEXT,
  team_size       TEXT,
  ai_experience   TEXT,
  communication_tone TEXT,
  work_routine    TEXT,
  tech_comfort    TEXT,
  data_frequency  TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  quiz_completed       BOOLEAN DEFAULT FALSE,
  prompts_generated    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on new auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- -------------------------------------------------------
-- 2. quiz_responses
-- -------------------------------------------------------
CREATE TABLE quiz_responses (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses          JSONB NOT NULL,
  pain_points        TEXT[] DEFAULT '{}',
  quiz_version       INTEGER DEFAULT 2,
  time_spent_seconds INTEGER,
  completed_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
  ON quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- 3. user_skills
-- -------------------------------------------------------
CREATE TABLE user_skills (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name        TEXT NOT NULL,
  skill_description TEXT NOT NULL,
  strengths         TEXT[],
  growth_areas      TEXT[],
  recommended_focus TEXT[],
  ai_model          TEXT NOT NULL,
  raw_response      JSONB,
  quiz_response_id  UUID REFERENCES quiz_responses(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_quiz_response_id ON user_skills(quiz_response_id);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- 4. generated_prompts
-- -------------------------------------------------------
CREATE TABLE generated_prompts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_response_id    UUID REFERENCES quiz_responses(id) ON DELETE SET NULL,
  category            TEXT NOT NULL CHECK (category IN ('produtividade','comunicacao','analise_dados','automacao','tomada_decisao')),
  prompt_index        INTEGER,
  situation           TEXT NOT NULL,
  prompt_text         TEXT NOT NULL,
  variations          JSONB DEFAULT '[]',
  golden_tip          TEXT,
  estimated_time_saved TEXT,
  ai_model            TEXT NOT NULL,
  generation_batch_id UUID,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_prompts_user_id ON generated_prompts(user_id);
CREATE INDEX idx_generated_prompts_quiz_response_id ON generated_prompts(quiz_response_id);
CREATE INDEX idx_generated_prompts_category ON generated_prompts(category);
CREATE INDEX idx_generated_prompts_batch_id ON generated_prompts(generation_batch_id);

ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON generated_prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts"
  ON generated_prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------
-- 5. chat_conversations
-- -------------------------------------------------------
CREATE TABLE chat_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT DEFAULT 'Nova conversa',
  model           TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
  message_count   INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_last_message ON chat_conversations(user_id, last_message_at DESC);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- 6. chat_messages
-- -------------------------------------------------------
CREATE TABLE chat_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content         TEXT NOT NULL,
  tokens_used     INTEGER,
  model           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation_created ON chat_messages(conversation_id, created_at);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-update conversation stats on new message
CREATE OR REPLACE FUNCTION handle_new_chat_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations
  SET message_count = message_count + 1,
      last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_chat_message_inserted
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_chat_message();

-- -------------------------------------------------------
-- 7. training_modules
-- -------------------------------------------------------
CREATE TABLE training_modules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  sort_order    INTEGER DEFAULT 0,
  lesson_count  INTEGER DEFAULT 0,
  is_published  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published modules"
  ON training_modules FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = TRUE);

-- Auto-update updated_at
CREATE TRIGGER training_modules_updated_at
  BEFORE UPDATE ON training_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- 8. training_lessons
-- -------------------------------------------------------
CREATE TABLE training_lessons (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id              UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  title                  TEXT NOT NULL,
  description            TEXT,
  video_url              TEXT,
  video_duration_seconds INTEGER,
  content_html           TEXT,
  downloadable_files     JSONB DEFAULT '[]',
  sort_order             INTEGER DEFAULT 0,
  is_published           BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_lessons_module_id ON training_lessons(module_id);
CREATE INDEX idx_training_lessons_sort ON training_lessons(module_id, sort_order);

ALTER TABLE training_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published lessons"
  ON training_lessons FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = TRUE);

-- Auto-update updated_at
CREATE TRIGGER training_lessons_updated_at
  BEFORE UPDATE ON training_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- 9. user_lesson_progress
-- -------------------------------------------------------
CREATE TABLE user_lesson_progress (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id            UUID NOT NULL REFERENCES training_lessons(id) ON DELETE CASCADE,
  module_id            UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  completed            BOOLEAN DEFAULT FALSE,
  completed_at         TIMESTAMPTZ,
  last_watched_seconds INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_module ON user_lesson_progress(user_id, module_id);
CREATE INDEX idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER user_lesson_progress_updated_at
  BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
