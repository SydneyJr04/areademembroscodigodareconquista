import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  tier: 'semanal' | 'mensal' | 'vitalicio';
}

const plans: Plan[] = [
  {
    id: 'semanal',
    name: 'Plano Semanal',
    price: 197,
    duration: 'Renova a cada 7 dias',
    tier: 'semanal',
    benefits: [
      'Acesso a todos os 7 módulos',
      'Suporte via WhatsApp',
      'Materiais de apoio',
      'Comunidade exclusiva',
    ],
  },
  {
    id: 'mensal',
    name: 'Plano Mensal',
    price: 397,
    duration: 'Renova a cada 30 dias',
    tier: 'mensal',
    benefits: [
      'Acesso a todos os 7 módulos',
      'Suporte prioritário via WhatsApp',
      'Materiais de apoio',
      'Comunidade exclusiva',
      'Desconto em upsells',
    ],
  },
  {
    id: 'vitalicio',
    name: 'Plano Vitalício',
    price: 997,
    duration: 'Acesso para sempre',
    tier: 'vitalicio',
    benefits: [
      'Acesso vitalício a todos os módulos',
      'Suporte VIP via WhatsApp',
      'Todos os materiais de apoio',
      'Comunidade exclusiva',
      'Atualizações futuras gratuitas',
      'Bônus exclusivos',
      '50% de desconto em lives de mentoria',
    ],
  },
];

const MyPlan = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_expires_at')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setCurrentTier(data.subscription_tier || 'mensal');
          setExpiresAt(data.subscription_expires_at);
        }
      }
    };

    fetchSubscription();
  }, [user]);

  // ═══════════════════════════════════════════════════════════
  // ✅ HANDLER: CHECKOUT DE PAGAMENTO
  // ═══════════════════════════════════════════════════════════
  const handleCheckout = async (tier: 'semanal' | 'mensal' | 'vitalicio', price: number) => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setProcessingPlan(tier);

    try {
      // Chamar edge function para criar checkout
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier,
          userId: user.id,
          email: user.email,
        },
      });

      if (error) {
        console.error('Erro ao criar checkout:', error);
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      if (data?.checkoutUrl) {
        // Redirecionar para checkout
        toast.success('Redirecionando para pagamento...', {
          description: 'Você será redirecionado em instantes',
        });

        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1000);
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pagamento', {
        description: error.message || 'Tente novamente ou entre em contato',
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
          <p className="text-muted-foreground">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isExpired = expiresAt && new Date(expiresAt) < new Date();
  const isVitalicio = currentTier === 'vitalicio';

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Meu Plano de Assinatura</h1>

          {/* Plano Atual */}
          {currentTier && !isExpired && (
            <div className="mx-auto max-w-2xl rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="font-semibold text-green-500">
                ✅ Plano {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Ativo
              </p>
              {expiresAt && !isVitalicio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Expira{' '}
                  {formatDistanceToNow(new Date(expiresAt), {
                    locale: pt,
                    addSuffix: true,
                  })}{' '}
                  ({format(new Date(expiresAt), "dd 'de' MMMM", { locale: pt })})
                </p>
              )}
            </div>
          )}

          {/* Alerta de Expiração */}
          {isExpired && (
            <div className="mx-auto max-w-2xl rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="font-semibold text-destructive">
                ⚠️ Seu plano expirou. Renove para continuar acessando o conteúdo!
              </p>
            </div>
          )}
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.tier === currentTier;
            const isVitalicioPlan = plan.tier === 'vitalicio';
            const isProcessing = processingPlan === plan.tier;

            return (
              <Card
                key={plan.id}
                className={`relative p-6 transition-all ${
                  isVitalicioPlan
                    ? 'border-primary bg-gradient-to-br from-primary/20 to-background shadow-xl scale-105'
                    : isCurrentPlan
                      ? 'border-green-500'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                {isVitalicioPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-1 shadow-lg">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-bold">RECOMENDADO</span>
                    </div>
                  </div>
                )}

                {isCurrentPlan && !isExpired && (
                  <div className="absolute -top-4 right-4">
                    <div className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                      SEU PLANO
                    </div>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{plan.duration}</p>
                  <p className="text-4xl font-bold text-primary">{plan.price} MZN</p>
                  {!isVitalicioPlan && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ~{Math.round(plan.price / (plan.tier === 'semanal' ? 7 : 30))} MZN/dia
                    </p>
                  )}
                </div>

                <ul className="mb-6 space-y-3">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan && !isExpired ? 'outline' : 'default'}
                  disabled={(isCurrentPlan && !isExpired) || isProcessing}
                  onClick={() => handleCheckout(plan.tier, plan.price)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : isCurrentPlan && !isExpired ? (
                    'Plano Ativo'
                  ) : isCurrentPlan && isExpired ? (
                    'Renovar Plano'
                  ) : (
                    'Escolher Plano'
                  )}
                </Button>

                {isVitalicioPlan && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    ⚡ Melhor custo-benefício!
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* FAQ / Informações Adicionais */}
        <div className="mt-16 mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-center text-foreground">
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Como funciona o pagamento?</h3>
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para uma página segura de pagamento. Aceitamos cartão de
                crédito, M-Pesa e outras formas de pagamento.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">
                O que acontece se meu plano expirar?
              </h3>
              <p className="text-sm text-muted-foreground">
                Você perderá acesso aos módulos até renovar. Seu progresso será mantido e você
                poderá retomar de onde parou.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Posso fazer upgrade?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode fazer upgrade a qualquer momento. A diferença de valor será
                proporcional ao tempo restante do plano atual.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Tem garantia?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Oferecemos 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do
                seu dinheiro.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Dúvidas? Entre em contato pelo WhatsApp:{' '}
            <a
              href="https://wa.me/258834569225"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              +258 83 456 9225
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
