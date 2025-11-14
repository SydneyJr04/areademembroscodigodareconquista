import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ModuleCompletionCardProps {
  currentModule: number;
  completedPercentage: number;
}

export function ModuleCompletionCard({
  currentModule,
  completedPercentage,
}: ModuleCompletionCardProps) {
  const navigate = useNavigate();
  const isCompleted = completedPercentage >= 100;
  const nextModule = currentModule + 1;
  const hasNextModule = nextModule <= 7;

  const moduleNames = {
    2: 'Mapa da Mente Masculina',
    3: 'Gatilhos da Memória Emocional',
    4: 'A Frase de 5 Palavras',
    5: 'Primeiro Contato Estratégico',
    6: 'Domínio da Conversa',
    7: 'Conquista Duradoura',
  };

  if (!isCompleted) return null;

  return (
    <Card className="mb-8 border-green-500/30 bg-gradient-to-br from-green-500/10 via-primary/10 to-background p-8">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-500/50 bg-green-500/20">
            <Award className="h-10 w-10 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-3xl font-bold text-foreground">
          🎉 Módulo {currentModule} Concluído!
        </h2>

        <p className="mb-6 text-lg text-muted-foreground">
          Parabéns! Completaste todas as aulas deste módulo.
        </p>

        {/* Stats */}
        <div className="mb-8 flex items-center justify-center gap-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-1 h-6 w-6 text-green-500" />
            <p className="text-sm text-muted-foreground">100% Completo</p>
          </div>
          <div className="h-12 w-px bg-border"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">✓</p>
            <p className="text-sm text-muted-foreground">Certificado Desbloqueado</p>
          </div>
        </div>

        {/* Next Module CTA */}
        {hasNextModule ? (
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <p className="mb-4 text-sm text-muted-foreground">Próximo Módulo:</p>
            <h3 className="mb-4 text-xl font-bold text-foreground">
              Módulo {nextModule}: {moduleNames[nextModule as keyof typeof moduleNames]}
            </h3>
            <Button
              size="lg"
              onClick={() => navigate(`/modulo/${nextModule}/aula/1`)}
              className="gap-2 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              Começar Próximo Módulo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h3 className="mb-4 text-xl font-bold text-foreground">🏆 Curso Completo!</h3>
            <p className="mb-4 text-muted-foreground">
              Parabéns por completar toda a jornada do Código da Reconquista!
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold text-black hover:from-yellow-600 hover:to-yellow-700"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
