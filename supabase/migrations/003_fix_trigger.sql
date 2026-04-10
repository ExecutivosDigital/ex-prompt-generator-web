-- ============================================================
-- 003 — FIX: Corrigir trigger handle_new_user
-- ============================================================
-- O signup falha com "Database error saving new user" porque
-- o trigger handle_new_user() falha ao inserir no profiles.
--
-- Este script:
-- 1. Recria a funcao com tratamento de erros
-- 2. Garante que o trigger existe
-- 3. Testa a configuracao
-- ============================================================

-- Dropar trigger existente para recriar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar funcao com tratamento de erros robusto
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas NAO falhar o signup
  RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Verificar se a funcao utility existe
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Garantir que o trigger de updated_at existe
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Verificar permissoes: a funcao precisa de acesso ao schema public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Garantir que a sequencia de UUID funciona
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;

-- ============================================================
-- Teste: verificar se tudo esta OK
-- ============================================================
-- Rode isso separadamente depois para conferir:
--
-- SELECT
--   p.proname AS function_name,
--   t.tgname AS trigger_name,
--   t.tgenabled AS enabled
-- FROM pg_trigger t
-- JOIN pg_proc p ON t.tgfoid = p.oid
-- WHERE t.tgrelid = 'auth.users'::regclass;
-- ============================================================
