import { Bell, BellOff, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState } from 'react';

export const NotificationPrompt = () => {
  const { isSupported, permission, requestPermission, isEnabled, unsubscribe } =
    usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (!isSupported || dismissed || permission === 'denied') {
    return null;
  }

  if (isEnabled) {
    return (
      <Card className="border-primary/20 bg-primary/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Notificações Ativas</p>
              <p className="text-xs text-muted-foreground">
                Você receberá lembretes para continuar suas aulas
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={unsubscribe}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <BellOff className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/20 to-accent/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold">Não perca o ritmo! 🔥</p>
            <p className="mb-3 text-xs text-muted-foreground">
              Ative as notificações e receba lembretes para continuar suas aulas. A consistência é a
              chave para a reconquista!
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={requestPermission}
                className="bg-primary hover:bg-primary/90"
              >
                Ativar Notificações
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
                className="text-xs"
              >
                Agora não
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
