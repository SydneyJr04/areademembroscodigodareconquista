/*
  # Código da Reconquista - Complete Members Area Schema

  ## Overview
  Complete database schema for the "Código da Reconquista" course members area.
  Implements user profiles, modules, lessons, progress tracking, payments, and gamification.

  ## Tables Created
  1. **profiles** - Extended user information (name, phone, subscription status)
  2. **modules** - Course modules catalog
  3. **lessons** - Individual lessons within modules
  4. **user_modules** - User access control with drip content release dates
  5. **user_lessons** - Lesson progress tracking (completion, watch percentage)
  6. **payments** - Stripe payment records
  7. **user_stats** - Gamification statistics (streaks, total watch time)

  ## Security
  - Row Level Security enabled on all user-specific tables
  - Policies restrict users to their own data
  - Public read access to modules/lessons catalog for authenticated users

  ## Automation
  - Trigger creates initial records when user signs up
  - Trigger updates stats when lessons are completed
  - Drip content: 1 module released every 2 days
*/

-- =====================================================
-- TABELA: profiles (complementa auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT NOT NULL,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'semanal', 'mensal', 'vitalicio')),
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- =====================================================
-- TABELA: modules (catálogo de módulos)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.modules (
  id SERIAL PRIMARY KEY,
  module_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_text TEXT,
  total_lessons INTEGER DEFAULT 0,
  badge_text TEXT,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: lessons (catálogo de aulas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL,
  duration_seconds INTEGER,
  is_bonus BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, lesson_number)
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);

-- =====================================================
-- TABELA: user_modules (controle de acesso e liberação)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
  release_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_user_modules_user ON public.user_modules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_release ON public.user_modules(user_id, release_date);

-- =====================================================
-- TABELA: user_lessons (progresso de aulas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  watch_percentage INTEGER DEFAULT 0 CHECK (watch_percentage BETWEEN 0 AND 100),
  last_watched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lessons_user ON public.user_lessons(user_id);

-- =====================================================
-- TABELA: payments (histórico de pagamentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'MZN',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  subscription_tier TEXT,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON public.payments(stripe_payment_intent_id);

-- =====================================================
-- TABELA: user_stats (estatísticas e gamificação)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  total_watch_time_seconds INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  modules_completed INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_logins INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies para user_modules
DROP POLICY IF EXISTS "Users can view own modules" ON public.user_modules;
CREATE POLICY "Users can view own modules"
  ON public.user_modules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies para user_lessons
DROP POLICY IF EXISTS "Users can view own lessons" ON public.user_lessons;
CREATE POLICY "Users can view own lessons"
  ON public.user_lessons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lessons" ON public.user_lessons;
CREATE POLICY "Users can update own lessons"
  ON public.user_lessons FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lessons" ON public.user_lessons;
CREATE POLICY "Users can insert own lessons"
  ON public.user_lessons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies para payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies para user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Módulos podem ser lidos por todos usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can view modules" ON public.modules;
CREATE POLICY "Authenticated users can view modules"
  ON public.modules FOR SELECT
  TO authenticated
  USING (true);

-- Lessons podem ser lidas por todos usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON public.lessons;
CREATE POLICY "Authenticated users can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- FUNÇÃO: Criar registros iniciais ao cadastrar usuário
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, whatsapp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
  );

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_modules (user_id, module_id, release_date)
  SELECT 
    NEW.id,
    m.id,
    NOW() + ((m.module_number - 1) * INTERVAL '2 days')
  FROM public.modules m
  WHERE m.is_active = true;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNÇÃO: Atualizar estatísticas ao completar aula
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_stats_on_lesson_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    UPDATE public.user_stats
    SET 
      lessons_completed = lessons_completed + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_lesson_completed ON public.user_lessons;
CREATE TRIGGER on_lesson_completed
  AFTER UPDATE ON public.user_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_on_lesson_complete();

-- =====================================================
-- SEED: Inserir módulos e aulas
-- =====================================================
INSERT INTO public.modules (module_number, title, slug, description, thumbnail_url, duration_text, total_lessons, badge_text, order_index) 
VALUES
(1, 'Reset Emocional', 'reset-emocional', 'Aprende a parar de agir pela emoção e descobre a melhor técnica de reconquista amorosa. O primeiro passo para virar o jogo.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%201.webp', '45 min', 7, 'MAIS VISTO', 1),
(2, 'Mapa da Mente Masculina', 'mapa-mente-masculina', 'Descobre porque homens se apaixonam pela ausência e como fazer ele sentir a tua falta de forma irresistível.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%202.webp', '50 min', 7, 'RECOMENDADO', 2),
(3, 'Gatilhos da Memória Emocional', 'gatilhos-memoria-emocional', 'Como ativar a memória emocional dele e fazê-lo reviver os melhores momentos convosco de forma involuntária.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%203.webp', '55 min', 4, 'NOVO', 3),
(4, 'A Frase de 5 Palavras', 'frase-5-palavras', 'A frase secreta de 5 palavras que ativa o desejo dele instantaneamente. Usa no WhatsApp, ao vivo ou por áudio.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%204.webp', '60 min', 4, 'POPULAR', 4),
(5, 'Primeiro Contato Estratégico', 'primeiro-contato-estrategico', 'O que dizer quando ele te procurar (ou como fazer ele dar o primeiro passo). Scripts prontos para cada situação.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%205.webp', '48 min', 3, 'NOVO', 5),
(6, 'Domínio da Conversa', 'dominio-conversa', 'Como manter conversas envolventes sem parecer carente. As 3 frases que ativam o desejo do homem.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%206.webp', '52 min', 5, 'POPULAR', 6),
(7, 'Conquista Duradoura', 'conquista-duradoura', 'Os 5 pilares do relacionamento saudável. Como manter a chama acesa e transformar reconquista em amor eterno.', 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%207.webp', '58 min', 6, 'MAIS VISTO', 7)
ON CONFLICT (module_number) DO NOTHING;

INSERT INTO public.lessons (module_id, lesson_number, title, slug, description, youtube_id, is_bonus, order_index) VALUES
(1, 1, 'Suma que ELE VEM ATRÁS!', 'suma-que-ele-vem-atras', 'Entenda por que o desapego é a chave para fazê-lo voltar. Aprenda a virar o jogo usando a ausência estratégica a seu favor.', 'c1CQZVK5lhc', false, 1),
(1, 2, 'NÃO TENHA MEDO de sumir e ELE TE ESQUECER!', 'nao-tenha-medo-sumir', 'Descubra o timing perfeito para aplicar a ausência e fazer ele sentir a sua falta de forma incontrolável.', 'S7_4EebCUcM', false, 2),
(1, 3, 'Os HOMENS SEMPRE VOLTAM Como assim!!', 'homens-sempre-voltam', 'Por que homens sempre voltam quando você para de correr atrás. A psicologia por trás da ausência.', 'fsCvIC_FYRM', false, 3),
(1, 4, 'HOMEM precisa de AUSÊNCIA e TEMPO para CORRER ATRÁS', 'homem-ausencia-tempo', 'O timing masculino é diferente. Aprenda a respeitar este processo e use a seu favor.', 'wPFir0N4HoU', false, 4),
(1, 5, 'Por que quando a MULHER SOME O HOMEM VAI ATRÁS?', 'mulher-some-homem-vai-atras', 'A ciência por trás do comportamento masculino de valorizar o que está longe.', 'w3gApW6MI3M', true, 5),
(1, 6, 'Por que NÃO IR ATRÁS é a melhor escolha?', 'nao-ir-atras', 'Entenda porque correr atrás destrói atração e como reverter isso.', 'ODhg0ND4DYc', true, 6),
(1, 7, 'Não entre em DESESPERO! Senão você PERDE!', 'nao-entre-desespero', 'Como controlar a ansiedade e não sabotar sua reconquista por desespero.', 'jGjdF7U14EY', true, 7),
(2, 1, 'OS 5 PRINCÍPIOS DA MENTE MASCULINA!', 'os-5-principios-mente-masculina', 'Domine os 5 pilares da psicologia masculina que determinam como ele age, sente e decide em um relacionamento.', 'Kvmh9RUIfFc', false, 1),
(2, 2, 'COMO CONTROLAR A MENTE DE UM HOMEM?', 'como-controlar-mente-homem', 'Aprenda os mecanismos psicológicos que regem as decisões masculinas e como usá-los a seu favor na reconquista.', '-pfXXwkNWTk', false, 2),
(2, 3, 'O que o SILÊNCIO faz na CABEÇA de um HOMEM?', 'silencio-cabeca-homem', 'Descubra o poder devastador do silêncio estratégico na mente masculina.', 'v_d7mmtVh0c', false, 3),
(2, 4, 'CABEÇA DO HOMEM no PÓS TÉRMINO.', 'cabeca-homem-pos-termino', 'O que realmente se passa na mente dele depois que termina. A linha do tempo masculina.', 'knKjXRx0iag', false, 4),
(2, 5, 'OS HOMENS SÃO PREVISÍVEIS!! ATENÇÃO MULHERES!!', 'homens-previsiveis', 'Padrões de comportamento masculino que se repetem em 95% dos casos.', 'eDMlDbXrBUA', true, 5),
(2, 6, 'HOMEM GOSTA DE SER PISADO E DESPREZADO?', 'homem-gosta-ser-pisado', 'A psicologia reversa e quando ela funciona (ou não).', 'DbMmYHv1xkk', true, 6),
(2, 7, 'LINHA MASCULINA do tempo no PÓS TÉRMINO?', 'linha-masculina-tempo', 'Timeline detalhada: o que ele sente semana a semana após o término.', 'nz3IEPR7euo', true, 7),
(3, 1, 'Como deixar um HOMEM COM MEDO DE PERDER!', 'homem-medo-perder', 'Ative o gatilho do medo da perda e faça ele perceber que pode estar a cometer o maior erro da vida dele.', 'Itat8QDkhhQ', false, 1),
(3, 2, 'APRENDA A REJEITAR PRA ELE VIR ATRAS!', 'rejeitar-ele-vir-atras', 'A arte de dizer não no momento certo para aumentar seu valor percebido.', '5LMJop82nBk', false, 2),
(3, 3, 'Postura que faz HOMEM QUERER FEITO DOIDO.', 'postura-homem-querer', 'Linguagem corporal, atitude e energia que ativam desejo instantâneo.', '8KD93jjgbBg', false, 3),
(3, 4, 'EU QUERO QUE ELE VOLTE RASTEJAAAANNNDO!', 'ele-volte-rastejando', 'Estratégias avançadas para fazer ele implorar por uma segunda chance.', 'TAgC5VAg2_o', true, 4),
(4, 1, '3 Frases Pra Mexer PROFUNDAMENTE com o Psicológico de um Homem!', 'tres-frases-psicologico', 'Aprenda as 3 frases secretas que ativam a memória emocional dele e reacendem a paixão adormecida.', 'hjVBIwEWO7o', false, 1),
(4, 2, 'A Mensagem que Reconquista ELE Sumiu Diga isso!', 'mensagem-reconquista', 'A mensagem exata para enviar quando ele desaparece, que o faz voltar arrependido e desesperado por uma segunda chance.', 'tu2NxuqrbK4', false, 2),
(4, 3, 'ELE SUMIU! Devo MANDAR um ''Oi''?', 'ele-sumiu-mandar-oi', 'O que fazer (e não fazer) quando ele some. Scripts de mensagens testadas.', 'hRYhIoNhJqs', false, 3),
(4, 4, 'Como Fazer Ele SENTIR SUA FALTA', 'fazer-sentir-falta', 'Técnicas práticas para criar saudade genuína e incontrolável.', 'PGKr4GN-UtM', true, 4),
(5, 1, 'O EX APARECEU FAÇA CERTO DESSA VEZ!', 'ex-apareceu-faca-certo', 'O que dizer e fazer quando ele te procura de novo. Evite os erros fatais e capitalize este momento crucial.', '-6YSO7AYrZI', false, 1),
(5, 2, 'Como se comportar ao se ENCONTRAR com EX?', 'comportar-encontrar-ex', 'O guia completo de postura, tom de voz e linguagem corporal para o primeiro encontro após o término.', 'sklhMr24Fg4', false, 2),
(5, 3, 'Ele enviou ''SAUDADES''!!! O QUE RESPONDER?', 'saudades-responder', 'Scripts prontos para diferentes cenários de reaproximação dele.', 'h5gUHiS-q7k', false, 3),
(6, 1, 'WHATSAPP SEJA DIRETA AO FALAR COM HOMEM!', 'whatsapp-direta', 'Domine a arte da comunicação por mensagem. Aprenda o tom, o timing e as frases que criam tensão e desejo.', 'jkBEYleb4ZM', false, 1),
(6, 2, 'WhatsApp; Mensagem MEDÍOCRE NÃO se RESPONDE!!', 'mensagem-mediocre', 'Como escrever mensagens que geram resposta imediata e emocionada.', 'MYPGCmLJFKw', false, 2),
(6, 3, 'VOCÊ sabe se COMUNICAR com um HOMEM?', 'comunicar-homem', 'Fundamentos da comunicação eficaz com homens em todas as fases.', 'eSgYJD9OVSU', false, 3),
(6, 4, 'O que falar no WHATS após um Gelo? Parte 1', 'whats-apos-gelo-1', 'Como reaquecer uma conversa fria sem parecer desesperada.', 'QDFILn1Z-n0', true, 4),
(6, 5, 'O que falar no SAPP após Gelo? Parte 2', 'sapp-apos-gelo-2', 'Continuação: scripts avançados para diferentes níveis de frieza.', 'UL6eqQ3yGFA', true, 5),
(7, 1, 'POR QUE NENHUM RELACIONAMENTO MEU VAI PRA FRENTE', 'relacionamento-nao-vai-frente', 'Identifique os padrões sabotadores que impedem seus relacionamentos de evoluir e corrija-os de uma vez por todas.', 'kSf3mrsW5XA', false, 1),
(7, 2, 'Como VIRAR O JOGO no seu RELACIONAMENTO?', 'virar-jogo-relacionamento', 'Estratégias práticas para transformar uma relação desgastada em um compromisso forte, saudável e duradouro.', '4p3u7AaOsDg', false, 2),
(7, 3, 'Como prender um homem? TÉCNICA INFALÍVEL!', 'prender-homem-tecnica', 'A fórmula testada para fazer ele querer ficar para sempre.', 'NXDmCor9bUY', false, 3),
(7, 4, 'COMO MANTER O HOMEM INTERESSADO?', 'manter-homem-interessado', 'Segredos para manter a chama viva mesmo depois de anos juntos.', 'zbwv5QuANd8', false, 4),
(7, 5, 'NÃO ACEITE qualquer coisa de um HOMEM!!', 'nao-aceite-qualquer-coisa', 'Como estabelecer padrões altos e ser respeitada desde o início.', 's4SzR3LStMc', true, 5),
(7, 6, 'NÃO DÊ O SEU PODER A UM HOMEM!', 'nao-de-seu-poder', 'Mantenha sua identidade, poder pessoal e independência no relacionamento.', 'koNd0YLIYkQ', true, 6)
ON CONFLICT (module_id, lesson_number) DO NOTHING;