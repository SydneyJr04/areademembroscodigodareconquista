# Código da Reconquista - Área de Membros

Plataforma completa de membros para o curso "Código da Reconquista" com sistema de drip content, progresso de aulas, gamificação e integração com pagamentos Stripe.

## 🎯 Funcionalidades

### Autenticação
- ✅ Sistema completo de registro e login
- ✅ Senha padrão automática: `Reconquista@2026`
- ✅ Validação de WhatsApp formato Moçambique (+258)
- ✅ Perfil de usuário com upload de avatar
- ✅ Alteração de senha com validações

### Sistema de Conteúdo
- ✅ 7 módulos com drip content (1 módulo a cada 2 dias)
- ✅ 42 aulas em vídeo (YouTube embeds)
- ✅ Progresso de aula salvo automaticamente
- ✅ Modal de celebração ao completar aulas
- ✅ Navegação entre aulas

### Gamificação
- ✅ Sistema de estatísticas
- ✅ Contador de dias consecutivos (streak)
- ✅ Progresso visual por módulo
- ✅ Badges e conquistas

### Design
- ✅ Design premium com gradientes dourado/vermelho
- ✅ Totalmente responsivo
- ✅ Animações suaves e transições
- ✅ Interface Netflix-style

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd codigo-da-reconquista
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure o Supabase

#### 4.1 Crie um projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto

#### 4.2 Execute a migração do banco de dados
- No Supabase Dashboard, vá em SQL Editor
- A migração já foi aplicada automaticamente com todas as tabelas necessárias

#### 4.3 Configure o Storage para avatares
1. Vá em Storage > Create bucket
2. Nome: `avatars`
3. Public bucket: ✅ Ativo
4. Allowed MIME types: `image/*`

#### 4.4 Configure Authentication
1. Vá em Authentication > Settings
2. Desabilite "Email Confirmations" (já está por padrão)
3. Em "Auth Providers", mantenha apenas "Email" habilitado

### 5. Rode o projeto localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **profiles** - Dados complementares do usuário
- **modules** - Catálogo de módulos (7 módulos)
- **lessons** - Catálogo de aulas (42 aulas)
- **user_modules** - Controle de acesso com drip content
- **user_lessons** - Progresso individual de cada aula
- **user_stats** - Estatísticas e gamificação
- **payments** - Histórico de pagamentos Stripe

### Drip Content

Os módulos são liberados automaticamente:
- Módulo 1: Imediatamente após cadastro
- Módulo 2: 2 dias após cadastro
- Módulo 3: 4 dias após cadastro
- E assim por diante...

## 💳 Integração com Stripe (Opcional)

### Passo 1: Criar conta Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie uma conta

### Passo 2: Obter chaves da API

1. Vá em Developers > API keys
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### Passo 3: Criar produtos

1. Vá em Products
2. Crie os planos:
   - **Semanal**: 100 MZN/semana
   - **Mensal**: 300 MZN/mês
   - **Vitalício**: 1500 MZN (pagamento único)

### Passo 4: Deploy das Edge Functions

As Edge Functions para Stripe já estão preparadas no diretório `supabase/functions/`.

Para fazer deploy:

```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref your-project-ref

# Deploy das functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhooks
```

### Passo 5: Configurar Webhook no Stripe

1. Vá em Developers > Webhooks
2. Clique em "Add endpoint"
3. URL do webhook: `https://your-project.supabase.co/functions/v1/stripe-webhooks`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copie o **Webhook Secret** (whsec_...)

### Passo 6: Adicione as variáveis de ambiente

No Supabase Dashboard > Edge Functions > Settings:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🎨 Customização

### Cores

Edite `tailwind.config.js` para alterar o tema de cores:

```js
theme: {
  extend: {
    colors: {
      primary: '#FFD700',    // Dourado
      accent: '#E50914',     // Vermelho
      // Adicione suas cores aqui
    }
  }
}
```

### Módulos e Aulas

Os dados estão seed-ados no banco. Para adicionar novos:

1. Vá no Supabase Dashboard > Table Editor
2. Tabela `modules`: Adicione novos módulos
3. Tabela `lessons`: Adicione novas aulas com o YouTube ID

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 🔐 Segurança

### Row Level Security (RLS)

Todas as tabelas de usuário têm RLS habilitado:

- Usuários só podem ver/editar seus próprios dados
- Módulos e aulas são públicos para usuários autenticados
- Pagamentos são privados por usuário

### Validações

- Email único no cadastro
- Senha mínima de 8 caracteres (ao alterar)
- WhatsApp formato +258XXXXXXXXX
- Upload de imagem limitado a 2MB

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

Certifique-se de que o arquivo `.env` existe e contém as variáveis corretas.

### Módulos não aparecem

1. Verifique se a migração foi executada
2. Vá no Supabase > Table Editor > modules
3. Confirme que existem 7 módulos cadastrados

### Vídeos não carregam

1. Verifique se os YouTube IDs estão corretos
2. Certifique-se de que os vídeos são públicos ou não-listados (não privados)

### Avatar não faz upload

1. Confirme que o bucket `avatars` existe
2. Verifique se é público
3. Confirme as permissões de MIME types

## 📄 Licença

Este projeto é proprietário e confidencial.

## 🤝 Suporte

Para suporte, entre em contato: [seu-email@exemplo.com]

---

Desenvolvido com ❤️ para o Código da Reconquista
