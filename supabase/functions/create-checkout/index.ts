// supabase/functions/create-checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  tier: 'semanal' | 'mensal' | 'vitalicio';
  userId: string;
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tier, userId, email }: CheckoutRequest = await req.json();

    // Preços em MZN
    const prices = {
      'semanal': 197,
      'mensal': 397,
      'vitalicio': 997,
    };

    const price = prices[tier];

    if (!price) {
      throw new Error('Plano inválido');
    }

    // ============================================
    // OPÇÃO 1: STRIPE (RECOMENDADO)
    // ============================================
    // Descomente se usar Stripe:
    /*
    const stripe = require('stripe')(Deno.env.get('STRIPE_SECRET_KEY'));

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mzn',
          product_data: {
            name: `Código da Reconquista - Plano ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
            description: tier === 'vitalicio'
              ? 'Acesso vitalício a todos os módulos'
              : `Acesso por ${tier === 'semanal' ? '7 dias' : '30 dias'}`,
          },
          unit_amount: price * 100, // Stripe usa centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_URL')}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${Deno.env.get('APP_URL')}/meu-plano?payment=cancelled`,
      metadata: {
        userId,
        tier,
      },
    });

    return new Response(
      JSON.stringify({
        checkoutUrl: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    */

    // ============================================
    // OPÇÃO 2: MPESA (MOÇAMBIQUE)
    // ============================================
    // Descomente se usar M-Pesa:
    /*
    const mpesaResponse = await fetch('https://api.mpesa.vm.co.mz/ipg/v1x/c2bPayment/singleStage/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('MPESA_API_KEY')}`,
      },
      body: JSON.stringify({
        input_Amount: price,
        input_CustomerMSISDN: '258...', // Número do cliente
        input_ServiceProviderCode: Deno.env.get('MPESA_SERVICE_CODE'),
        input_ThirdPartyReference: `CR-${userId}-${Date.now()}`,
        input_TransactionReference: `TRX-${Date.now()}`,
      }),
    });

    const mpesaData = await mpesaResponse.json();

    return new Response(
      JSON.stringify({
        transactionId: mpesaData.output_TransactionID,
        message: 'Pagamento M-Pesa iniciado'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    */

    // ============================================
    // OPÇÃO 3: WHATSAPP (PROVISÓRIO)
    // ============================================
    // Enquanto não integra pagamento, use WhatsApp:

    const whatsappNumber = '258834569225';
    const message = `Olá! Gostaria de adquirir o *Plano ${tier.charAt(0).toUpperCase() + tier.slice(1)}* por *${price} MZN*.

📧 Email: ${email}
🆔 ID: ${userId}

Por favor, confirme os dados de pagamento.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Registrar intenção de compra
    await supabase.from('payment_transactions').insert({
      user_id: userId,
      amount: price,
      currency: 'MZN',
      payment_method: 'whatsapp',
      status: 'pending',
      subscription_tier: tier,
      metadata: { email, initiated_at: new Date().toISOString() },
    });

    return new Response(
      JSON.stringify({
        checkoutUrl: whatsappUrl,
        method: 'whatsapp',
        message: 'Redirecionando para WhatsApp...'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
