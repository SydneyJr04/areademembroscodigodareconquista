import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';

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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        const { data } = await (supabase as any)
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">A carregar...</div>
      </div>
    );
  }

  if (!user) return null;

  const isExpired = expiresAt && new Date(expiresAt) < new Date();

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
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Meu Plano de Assinatura</h1>
          {isExpired && (
            <div className="mx-auto max-w-2xl rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="font-semibold text-destructive">
                ⚠️ Seu plano expirou. Renove para continuar acessando o conteúdo!
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.tier === currentTier;
            const isVitalicio = plan.tier === 'vitalicio';

            return (
              <Card
                key={plan.id}
                className={`relative p-6 ${
                  isVitalicio
                    ? 'border-primary bg-gradient-to-br from-primary/20 to-background'
                    : isCurrentPlan
                      ? 'border-green-500'
                      : 'border-border'
                }`}
              >
                {isVitalicio && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-1">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-bold">RECOMENDADO</span>
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold">
                      SEU PLANO
                    </div>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{plan.duration}</p>
                  <p className="text-4xl font-bold text-primary">{plan.price} MZN</p>
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
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan && !isExpired}
                >
                  {isCurrentPlan && !isExpired
                    ? 'Plano Ativo'
                    : isCurrentPlan && isExpired
                      ? 'Renovar Plano'
                      : 'Fazer Upgrade'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
