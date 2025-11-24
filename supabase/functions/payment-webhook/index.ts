// supabase/functions/payment-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, tier, paymentId, amount } = await req.json();

    await processPayment(supabase, userId, tier, 'manual', paymentId, amount);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

async function processPayment(
  supabase: any,
  userId: string,
  tier: 'semanal' | 'mensal' | 'vitalicio',
  paymentMethod: string,
  paymentId: string,
  amount: number
) {
  console.log(`Processando pagamento: ${userId} - ${tier} - ${amount}`);

  let expiresAt: string | null = null;

  if (tier === 'semanal') {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    expiresAt = date.toISOString();
  } else if (tier === 'mensal') {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    expiresAt = date.toISOString();
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: expiresAt,
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
  }

  if (tier === 'vitalicio') {
    await supabase
      .from('user_modules')
      .update({
        is_released: true,
        release_date: new Date().toISOString()
      })
      .eq('user_id', userId);
  }

  await supabase
    .from('payment_transactions')
    .insert({
      user_id: userId,
      amount,
      currency: 'MZN',
      payment_method: paymentMethod,
      payment_id: paymentId,
      status: 'completed',
      subscription_tier: tier,
      subscription_period_start: new Date().toISOString(),
      subscription_period_end: expiresAt,
      paid_at: new Date().toISOString(),
      metadata: {
        processed_at: new Date().toISOString(),
      },
    });

  console.log(`✅ Pagamento processado: ${userId} - ${tier}`);
}
