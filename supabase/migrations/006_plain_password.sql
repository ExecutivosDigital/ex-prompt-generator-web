-- ============================================================
-- 006 — Senha em texto plano na tabela profiles
-- ============================================================

-- 1. Adicionar coluna password (texto plano) se nao existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Recriar register_user sem hash
CREATE OR REPLACE FUNCTION register_user(
  p_full_name TEXT,
  p_email TEXT,
  p_password TEXT
) RETURNS JSONB AS $$
DECLARE
  v_id UUID;
  v_profile JSONB;
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = LOWER(TRIM(p_email))) THEN
    RETURN jsonb_build_object('error', 'Email ja cadastrado');
  END IF;

  INSERT INTO profiles (id, full_name, display_name, email, password)
  VALUES (
    gen_random_uuid(),
    TRIM(p_full_name),
    TRIM(p_full_name),
    LOWER(TRIM(p_email)),
    p_password
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

-- 3. Recriar login_user sem hash
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
    AND p.password = p_password;

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
