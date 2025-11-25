// =====================================================
// EDGE FUNCTION: webhook-deusa-na-cama
// Descrição: Processa pagamentos do Lojou.app para A Deusa na Cama
// Deploy em: https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Parse o corpo da requisição
    const payload = await req.json();
    console.log('📦 Webhook recebido:', JSON.stringify(payload, null, 2));

    // 2. Validar evento
    const event = payload.event || payload.type;
    if (!['payment.completed', 'payment.approved', 'order.paid'].includes(event)) {
      console.log('⚠️ Evento ignorado:', event);
      return new Response(
        JSON.stringify({ message: 'Evento não processado', event }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 3. Extrair dados do comprador
    const customerData = payload.data || payload.customer || payload;
    const email = customerData.email || customerData.buyer_email;
    const name = customerData.name || customerData.buyer_name || email.split('@')[0];
    const amount = customerData.amount || customerData.paid_amount || 597.00;
    const transactionId = customerData.transaction_id || customerData.payment_id || `deusa_${Date.now()}`;

    if (!email) {
      throw new Error('Email não encontrado no payload');
    }

    console.log('👤 Comprador:', { email, name, amount, transactionId });

    // 4. Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Buscar ou criar usuário
    let userId: string;

    // Tentar encontrar usuário existente
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const foundUser = existingUser?.users?.find((u) => u.email === email);

    if (foundUser) {
      userId = foundUser.id;
      console.log('✅ Usuário existente encontrado:', userId);
    } else {
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (createError) {
        throw new Error(`Erro ao criar usuário: ${createError.message}`);
      }

      userId = newUser.user!.id;
      console.log('✅ Novo usuário criado:', userId);
    }

    // 6. Buscar produto A Deusa na Cama
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', 'deusa-na-cama')
      .single();

    if (productError || !product) {
      throw new Error('Produto "A Deusa na Cama" não encontrado no banco de dados');
    }

    console.log('📚 Produto encontrado:', product.id);

    // 7. Conceder acesso ao produto
    const { error: accessError } = await supabase
      .from('user_product_access')
      .upsert(
        {
          user_id: userId,
          product_id: product.id,
          purchased_at: new Date().toISOString(),
          expires_at: null, // Acesso vitalício
          is_active: true,
          transaction_id: transactionId,
          amount_paid: amount,
        },
        { onConflict: 'user_id,product_id' }
      );

    if (accessError) {
      throw new Error(`Erro ao conceder acesso: ${accessError.message}`);
    }

    console.log('🎉 Acesso concedido com sucesso!');

    // 8. Resposta de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Acesso ao curso "A Deusa na Cama" concedido com sucesso',
        userId,
        productId: product.id,
        email,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Erro no webhook:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.toString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// =====================================================
// COMO USAR:
// =====================================================
// 1. Deploy desta função no Supabase:
//    - Via Dashboard: Edge Functions → Create Function
//    - Via CLI: supabase functions deploy webhook-deusa-na-cama
//
// 2. Configurar webhook no Lojou.app:
//    - URL: https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama
//    - Eventos: payment.completed, payment.approved, order.paid
//
// 3. Testar manualmente:
//    curl -X POST https://SEU-PROJECT-ID.supabase.co/functions/v1/webhook-deusa-na-cama \
//      -H "Content-Type: application/json" \
//      -d '{
//        "event": "payment.completed",
//        "data": {
//          "email": "teste@email.com",
//          "name": "Cliente Teste",
//          "amount": 597.00,
//          "transaction_id": "test_123"
//        }
//      }'
// =====================================================
