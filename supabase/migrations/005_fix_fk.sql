-- ============================================================
-- 005 — FIX: Remover FK de profiles para auth.users
-- ============================================================
-- O 004 tentou DROP CONSTRAINT profiles_pkey CASCADE mas a FK
-- pode ter outro nome. Vamos encontrar e remover.
-- ============================================================

-- Remover TODAS as foreign keys de profiles que apontem para auth.users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'f'
  LOOP
    RAISE NOTICE 'Dropping FK: %', r.conname;
    EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT ' || quote_ident(r.conname) || ' CASCADE';
  END LOOP;
END $$;

-- Garantir PK e default UUID
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE profiles ADD PRIMARY KEY (id);
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verificacao: listar constraints restantes
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT conname, contype
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
  LOOP
    RAISE NOTICE 'Constraint: % (type: %)', r.conname, r.contype;
  END LOOP;
END $$;
