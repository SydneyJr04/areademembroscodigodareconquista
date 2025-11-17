# 💳 CONFIGURAÇÃO COMPLETA DO STRIPE

## 🎯 URLs DOS WEBHOOKS

Após fazer deploy das Edge Functions no Supabase, você terá estas URLs:

### URL do Checkout
```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-checkout
```

### URL do Webhook
```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-webhooks
```

**Onde encontrar SEU-PROJECT-ID:**
- No Supabase Dashboard, vá em Settings > API
- Copie o "Project URL"
- O ID está no formato: `https://abcdefghijk.supabase.co`
- Use `abcdefghijk` como SEU-PROJECT-ID

## 📋 PASSO A PASSO COMPLETO

### 1. Criar Conta Stripe

1. Acesse [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Preencha os dados da empresa
3. Ative o modo de teste (Test Mode)

### 2. Obter Chaves da API

1. Vá em **Developers** > **API keys**
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - clique em "Reveal"

### 3. Criar Produtos e Preços

#### Produto 1: Acesso Semanal
1. Vá em **Products** > **Add product**
2. Nome: `Código da Reconquista - Semanal`
3. Descrição: `Acesso semanal ao curso completo`
4. Pricing:
   - Modelo: `Recurring`
   - Preço: `100` MZN
   - Billing period: `Weekly`
5. Clique em **Save product**
6. **COPIE O PRICE ID** (price_...)

#### Produto 2: Acesso Mensal
1. Nome: `Código da Reconquista - Mensal`
2. Descrição: `Acesso mensal ao curso completo`
3. Pricing:
   - Modelo: `Recurring`
   - Preço: `300` MZN
   - Billing period: `Monthly`
4. **COPIE O PRICE ID** (price_...)

#### Produto 3: Acesso Vitalício
1. Nome: `Código da Reconquista - Vitalício`
2. Descrição: `Acesso vitalício ao curso completo`
3. Pricing:
   - Modelo: `One-time`
   - Preço: `1500` MZN
4. **COPIE O PRICE ID** (price_...)

### 4. Criar Edge Functions no Supabase

#### 4.1 Instalar Supabase CLI

```bash
npm install -g supabase
```

#### 4.2 Fazer Login

```bash
supabase login
```

Você será redirecionado para o navegador para autorizar.

#### 4.3 Link com o Projeto

```bash
supabase link --project-ref [SEU-PROJECT-ID]
```

#### 4.4 Criar Diretório das Functions

```bash
mkdir -p supabase/functions/stripe-checkout
mkdir -p supabase/functions/stripe-webhooks
```

#### 4.5 Criar os Arquivos

**supabase/functions/stripe-checkout/index.ts:**

(Copie o conteúdo do arquivo do SETUP_COMPLETO.md)

**supabase/functions/stripe-webhooks/index.ts:**

(Copie o conteúdo do arquivo do SETUP_COMPLETO.md)

#### 4.6 Deploy das Functions

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhooks
```

Após o deploy, você verá as URLs:
```
✅ stripe-checkout deployed successfully
   URL: https://[PROJECT-ID].supabase.co/functions/v1/stripe-checkout

✅ stripe-webhooks deployed successfully
   URL: https://[PROJECT-ID].supabase.co/functions/v1/stripe-webhooks
```

**⚠️ IMPORTANTE: COPIE ESSAS URLs!**

### 5. Configurar Webhook no Stripe

1. Vá em **Developers** > **Webhooks**
2. Clique em **Add endpoint**
3. **Endpoint URL**: Cole a URL do stripe-webhooks
   ```
   https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-webhooks
   ```
4. **Description**: `Supabase Webhook Handler`
5. **Events to send**: Clique em **Select events**
6. Selecione:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
   - ✅ `invoice.payment_succeeded`
7. Clique em **Add endpoint**
8. **COPIE O SIGNING SECRET** (whsec_...)

### 6. Adicionar Variáveis de Ambiente no Supabase

1. No Supabase Dashboard, vá em **Edge Functions** > **Settings**
2. Adicione estas variáveis (seção "Secrets"):

```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXX
```

3. Clique em **Save**

### 7. Atualizar .env Local

Adicione ao arquivo `.env` na raiz do projeto:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXX

# Price IDs dos produtos
VITE_STRIPE_PRICE_SEMANAL=price_XXXXXX
VITE_STRIPE_PRICE_MENSAL=price_XXXXXX
VITE_STRIPE_PRICE_VITALICIO=price_XXXXXX
```

## 🧪 TESTAR A INTEGRAÇÃO

### 1. Criar Botão de Checkout (Exemplo)

Adicione em `src/pages/Dashboard.tsx`:

```typescript
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

async function handleSubscribe() {
  const { data: { user } } = await supabase.auth.getUser();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_PRICE_MENSAL,
        userId: user?.id,
        userEmail: user?.email,
      }),
    }
  );

  const { sessionId } = await response.json();

  // Redirecionar para checkout
  const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  await stripe.redirectToCheckout({ sessionId });
}

// No JSX:
<Button onClick={handleSubscribe}>
  Assinar Plano Mensal - 300 MZN
</Button>
```

### 2. Instalar Stripe.js

```bash
npm install @stripe/stripe-js
```

### 3. Testar com Cartão de Teste

Use estes dados no checkout:

- **Número do cartão**: `4242 4242 4242 4242`
- **Data de validade**: Qualquer data futura (ex: 12/25)
- **CVC**: Qualquer 3 dígitos (ex: 123)
- **CEP**: Qualquer 5 dígitos

### 4. Verificar Webhook

Após completar o pagamento de teste:

1. Vá em **Developers** > **Webhooks** no Stripe
2. Clique no seu webhook
3. Veja a aba **Events** - deve mostrar `checkout.session.completed`
4. Verifique se o status é `Succeeded`

### 5. Confirmar no Supabase

1. Vá no Supabase Dashboard > **Table Editor**
2. Abra a tabela `profiles`
3. Verifique se o usuário tem:
   - `stripe_customer_id` preenchido
   - `subscription_tier` = "mensal"
   - `subscription_expires_at` preenchido

## 🔐 SEGURANÇA

### Variáveis Sensíveis

**NUNCA commite no Git:**
- ❌ `STRIPE_SECRET_KEY`
- ❌ `STRIPE_WEBHOOK_SECRET`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`

**Pode commitar:**
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_... ou pk_live_...)
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

### Validação de Webhooks

O código das Edge Functions já valida a assinatura do webhook do Stripe, garantindo que apenas requisições legítimas sejam processadas.

## 🚀 MODO PRODUÇÃO

Quando for para produção:

### 1. Ativar Modo Live no Stripe

1. No Stripe Dashboard, alterne de "Test mode" para "Live mode" (toggle no canto superior direito)
2. Repita todos os passos acima no modo Live
3. Use as novas chaves `pk_live_...` e `sk_live_...`

### 2. Atualizar Variáveis

```env
# Production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXX

# No Supabase Edge Functions:
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXX (live webhook)
```

### 3. Webhook de Produção

Configure um novo webhook no modo Live do Stripe com a mesma URL:
```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-webhooks
```

## 📊 MONITORAMENTO

### Ver Logs das Edge Functions

```bash
supabase functions logs stripe-webhooks
```

### Dashboard do Stripe

- **Pagamentos**: Veja todos os pagamentos em Payments
- **Assinaturas**: Gerencie em Subscriptions
- **Clientes**: Veja perfis em Customers
- **Webhooks**: Monitore eventos em Developers > Webhooks

## 🆘 TROUBLESHOOTING

### Webhook não está recebendo eventos

1. Verifique se a URL está correta
2. Teste manualmente no Stripe Dashboard (aba "Send test webhook")
3. Veja os logs: `supabase functions logs stripe-webhooks`

### Erro 401 ao chamar função

Certifique-se de enviar o header:
```typescript
headers: {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
}
```

### Cliente não foi atualizado

1. Verifique os logs do webhook
2. Confirme que o `userId` está sendo passado corretamente no metadata
3. Verifique se o RLS permite a atualização

---

## ✅ CHECKLIST FINAL

Antes de considerar completo:

- [ ] Conta Stripe criada
- [ ] API keys copiadas
- [ ] 3 produtos criados (semanal, mensal, vitalício)
- [ ] Price IDs copiados
- [ ] Edge Functions criadas e deployed
- [ ] URL do webhook obtida
- [ ] Webhook configurado no Stripe
- [ ] Signing secret copiado
- [ ] Variáveis adicionadas no Supabase
- [ ] .env local atualizado
- [ ] Teste com cartão de teste realizado
- [ ] Dados atualizados no Supabase confirmados

---

**🎉 Parabéns! Sua integração Stripe está completa!**
