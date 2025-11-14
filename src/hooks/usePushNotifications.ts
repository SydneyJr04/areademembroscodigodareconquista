import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar suporte
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
      throw error;
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('Notificações ativadas! Você receberá lembretes para continuar.');
        await subscribeUser();
        return true;
      } else {
        toast.error('Permissão negada. Você não receberá lembretes.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast.error('Erro ao ativar notificações');
      return false;
    }
  };

  const subscribeUser = async () => {
    if (!user) return;

    try {
      const registration = await registerServiceWorker();
      
      // Chave pública VAPID (você precisará gerar uma para produção)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBmYRTyF9s1PBmxv0YEk';
      
      const existingSubscription = await registration.pushManager.getSubscription();
      
      let pushSubscription = existingSubscription;
      
      if (!existingSubscription) {
        pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      setSubscription(pushSubscription);

      // Salvar subscription no banco
      if (pushSubscription) {
        const { error } = await (supabase as any)
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            subscription: pushSubscription.toJSON(),
            endpoint: pushSubscription.endpoint
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Erro ao salvar subscription:', error);
        }
      }

      return pushSubscription;
    } catch (error) {
      console.error('Erro ao criar subscription:', error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    if (!user || !subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Remover do banco
      await (supabase as any)
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      toast.success('Notificações desativadas');
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      toast.error('Erro ao desativar notificações');
    }
  };

  // Enviar notificação de teste
  const sendTestNotification = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          userId: user.id,
          title: '👑 Código da Reconquista',
          body: 'Esta é uma notificação de teste!',
          url: '/'
        }
      });

      if (error) throw error;
      toast.success('Notificação de teste enviada!');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast.error('Erro ao enviar notificação de teste');
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    unsubscribe,
    sendTestNotification,
    isEnabled: permission === 'granted' && !!subscription
  };
};

// Converter chave VAPID de base64 para Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
