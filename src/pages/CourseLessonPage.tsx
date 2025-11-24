import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  BookOpen
} from 'lucide-react';

// Declarar tipo global para Plyr
declare global {
  interface Window {
    Plyr: any;
  }
}

interface LessonData {
  id: string;
  lesson_number: number;
  lesson_title: string;
  lesson_description: string | null;
  youtube_id: string;
  duration_minutes: number | null;
  module_id: string;
  watch_percentage: number;
  is_completed: boolean;
}

interface ModuleData {
  id: string;
  module_number: number;
  module_name: string;
  product_id: string;
}

interface NavigationLesson {
  lesson_number: number;
  module_number: number;
}

export default function CourseLessonPage() {
  const { courseSlug, moduleNumber, lessonNumber } = useParams<{
    courseSlug: string;
    moduleNumber: string;
    lessonNumber: string;
  }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [module, setModule] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousLesson, setPreviousLesson] = useState<NavigationLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<NavigationLesson | null>(null);

  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadLessonData();

    return () => {
      // Cleanup
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [courseSlug, moduleNumber, lessonNumber]);

  const loadLessonData = async () => {
    try {
      setLoading(true);

      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      userIdRef.current = user.id;

      // Buscar produto
      const { data: productData } = await supabase
        .from('products')
        .select('id')
        .eq('slug', courseSlug)
        .single();

      if (!productData) {
        navigate('/cursos');
        return;
      }

      // Verificar acesso
      const { data: accessData } = await supabase
        .from('user_product_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productData.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!accessData) {
        navigate('/cursos');
        return;
      }

      // Buscar módulo
      const { data: moduleData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('product_id', productData.id)
        .eq('module_number', parseInt(moduleNumber || '1'))
        .single();

      if (!moduleData) {
        navigate(`/cursos/${courseSlug}`);
        return;
      }
      setModule(moduleData);

      // Buscar aula
      const { data: lessonData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('module_id', moduleData.id)
        .eq('lesson_number', parseInt(lessonNumber || '1'))
        .single();

      if (!lessonData) {
        navigate(`/cursos/${courseSlug}`);
        return;
      }

      // Buscar progresso
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonData.id)
        .maybeSingle();

      setLesson({
        ...lessonData,
        watch_percentage: progressData?.watch_percentage || 0,
        is_completed: progressData?.is_completed || false,
      });

      // Buscar navegação (aula anterior e próxima)
      await loadNavigation(productData.id, moduleData.id, parseInt(moduleNumber || '1'), parseInt(lessonNumber || '1'));

      // Inicializar player após carregar dados
      setTimeout(() => initializePlayer(lessonData.youtube_id), 100);
    } catch (error) {
      console.error('Erro ao carregar aula:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNavigation = async (
    productId: string,
    currentModuleId: string,
    currentModuleNumber: number,
    currentLessonNumber: number
  ) => {
    // Buscar todas as aulas do curso para navegação
    const { data: allModules } = await supabase
      .from('course_modules')
      .select('id, module_number')
      .eq('product_id', productId)
      .order('module_number');

    if (!allModules) return;

    const allLessons: Array<{ module_number: number; lesson_number: number; module_id: string }> = [];

    for (const mod of allModules) {
      const { data: lessons } = await supabase
        .from('course_lessons')
        .select('lesson_number')
        .eq('module_id', mod.id)
        .order('lesson_number');

      if (lessons) {
        lessons.forEach((l) => {
          allLessons.push({
            module_number: mod.module_number,
            lesson_number: l.lesson_number,
            module_id: mod.id,
          });
        });
      }
    }

    // Encontrar índice da aula atual
    const currentIndex = allLessons.findIndex(
      (l) =>
        l.module_number === currentModuleNumber && l.lesson_number === currentLessonNumber
    );

    if (currentIndex > 0) {
      setPreviousLesson({
        module_number: allLessons[currentIndex - 1].module_number,
        lesson_number: allLessons[currentIndex - 1].lesson_number,
      });
    }

    if (currentIndex < allLessons.length - 1) {
      setNextLesson({
        module_number: allLessons[currentIndex + 1].module_number,
        lesson_number: allLessons[currentIndex + 1].lesson_number,
      });
    }
  };

  const initializePlayer = (youtubeId: string) => {
    if (!videoContainerRef.current || !window.Plyr) {
      console.error('Plyr não carregado ou container não encontrado');
      return;
    }

    // Limpar player existente
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Criar elemento de vídeo
    const videoElement = document.createElement('div');
    videoElement.setAttribute('data-plyr-provider', 'youtube');
    videoElement.setAttribute('data-plyr-embed-id', youtubeId);
    videoContainerRef.current.innerHTML = '';
    videoContainerRef.current.appendChild(videoElement);

    // Inicializar Plyr
    playerRef.current = new window.Plyr(videoElement, {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    });

    // Iniciar tracking de progresso
    startProgressTracking();
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(async () => {
      if (!playerRef.current || !lesson || !userIdRef.current) return;

      try {
        const currentTime = playerRef.current.currentTime || 0;
        const duration = playerRef.current.duration || 1;
        const percentage = Math.min(Math.round((currentTime / duration) * 100), 100);

        // Considerar completo se assistiu mais de 90%
        const isCompleted = percentage >= 90;

        // Atualizar no banco de dados
        await supabase.from('user_lesson_progress').upsert(
          {
            user_id: userIdRef.current,
            lesson_id: lesson.id,
            watch_percentage: percentage,
            is_completed: isCompleted,
            last_watched_at: new Date().toISOString(),
            completed_at: isCompleted ? new Date().toISOString() : null,
          },
          { onConflict: 'user_id,lesson_id' }
        );

        // Atualizar estado local
        setLesson((prev) =>
          prev
            ? {
                ...prev,
                watch_percentage: percentage,
                is_completed: isCompleted,
              }
            : null
        );
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      }
    }, 5000); // Atualizar a cada 5 segundos
  };

  const handleNavigation = (modNum: number, lessNum: number) => {
    navigate(`/cursos/${courseSlug}/modulo/${modNum}/aula/${lessNum}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Carregando aula...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !module) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cursos/${courseSlug}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Curso
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            Módulo {module.module_number} - {module.module_name}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div
                ref={videoContainerRef}
                className="aspect-video w-full bg-black"
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">Aula {lesson.lesson_number}</Badge>
                      {lesson.is_completed && (
                        <Badge className="gap-1 bg-green-500">
                          <CheckCircle2 className="h-3 w-3" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{lesson.lesson_title}</CardTitle>
                    {lesson.lesson_description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {lesson.lesson_description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Seu Progresso</span>
                    <span className="font-semibold text-primary">
                      {lesson.watch_percentage}%
                    </span>
                  </div>
                  <Progress value={lesson.watch_percentage} className="h-2" />
                </div>
              </CardHeader>
            </Card>

            {/* Navigation */}
            <div className="mt-6 flex gap-4">
              {previousLesson ? (
                <Button
                  variant="outline"
                  onClick={() =>
                    handleNavigation(previousLesson.module_number, previousLesson.lesson_number)
                  }
                  className="flex-1 gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Aula Anterior
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson ? (
                <Button
                  onClick={() =>
                    handleNavigation(nextLesson.module_number, nextLesson.lesson_number)
                  }
                  className="flex-1 gap-2"
                >
                  Próxima Aula
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/cursos/${courseSlug}`)}
                  className="flex-1 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Concluir Módulo
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre esta aula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.duration_minutes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duração</span>
                    <span className="text-sm font-semibold">
                      {lesson.duration_minutes} minutos
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={lesson.is_completed ? 'default' : 'secondary'}>
                    {lesson.is_completed ? 'Completa' : 'Em Progresso'}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/cursos/${courseSlug}`)}
                    className="w-full gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Ver Todas as Aulas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
