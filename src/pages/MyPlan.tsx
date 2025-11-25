import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Check,
  Crown,
  Sparkles,
  Lock,
  Zap,
  Clock,
  Infinity,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MyPlan() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (tier: 'mensal' | 'vitalicio') => {
    if (!user) return;

    // Verificar se já tem plano vitalício
    if (profile?.subscription_tier === 'vitalicio') {
      toast.error('Você já possui o plano vitalício! 🎉');
      return;
    }

    setCheckoutLoading(tier);

    try {
      // URLs de checkout (substituir pelos URLs reais do Lojou.app)
      const checkoutUrls = {
        mensal: 'https://pay.lojou.app/p/MENSAL_197', // ← Substituir pelo link real
        vitalicio: 'https://pay.lojou.app/p/VITALICIO_897', // ← Substituir pelo link real
      };

      // Redirecionar para checkout
      window.location.href = checkoutUrls[tier];

    } catch (error: any) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setTimeout(() => setCheckoutLoading(null), 2000);
    }
  };

  const getTimeUntilExpiry = () => {
    if (!profile?.subscription_expires_at) return null;

    try {
      return formatDistanceToNow(new Date(profile.subscription_expires_at), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return null;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    );
  }

  const plans = [
    {
      id: 'mensal',
      name: 'Plano Mensal',
      price: 197,
      period: 'mês',
      description: 'Acesso ao conteúdo principal por 1 mês',
      icon: Clock,
      color: 'blue',
      features: [
        { text: 'Código da Reconquista Completo', included: true },
        { text: '7 módulos transformadores', included: true },
        { text: '39 aulas práticas', included: true },
        { text: 'Suporte básico', included: true },
        { text: 'A Deusa na Cama', included: false },
        { text: 'Mentoria e Lives 3x/semana', included: false },
        { text: 'Comunidade das Poderosas', included: false },
        { text: 'Todos os bônus', included: false },
        { text: 'Notificações em primeira mão', included: false },
      ],
      cta: 'Começar Agora',
      popular: false,
    },
    {
      id: 'vitalicio',
      name: 'Plano Vitalício',
      price: 897,
      period: 'pagamento único',
      description: 'Acesso COMPLETO e VITALÍCIO a TUDO na plataforma',
      icon: Crown,
      color: 'purple',
      features: [
        { text: 'Código da Reconquista Completo', included: true },
        { text: 'A Deusa na Cama (40 aulas)', included: true, highlight: true },
        { text: 'Mentoria e Lives 3x/semana', included: true, highlight: true },
        { text: 'Comunidade das Poderosas', included: true, highlight: true },
        { text: 'Todos os bônus exclusivos', included: true, highlight: true },
        { text: 'Suporte prioritário VIP', included: true, highlight: true },
        { text: 'Notificações em primeira mão', included: true, highlight: true },
        { text: 'Acesso vitalício (para sempre)', included: true, highlight: true },
        { text: 'Futuras atualizações GRÁTIS', included: true, highlight: true },
      ],
      cta: 'Garantir Acesso Vitalício',
      popular: true,
      savings: 'Economize 2.300+ MZN por ano',
    },
  ];

  const currentPlan = profile?.subscription_tier;
  const expiryTime = getTimeUntilExpiry();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Escolha Seu Plano
            </h1>
            <p className="text-lg text-muted-foreground">
              Transforme sua vida amorosa com acesso completo ao conteúdo
            </p>
          </div>

          {/* Current Plan Status */}
          {currentPlan && (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Plano Atual: {currentPlan === 'vitalicio' ? 'Vitalício' : 'Mensal'}
                </span>
              </div>
              {expiryTime && currentPlan !== 'vitalicio' && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Expira {expiryTime}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plans Carousel */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 md:justify-center">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;
              const canUpgrade = currentPlan === 'mensal' && plan.id === 'vitalicio';

              return (
                <Card
                  key={plan.id}
                  className={`relative min-w-[320px] flex-shrink-0 snap-center overflow-hidden border-2 transition-all duration-300 hover:scale-105 sm:min-w-[400px] ${
                    plan.popular
                      ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
                      : 'border-border/50'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute right-0 top-0 z-10">
                      <div className="rotate-45 translate-x-8 translate-y-4 transform bg-gradient-to-r from-purple-500 to-purple-700 px-12 py-1 text-center text-xs font-bold text-white shadow-lg">
                        MAIS ESCOLHIDO
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute left-4 top-4 z-10">
                      <Badge className="gap-1 bg-green-500">
                        <Check className="h-3 w-3" />
                        Seu Plano
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={`${plan.popular ? 'bg-gradient-to-br from-purple-500/20 to-transparent' : ''}`}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`rounded-lg p-3 ${plan.color === 'purple' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                        <Icon className={`h-8 w-8 ${plan.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        {plan.savings && (
                          <Badge variant="outline" className="mt-1 border-green-500 text-green-500">
                            {plan.savings}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className={`text-4xl font-bold ${plan.popular ? 'text-purple-400' : 'text-blue-400'}`}>
                          {plan.price} MZN
                        </span>
                        {plan.id === 'vitalicio' && (
                          <Infinity className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.period}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 ${
                            feature.highlight ? 'rounded-lg bg-purple-500/10 p-2' : ''
                          }`}
                        >
                          {feature.included ? (
                            <Check className={`mt-0.5 h-5 w-5 flex-shrink-0 ${feature.highlight ? 'text-purple-400' : 'text-green-500'}`} />
                          ) : (
                            <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground/50" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? feature.highlight
                                  ? 'font-semibold text-foreground'
                                  : 'text-foreground'
                                : 'text-muted-foreground/50 line-through'
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={() => handleCheckout(plan.id as 'mensal' | 'vitalicio')}
                      disabled={isCurrentPlan || checkoutLoading !== null}
                      className={`w-full font-semibold ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800'
                          : ''
                      }`}
                      size="lg"
                    >
                      {checkoutLoading === plan.id ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processando...
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Plano Atual
                        </>
                      ) : canUpgrade ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Fazer Upgrade
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          {plan.cta}
                        </>
                      )}
                    </Button>

                    {/* Guarantee */}
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
                      <p className="text-xs text-green-400">
                        🛡️ Garantia de 7 dias ou seu dinheiro de volta
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Scroll Indicators */}
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {plans.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 space-y-6">
          {/* FAQ Quick */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-xl font-bold text-foreground">
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              <div>
                <p className="mb-1 font-semibold text-foreground">
                  Posso cancelar quando quiser?
                </p>
                <p className="text-sm text-muted-foreground">
                  Sim! Não há fidelidade. Você pode cancelar sua assinatura mensal a qualquer momento.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-foreground">
                  O plano vitalício é realmente para sempre?
                </p>
                <p className="text-sm text-muted-foreground">
                  Sim! Pagamento único e acesso vitalício a TODO o conteúdo, incluindo futuras atualizações.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-foreground">
                  Como funciona a garantia?
                </p>
                <p className="text-sm text-muted-foreground">
                  Se não ficar satisfeita em 7 dias, devolvemos 100% do seu dinheiro. Sem perguntas!
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-6 text-center">
            <MessageCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-bold text-foreground">
              Ainda tem dúvidas?
            </h3>
            <p className="mb-4 text-muted-foreground">
              Fale conosco no WhatsApp e tire todas as suas dúvidas
            </p>
            <Button
              variant="outline"
              onClick={() => window.open('https://wa.me/258834569225', '_blank')}
              className="gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
