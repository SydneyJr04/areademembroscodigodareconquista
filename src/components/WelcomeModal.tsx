import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, BookOpen, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WelcomeModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [checklist, setChecklist] = useState({
    watchVideo: false,
    downloadGuide: false,
    joinGroup: false,
    startModule: false,
  });

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_login_completed')
        .eq('id', user.id)
        .single();

      if (profile && !profile.first_login_completed) {
        setIsOpen(true);
      }
    };

    checkFirstLogin();
  }, [user]);

  const handleComplete = async () => {
    if (!user) return;

    await supabase.from('profiles').update({ first_login_completed: true }).eq('id', user.id);

    setIsOpen(false);

    if (checklist.startModule) {
      navigate('/dashboard');
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="border-primary/20 bg-gradient-to-br from-background to-background/95 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center text-3xl font-bold">
            <Sparkles className="h-8 w-8 animate-pulse text-primary" />
            Bem-vinda ao Código da Reconquista!
            <Sparkles className="h-8 w-8 animate-pulse text-primary" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-center text-lg text-muted-foreground">
            Estás prestes a iniciar uma jornada transformadora. Vamos começar?
          </p>

          <div className="space-y-4 rounded-lg border border-border bg-card/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Passos Iniciais:</h3>

            <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50">
              <Checkbox
                id="watchVideo"
                checked={checklist.watchVideo}
                onCheckedChange={(checked) => setChecklist({ ...checklist, watchVideo: !!checked })}
              />
              <label htmlFor="watchVideo" className="flex-1 cursor-pointer select-none space-y-1">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="font-medium">Assiste ao Vídeo de Boas-Vindas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Entende como aproveitar ao máximo o curso
                </p>
              </label>
            </div>

            <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50">
              <Checkbox
                id="downloadGuide"
                checked={checklist.downloadGuide}
                onCheckedChange={(checked) =>
                  setChecklist({ ...checklist, downloadGuide: !!checked })
                }
              />
              <label
                htmlFor="downloadGuide"
                className="flex-1 cursor-pointer select-none space-y-1"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium">Baixa o Guia de Início Rápido</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Material complementar para potencializar teus resultados
                </p>
              </label>
            </div>

            <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50">
              <Checkbox
                id="joinGroup"
                checked={checklist.joinGroup}
                onCheckedChange={(checked) => setChecklist({ ...checklist, joinGroup: !!checked })}
              />
              <label htmlFor="joinGroup" className="flex-1 cursor-pointer select-none space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Entra no Grupo de Suporte</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comunidade exclusiva para trocares experiências
                </p>
              </label>
            </div>

            <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50">
              <Checkbox
                id="startModule"
                checked={checklist.startModule}
                onCheckedChange={(checked) =>
                  setChecklist({ ...checklist, startModule: !!checked })
                }
              />
              <label htmlFor="startModule" className="flex-1 cursor-pointer select-none space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Começa o Módulo 1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inicia tua transformação agora mesmo!
                </p>
              </label>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={!allChecked}
            className="h-12 w-full text-lg font-semibold"
            size="lg"
          >
            {allChecked ? '🚀 Começar Agora!' : '✓ Complete os passos acima'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
