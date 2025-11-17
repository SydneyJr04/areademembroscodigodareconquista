import { Card } from '@/components/ui/card';
import { UserStats } from '@/types';
import { Flame, CheckCircle, Clock, Target } from 'lucide-react';

interface ProgressCardProps {
  stats: UserStats | null;
}

const TOTAL_LESSONS = 42;

export function ProgressCard({ stats }: ProgressCardProps) {
  if (!stats) {
    return (
      <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-yellow-500/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-3 bg-gray-800 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const completionPercentage = Math.round((stats.lessons_completed / TOTAL_LESSONS) * 100);
  const watchHours = Math.floor(stats.total_watch_time_seconds / 3600);
  const watchMinutes = Math.floor((stats.total_watch_time_seconds % 3600) / 60);

  return (
    <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-yellow-500/20 p-6">
      <h3 className="text-2xl font-bold mb-6 text-white">Meu Progresso</h3>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-300">Progresso Geral</span>
          <span className="text-yellow-500 font-bold">{completionPercentage}% concluído</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.current_streak_days}</div>
          <div className="text-xs text-gray-400">dias consecutivos</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.lessons_completed}</div>
          <div className="text-xs text-gray-400">de {TOTAL_LESSONS} aulas</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {watchHours}h {watchMinutes}min
          </div>
          <div className="text-xs text-gray-400">assistido</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center backdrop-blur-sm">
          <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.modules_completed}</div>
          <div className="text-xs text-gray-400">módulos completos</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold text-white">Próxima meta:</span>
          <span className="text-gray-400">
            {stats.modules_completed < 7
              ? `Completar Módulo ${stats.modules_completed + 1}`
              : 'Todos os módulos completos!'}
          </span>
        </div>
      </div>
    </Card>
  );
}
