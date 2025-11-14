import { useState } from 'react';
import { Target } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

const challenges = [
  'Aplique a técnica do Módulo 2 e não envie mensagem por 48h',
  'Assista 3 aulas esta semana e pratique o que aprendeu',
  'Complete um módulo inteiro sem pausas',
  "Aplique a 'Frase de 5 Palavras' numa conversa real",
  'Faça o exercício de auto-reflexão do Módulo 1',
];

export const WeeklyChallengeCard = () => {
  const [accepted, setAccepted] = useState(false);
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % challenges.length;
  const currentChallenge = challenges[weekNumber];

  const handleAccept = () => {
    setAccepted(true);
    toast.success('Desafio aceite! Vamos nessa! 💪');
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-background p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/20 p-3">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-foreground">🎯 Seu Desafio da Semana</h3>
          <p className="mb-4 text-muted-foreground">{currentChallenge}</p>
          <Button
            onClick={handleAccept}
            disabled={accepted}
            variant={accepted ? 'outline' : 'default'}
            className="w-full sm:w-auto"
          >
            {accepted ? '✓ Desafio Aceite!' : 'Aceito o Desafio!'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
