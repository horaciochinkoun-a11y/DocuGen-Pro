import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X, ArrowUpCircle } from 'lucide-react';
import { APP_VERSION, RELEASE_NOTES } from '../version';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const latestNote = RELEASE_NOTES[0];

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${needRefresh ? 'bg-brand-500/10 text-brand-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {needRefresh ? <RefreshCw className="animate-spin-slow" size={20} /> : <ArrowUpCircle size={20} />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  {needRefresh ? 'Mise à jour disponible' : 'Prêt pour le mode hors ligne'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {needRefresh 
                    ? `DocuGen Pro v${APP_VERSION} est prêt. Cliquez pour profiter des dernières améliorations.` 
                    : 'L\'application est maintenant disponible hors connexion.'}
                </p>
                
                {needRefresh && latestNote && (
                  <div className="mt-2 text-[10px] bg-neutral-50 dark:bg-neutral-950 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">Nouveautés :</span>
                    <ul className="mt-1 space-y-0.5">
                      {latestNote.changes.slice(0, 2).map((change, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-brand-500" />
                          <span className="truncate">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button 
                onClick={close}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              {needRefresh && (
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                >
                  Mettre à jour maintenant
                </button>
              )}
              <button
                onClick={close}
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95"
              >
                {needRefresh ? 'Plus tard' : 'Fermer'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
