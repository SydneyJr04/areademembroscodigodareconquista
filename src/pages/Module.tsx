import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Lesson, UserLesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Play, CheckCircle2, Lock } from 'lucide-react';

export function Module() {
  const { moduleSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState('');

  useEffect(() => {
    if (user && moduleSlug) {
      loadModuleData();
    }
  }, [user, moduleSlug]);

  async function loadModuleData() {
    try {
      const { data: moduleData } = await supabase
        .from('modules')
        .select('id, title')
        .eq('slug', moduleSlug)
        .maybeSingle();

      if (!moduleData) {
        navigate('/dashboard');
        return;
      }

      setModuleTitle(moduleData.title);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleData.id)
        .order('order_index');

      setLessons(lessonsData || []);

      const { data: userLessonsData } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', user?.id)
        .in('lesson_id', lessonsData?.map(l => l.id) || []);

      setUserLessons(userLessonsData || []);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  }

  function getLessonProgress(lessonId: string): UserLesson | undefined {
    return userLessons.find(ul => ul.lesson_id === lessonId);
  }

  function handleLessonClick(lesson: Lesson) {
    navigate(`/module/${moduleSlug}/lesson/${lesson.slug}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4 bg-gray-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{moduleTitle}</h1>
          <p className="text-gray-400">
            {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'} neste módulo
          </p>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const progress = getLessonProgress(lesson.id);
            const isCompleted = progress?.is_completed || false;

            return (
              <Card
                key={lesson.id}
                className="p-6 hover:border-yellow-500/50 transition-all cursor-pointer"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-yellow-500 font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {lesson.description}
                          </p>
                        )}
                        {lesson.is_bonus && (
                          <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-semibold rounded-full">
                            BÔNUS
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Concluída</span>
                          </div>
                        ) : progress && progress.watch_percentage > 0 ? (
                          <div className="text-sm text-gray-400">
                            {progress.watch_percentage}% assistido
                          </div>
                        ) : null}

                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          {isCompleted ? 'Assistir novamente' : progress ? 'Continuar' : 'Assistir'}
                        </Button>
                      </div>
                    </div>

                    {progress && progress.watch_percentage > 0 && !isCompleted && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all duration-300"
                            style={{ width: `${progress.watch_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
