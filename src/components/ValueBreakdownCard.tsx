import { Card } from '@/components/ui/card';
import { TrendingDown, Sparkles } from 'lucide-react';

export const ValueBreakdownCard = () => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">O Que Recebeste</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">7 Módulos Completos</span>
            <span className="font-semibold">1.200 MZN</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Aulas Bónus Exclusivas</span>
            <span className="font-semibold">800 MZN</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Suporte Direto</span>
            <span className="font-semibold">500 MZN</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Materiais Complementares</span>
            <span className="font-semibold">300 MZN</span>
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Valor Total:</span>
              <span>2.800 MZN</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tu Pagaste:</span>
              <span className="text-2xl font-bold text-primary">197 MZN</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-green-500">Poupança:</span>
              </div>
              <span className="font-bold text-green-500">2.603 MZN (93%)</span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs italic text-muted-foreground">
            Investimento que transforma vidas. Aproveita! ✨
          </p>
        </div>
      </div>
    </Card>
  );
};
