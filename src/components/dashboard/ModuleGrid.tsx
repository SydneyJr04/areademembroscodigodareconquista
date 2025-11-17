import { UserModule } from '@/types';
import { ModuleCard } from './ModuleCard';

interface ModuleGridProps {
  modules: UserModule[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Nenhum módulo disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((userModule) => (
        <ModuleCard key={userModule.id} userModule={userModule} />
      ))}
    </div>
  );
}
