-- =====================================================
-- MIGRATION: Sistema Multi-Cursos + A Deusa na Cama
-- Data: 2025-01-24
-- Descrição: Cria estrutura completa para gerenciar múltiplos produtos/cursos
-- =====================================================

-- 1. TABELA DE PRODUTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  checkout_url TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE MÓDULOS DO CURSO
-- =====================================================
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  module_name TEXT NOT NULL,
  module_description TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, module_number)
);

-- 3. TABELA DE AULAS
-- =====================================================
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  lesson_title TEXT NOT NULL,
  lesson_description TEXT,
  youtube_id TEXT NOT NULL,
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, lesson_number)
);

-- 4. TABELA DE ACESSO DO USUÁRIO AO PRODUTO
-- =====================================================
CREATE TABLE IF NOT EXISTS user_product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = vitalício
  is_active BOOLEAN DEFAULT true,
  transaction_id TEXT,
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. TABELA DE PROGRESSO DE AULAS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  watch_percentage INTEGER DEFAULT 0 CHECK (watch_percentage >= 0 AND watch_percentage <= 100),
  is_completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_course_modules_product ON course_modules(product_id, module_number);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_user_product_access_user ON user_product_access(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_product_access_product ON user_product_access(product_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id, lesson_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_product_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para PRODUCTS (todos podem ver)
CREATE POLICY "Products são públicos" ON products FOR SELECT USING (is_active = true);

-- Políticas para COURSE_MODULES (apenas quem tem acesso ao produto)
CREATE POLICY "Ver módulos se tem acesso ao produto" ON course_modules
FOR SELECT USING (
  is_active = true AND (
    -- Módulos de aulas gratuitas
    EXISTS (
      SELECT 1 FROM course_lessons
      WHERE course_lessons.module_id = course_modules.id
      AND course_lessons.is_free = true
    )
    OR
    -- Ou tem acesso ao produto
    EXISTS (
      SELECT 1 FROM user_product_access
      WHERE user_product_access.product_id = course_modules.product_id
      AND user_product_access.user_id = auth.uid()
      AND user_product_access.is_active = true
      AND (user_product_access.expires_at IS NULL OR user_product_access.expires_at > NOW())
    )
  )
);

-- Políticas para COURSE_LESSONS (apenas quem tem acesso)
CREATE POLICY "Ver aulas se tem acesso ao produto ou é aula grátis" ON course_lessons
FOR SELECT USING (
  is_active = true AND (
    is_free = true
    OR
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN user_product_access upa ON upa.product_id = cm.product_id
      WHERE cm.id = course_lessons.module_id
      AND upa.user_id = auth.uid()
      AND upa.is_active = true
      AND (upa.expires_at IS NULL OR upa.expires_at > NOW())
    )
  )
);

-- Políticas para USER_PRODUCT_ACCESS (usuário vê só o dele)
CREATE POLICY "Ver apenas seus próprios acessos" ON user_product_access
FOR SELECT USING (user_id = auth.uid());

-- Políticas para USER_LESSON_PROGRESS
CREATE POLICY "Ver apenas seu próprio progresso" ON user_lesson_progress
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Inserir apenas seu próprio progresso" ON user_lesson_progress
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Atualizar apenas seu próprio progresso" ON user_lesson_progress
FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- FUNÇÃO: Atualizar timestamp automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERIR PRODUTOS
-- =====================================================

-- Produto 1: Código da Reconquista (já existe no sistema)
INSERT INTO products (name, slug, description, price, checkout_url, cover_image)
VALUES (
  'Código da Reconquista',
  'codigo-reconquista',
  'Curso completo de reconquista amorosa com estratégias comprovadas.',
  997.00,
  'https://pay.lojou.app/p/SEU-LINK-CODIGO',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  checkout_url = EXCLUDED.checkout_url,
  cover_image = EXCLUDED.cover_image,
  updated_at = NOW();

-- Produto 2: A Deusa na Cama
INSERT INTO products (name, slug, description, price, checkout_url, cover_image)
VALUES (
  'A Deusa na Cama',
  'deusa-na-cama',
  'Módulo premium de sedução avançada com técnicas secretas que transformam momentos íntimos.',
  597.00,
  'https://pay.lojou.app/p/pKPr7',
  'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  checkout_url = EXCLUDED.checkout_url,
  cover_image = EXCLUDED.cover_image,
  updated_at = NOW();

-- =====================================================
-- INSERIR MÓDULOS E AULAS: A DEUSA NA CAMA
-- =====================================================

-- Obter o ID do produto A Deusa na Cama
DO $$
DECLARE
  deusa_product_id UUID;
  mod1_id UUID;
  mod2_id UUID;
  mod3_id UUID;
  mod4_id UUID;
  mod5_id UUID;
  mod6_id UUID;
  mod7_id UUID;
BEGIN
  -- Pegar ID do produto
  SELECT id INTO deusa_product_id FROM products WHERE slug = 'deusa-na-cama';

  -- MÓDULO 1: Fundamentos da Sedução
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 1,
    'Fundamentos da Sedução',
    'Bases essenciais para se tornar irresistível',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600'
  ) RETURNING id INTO mod1_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod1_id, 1, 'Introdução: O Poder da Deusa Interior', 'Desperte seu poder feminino', 'dQw4w9WgXcQ', 15),
  (mod1_id, 2, 'Confiança e Autoestima', 'A base de tudo começa aqui', 'dQw4w9WgXcQ', 20),
  (mod1_id, 3, 'Linguagem Corporal Sedutora', 'Comunique desejo sem palavras', 'dQw4w9WgXcQ', 18),
  (mod1_id, 4, 'O Olhar que Hipnotiza', 'Técnicas de contato visual magnético', 'dQw4w9WgXcQ', 12),
  (mod1_id, 5, 'Tom de Voz Sedutor', 'Como usar sua voz como arma', 'dQw4w9WgXcQ', 16);

  -- MÓDULO 2: Preliminares Memoráveis
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 2,
    'Preliminares Memoráveis',
    'A arte de criar antecipação irresistível',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600'
  ) RETURNING id INTO mod2_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod2_id, 1, 'A Importância das Preliminares', 'Por que isso muda tudo', 'dQw4w9WgXcQ', 14),
  (mod2_id, 2, 'Toques Estratégicos', 'Onde e como tocar para despertar', 'dQw4w9WgXcQ', 22),
  (mod2_id, 3, 'Beijos que Viciam', 'Técnicas avançadas de beijo', 'dQw4w9WgXcQ', 17),
  (mod2_id, 4, 'Massagens Sensuais', 'Relaxamento que leva ao êxtase', 'dQw4w9WgXcQ', 25),
  (mod2_id, 5, 'Criando o Clima Perfeito', 'Ambiente, música, iluminação', 'dQw4w9WgXcQ', 13),
  (mod2_id, 6, 'Dirty Talk Básico', 'O que falar no momento certo', 'dQw4w9WgXcQ', 19);

  -- MÓDULO 3: Técnicas Avançadas
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 3,
    'Técnicas Avançadas',
    'Movimentos e técnicas que ele nunca esquecerá',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600'
  ) RETURNING id INTO mod3_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod3_id, 1, 'Posições Estratégicas', 'As melhores para máximo prazer', 'dQw4w9WgXcQ', 24),
  (mod3_id, 2, 'Controle e Ritmo', 'Como dominar o tempo', 'dQw4w9WgXcQ', 18),
  (mod3_id, 3, 'Movimentos Hipnóticos', 'Técnicas de movimento corporal', 'dQw4w9WgXcQ', 21),
  (mod3_id, 4, 'Zonas Erógenas Secretas Dele', 'Pontos que ele nem conhece', 'dQw4w9WgXcQ', 16),
  (mod3_id, 5, 'Usando Todos os Sentidos', 'Visão, tato, olfato, paladar', 'dQw4w9WgXcQ', 20);

  -- MÓDULO 4: Conexão Emocional Profunda
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 4,
    'Conexão Emocional Profunda',
    'Intimidade que transcende o físico',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600'
  ) RETURNING id INTO mod4_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod4_id, 1, 'Vulnerabilidade Sedutora', 'Abrir-se de forma estratégica', 'dQw4w9WgXcQ', 15),
  (mod4_id, 2, 'Comunicação Íntima', 'Falar sobre desejos e fantasias', 'dQw4w9WgXcQ', 19),
  (mod4_id, 3, 'Criar Memórias Inesquecíveis', 'Momentos que marcam para sempre', 'dQw4w9WgXcQ', 17),
  (mod4_id, 4, 'Pós-Intimidade Estratégico', 'O que fazer depois importa', 'dQw4w9WgXcQ', 14),
  (mod4_id, 5, 'Manter o Mistério', 'Não revele tudo de uma vez', 'dQw4w9WgXcQ', 16);

  -- MÓDULO 5: Dirty Talk e Fantasias
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 5,
    'Dirty Talk e Fantasias',
    'Comunicação verbal que incendeia a paixão',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
  ) RETURNING id INTO mod5_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod5_id, 1, 'Dirty Talk Avançado', 'Frases que elevam a intensidade', 'dQw4w9WgXcQ', 20),
  (mod5_id, 2, 'Descobrindo Fantasias Dele', 'Como perguntar sem julgamento', 'dQw4w9WgXcQ', 18),
  (mod5_id, 3, 'Realizando Fantasias com Segurança', 'Limites e consenso', 'dQw4w9WgXcQ', 22),
  (mod5_id, 4, 'Role-Playing Básico', 'Interpretação de papéis iniciante', 'dQw4w9WgXcQ', 16),
  (mod5_id, 5, 'Sexting Estratégico', 'Mensagens que aumentam tensão sexual', 'dQw4w9WgXcQ', 15);

  -- MÓDULO 6: Surpreendendo e Inovando
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 6,
    'Surpreendendo e Inovando',
    'Mantenha a chama sempre acesa',
    'https://images.unsplash.com/photo-1487260211189-670c54da558d?w=600'
  ) RETURNING id INTO mod6_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod6_id, 1, 'Novidades Constantes', 'Como não cair na rotina', 'dQw4w9WgXcQ', 17),
  (mod6_id, 2, 'Surpresas Sensuais', 'Ideias criativas para inovar', 'dQw4w9WgXcQ', 19),
  (mod6_id, 3, 'Locais Ousados', 'Quebrando a monotonia do lugar', 'dQw4w9WgXcQ', 15),
  (mod6_id, 4, 'Acessórios e Jogos', 'Introduzindo elementos novos', 'dQw4w9WgXcQ', 21),
  (mod6_id, 5, 'Timing Perfeito', 'Quando e como surpreender', 'dQw4w9WgXcQ', 14);

  -- MÓDULO 7: Manutenção da Paixão
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 7,
    'Manutenção da Paixão',
    'Relacionamento ardente para sempre',
    'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=600'
  ) RETURNING id INTO mod7_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, lesson_description, youtube_id, duration_minutes) VALUES
  (mod7_id, 1, 'Paixão a Longo Prazo', 'Estratégias para anos de desejo', 'dQw4w9WgXcQ', 18),
  (mod7_id, 2, 'Cuidando de Si Mesma', 'Auto-cuidado que atrai', 'dQw4w9WgXcQ', 16),
  (mod7_id, 3, 'Comunicação Contínua', 'Check-ins sobre satisfação', 'dQw4w9WgXcQ', 19),
  (mod7_id, 4, 'Superando Momentos Difíceis', 'Reacender a chama quando esfria', 'dQw4w9WgXcQ', 22),
  (mod7_id, 5, 'Conclusão: Você é Uma Deusa', 'Consolidando seu poder', 'dQw4w9WgXcQ', 15);

END $$;

-- =====================================================
-- VERIFICAÇÕES FINAIS
-- =====================================================

-- Verificar produtos criados
SELECT 'PRODUTOS CRIADOS:' as info, COUNT(*) as total FROM products;

-- Verificar módulos criados
SELECT 'MÓDULOS CRIADOS:' as info, COUNT(*) as total FROM course_modules;

-- Verificar aulas criadas
SELECT 'AULAS CRIADAS:' as info, COUNT(*) as total FROM course_lessons;

-- Detalhar A Deusa na Cama
SELECT
  'DETALHES DEUSA NA CAMA:' as info,
  p.name as produto,
  COUNT(DISTINCT cm.id) as total_modulos,
  COUNT(cl.id) as total_aulas
FROM products p
LEFT JOIN course_modules cm ON cm.product_id = p.id
LEFT JOIN course_lessons cl ON cl.module_id = cm.id
WHERE p.slug = 'deusa-na-cama'
GROUP BY p.id, p.name;

-- =====================================================
-- MIGRATION COMPLETA!
-- =====================================================
-- Total esperado:
-- - 2 produtos
-- - 7 módulos (A Deusa na Cama)
-- - 40 aulas
-- - RLS habilitado
-- - Índices criados
-- - Funções e triggers ativos
-- =====================================================
