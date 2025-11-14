import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  onNextLesson?: () => void;
}

export const CelebrationModal = ({
  isOpen,
  onClose,
  lessonTitle,
  onNextLesson,
}: CelebrationModalProps) => {
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Importar confetti dinamicamente
      import('canvas-confetti').then((confetti) => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          confetti.default({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti.default({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);

        return () => clearInterval(interval);
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background sm:max-w-[500px]">
        <div className="space-y-6 py-6 text-center">
          <div className="relative inline-block">
            <Trophy className="mx-auto h-24 w-24 animate-bounce text-primary" />
            <Sparkles className="absolute -right-2 -top-2 h-8 w-8 animate-pulse text-yellow-400" />
            <Star className="absolute -bottom-1 -left-1 h-6 w-6 animate-spin text-yellow-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-primary">Parabéns! 🎉</h2>
            <p className="text-xl font-semibold">Concluíste a aula:</p>
            <p className="text-lg italic text-muted-foreground">"{lessonTitle}"</p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/20 bg-card/50 p-6">
            <p className="text-sm font-semibold text-primary">✨ Mais uma etapa vencida!</p>
            <p className="text-sm text-muted-foreground">
              Estás cada vez mais perto de reconquistar o que é teu. Continue assim!
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Ver Dashboard
            </Button>
            {onNextLesson && (
              <Button onClick={onNextLesson} className="flex-1 bg-primary hover:bg-primary/90">
                Próxima Aula →
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
