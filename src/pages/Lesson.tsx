import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { VideoPlayer } from '@/components/lessons/VideoPlayer';
import { CompletionModal } from '@/components/lessons/CompletionModal';
import { Button } from '@/components/ui/button';
import { Lesson as LessonType } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Lesson() {
  const { moduleSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateLessonProgress, getLessonProgress } = useProgress(user?.id);
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [allLessons, setAllLessons] = useState<LessonType[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAutoCompleted, setHasAutoCompleted] = useState(false);

  useEffect(() => {
    if (user && moduleSlug && lessonSlug) {
      loadLesson();
    }
  }, [user, moduleSlug, lessonSlug]);

  async function loadLesson() {
    try {
      const { data: moduleData } = await supabase
        .from('modules')
        .select('id')
        .eq('slug', moduleSlug)
        .maybeSingle();

      if (!moduleData) {
        navigate('/dashboard');
        return;
      }

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleData.id)
        .order('order_index');

      setAllLessons(lessonsData || []);

      const currentLesson = lessonsData?.find(l => l.slug === lessonSlug);

      if (!currentLesson) {
        navigate('/dashboard');
        return;
      }

      setLesson(currentLesson);

      const userProgress = await getLessonProgress(currentLesson.id);
      if (userProgress) {
        setProgress(userProgress.watch_percentage);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleProgress(percentage: number) {
    if (!lesson) return;

    setProgress(percentage);

    if (percentage % 10 === 0) {
      await updateLessonProgress(lesson.id, percentage, false);
    }
  }

  async function handleComplete() {
    if (!lesson || hasAutoCompleted) return;

    setHasAutoCompleted(true);
    await updateLessonProgress(lesson.id, 100, true);
    setShowCompletionModal(true);
  }

  function getCurrentLessonIndex(): number {
    return allLessons.findIndex(l => l.id === lesson?.id);
  }

  function hasNextLesson(): boolean {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex !== -1 && currentIndex < allLessons.length - 1;
  }

  function hasPreviousLesson(): boolean {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0;
  }

  function goToNextLesson() {
    const currentIndex = getCurrentLessonIndex();
    if (hasNextLesson()) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/module/${moduleSlug}/lesson/${nextLesson.slug}`);
      setShowCompletionModal(false);
      setHasAutoCompleted(false);
    }
  }

  function goToPreviousLesson() {
    const currentIndex = getCurrentLessonIndex();
    if (hasPreviousLesson()) {
      const previousLesson = allLessons[currentIndex - 1];
      navigate(`/module/${moduleSlug}/lesson/${previousLesson.slug}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/module/${moduleSlug}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Módulo
          </Button>
          <div className="text-sm text-gray-400 hidden md:block">
            Aula {getCurrentLessonIndex() + 1} de {allLessons.length}
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <VideoPlayer
          youtubeId={lesson.youtube_id}
          onProgress={handleProgress}
          onComplete={handleComplete}
        />

        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-lg text-gray-400 mb-4">{lesson.description}</p>
              )}
              {lesson.is_bonus && (
                <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-500 text-sm font-semibold rounded-full">
                  AULA BÔNUS
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso da aula</span>
              <span className="text-yellow-500 font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {hasPreviousLesson() && (
              <Button variant="outline" size="lg" onClick={goToPreviousLesson} className="flex-1">
                <ChevronLeft className="mr-2 h-5 w-5" />
                Aula Anterior
              </Button>
            )}
            {hasNextLesson() && (
              <Button size="lg" onClick={goToNextLesson} className="flex-1">
                Próxima Aula
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {showCompletionModal && (
        <CompletionModal
          lessonTitle={lesson.title}
          onClose={() => setShowCompletionModal(false)}
          onNextLesson={hasNextLesson() ? goToNextLesson : undefined}
          onBackToDashboard={() => navigate('/dashboard')}
          hasNextLesson={hasNextLesson()}
        />
      )}
    </div>
  );
}
