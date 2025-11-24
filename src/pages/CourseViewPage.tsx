import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Lock,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Clock
} from 'lucide-react';

interface CourseModule {
  id: string;
  module_number: number;
  module_name: string;
  module_description: string | null;
  cover_image: string | null;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  lesson_number: number;
  lesson_title: string;
  lesson_description: string | null;
  duration_minutes: number | null;
  is_completed: boolean;
  watch_percentage: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
}

export default function CourseViewPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    loadCourseData();
  }, [courseSlug]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Buscar produto
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', courseSlug)
        .single();

      if (productError || !productData) {
        console.error('Produto não encontrado:', productError);
        navigate('/cursos');
        return;
      }

      setProduct(productData);

      // Verificar acesso
      const { data: accessData } = await supabase
        .from('user_product_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productData.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!accessData) {
        console.error('Usuário não tem acesso a este curso');
        navigate('/cursos');
        return;
      }

      // Buscar módulos
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('product_id', productData.id)
        .eq('is_active', true)
        .order('module_number');

      if (modulesError) {
        console.error('Erro ao carregar módulos:', modulesError);
        throw modulesError;
      }

      // Buscar aulas de cada módulo
      const modulesWithLessons = await Promise.all(
        (modulesData || []).map(async (module) => {
          const { data: lessonsData } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('module_id', module.id)
            .eq('is_active', true)
            .order('lesson_number');

          // Buscar progresso de cada aula
          const lessonsWithProgress = await Promise.all(
            (lessonsData || []).map(async (lesson) => {
              const { data: progressData } = await supabase
                .from('user_lesson_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('lesson_id', lesson.id)
                .maybeSingle();

              return {
                ...lesson,
                is_completed: progressData?.is_completed || false,
                watch_percentage: progressData?.watch_percentage || 0,
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress,
          };
        })
      );

      setModules(modulesWithLessons);

      // Calcular progresso geral
      const totalLessons = modulesWithLessons.reduce(
        (sum, mod) => sum + mod.lessons.length,
        0
      );
      const completedLessons = modulesWithLessons.reduce(
        (sum, mod) => sum + mod.lessons.filter((l) => l.is_completed).length,
        0
      );
      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      setOverallProgress(Math.round(progress));
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Carregando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: product.cover_image
            ? `url(${product.cover_image})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cursos')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Cursos
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Course Info Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2 text-3xl">{product.name}</CardTitle>
                {product.description && (
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {modules.length} Módulos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlayCircle className="h-4 w-4" />
                    {modules.reduce((sum, mod) => sum + mod.lessons.length, 0)} Aulas
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Badge className="gap-1 bg-green-500 text-white">
                  <CheckCircle2 className="h-3 w-3" />
                  Acesso Completo
                </Badge>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Progresso Geral</div>
                  <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
                  <Progress value={overallProgress} className="mt-2 h-2" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Modules */}
        <div className="space-y-6 pb-12">
          {modules.map((module) => {
            const completedLessons = module.lessons.filter((l) => l.is_completed).length;
            const moduleProgress =
              module.lessons.length > 0
                ? (completedLessons / module.lessons.length) * 100
                : 0;

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/50">
                  <div className="flex items-start gap-4">
                    {module.cover_image && (
                      <img
                        src={module.cover_image}
                        alt={module.module_name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Módulo {module.module_number}</Badge>
                        <Badge variant={moduleProgress === 100 ? 'default' : 'secondary'}>
                          {completedLessons}/{module.lessons.length} Concluídas
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{module.module_name}</CardTitle>
                      {module.module_description && (
                        <CardDescription className="mt-1">
                          {module.module_description}
                        </CardDescription>
                      )}
                      <Progress value={moduleProgress} className="mt-3 h-2" />
                    </div>
                  </div>
                </CardHeader>

                <div className="divide-y">
                  {module.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/cursos/${courseSlug}/modulo/${module.module_number}/aula/${lesson.lesson_number}`}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          lesson.is_completed
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {lesson.is_completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <PlayCircle className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            Aula {lesson.lesson_number}
                          </span>
                          {lesson.watch_percentage > 0 && !lesson.is_completed && (
                            <Badge variant="outline" className="text-xs">
                              {lesson.watch_percentage}% assistido
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-foreground">{lesson.lesson_title}</div>
                        {lesson.lesson_description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {lesson.lesson_description}
                          </div>
                        )}
                      </div>

                      {lesson.duration_minutes && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {lesson.duration_minutes}min
                        </div>
                      )}

                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
