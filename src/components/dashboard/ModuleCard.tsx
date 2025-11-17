import { UserModule } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Play, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDaysUntilUnlock, isModuleUnlocked } from '@/lib/utils';

interface ModuleCardProps {
  userModule: UserModule;
}

export function ModuleCard({ userModule }: ModuleCardProps) {
  const navigate = useNavigate();
  const module = userModule.module;

  if (!module) return null;

  const isUnlocked = isModuleUnlocked(userModule.release_date);
  const daysUntilUnlock = getDaysUntilUnlock(userModule.release_date);

  function handleClick() {
    if (isUnlocked) {
      navigate(`/module/${module.slug}`);
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isUnlocked
          ? 'hover:scale-105 hover:shadow-2xl hover:border-yellow-500/50 cursor-pointer'
          : 'opacity-60'
      }`}
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        <img
          src={module.thumbnail_url || '/placeholder-module.jpg'}
          alt={module.title}
          className="w-full h-full object-cover"
        />

        {module.badge_text && isUnlocked && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {module.badge_text}
          </div>
        )}

        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Bloqueado</p>
              <p className="text-gray-400 text-sm mt-1">
                Disponível em {daysUntilUnlock} {daysUntilUnlock === 1 ? 'dia' : 'dias'}
              </p>
            </div>
          </div>
        )}

        {userModule.is_completed && (
          <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full p-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 font-bold text-sm">Módulo {module.module_number}</span>
          {module.duration_text && (
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {module.duration_text}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{module.title}</h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{module.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {module.total_lessons} {module.total_lessons === 1 ? 'aula' : 'aulas'}
          </span>

          <Button
            size="sm"
            disabled={!isUnlocked}
            variant={isUnlocked ? 'default' : 'outline'}
            className={!isUnlocked ? 'cursor-not-allowed' : ''}
          >
            {isUnlocked ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                {userModule.is_completed ? 'Revisar' : 'Começar'}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Bloqueado
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
