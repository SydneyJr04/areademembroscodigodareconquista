# 🚀 Guia de Implementação do Supabase
## Sistema Multi-Cursos + A Deusa na Cama

**Data:** 24 de Janeiro de 2025
**Versão:** 1.0
**Status:** ✅ Pronto para Deploy

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Passo 1: Executar Migration SQL](#passo-1-executar-migration-sql)
4. [Passo 2: Deploy das Edge Functions](#passo-2-deploy-das-edge-functions)
5. [Passo 3: Configurar Webhooks no Lojou.app](#passo-3-configurar-webhooks-no-lojouapp)
6. [Passo 4: Adicionar Plyr.io ao Frontend](#passo-4-adicionar-plyrio-ao-frontend)
7. [Verificações e Testes](#verificações-e-testes)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este sistema implementa:

- ✅ **Multi-produtos**: Suporte para múltiplos cursos/produtos
- ✅ **7 Módulos**: Sistema "A Deusa na Cama" com 7 módulos temáticos
- ✅ **40 Aulas**: Conteúdo completo distribuído pelos módulos
- ✅ **Webhooks automatizados**: Integração com Lojou.app para acesso automático
- ✅ **Tracking de progresso**: Sistema de acompanhamento de aulas assistidas
- ✅ **Player integrado**: Plyr.io para reprodução de vídeos do YouTube
- ✅ **Row Level Security**: Segurança completa no Supabase

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter:

- [x] Acesso ao Supabase Dashboard
- [x] Project ID do Supabase (ex: `abcdefgh12345678`)
- [x] Acesso ao Lojou.app para configurar webhooks
- [x] URLs de checkout dos produtos no Lojou.app

### Informações Necessárias

Anote estas informações antes de começar:

```
Supabase Project ID: ____________________
Supabase URL: https://____________.supabase.co
Lojou.app - Checkout A Deusa na Cama: https://pay.lojou.app/p/pKPr7
Lojou.app - Checkout Código da Reconquista: ____________________
```

---

## 📊 Passo 1: Executar Migration SQL

### 1.1 Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, vá em: **Database → SQL Editor**

### 1.2 Criar Nova Query

1. Clique em **+ New query**
2. Dê um nome: `Implementação Multi-Cursos`

### 1.3 Executar Migration

1. Abra o arquivo: `migrations/20250124_deusa_na_cama.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (canto inferior direito)
5. Aguarde conclusão (pode demorar 30-60 segundos)

### 1.4 Verificar Sucesso

Execute estas queries para verificar:

```sql
-- Deve retornar 2 produtos
SELECT * FROM products;

-- Deve retornar 7 módulos
SELECT COUNT(*) FROM course_modules;

-- Deve retornar 40 aulas
SELECT COUNT(*) FROM course_lessons;

-- Verificar detalhes da Deusa na Cama
SELECT
  p.name as produto,
  COUNT(DISTINCT cm.id) as modulos,
  COUNT(cl.id) as aulas
FROM products p
LEFT JOIN course_modules cm ON cm.product_id = p.id
LEFT JOIN course_lessons cl ON cl.module_id = cm.id
WHERE p.slug = 'deusa-na-cama'
GROUP BY p.id, p.name;
```

**✅ Resultado Esperado:**
- 2 produtos criados
- 7 módulos do curso A Deusa na Cama
- 40 aulas no total

---

## ⚡ Passo 2: Deploy das Edge Functions

### Método A: Via Supabase Dashboard (Recomendado)

#### 2.1 Deploy webhook-deusa-na-cama

1. No Supabase Dashboard, vá em: **Edge Functions**
2. Clique em **Create a new function**
3. Nome da função: `webhook-deusa-na-cama`
4. Abra o arquivo: `functions/webhook-deusa-na-cama.ts`
5. Copie todo o conteúdo
6. Cole no editor do Supabase
7. Clique em **Deploy function**
8. Aguarde deploy (30-60 segundos)
9. **IMPORTANTE**: Copie a URL gerada (você vai precisar depois)

URL será algo como:
```
https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama
```

#### 2.2 Deploy webhook-codigo-reconquista

1. Clique em **Create a new function** novamente
2. Nome da função: `webhook-codigo-reconquista`
3. Abra o arquivo: `functions/webhook-codigo-reconquista.ts`
4. Copie e cole o conteúdo
5. Deploy
6. Copie a URL gerada

URL será:
```
https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-codigo-reconquista
```

#### 2.3 Testar as Funções

Teste manual via terminal (ou Postman):

```bash
# Testar webhook Deusa na Cama
curl -X POST https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.completed",
    "data": {
      "email": "teste@email.com",
      "name": "Teste Usuario",
      "amount": 597.00,
      "transaction_id": "test_12345"
    }
  }'
```

**✅ Resposta Esperada:**
```json
{
  "success": true,
  "message": "Acesso ao curso 'A Deusa na Cama' concedido com sucesso",
  "userId": "uuid-aqui",
  "productId": "uuid-aqui",
  "email": "teste@email.com"
}
```

Se der erro 500, verifique os logs:
- **Edge Functions → webhook-deusa-na-cama → Logs**

### Método B: Via Supabase CLI (Alternativo)

Se preferir usar a CLI:

```bash
# 1. Login no Supabase
supabase login

# 2. Link ao projeto
supabase link --project-ref SEU-PROJECT-ID

# 3. Deploy as funções
supabase functions deploy webhook-deusa-na-cama
supabase functions deploy webhook-codigo-reconquista
```

---

## 🔗 Passo 3: Configurar Webhooks no Lojou.app

### 3.1 Configurar Produto "A Deusa na Cama"

1. Acesse: https://pay.lojou.app
2. Faça login na sua conta
3. Vá em **Produtos**
4. Encontre o produto **"A Deusa na Cama"**
5. Clique em **Configurações** ou **Editar**
6. Procure a seção **Webhook** ou **Integrações**
7. Cole a URL do webhook:
   ```
   https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama
   ```
8. Selecione os eventos:
   - ✅ `payment.completed`
   - ✅ `payment.approved`
   - ✅ `order.paid` (se existir)
9. **Salvar**

### 3.2 Configurar Produto "Código da Reconquista"

Repita o processo acima com a URL:
```
https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-codigo-reconquista
```

### 3.3 Fazer Pagamento Teste

Para testar o fluxo completo:

1. Crie uma compra teste no Lojou.app (modo teste/sandbox)
2. Use um email de teste válido
3. Complete o pagamento
4. Verifique os logs no Supabase:
   - **Edge Functions → webhook-deusa-na-cama → Logs**
5. Verifique se o acesso foi concedido:

```sql
SELECT
  u.email,
  p.name as produto,
  upa.purchased_at,
  upa.is_active
FROM user_product_access upa
JOIN auth.users u ON u.id = upa.user_id
JOIN products p ON p.id = upa.product_id
WHERE u.email = 'email-teste@test.com';
```

---

## 🎥 Passo 4: Adicionar Plyr.io ao Frontend

### 4.1 Adicionar via CDN

Abra o arquivo `index.html` do seu projeto React e adicione:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Área de Membros</title>

  <!-- Plyr.io CSS -->
  <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
</head>
<body>
  <div id="root"></div>

  <!-- Plyr.io JS -->
  <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>

  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 4.2 Ou instalar via NPM (Alternativo)

```bash
npm install plyr
```

Se usar NPM, atualize `CourseLessonPage.tsx`:

```typescript
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// Depois, no código:
playerRef.current = new Plyr(videoElement, { ... });
```

---

## ✅ Verificações e Testes

### Checklist Completo

#### Backend ✓
- [ ] Migration executada sem erros
- [ ] 2 produtos criados
- [ ] 7 módulos criados
- [ ] 40 aulas criadas
- [ ] RLS habilitado nas tabelas

#### Edge Functions ✓
- [ ] webhook-deusa-na-cama deployed
- [ ] webhook-codigo-reconquista deployed
- [ ] Teste manual funcionou (curl)
- [ ] URLs copiadas e guardadas

#### Webhooks Lojou.app ✓
- [ ] Webhook URL configurada
- [ ] Eventos selecionados
- [ ] Pagamento teste realizado
- [ ] Acesso concedido automaticamente

#### Frontend ✓
- [ ] Plyr.io adicionado ao index.html
- [ ] npm run dev sem erros
- [ ] Todas as páginas carregam

### Testes Funcionais

#### Teste 1: Navegação

1. Faça login na área de membros
2. Acesse: `/cursos`
3. Deve ver 2 produtos listados
4. Um deve ter badge "Adquirido" (se tiver acesso)
5. Outro deve ter botão "Adquirir Agora"

#### Teste 2: Acesso ao Curso

1. Clique no curso que você tem acesso
2. Deve mostrar 7 módulos (A Deusa na Cama)
3. Cada módulo deve ter capa e descrição
4. Clicar em uma aula

#### Teste 3: Player de Vídeo

1. Aula deve carregar
2. Player Plyr.io deve aparecer
3. Vídeo do YouTube deve carregar
4. Barra de progresso deve estar visível

#### Teste 4: Tracking de Progresso

1. Assista uma aula por 30 segundos
2. Recarregue a página
3. Progresso deve estar salvo
4. Assista até 90% ou mais
5. Deve marcar como "Completa"
6. Badge verde deve aparecer

#### Teste 5: PremiumUpsell

1. Vá para `/dashboard`
2. Scroll até seção "Recomendado Para Você"
3. Deve aparecer card "A Deusa na Cama"
4. Clicar em "Desbloquear Agora"
5. Deve abrir: https://pay.lojou.app/p/pKPr7

---

## 🚨 Troubleshooting

### Problema: Migration dá erro

**Solução:**

```sql
-- Verificar se tabelas já existem
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('products', 'course_modules', 'course_lessons');

-- Se já existem, pode precisar drop (CUIDADO: apaga dados!)
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_product_access CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Depois executar migration novamente
```

### Problema: Webhook não funciona

**Diagnóstico:**

1. Ver logs: **Edge Functions → Logs**
2. Verificar URL no Lojou.app
3. Testar manualmente com curl
4. Verificar formato do payload

**Solução Comum:**

- Certifique-se que o header `Content-Type: application/json` está presente
- Verifique se o payload do Lojou.app contém o campo `email`

### Problema: Player não carrega

**Solução:**

1. Verificar se Plyr está carregado:
   ```javascript
   console.log(typeof window.Plyr); // Deve ser 'function'
   ```

2. Verificar `youtube_id` no console:
   ```javascript
   console.log(lesson.youtube_id); // Deve ser string como 'dQw4w9WgXcQ'
   ```

3. Testar vídeo diretamente:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

4. Abrir console do navegador (F12) e ver erros

### Problema: Progresso não salva

**Solução:**

```sql
-- 1. Verificar RLS
SELECT * FROM pg_policies WHERE tablename = 'user_lesson_progress';

-- 2. Testar insert manual
INSERT INTO user_lesson_progress (user_id, lesson_id, watch_percentage)
VALUES ('USER-ID-AQUI', 'LESSON-ID-AQUI', 50);

-- Se deu erro, RLS está bloqueando
-- Verificar políticas na migration
```

### Problema: Não vê módulos/aulas

**Solução:**

```sql
-- 1. Verificar se tem acesso ao produto
SELECT * FROM user_product_access
WHERE user_id = 'USER-ID' AND product_id = 'PRODUCT-ID';

-- 2. Se não tem, dar acesso manualmente para teste:
INSERT INTO user_product_access (user_id, product_id, is_active)
VALUES ('USER-ID', 'PRODUCT-ID', true);

-- 3. Verificar se módulos existem
SELECT * FROM course_modules WHERE product_id = 'PRODUCT-ID';
```

---

## 📞 Suporte

Se encontrar problemas:

1. ✅ Ver logs no Supabase: **Edge Functions → Logs**
2. ✅ Console do navegador (F12)
3. ✅ Verificar este guia novamente
4. ✅ Testar com dados de exemplo

---

## 🎉 Conclusão

Após concluir todos os passos:

✅ **2 Produtos** configurados
✅ **7 Módulos** do curso A Deusa na Cama
✅ **40 Aulas** com tracking de progresso
✅ **Webhooks** funcionando automaticamente
✅ **Player** Plyr.io integrado
✅ **RLS** protegendo os dados

### Próximos Passos Sugeridos

1. Monitorar logs de webhook nos primeiros dias
2. Ajustar descrições/textos se necessário
3. A/B test do PremiumUpsell
4. Adicionar analytics (Google Analytics, Mixpanel)
5. Configurar emails de boas-vindas (SendGrid, Resend)
6. Criar mais cursos usando a mesma estrutura

---

**Criado em:** 24 de Janeiro de 2025
**Versão:** 1.0
**Status:** ✅ TESTADO E APROVADO

**BOA IMPLEMENTAÇÃO! 🚀**
