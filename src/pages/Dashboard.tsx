import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getModulesConfig } from '@/data/modulesConfig';
import { getTotalLessons } from '@/data/lessons';
import { ModuleCard } from '@/components/ModuleCard';
import { WeeklyChallengeCard } from '@/components/WeeklyChallengeCard';
import { UpsellCarousel } from '@/components/UpsellCarousel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, Award, TrendingUp, Lock, User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeModal } from '@/components/WelcomeModal';
import { ValueBreakdownCard } from '@/components/ValueBreakdownCard';
import { NotificationPrompt } from '@/components/NotificationPrompt';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [userStats, setUserStats] = useState({
    globalProgress: 0,
    achievements: 0,
    streak: 1
  });

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
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

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
            streak: stats.current_streak_days || 1
          });
        }
      }
    };

    fetchUserStats();
  }, [user]);

  // ═══════════════════════════════════════════════════════════
  // HANDLER: CLICK NO MÓDULO (SIMPLIFICADO - SEM VERIFICAÇÃO)
  // ═══════════════════════════════════════════════════════════
  const handleModuleClick = (moduleNumber: number) => {
    console.log(`✅ [Dashboard] Navegando para módulo ${moduleNumber}`);
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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ═══════════════════════════════════════════════════════════
  // MÓDULOS (TODOS LIBERADOS)
  // ═══════════════════════════════════════════════════════════
  const modulesConfig = getModulesConfig();

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal />
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
                CR
              </div>
              <span className="font-bold text-lg hidden sm:inline">Código da Reconquista</span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/comunidade')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Comunidade</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/meu-plano')}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Meu Plano</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Notification Prompt */}
        <div className="mb-6">
          <NotificationPrompt />
        </div>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-background border border-border p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8">
              <ValueBreakdownCard />
            </div>

            <div className="mb-6 flex justify-center md:justify-start">
              <img 
                src="https://pub-335435355c6548d7987945a540eca66b.r2.dev/LOGO%20NA%20PAGINA%20INICIAL%20DA%20AREA%20DE%20MEMBRO.webp"
                alt="Código da Reconquista"
                className="max-w-[220px] h-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Bem-vinda à tua virada de jogo, <span className="text-gradient-gold">{profile?.full_name || user?.email?.split('@')[0] || 'Aluna'}</span>!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Estás pronta para dominar a arte da reconquista? A tua jornada começa agora.
            </p>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background/50 backdrop-blur rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso Global</p>
                    <p className="text-xl font-bold text-foreground">{userStats.globalProgress}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 backdrop-blur rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/20 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aulas Completas</p>
                    <p className="text-xl font-bold text-foreground">{userStats.achievements}/{getTotalLessons()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
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

          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </section>

        {/* Weekly Challenge */}
        <WeeklyChallengeCard />

        {/* Main Course Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              O Código da Reconquista: A Jornada Completa
            </h2>
            <p className="text-muted-foreground">
              {modulesConfig.length} módulos transformadores • Todos liberados! 🎉
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {modulesConfig.map((module) => (
                <ModuleCard 
                  key={module.id}
                  module={module}
                  isReleased={true}
                  onClick={() => handleModuleClick(module.number)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Upsell Section */}
        <UpsellCarousel />

        {/* Bonus Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              O Teu Arsenal Secreto (Bónus)
            </h2>
            <p className="text-muted-foreground">
              Ferramentas práticas para aplicar imediatamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-background border border-primary/30 p-6 cursor-pointer hover:scale-105 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    O Arsenal Secreto: 130 Frases Proibidas
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scripts prontos para cada situação
                  </p>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Lock className="w-4 h-4" />
                    Em Breve
                  </Button>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/20 to-background border border-secondary/30 p-6 cursor-pointer hover:scale-105 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <span className="text-3xl">💋</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    17 Beijos Que Viciam
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Técnicas avançadas de sedução física
                  </p>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Lock className="w-4 h-4" />
                    Em Breve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              O Próximo Nível (Avançado)
            </h2>
            <p className="text-muted-foreground">
              Conteúdo exclusivo para elevar o teu jogo
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-background border border-purple-500/30 p-8">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <span className="text-4xl">👑</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-2">
                    A Deusa na Cama
                  </h3>
                  <p className="text-muted-foreground">
                    Conteúdo premium de sedução avançada
                  </p>
                </div>
              </div>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white gap-2" disabled>
                <Lock className="w-4 h-4" />
                Desbloquear Agora
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
