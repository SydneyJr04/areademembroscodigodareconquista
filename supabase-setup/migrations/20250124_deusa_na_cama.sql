-- =====================================================
-- MIGRATION: Sistema Multi-Cursos + A Deusa na Cama (CORRIGIDO)
-- Data: 2025-01-24
-- Versão: 2.0 - COM YOUTUBE IDS REAIS
-- Descrição: Cria estrutura completa com 40 aulas e IDs reais do YouTube
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
  'Módulo premium de sedução avançada com técnicas secretas que transformam momentos íntimos em experiências inesquecíveis.',
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
-- INSERIR MÓDULOS E AULAS: A DEUSA NA CAMA (COM IDS REAIS)
-- =====================================================

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

  -- =====================================================
  -- MÓDULO 1: O Despertar da Deusa (5 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 1,
    'O Despertar da Deusa',
    'Liberte-se da insegurança e abrace seu poder feminino',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600'
  ) RETURNING id INTO mod1_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod1_id, 1, 'Como perder a insegurança antes e durante o sexo', 'BW7wLQECPkc', 15),
  (mod1_id, 2, 'A técnica da soltura: destravando o corpo e a mente na cama', 'YozK0FZu0dU', 18),
  (mod1_id, 3, 'Como eliminar a vergonha e assumir sua energia feminina', 'f1mX86Ficio', 20),
  (mod1_id, 4, 'Como se soltar e inovar sem medo na hora do sexo', 'BMS4D7thPrg', 16),
  (mod1_id, 5, 'Como perder a vergonha e inovar na hora do sexo', 'JocIiA2pX_4', 17);

  -- =====================================================
  -- MÓDULO 2: O Toque Viciante (4 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 2,
    'O Toque Viciante',
    'Domine as zonas que deixam qualquer homem viciado',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600'
  ) RETURNING id INTO mod2_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod2_id, 1, 'Zonas que deixam qualquer homem viciado no seu corpo', 'b6xb4VXuv0E', 22),
  (mod2_id, 2, '10 zonas erógenas que deixam os homens com muito tesão', 'hfKNqCIw9Ms', 19),
  (mod2_id, 3, 'Massagem sensual rápida (5 minutos)', 'K_UylBFh--E', 12),
  (mod2_id, 4, 'Strip Tease fácil para iniciantes (passo a passo)', 'iLmOtcPCgeM', 14);

  -- =====================================================
  -- MÓDULO 3: O Segredo Oral (6 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 3,
    'O Segredo Oral',
    'Técnicas que enlouquecem e viciam para sempre',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600'
  ) RETURNING id INTO mod3_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod3_id, 1, 'O mindset das mulheres que enlouquecem no oral', '8KWHAmtfuEM', 16),
  (mod3_id, 2, 'Como fazer o oral perfeito', '4NC1OBMw7ao', 21),
  (mod3_id, 3, 'Como dar aquela chupada que deixa ele louco', 'GXKAbadNJVw', 18),
  (mod3_id, 4, 'Como chupar um p*u direito (avançado)', 'F4ZZr2oVtF0', 23),
  (mod3_id, 5, 'Técnica da Lambida do Trono', '7oWiE78ns6k', 15),
  (mod3_id, 6, 'A técnica da laranja — prazer absoluto', 'Q-DuzZq6vlY', 17);

  -- =====================================================
  -- MÓDULO 4: A Cavalgada da Deusa (13 aulas) ★ MÓDULO PRINCIPAL
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 4,
    'A Cavalgada da Deusa',
    'Domine a arte da sentada perfeita e deixe-o viciado',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600'
  ) RETURNING id INTO mod4_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod4_id, 1, 'A Sentada da Deusa (técnica principal)', 'KE6L8iJQkcA', 24),
  (mod4_id, 2, 'Como cavalgá-lo sem cansar', 'rYgr2sla7Zw', 19),
  (mod4_id, 3, 'Técnica de sentada que deixa ele em choque', '5UB_j2B68Ec', 21),
  (mod4_id, 4, 'A Sentada Borboleta Paraguaya', 'MeF1fGBYSJA', 18),
  (mod4_id, 5, 'Posições para máximo estímulo do clitóris', '-hN9Q7EOiHA', 20),
  (mod4_id, 6, 'Sentada da Donzela (movimentos avançados)', 'l3MSf81Kj_M', 22),
  (mod4_id, 7, 'Melhores posições para chegar lá junto com ele', '2n_TKNQESHw', 17),
  (mod4_id, 8, '3 movimentos para mexer com ele sem dizer nada', 'rPRfTBfW9KY', 14),
  (mod4_id, 9, '3 posições que eles amam', 'lyUnrpl1KvI', 16),
  (mod4_id, 10, 'Movimentos que enlouquecem o boy', 'U47Y7B1i78U', 15),
  (mod4_id, 11, 'Dicas para movimentos durante a hora H', 'P_uqsz-Lhus', 13),
  (mod4_id, 12, 'Domine a arte de sentar na cadeira', '-g61n3QKFRQ', 19),
  (mod4_id, 13, 'Pompoarismo para iniciantes (resistência e controle)', '9ArZJydu6RY', 25);

  -- =====================================================
  -- MÓDULO 5: O Big Bang Sonoro (4 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 5,
    'O Big Bang Sonoro',
    'Gema e fale de forma irresistível na hora H',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
  ) RETURNING id INTO mod5_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod5_id, 1, 'Como gemer bonito (mesmo tímida)', '9NgwS2iDPuA', 14),
  (mod5_id, 2, '4 formas de gemer e enlouquecer qualquer homem', 'Y8b8mZYOUrE', 16),
  (mod5_id, 3, 'O que falar na hora H (dirty talk para iniciantes)', 'zPPC-3MtKyc', 19),
  (mod5_id, 4, 'Como perder a vergonha de falar durante o sexo', 'P9a8-To6NyE', 17);

  -- =====================================================
  -- MÓDULO 6: Segredos Profundos (5 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 6,
    'Segredos Profundos',
    'Explore novos territórios com segurança e prazer',
    'https://images.unsplash.com/photo-1487260211189-670c54da558d?w=600'
  ) RETURNING id INTO mod6_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod6_id, 1, 'Como dar o C sem dor (guia para iniciantes)', 'O8vm_IczzSk', 22),
  (mod6_id, 2, 'Sexo anal sem dor — técnica essencial', 'mNLLV-A4JpI', 24),
  (mod6_id, 3, 'Como dar a roda com prazer', 'f_VCUFzxkxU', 20),
  (mod6_id, 4, 'Como relaxar e começar no anal de forma segura', 'T1_kLJGFhuA', 18),
  (mod6_id, 5, 'Introdução ao mundo dos fetiches (seguro e elegante)', 'BESJUeTlkVw', 21);

  -- =====================================================
  -- MÓDULO 7: Devoção Eterna (3 aulas)
  -- =====================================================
  INSERT INTO course_modules (product_id, module_number, module_name, module_description, cover_image)
  VALUES (
    deusa_product_id, 7,
    'Devoção Eterna',
    'Mantenha-o apaixonado e conectado para sempre',
    'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=600'
  ) RETURNING id INTO mod7_id;

  INSERT INTO course_lessons (module_id, lesson_number, lesson_title, youtube_id, duration_minutes) VALUES
  (mod7_id, 1, 'Como se comportar após o sexo para aumentar a conexão', 'QtZXVjJngnk', 16),
  (mod7_id, 2, 'Dica para deixá-lo louco após a transa', 'Vt8QD8RsHA0', 14),
  (mod7_id, 3, 'O que fazer quando ele some depois do sexo (estratégia da poderosa)', 'irwY5ixTtHY', 19);

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

-- Listar todas as aulas com URLs completas para teste
SELECT
  cm.module_number,
  cm.module_name,
  cl.lesson_number,
  cl.lesson_title,
  cl.youtube_id,
  CONCAT('https://www.youtube.com/watch?v=', cl.youtube_id) as url_completa
FROM course_lessons cl
JOIN course_modules cm ON cl.module_id = cm.id
JOIN products p ON cm.product_id = p.id
WHERE p.slug = 'deusa-na-cama'
ORDER BY cm.module_number, cl.lesson_number;

-- =====================================================
-- MIGRATION COMPLETA COM YOUTUBE IDS REAIS!
-- =====================================================
-- Total:
-- - 2 produtos
-- - 7 módulos (A Deusa na Cama)
-- - 40 aulas COM YOUTUBE IDS REAIS
-- - RLS habilitado
-- - Índices criados
-- - Funções e triggers ativos
-- =====================================================
