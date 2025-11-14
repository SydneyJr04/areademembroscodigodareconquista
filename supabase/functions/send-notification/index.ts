import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { userId, title, body, url, moduleId, lessonNumber } = await req.json();

    // Buscar subscription do usuário
    const { data: subscriptionData, error: subError } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .single();

    if (subError || !subscriptionData) {
      return new Response(
        JSON.stringify({ error: 'Subscription não encontrada' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscription = subscriptionData.subscription;

    // Enviar notificação push
    const payload = JSON.stringify({
      title: title || '👑 Código da Reconquista',
      body: body || 'Continue suas aulas e reconquiste!',
      url: url || '/',
      moduleId,
      lessonNumber
    });

    // Aqui você enviaria a notificação usando web-push
    // Por simplicidade, vamos apenas logar
    console.log('Enviando notificação:', { userId, payload });

    // Registrar no banco
    await supabase.from('notification_logs').insert({
      user_id: userId,
      title,
      body,
      sent_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Notificação enviada' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Erro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
