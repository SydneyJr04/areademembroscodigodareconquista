-- Corrigir todas as funções sem search_path
CREATE OR REPLACE FUNCTION public.initialize_user_modules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  modules jsonb := '[
    {"number": 1, "name": "Reset Emocional", "days_delay": 0},
    {"number": 2, "name": "Mapa da Mente Masculina", "days_delay": 2},
    {"number": 3, "name": "Gatilhos da Memória Emocional", "days_delay": 4},
    {"number": 4, "name": "A Frase de 5 Palavras", "days_delay": 6},
    {"number": 5, "name": "Primeiro Contato Estratégico", "days_delay": 8},
    {"number": 6, "name": "Domínio da Conversa", "days_delay": 10},
    {"number": 7, "name": "Conquista Duradoura", "days_delay": 12}
  ]'::jsonb;
  module jsonb;
BEGIN
  FOR module IN SELECT * FROM jsonb_array_elements(modules)
  LOOP
    INSERT INTO public.user_modules (
      user_id,
      module_number,
      module_name,
      release_date,
      is_released
    ) VALUES (
      NEW.id,
      (module->>'number')::integer,
      module->>'name',
      now() + ((module->>'days_delay')::integer || ' days')::interval,
      (module->>'days_delay')::integer = 0
    );
  END LOOP;
  
  RETURN NEW;
END;
$function$;