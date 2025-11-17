# 🚀 SETUP COMPLETO - Código da Reconquista

## ✅ O QUE JÁ FOI CRIADO

### 1. Banco de Dados Supabase ✅
- ✅ 7 tabelas criadas (profiles, modules, lessons, user_modules, user_lessons, payments, user_stats)
- ✅ 7 módulos inseridos com thumbnails
- ✅ 42 aulas inseridas com YouTube IDs
- ✅ Row Level Security (RLS) configurado
- ✅ Triggers automáticos (criação de registros ao cadastrar usuário)
- ✅ Sistema de drip content (1 módulo a cada 2 dias)

### 2. Frontend Completo ✅
- ✅ Sistema de autenticação (login, registro, recuperação de senha)
- ✅ Dashboard com progresso e estatísticas
- ✅ Listagem de módulos com status de bloqueio
- ✅ Player de vídeo do YouTube com tracking de progresso
- ✅ Modal de celebração ao completar aulas
- ✅ Perfil de usuário com upload de avatar
- ✅ Design premium (gradientes dourado/vermelho)
- ✅ Totalmente responsivo

### 3. Estrutura de Arquivos ✅

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── ModuleGrid.tsx
│   │   └── ModuleCard.tsx
│   ├── lessons/
│   │   ├── VideoPlayer.tsx
│   │   └── CompletionModal.tsx
│   ├── profile/
│   │   └── ProfileModal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── dialog.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useProgress.ts
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Module.tsx
│   └── Lesson.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 📋 INSTRUÇÕES DE INSTALAÇÃO

### Passo 1: Instalar Dependências

```bash
# Remover instalações anteriores
rm -rf node_modules package-lock.json

# Instalar todas as dependências
npm install

# Se houver erro, tente:
npm install --legacy-peer-deps
```

### Passo 2: Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://sua-url.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Para obter essas variáveis:
1. Acesse seu projeto no Supabase
2. Vá em **Settings** > **API**
3. Copie a **URL** e a **anon/public key**

### Passo 3: Configurar Storage para Avatares

No Supabase Dashboard:

1. Vá em **Storage**
2. Clique em **New Bucket**
3. Nome: `avatars`
4. **Public bucket**: ✅ ATIVADO
5. Clique em Create

### Passo 4: Rodar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🎬 FLUXO DE USO

### 1. Cadastro
- Acesse `/register`
- Preencha: Nome, Email, WhatsApp (+258...)
- Senha automática: `Reconquista@2026`
- Aceite os termos
- Clique em "Criar Conta"

### 2. Login
- Acesse `/login`
- Email + senha padrão
- Você será redirecionado para o dashboard

### 3. Dashboard
- Veja seu progresso geral
- Módulo 1 liberado imediatamente
- Módulos 2-7 liberados gradualmente (a cada 2 dias)

### 4. Assistir Aulas
- Clique em um módulo desbloqueado
- Escolha uma aula
- Assista ao vídeo
- Progresso é salvo automaticamente
- Modal de celebração aos 90%

### 5. Perfil
- Clique no seu nome no header
- Upload de avatar (máx 2MB)
- Edite nome e WhatsApp
- Altere a senha

## 💳 INTEGRAÇÃO STRIPE (OPCIONAL)

### Arquivos Necessários das Edge Functions

#### 1. `supabase/functions/stripe-checkout/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { priceId, userId, userEmail } = await req.json();

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "subscription",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "success_url": `${req.headers.get("origin")}/dashboard?payment=success`,
        "cancel_url": `${req.headers.get("origin")}/dashboard?payment=cancelled`,
        "customer_email": userEmail,
        "client_reference_id": userId,
        "metadata[userId]": userId,
      }).toString(),
    });

    const session = await response.json();

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

#### 2. `supabase/functions/stripe-webhooks/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;

        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_tier: "mensal",
            subscription_expires_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
          .eq("id", userId);

        await supabase.from("payments").insert({
          user_id: userId,
          stripe_payment_intent_id: session.payment_intent,
          stripe_subscription_id: session.subscription,
          amount_cents: session.amount_total,
          currency: session.currency?.toUpperCase(),
          status: "succeeded",
          subscription_tier: "mensal",
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_expires_at: null,
          })
          .eq("stripe_customer_id", subscription.customer);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Deploy das Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhooks
```

### Configurar Webhook no Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Developers** > **Webhooks**
3. Clique em **Add endpoint**
4. URL: `https://SEU_PROJECT.supabase.co/functions/v1/stripe-webhooks`
5. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Copie o **Webhook Secret** (whsec_...)

### Adicionar Variáveis no Supabase

No Supabase Dashboard > **Edge Functions** > **Settings**:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🔧 TROUBLESHOOTING

### Erro: "Cannot find module vite"

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Erro: Avatar não faz upload

Verifique se:
1. O bucket `avatars` existe
2. É público
3. Permite tipo `image/*`

### Módulos não aparecem

Execute a migração novamente no SQL Editor do Supabase.

### Vídeos não carregam

Verifique se os YouTube IDs estão corretos e os vídeos são públicos/não-listados.

## 📊 DADOS SEED

Os seguintes dados já foram inseridos no banco:

- **7 Módulos** (Reset Emocional até Conquista Duradoura)
- **42 Aulas** (distribuídas pelos módulos)
- Todos com YouTube IDs funcionais
- Thumbnails profissionais

## 🎯 PRÓXIMOS PASSOS

1. ✅ Configure as variáveis de ambiente
2. ✅ Rode `npm run dev`
3. ✅ Teste o cadastro e login
4. ✅ Assista uma aula e veja o progresso sendo salvo
5. 🔜 (Opcional) Configure o Stripe para pagamentos

---

## 📞 SUPORTE

Em caso de problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase
3. Confirme que todas as variáveis de ambiente estão corretas

---

**Desenvolvido com ❤️ para o Código da Reconquista**
