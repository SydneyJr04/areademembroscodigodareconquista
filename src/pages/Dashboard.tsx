import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getModulesConfig } from '@/data/modulesConfig';
import { getTotalLessons } from '@/data/lessons';
import { ModuleCard } from '@/components/ModuleCard';
import { WeeklyChallengeCard } from '@/components/WeeklyChallengeCard';
import { UpsellCarousel } from '@/components/UpsellCarousel';
import { PremiumUpsell } from '@/components/PremiumUpsell';
import { BonusCarousel } from '@/components/BonusCarousel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, Award, TrendingUp, User, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeModal } from '@/components/WelcomeModal';
import { ValueBreakdownCard } from '@/components/ValueBreakdownCard';
import { NotificationPrompt } from '@/components/NotificationPrompt';
import { JourneyMap } from '@/components/JourneyMap';
import { useUserModules } from '@/hooks/useUserModules';
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [userStats, setUserStats] = useState({
    globalProgress: 0,
    achievements: 0,
    streak: 1,
  });

  // ✅ USAR HOOK DE MÓDULOS (DRIP CONTENT)
  const { modules: userModules, loading: modulesLoading } = useUserModules();

  // ═══════════════════════════════════════════════════════════
  // AUTENTICAÇÃO
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // ═══════════════════════════════════════════════════════════
  // CARREGAR PERFIL
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier, subscription_expires_at')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);

          // ✅ VERIFICAR SE SUBSCRIPTION ESTÁ ATIVA
          if (data.subscription_tier !== 'vitalicio' && data.subscription_expires_at) {
            const expiresAt = new Date(data.subscription_expires_at);
            const isExpired = expiresAt < new Date();

            if (isExpired) {
              toast.warning('Sua assinatura expirou!', {
                description: 'Renove para continuar acessando o conteúdo',
                action: {
                  label: 'Renovar',
                  onClick: () => navigate('/meu-plano'),
                },
                duration: 10000,
              });
            }
          }
        }
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // ═══════════════════════════════════════════════════════════
  // CARREGAR ESTATÍSTICAS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        const { data: stats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (stats) {
          const totalLessons = getTotalLessons();
          const globalProgress = Math.round((stats.lessons_completed / totalLessons) * 100);

          setUserStats({
            globalProgress,
            achievements: stats.lessons_completed,
            streak: stats.current_streak_days || 1,
          });
        }
      }
    };

    fetchUserStats();
  }, [user]);

  // ═══════════════════════════════════════════════════════════
  // ✅ HANDLER: CLICK NO MÓDULO (COM VERIFICAÇÃO!)
  // ═══════════════════════════════════════════════════════════
  const handleModuleClick = (moduleNumber: number) => {
    // Buscar módulo do usuário
    const userModule = userModules.find((m) => m.module_number === moduleNumber);

    if (!userModule) {
      toast.error('Módulo não encontrado');
      return;
    }

    // ✅ VERIFICAR SE ESTÁ LIBERADO
    if (!userModule.is_released) {
      const releaseDate = new Date(userModule.release_date);
      const daysUntil = Math.ceil(
        (releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      const relativeTime = formatDistanceToNow(releaseDate, {
        locale: pt,
        addSuffix: true,
      });

      toast.error('🔒 Módulo Bloqueado!', {
        description: `Será liberado ${relativeTime} (${format(releaseDate, "dd 'de' MMMM", { locale: pt })})`,
        duration: 5000,
      });
      return;
    }

    // ✅ MÓDULO LIBERADO - PODE ACESSAR
    console.log(`✅ Acessando módulo ${moduleNumber}`);
    navigate(`/modulo/${moduleNumber}/aula/1`);
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLER: LOGOUT
  // ═══════════════════════════════════════════════════════════
  const handleLogout = async () => {
    await signOut();
    toast.success('Até breve! 👋');
    navigate('/login');
  };

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════
  if (loading || modulesLoading) {
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

  // ═══════════════════════════════════════════════════════════
  // MÓDULOS CONFIG (UI)
  // ═══════════════════════════════════════════════════════════
  const modulesConfig = getModulesConfig();

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                CR
              </div>
              <span className="hidden text-lg font-bold sm:inline">Código da Reconquista</span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/comunidade')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Comunidade</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/meu-plano')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Meu Plano</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 transition-all hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Notification Prompt */}
        <div className="mb-6">
          <NotificationPrompt />
        </div>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8">
              <ValueBreakdownCard />
            </div>

            <div className="mb-6 flex justify-center md:justify-start">
              <img
                src="https://pub-335435355c6548d7987945a540eca66b.r2.dev/LOGO%20NA%20PAGINA%20INICIAL%20DA%20AREA%20DE%20MEMBRO.webp"
                alt="Código da Reconquista"
                className="h-auto max-w-[220px]"
              />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              Bem-vinda à tua virada de jogo,{' '}
              <span className="text-gradient-gold">
                {profile?.full_name || user?.email?.split('@')[0] || 'Aluna'}
              </span>
              !
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Estás pronta para dominar a arte da reconquista? A tua jornada começa agora.
            </p>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background/50 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso Global</p>
                    <p className="text-xl font-bold text-foreground">{userStats.globalProgress}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/20 p-2">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aulas Completas</p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.achievements}/{getTotalLessons()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.streak} {userStats.streak === 1 ? 'dia' : 'dias'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        {/* ✅ JOURNEY MAP (Mapa de Progresso) */}
        {userModules.length > 0 && <JourneyMap modules={userModules} />}

        {/* Weekly Challenge */}
        <WeeklyChallengeCard />

        {/* Main Course Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              O Código da Reconquista: A Jornada Completa
            </h2>
            <p className="text-muted-foreground">
              {modulesConfig.length} módulos transformadores •{' '}
              <span className="font-semibold text-primary">
                {userModules.filter((m) => m.is_released).length} liberados
              </span>
            </p>
          </div>

          <div className="relative">
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
              {modulesConfig.map((module) => {
                // ✅ BUSCAR STATUS DO MÓDULO
                const userModule = userModules.find((m) => m.module_number === module.number);

                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isReleased={userModule?.is_released || false}
                    releaseDate={userModule?.release_date}
                    onClick={() => handleModuleClick(module.number)}
                  />
                );
              })}
            </div>
          </div>

          {/* ✅ LEGENDA */}
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg border border-border bg-card/50 p-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Liberado</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Bloqueado</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Concluído</span>
            </div>
          </div>
        </section>

        {/* Recomendado Para Você */}
        <UpsellCarousel />

        {/* Seção Premium: A Deusa na Cama */}
        <PremiumUpsell />

        {/* O Teu Arsenal Secreto */}
        <BonusCarousel />
      </div>
    </div>
  );
};

export default Dashboard;
