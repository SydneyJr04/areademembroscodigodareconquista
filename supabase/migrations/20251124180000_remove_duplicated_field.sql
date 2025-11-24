-- ============================================
-- MIGRATION: Remover campo duplicado 'completed'
-- Data: 2025-11-24
-- Objetivo: Manter apenas 'is_completed'
-- ============================================

BEGIN;

-- 1. Migrar dados do campo 'completed' para 'is_completed' (se houver)
UPDATE user_lessons
SET is_completed = COALESCE(completed, false)
WHERE is_completed IS NULL;

-- 2. Garantir que completed_at está correto
UPDATE user_lessons
SET completed_at = updated_at
WHERE is_completed = true AND completed_at IS NULL;

-- 3. Remover o campo duplicado 'completed' (se existir)
ALTER TABLE user_lessons DROP COLUMN IF EXISTS completed;

-- 4. Garantir que is_completed tem default e não é null
ALTER TABLE user_lessons
ALTER COLUMN is_completed SET DEFAULT false;

-- Se a coluna permitia NULL, tornar NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_lessons'
    AND column_name = 'is_completed'
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE user_lessons ALTER COLUMN is_completed SET NOT NULL;
  END IF;
END $$;

-- 5. Criar índice para queries comuns (se não existir)
CREATE INDEX IF NOT EXISTS idx_user_lessons_completed
ON user_lessons(user_id, module_id, is_completed)
WHERE is_completed = true;

COMMIT;

-- ============================================
-- VERIFICAÇÃO PÓS-MIGRATION
-- ============================================
-- Execute para verificar:
-- SELECT COUNT(*) FROM user_lessons WHERE is_completed = true;
-- SELECT * FROM user_lessons LIMIT 5;
