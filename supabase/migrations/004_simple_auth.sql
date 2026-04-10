-- ============================================================
-- 004 — AUTH SIMPLIFICADO: Login/Registro direto na profiles
-- ============================================================
-- Sem Supabase Auth. Email + senha na tabela profiles.
-- Senha hashada com pgcrypto (bcrypt).
-- ============================================================

-- 1. Habilitar pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Adicionar campos de auth na profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Remover dependencia de auth.users
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE profiles ADD PRIMARY KEY (id);
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Remover trigger antigo que dependia de auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 5. RPC: Registrar usuario
CREATE OR REPLACE FUNCTION register_user(
  p_full_name TEXT,
  p_email TEXT,
  p_password TEXT
) RETURNS JSONB AS $$
DECLARE
  v_id UUID;
  v_profile JSONB;
BEGIN
  -- Verificar se email ja existe
  IF EXISTS (SELECT 1 FROM profiles WHERE email = LOWER(TRIM(p_email))) THEN
    RETURN jsonb_build_object('error', 'Email ja cadastrado');
  END IF;

  INSERT INTO profiles (id, full_name, display_name, email, password_hash)
  VALUES (
    gen_random_uuid(),
    TRIM(p_full_name),
    TRIM(p_full_name),
    LOWER(TRIM(p_email)),
    crypt(p_password, gen_salt('bf'))
  )
  RETURNING id INTO v_id;

  SELECT jsonb_build_object(
    'id', p.id,
    'full_name', p.full_name,
    'display_name', p.display_name,
    'email', p.email,
    'avatar_url', p.avatar_url,
    'phone', p.phone,
    'business_type', p.business_type,
    'business_niche', p.business_niche,
    'revenue_range', p.revenue_range,
    'team_size', p.team_size,
    'ai_experience', p.ai_experience,
    'communication_tone', p.communication_tone,
    'onboarding_completed', p.onboarding_completed,
    'quiz_completed', p.quiz_completed,
    'prompts_generated', p.prompts_generated,
    'is_active', p.is_active,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  ) INTO v_profile
  FROM profiles p WHERE p.id = v_id;

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_id,
    'profile', v_profile
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: Login
CREATE OR REPLACE FUNCTION login_user(
  p_email TEXT,
  p_password TEXT
) RETURNS JSONB AS $$
DECLARE
  v_profile JSONB;
  v_id UUID;
  v_active BOOLEAN;
BEGIN
  SELECT p.id, p.is_active,
    jsonb_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'display_name', p.display_name,
      'email', p.email,
      'avatar_url', p.avatar_url,
      'phone', p.phone,
      'business_type', p.business_type,
      'business_niche', p.business_niche,
      'revenue_range', p.revenue_range,
      'team_size', p.team_size,
      'ai_experience', p.ai_experience,
      'communication_tone', p.communication_tone,
      'onboarding_completed', p.onboarding_completed,
      'quiz_completed', p.quiz_completed,
      'prompts_generated', p.prompts_generated,
      'is_active', p.is_active,
      'created_at', p.created_at,
      'updated_at', p.updated_at
    )
  INTO v_id, v_active, v_profile
  FROM profiles p
  WHERE p.email = LOWER(TRIM(p_email))
    AND p.password_hash = crypt(p_password, p.password_hash);

  IF v_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Email ou senha incorretos');
  END IF;

  IF NOT COALESCE(v_active, TRUE) THEN
    RETURN jsonb_build_object('error', 'Conta desativada');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_id,
    'profile', v_profile
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC: Buscar perfil por ID (sem auth.uid)
CREATE OR REPLACE FUNCTION get_profile_by_id(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', p.id,
    'full_name', p.full_name,
    'display_name', p.display_name,
    'email', p.email,
    'avatar_url', p.avatar_url,
    'phone', p.phone,
    'business_type', p.business_type,
    'business_niche', p.business_niche,
    'revenue_range', p.revenue_range,
    'team_size', p.team_size,
    'ai_experience', p.ai_experience,
    'communication_tone', p.communication_tone,
    'onboarding_completed', p.onboarding_completed,
    'quiz_completed', p.quiz_completed,
    'prompts_generated', p.prompts_generated,
    'is_active', p.is_active,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  ) INTO v_profile
  FROM profiles p
  WHERE p.id = p_user_id AND COALESCE(p.is_active, TRUE) = TRUE;

  RETURN COALESCE(v_profile, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Permissoes: anon pode chamar os RPCs
GRANT EXECUTE ON FUNCTION register_user(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION login_user(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_profile_by_id(UUID) TO anon;
GRANT EXECUTE ON FUNCTION register_user(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION login_user(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_by_id(UUID) TO authenticated;

-- 9. RLS: permitir leitura aberta de profiles (RPCs usam SECURITY DEFINER,
--    mas queries diretas do frontend precisam disso)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles by id" ON profiles;
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Permitir update por qualquer um que saiba o ID (simplificado)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (true);

-- Permitir insert (para o RPC funcionar e para queries diretas)
CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);
