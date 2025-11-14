import { Lock, CheckCircle2, BookOpen } from 'lucide-react';
import { UserModule } from '@/hooks/useUserModules';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface JourneyMapProps {
  modules: UserModule[];
}

export const JourneyMap = ({ modules }: JourneyMapProps) => {
  const currentModule = modules.find((m) => m.is_released && !m.is_completed);
  const currentModuleNumber = currentModule?.module_number || 1;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
        Você está no Módulo {currentModuleNumber} de {modules.length}
      </h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-6 h-1 bg-border" />
        <div
          className="absolute left-0 top-6 h-1 bg-primary transition-all duration-500"
          style={{
            width: `${(modules.filter((m) => m.is_completed).length / modules.length) * 100}%`,
          }}
        />

        {/* Modules */}
        <div className="relative flex justify-between">
          {modules.map((module) => {
            const isCompleted = module.is_completed;
            const isReleased = module.is_released;
            const isCurrent = module.module_number === currentModuleNumber;

            return (
              <div key={module.id} className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-green-500 bg-green-500'
                      : isReleased
                        ? 'animate-pulse border-primary bg-primary'
                        : 'border-border bg-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : isReleased ? (
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div className="text-xs font-semibold text-foreground">
                    M{module.module_number}
                  </div>

                  {!isReleased && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(module.release_date), 'dd/MM/yyyy', { locale: pt })}
                    </div>
                  )}

                  {isCurrent && (
                    <div className="mt-1 text-xs font-semibold text-primary">↑ você está aqui</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-muted-foreground">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Bloqueado</span>
        </div>
      </div>
    </div>
  );
};
