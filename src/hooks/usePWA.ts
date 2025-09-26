import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    const checkInstallStatus = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Check for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      // Check if already installed on iOS
      const isIOSInstalled = isIOS && (window.navigator as any).standalone;
      
      // Check if app is already installed (localStorage check)
      const installTimestamp = localStorage.getItem('pwa-install-timestamp');
      const isInstalled = isStandalone || isIOSInstalled || !!installTimestamp;

      setPwaState(prev => ({
        ...prev,
        isInstalled,
        isStandalone,
        isIOS,
      }));
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: promptEvent,
      }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      }));
      localStorage.setItem('pwa-install-timestamp', Date.now().toString());
    };

    // Initial check
    checkInstallStatus();

    // Listen for events
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      setPwaState(prev => ({
        ...prev,
        isStandalone: mediaQuery.matches,
        isInstalled: mediaQuery.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!pwaState.deferredPrompt) return false;

    try {
      await pwaState.deferredPrompt.prompt();
      const { outcome } = await pwaState.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          isInstallable: false,
          deferredPrompt: null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    }
  };

  const showIOSInstructions = () => {
    // You can customize this message or show a modal
    alert('To install this app on your iOS device:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner');
  };

  return {
    ...pwaState,
    install,
    showIOSInstructions,
  };
};
