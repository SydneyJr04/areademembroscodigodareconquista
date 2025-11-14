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

    // Buscar usuários inativos (sem atividade nas últimas 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: inactiveUsers, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        last_activity_date,
        profiles!inner(email, full_name)
      `)
      .lt('last_activity_date', oneDayAgo);

    if (error) throw error;

    console.log(`Encontrados ${inactiveUsers?.length || 0} usuários inativos`);

    // Para cada usuário inativo, enviar notificação
    for (const user of inactiveUsers || []) {
      // Buscar última aula vista
      const { data: lastLesson } = await supabase
        .from('user_lessons')
        .select('module_number, lesson_number')
        .eq('user_id', user.user_id)
        .order('last_watched_at', { ascending: false })
        .limit(1)
        .single();

      let message = 'Continue de onde parou e reconquiste!';
      let url = '/';

      if (lastLesson) {
        message = `Continue o Módulo ${lastLesson.module_number}, Aula ${lastLesson.lesson_number + 1}`;
        url = `/lesson?module=${lastLesson.module_number}&lesson=${lastLesson.lesson_number + 1}`;
      }

      // Enviar notificação
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
        },
        body: JSON.stringify({
          userId: user.user_id,
          title: '👑 Sentindo falta de você!',
          body: message,
          url
        })
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: inactiveUsers?.length || 0 
      }),
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
