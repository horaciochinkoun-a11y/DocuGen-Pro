import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

// Define the shape of the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    // Check if app is already installed
    // We do this check after the first render to avoid sync setState in effect lint error
    const checkStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
        ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone);
      if (isStandalone) {
        setIsInstalled(true);
      }
    };
    
    checkStatus();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20 text-xs font-bold">
        <CheckCircle2 size={14} />
        <span>Application installée</span>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleInstallClick}
      className="group relative flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl text-xs font-bold transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xl shadow-neutral-500/10 active:scale-95 overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-2">
        <Download size={15} className="group-hover:translate-y-0.5 transition-transform" />
        <span>Installer l'application</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/0 via-brand-600/10 to-brand-600/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
    </motion.button>
  );
}
