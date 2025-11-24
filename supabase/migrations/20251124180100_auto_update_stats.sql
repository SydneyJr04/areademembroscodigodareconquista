-- ============================================
-- MIGRATION: Trigger para atualizar user_stats automaticamente
-- Data: 2025-11-24
-- Objetivo: Quando uma aula for marcada como completa,
--           atualizar user_stats automaticamente
-- ============================================

BEGIN;

-- ============================================
-- FUNÇÃO: Atualizar user_stats quando aula completa
-- ============================================
CREATE OR REPLACE FUNCTION update_user_stats_on_lesson_complete()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_lessons_completed INT;
  v_modules_completed INT;
  v_total_watch_time INT;
  v_last_activity DATE;
  v_current_streak INT;
BEGIN
  -- Só executar quando is_completed mudar de false para true
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN

    -- 1. Calcular total de aulas completas
    SELECT COUNT(*)
    INTO v_lessons_completed
    FROM user_lessons
    WHERE user_id = NEW.user_id
      AND is_completed = true;

    -- 2. Calcular total de módulos completos
    SELECT COUNT(*)
    INTO v_modules_completed
    FROM user_modules
    WHERE user_id = NEW.user_id
      AND is_completed = true;

    -- 3. Calcular tempo total de visualização (em minutos)
    -- Assumindo que cada aula tem em média 15 minutos
    v_total_watch_time := v_lessons_completed * 15;

    -- 4. Calcular streak de dias consecutivos
    SELECT COALESCE(last_activity_date, CURRENT_DATE - INTERVAL '2 days')
    INTO v_last_activity
    FROM user_stats
    WHERE user_id = NEW.user_id;

    -- Se atividade foi ontem, incrementar streak
    IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
      SELECT COALESCE(current_streak_days, 0) + 1
      INTO v_current_streak
      FROM user_stats
      WHERE user_id = NEW.user_id;
    -- Se atividade é hoje, manter streak
    ELSIF v_last_activity = CURRENT_DATE THEN
      SELECT COALESCE(current_streak_days, 1)
      INTO v_current_streak
      FROM user_stats
      WHERE user_id = NEW.user_id;
    -- Se passou mais de 1 dia, resetar streak para 1
    ELSE
      v_current_streak := 1;
    END IF;

    -- 5. Atualizar user_stats
    INSERT INTO user_stats (
      user_id,
      lessons_completed,
      modules_completed,
      total_watch_time_minutes,
      current_streak_days,
      longest_streak_days,
      last_activity_date
    )
    VALUES (
      NEW.user_id,
      v_lessons_completed,
      v_modules_completed,
      v_total_watch_time,
      v_current_streak,
      GREATEST(v_current_streak, COALESCE((
        SELECT longest_streak_days FROM user_stats WHERE user_id = NEW.user_id
      ), 0)),
      CURRENT_DATE
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      lessons_completed = v_lessons_completed,
      modules_completed = v_modules_completed,
      total_watch_time_minutes = v_total_watch_time,
      current_streak_days = v_current_streak,
      longest_streak_days = GREATEST(v_current_streak, user_stats.longest_streak_days),
      last_activity_date = CURRENT_DATE,
      updated_at = now();

    -- 6. Verificar se completou todos os módulos (conquista!)
    IF v_modules_completed = 7 THEN
      RAISE NOTICE 'Usuário % completou TODOS os módulos! 🎉', NEW.user_id;
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGER: Acionar função após INSERT/UPDATE em user_lessons
-- ============================================
DROP TRIGGER IF EXISTS trigger_update_user_stats ON user_lessons;

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT OR UPDATE OF is_completed
ON user_lessons
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_lesson_complete();

-- ============================================
-- FUNÇÃO AUXILIAR: Recalcular stats de um usuário
-- ============================================
CREATE OR REPLACE FUNCTION recalculate_user_stats(p_user_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_lessons_completed INT;
  v_modules_completed INT;
  v_total_watch_time INT;
BEGIN
  -- Contar aulas completas
  SELECT COUNT(*)
  INTO v_lessons_completed
  FROM user_lessons
  WHERE user_id = p_user_id
    AND is_completed = true;

  -- Contar módulos completos
  SELECT COUNT(*)
  INTO v_modules_completed
  FROM user_modules
  WHERE user_id = p_user_id
    AND is_completed = true;

  -- Calcular tempo (15 min por aula)
  v_total_watch_time := v_lessons_completed * 15;

  -- Atualizar stats
  INSERT INTO user_stats (
    user_id,
    lessons_completed,
    modules_completed,
    total_watch_time_minutes,
    last_activity_date
  )
  VALUES (
    p_user_id,
    v_lessons_completed,
    v_modules_completed,
    v_total_watch_time,
    CURRENT_DATE
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    lessons_completed = v_lessons_completed,
    modules_completed = v_modules_completed,
    total_watch_time_minutes = v_total_watch_time,
    updated_at = now();

  RAISE NOTICE 'Stats recalculadas: % aulas, % módulos', v_lessons_completed, v_modules_completed;
END;
$$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT EXECUTE ON FUNCTION update_user_stats_on_lesson_complete() TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_user_stats(UUID) TO authenticated;

COMMIT;

-- ============================================
-- TESTES
-- ============================================
-- Para testar manualmente:
-- SELECT recalculate_user_stats('seu-user-id-aqui');
-- SELECT * FROM user_stats WHERE user_id = 'seu-user-id-aqui';
