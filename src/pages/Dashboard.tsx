import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Header } from '@/components/dashboard/Header';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { UserModule } from '@/types';
import { AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useProgress(user?.id);
  const [modules, setModules] = useState<UserModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserModules();
    }
  }, [user]);

  async function loadUserModules() {
    try {
      const { data, error } = await supabase
        .from('user_modules')
        .select(`
          *,
          module:modules(*)
        `)
        .eq('user_id', user?.id)
        .order('module(order_index)');

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      console.error('Error loading modules:', err);
      setError('Erro ao carregar módulos. Tente novamente.');
    } finally {
      setLoadingModules(false);
    }
  }

  if (authLoading || loadingModules) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header profile={profile} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <section className="mb-12">
          <ProgressCard stats={stats} />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Teus Módulos</h2>
            <p className="text-gray-400">
              Novos módulos são liberados a cada 2 dias. Continue assistindo para desbloquear todo o
              conteúdo!
            </p>
          </div>
          <ModuleGrid modules={modules} />
        </section>
      </main>
    </div>
  );
}
