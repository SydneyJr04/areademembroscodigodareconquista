import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonData, getNextLesson } from '@/data/lessons';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function Lesson() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const moduleNum = parseInt(params.moduleId || '0', 10);
    const lessonNum = parseInt(params.lessonId || '0', 10);

    console.log('📚 Carregando aula:', { moduleNum, lessonNum });

    const data = getLessonData(moduleNum, lessonNum);

    if (!data) {
      console.error('❌ Aula não encontrada');
      navigate('/dashboard');
      return;
    }

    console.log('✅ Aula carregada:', data);
    setLesson(data);
  }, [params]);

  const handleProgress = (percentage: number) => {
    console.log(`📊 Progresso: ${percentage}%`);
    setProgress(percentage);
  };

  const handleComplete = () => {
    console.log('🎉 Vídeo completado!');
    // Aqui você pode mostrar o modal de celebração
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  const nextLesson = getNextLesson(lesson.module, lesson.lesson);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
              CR
            </div>
            <div className="text-sm text-muted-foreground">
              Módulo {lesson.module} • Aula {lesson.lesson}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Video */}
        <div className="mb-8">
          <VideoPlayer
            youtubeId={lesson.videoId}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
        </div>

        {/* Lesson Info */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-muted-foreground text-lg mb-6">{lesson.description}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Ver Módulos
            </Button>
            {nextLesson && (
              <Button
                onClick={() => navigate(`/modulo/${nextLesson.module}/aula/${nextLesson.lesson}`)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Próxima Aula
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-black/50 rounded-lg p-4 text-xs font-mono">
            <p className="text-green-400 mb-2">🔍 Debug Info:</p>
            <p>Video ID: {lesson.videoId}</p>
            <p>Module: {lesson.module} | Lesson: {lesson.lesson}</p>
            <p>Progress: {progress}%</p>
            <p>
              <a
                href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Testar no YouTube →
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
