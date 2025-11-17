# 🔑 URLs E CREDENCIAIS - Código da Reconquista

## 📍 URLS IMPORTANTES

### Webhook Stripe
Após fazer deploy das Edge Functions:

```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-webhooks
```

**Como obter SEU-PROJECT-ID:**
1. Acesse [supabase.com](https://supabase.com)
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie a "Project URL"
5. Exemplo: `https://abcdefghijk.supabase.co`
6. O ID é: `abcdefghijk`

### Checkout Stripe

```
https://[SEU-PROJECT-ID].supabase.co/functions/v1/stripe-checkout
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Arquivo `.env` (Local Development)

```env
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (OPCIONAL - apenas se integrar pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Price IDs dos Produtos Stripe
VITE_STRIPE_PRICE_SEMANAL=price_xxxxx
VITE_STRIPE_PRICE_MENSAL=price_xxxxx
VITE_STRIPE_PRICE_VITALICIO=price_xxxxx
```

### Como obter Supabase Keys:

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** → VITE_SUPABASE_ANON_KEY

---

## 🎬 VÍDEOS CADASTRADOS

Os seguintes vídeos do YouTube já estão cadastrados no banco de dados:

### Módulo 1: Reset Emocional
1. `c1CQZVK5lhc` - Suma que ELE VEM ATRÁS!
2. `S7_4EebCUcM` - NÃO TENHA MEDO de sumir
3. `fsCvIC_FYRM` - Os HOMENS SEMPRE VOLTAM
4. `wPFir0N4HoU` - HOMEM precisa de AUSÊNCIA
5. `w3gApW6MI3M` - Por que quando a MULHER SOME (BÔNUS)
6. `ODhg0ND4DYc` - Por que NÃO IR ATRÁS (BÔNUS)
7. `jGjdF7U14EY` - Não entre em DESESPERO! (BÔNUS)

### Módulo 2: Mapa da Mente Masculina
1. `Kvmh9RUIfFc` - OS 5 PRINCÍPIOS DA MENTE MASCULINA!
2. `-pfXXwkNWTk` - COMO CONTROLAR A MENTE DE UM HOMEM?
3. `v_d7mmtVh0c` - O que o SILÊNCIO faz na CABEÇA
4. `knKjXRx0iag` - CABEÇA DO HOMEM no PÓS TÉRMINO
5. `eDMlDbXrBUA` - OS HOMENS SÃO PREVISÍVEIS!! (BÔNUS)
6. `DbMmYHv1xkk` - HOMEM GOSTA DE SER PISADO (BÔNUS)
7. `nz3IEPR7euo` - LINHA MASCULINA do tempo (BÔNUS)

### Módulo 3: Gatilhos da Memória Emocional
1. `Itat8QDkhhQ` - Como deixar um HOMEM COM MEDO DE PERDER!
2. `5LMJop82nBk` - APRENDA A REJEITAR PRA ELE VIR ATRAS!
3. `8KD93jjgbBg` - Postura que faz HOMEM QUERER FEITO DOIDO
4. `TAgC5VAg2_o` - EU QUERO QUE ELE VOLTE RASTEJANDO! (BÔNUS)

### Módulo 4: A Frase de 5 Palavras
1. `hjVBIwEWO7o` - 3 Frases Pra Mexer PROFUNDAMENTE
2. `tu2NxuqrbK4` - A Mensagem que Reconquista
3. `hRYhIoNhJqs` - ELE SUMIU! Devo MANDAR um 'Oi'?
4. `PGKr4GN-UtM` - Como Fazer Ele SENTIR SUA FALTA (BÔNUS)

### Módulo 5: Primeiro Contato Estratégico
1. `-6YSO7AYrZI` - O EX APARECEU FAÇA CERTO DESSA VEZ!
2. `sklhMr24Fg4` - Como se comportar ao se ENCONTRAR com EX?
3. `h5gUHiS-q7k` - Ele enviou 'SAUDADES'!!! O QUE RESPONDER?

### Módulo 6: Domínio da Conversa
1. `jkBEYleb4ZM` - WHATSAPP SEJA DIRETA AO FALAR COM HOMEM!
2. `MYPGCmLJFKw` - WhatsApp; Mensagem MEDÍOCRE NÃO se RESPONDE!!
3. `eSgYJD9OVSU` - VOCÊ sabe se COMUNICAR com um HOMEM?
4. `QDFILn1Z-n0` - O que falar no WHATS após um Gelo? Parte 1 (BÔNUS)
5. `UL6eqQ3yGFA` - O que falar no SAPP após Gelo? Parte 2 (BÔNUS)

### Módulo 7: Conquista Duradoura
1. `kSf3mrsW5XA` - POR QUE NENHUM RELACIONAMENTO MEU VAI PRA FRENTE
2. `4p3u7AaOsDg` - Como VIRAR O JOGO no seu RELACIONAMENTO?
3. `NXDmCor9bUY` - Como prender um homem? TÉCNICA INFALÍVEL!
4. `zbwv5QuANd8` - COMO MANTER O HOMEM INTERESSADO?
5. `s4SzR3LStMc` - NÃO ACEITE qualquer coisa de um HOMEM!! (BÔNUS)
6. `koNd0YLIYkQ` - NÃO DÊ O SEU PODER A UM HOMEM! (BÔNUS)

**TOTAL: 42 aulas cadastradas**

---

## �� CREDENCIAIS PADRÃO

### Senha Automática no Cadastro:
```
Reconquista@2026
```

Todos os novos usuários recebem esta senha automaticamente.
Eles podem alterá-la depois no perfil.

---

## 💳 STRIPE - DADOS DE TESTE

### Cartões de Teste:

**Sucesso:**
```
Número: 4242 4242 4242 4242
Validade: 12/25 (qualquer data futura)
CVC: 123 (qualquer 3 dígitos)
CEP: 12345 (qualquer 5 dígitos)
```

**Requer Autenticação:**
```
Número: 4000 0025 0000 3155
```

**Falha:**
```
Número: 4000 0000 0000 9995
```

**Mais cartões de teste:**
[https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 🎯 THUMBNAILS DOS MÓDULOS

URLs das imagens dos módulos:

1. Módulo 1: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%201.webp`
2. Módulo 2: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%202.webp`
3. Módulo 3: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%203.webp`
4. Módulo 4: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%204.webp`
5. Módulo 5: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%205.webp`
6. Módulo 6: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%206.webp`
7. Módulo 7: `https://pub-335435355c6548d7987945a540eca66b.r2.dev/MODULO%207.webp`

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### Tabelas Criadas:

1. **profiles** - Usuários
2. **modules** - Módulos (7 registros)
3. **lessons** - Aulas (42 registros)
4. **user_modules** - Acesso do usuário aos módulos
5. **user_lessons** - Progresso das aulas
6. **payments** - Pagamentos Stripe
7. **user_stats** - Estatísticas e gamificação

### Exemplo de Query:

```sql
-- Ver todos os módulos
SELECT * FROM modules ORDER BY order_index;

-- Ver aulas de um módulo
SELECT * FROM lessons WHERE module_id = 1 ORDER BY order_index;

-- Ver progresso de um usuário
SELECT
  l.title,
  ul.is_completed,
  ul.watch_percentage
FROM user_lessons ul
JOIN lessons l ON l.id = ul.lesson_id
WHERE ul.user_id = 'user-uuid-here';
```

---

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento:
```bash
npm run dev          # Iniciar servidor de dev
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar erros de código
npm run typecheck    # Verificar tipos TypeScript
```

### Supabase CLI:
```bash
supabase login                              # Login no Supabase
supabase link --project-ref [PROJECT-ID]    # Link com projeto
supabase functions deploy [FUNCTION-NAME]   # Deploy de function
supabase functions logs [FUNCTION-NAME]     # Ver logs
```

### Git:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

---

## 📱 LINKS ÚTEIS

### Documentação:
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/en/main)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Stripe API](https://stripe.com/docs/api)

### Dashboards:
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com)

### Ferramentas:
- [Plyr Documentation](https://github.com/sampotts/plyr)
- [Lucide Icons](https://lucide.dev)
- [Zod Validation](https://zod.dev)

---

## 🎨 DESIGN TOKENS

### Cores:
```css
--primary: #FFD700      /* Dourado */
--accent: #E50914       /* Vermelho */
--bg-dark: #0a0a0a      /* Background */
--surface: #1a1a1a      /* Cards */
--text-primary: #ffffff /* Texto branco */
--text-secondary: #a1a1a1 /* Texto cinza */
```

### Breakpoints:
```css
sm: 640px   /* Smartphone */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

---

## ✅ CHECKLIST PRÉ-PRODUÇÃO

Antes de fazer deploy para produção:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Bucket `avatars` criado e público no Supabase
- [ ] Stripe configurado (se usando)
- [ ] Todos os vídeos do YouTube verificados
- [ ] Testado em mobile, tablet e desktop
- [ ] Testado em Chrome, Firefox e Safari
- [ ] Performance verificada (Lighthouse > 90)
- [ ] SEO básico configurado
- [ ] Analytics configurado (opcional)
- [ ] Domínio customizado configurado (opcional)

---

## 🆘 SUPORTE

Em caso de problemas:

1. ✅ Leia `IMPORTANTE_LEIA_PRIMEIRO.md`
2. ✅ Consulte `SETUP_COMPLETO.md`
3. ✅ Verifique console do navegador (F12)
4. ✅ Veja logs do Supabase
5. ✅ Confirme variáveis de ambiente

---

**🎉 Tudo pronto! Boa sorte com o lançamento!**
