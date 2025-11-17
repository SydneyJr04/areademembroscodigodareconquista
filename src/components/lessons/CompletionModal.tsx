import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, ArrowRight, Home } from 'lucide-react';

const motivationalPhrases = [
  'Estás um passo mais perto de o reconquistar!',
  'Cada aula é uma arma nova no teu arsenal!',
  'Orgulho de ti! Continua assim!',
  'A transformação já começou!',
  'Ele vai sentir a diferença em ti!',
  'Estás a evoluir de forma incrível!',
];

interface CompletionModalProps {
  lessonTitle: string;
  onClose: () => void;
  onNextLesson?: () => void;
  onBackToDashboard: () => void;
  hasNextLesson: boolean;
}

export function CompletionModal({
  lessonTitle,
  onClose,
  onNextLesson,
  onBackToDashboard,
  hasNextLesson,
}: CompletionModalProps) {
  const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('confetti-active');
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('confetti-active');
    };
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-500/20 text-white max-w-md">
        <div className="text-center py-8">
          <div className="mb-6 relative">
            <div className="relative inline-block">
              <CheckCircle2 className="h-24 w-24 text-yellow-500 mx-auto animate-bounce" />
              <Sparkles className="h-8 w-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -bottom-1 -left-1 animate-ping" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Parabéns!</h2>
          <p className="text-xl mb-2 text-gray-300">Acabaste a aula:</p>
          <p className="text-lg font-semibold text-yellow-500 mb-6 px-4">{lessonTitle}</p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
            <p className="text-gray-300 italic text-lg">{phrase}</p>
          </div>

          <div className="space-y-3">
            {hasNextLesson && onNextLesson && (
              <Button size="lg" className="w-full" onClick={onNextLesson}>
                Próxima Aula
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={onBackToDashboard}
            >
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
