import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar Service Worker e funcionalidades PWA
 */
export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [cacheStatus, setCacheStatus] = useState({});

  // Verificar suporte a Service Worker
  useEffect(() => {
    setIsSupported('serviceWorker' in navigator);
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);
      setIsRegistered(true);

      // Verificar por atualizações
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setHasUpdate(true);
          }
        });
      });

      console.log('Service Worker registrado com sucesso');
      return true;
    } catch (error) {
      console.error('Falha ao registrar Service Worker:', error);
      return false;
    }
  }, [isSupported]);

  // Atualizar Service Worker
  const updateServiceWorker = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setHasUpdate(false);
      window.location.reload();
    }
  }, [registration]);

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obter status do cache
  const getCacheStatus = useCallback(async () => {
    if (!registration || !registration.active) return {};

    try {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          setCacheStatus(event.data);
          resolve(event.data);
        };

        registration.active.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [channel.port2]
        );
      });
    } catch (error) {
      console.error('Erro ao obter status do cache:', error);
      return {};
    }
  }, [registration]);

  // Registrar automaticamente quando o hook for montado
  useEffect(() => {
    if (isSupported && !isRegistered) {
      registerServiceWorker();
    }
  }, [isSupported, isRegistered, registerServiceWorker]);

  // Atualizar status do cache periodicamente
  useEffect(() => {
    if (isRegistered) {
      getCacheStatus();
      
      const interval = setInterval(getCacheStatus, 30000); // A cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [isRegistered, getCacheStatus]);

  return {
    isSupported,
    isRegistered,
    isOnline,
    hasUpdate,
    cacheStatus,
    registerServiceWorker,
    updateServiceWorker,
    getCacheStatus,
  };
};

/**
 * Hook para funcionalidades PWA
 */
export const usePWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // Detectar se a PWA pode ser instalada
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se já está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Instalar PWA
  const installPWA = useCallback(async () => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        setCanInstall(false);
        setInstallPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  }, [installPrompt]);

  return {
    canInstall,
    isInstalled,
    installPWA,
  };
};

/**
 * Hook para notificações push
 */
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [subscription, setSubscription] = useState(null);

  // Verificar suporte
  useEffect(() => {
    setIsSupported('Notification' in window && 'PushManager' in window);
  }, []);

  // Solicitar permissão para notificações
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }, [isSupported]);

  // Subscribir para push notifications
  const subscribeToPush = useCallback(async (serviceWorkerRegistration) => {
    if (!isSupported || permission !== 'granted' || !serviceWorkerRegistration) {
      return null;
    }

    try {
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.warn('VAPID public key não configurada');
        return null;
      }

      const sub = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Erro ao subscribir para push notifications:', error);
      return null;
    }
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
  };
};

/**
 * Hook combinado para todas as funcionalidades PWA
 */
export const usePWAFeatures = () => {
  const serviceWorker = useServiceWorker();
  const pwa = usePWA();
  const notifications = usePushNotifications();

  return {
    serviceWorker,
    pwa,
    notifications,
  };
};

export default useServiceWorker;
