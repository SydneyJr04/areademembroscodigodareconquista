import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonData, getNextLesson, getPreviousLesson, getModuleLessons } from '@/data/lessons';
import { VideoPlayer } from '@/components/VideoPlayer';
import { LessonSidebar } from '@/components/LessonSidebar';
import { ModuleCompletionCard } from '@/components/ModuleCompletionCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, BookOpen, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Lesson() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [moduleProgress, setModuleProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);

  const moduleNumber = parseInt(params.moduleId || '0');
  const lessonNumber = parseInt(params.lessonId || '0');

  // ═══════════════════════════════════════════════════════════
  // ✅ VERIFICAÇÃO DE ACESSO COMPLETA
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const verifyAccess = async () => {
      // 1. Verificar autenticação
      if (!loading && !user) {
        toast.error('Você precisa fazer login');
        navigate('/login');
        return;
      }

      if (!user) return;

      try {
        setIsVerifying(true);

        // 2. Verificar se módulo está liberado
        const { data: userModule, error: moduleError } = await supabase
          .from('user_modules')
          .select('is_released, release_date, module_name')
          .eq('user_id', user.id)
          .eq('module_number', moduleNumber)
          .single();

        if (moduleError) {
          console.error('Erro ao verificar módulo:', moduleError);
          toast.error('Erro ao verificar acesso ao módulo');
          navigate('/dashboard');
          return;
        }

        if (!userModule?.is_released) {
          const releaseDate = new Date(userModule.release_date);
          toast.error('🔒 Módulo ainda não liberado!', {
            description: `Este módulo será liberado em ${releaseDate.toLocaleDateString('pt-BR')}`,
            duration: 5000,
          });
          navigate('/dashboard');
          return;
        }

        // 3. Verificar subscription ativa
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_expires_at')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao verificar perfil:', profileError);
        }

        if (profile) {
          const isVitalicio = profile.subscription_tier === 'vitalicio';
          const expiresAt = profile.subscription_expires_at
            ? new Date(profile.subscription_expires_at)
            : null;
          const isExpired = expiresAt && expiresAt < new Date();

          if (!isVitalicio && isExpired) {
            toast.error('Sua assinatura expirou!', {
              description: 'Renove para continuar acessando o conteúdo',
              action: {
                label: 'Renovar',
                onClick: () => navigate('/meu-plano'),
              },
              duration: 10000,
            });
            navigate('/meu-plano');
            return;
          }
        }

        // 4. Verificar se a aula existe
        const lessonData = getLessonData(moduleNumber, lessonNumber);

        if (!lessonData) {
          toast.error('Aula não encontrada');
          navigate('/dashboard');
          return;
        }

        // ✅ TUDO OK - Permitir acesso
        setLesson(lessonData);
        setIsVerifying(false);
      } catch (error) {
        console.error('Erro na verificação de acesso:', error);
        toast.error('Erro ao verificar acesso');
        navigate('/dashboard');
      }
    };

    verifyAccess();
  }, [user, loading, moduleNumber, lessonNumber, navigate]);

  // ═══════════════════════════════════════════════════════════
  // CALCULAR PROGRESSO DO MÓDULO
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const calculateModuleProgress = async () => {
      if (!user) return;

      const moduleLessons = getModuleLessons(moduleNumber);

      const { data } = await supabase
        .from('user_lessons')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('module_id', moduleNumber)
        .eq('is_completed', true);

      const completedCount = data?.length || 0;
      const percentage = Math.round((completedCount / moduleLessons.length) * 100);
      setModuleProgress(percentage);
    };

    calculateModuleProgress();
  }, [user, moduleNumber, lessonNumber]);

  // ═══════════════════════════════════════════════════════════
  // ATUALIZAR PROGRESSO
  // ═══════════════════════════════════════════════════════════
  const handleProgress = async (percentage: number) => {
    setProgress(percentage);

    if (!user || !lesson) return;

    // Salvar progresso no Supabase
    await supabase
      .from('user_lessons')
      .upsert(
        {
          user_id: user.id,
          module_id: moduleNumber,
          lesson_id: lessonNumber,
          watch_percentage: percentage,
          is_completed: percentage >= 90,
          completed_at: percentage >= 90 ? new Date().toISOString() : null,
        },
        {
          onConflict: 'user_id,module_id,lesson_id',
        }
      );
  };

  // ═══════════════════════════════════════════════════════════
  // MARCAR COMO COMPLETA
  // ═══════════════════════════════════════════════════════════
  const handleComplete = async () => {
    if (!user || !lesson) return;

    await supabase
      .from('user_lessons')
      .upsert(
        {
          user_id: user.id,
          module_id: moduleNumber,
          lesson_id: lessonNumber,
          is_completed: true,
          completed_at: new Date().toISOString(),
          watch_percentage: 100,
        },
        {
          onConflict: 'user_id,module_id,lesson_id',
        }
      );

    toast.success('🎉 Aula concluída!', {
      description: 'Parabéns por mais uma conquista!',
    });
  };

  // ═══════════════════════════════════════════════════════════
  // LOADING STATES
  // ═══════════════════════════════════════════════════════════
  if (loading || isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
          <p className="text-muted-foreground">
            {isVerifying ? 'Verificando acesso...' : 'Carregando aula...'}
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Acesso Negado</h2>
          <p className="mb-6 text-muted-foreground">
            Você não tem permissão para acessar esta aula
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson(moduleNumber, lessonNumber);
  const prevLesson = getPreviousLesson(moduleNumber, lessonNumber);
  const isLastLessonOfModule = !nextLesson || nextLesson.module !== moduleNumber;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-primary-foreground shadow-lg">
                CR
              </div>
              <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                <BookOpen className="h-4 w-4" />
                <span>Módulo {moduleNumber}</span>
                <span>•</span>
                <span>Aula {lessonNumber}</span>
                {lesson.isBonus && (
                  <>
                    <span>•</span>
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400">
                      BÓNUS
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Video Section */}
          <div className="space-y-6">
            {/* Video Player */}
            <VideoPlayer
              youtubeId={lesson.videoId}
              onProgress={handleProgress}
              onComplete={handleComplete}
            />

            {/* Module Completion Card */}
            {isLastLessonOfModule && (
              <ModuleCompletionCard
                currentModule={moduleNumber}
                completedPercentage={moduleProgress}
              />
            )}

            {/* Lesson Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h1 className="mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-3xl font-bold md:text-4xl">
                {lesson.title}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">{lesson.description}</p>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso desta aula</span>
                  <span className="font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4">
              {prevLesson ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/modulo/${prevLesson.module}/aula/${prevLesson.lesson}`)}
                  className="min-w-[200px] flex-1 gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Aula Anterior
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="min-w-[200px] flex-1 gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar ao Início
                </Button>
              )}

              {nextLesson && (
                <Button
                  onClick={() => navigate(`/modulo/${nextLesson.module}/aula/${nextLesson.lesson}`)}
                  className="min-w-[200px] flex-1 gap-2 bg-primary font-semibold hover:bg-primary/90"
                >
                  Próxima Aula
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <LessonSidebar moduleNumber={moduleNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}
