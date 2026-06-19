import React from 'react';
import { X, History, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { RELEASE_NOTES, APP_VERSION } from '../version';

export default function ReleaseNotes({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-500/10 to-transparent pointer-events-none" />
        
        <div className="relative p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20">
                <History size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Journal des Mises à jour</h2>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Version actuelle : <span className="text-brand-600 dark:text-brand-400 font-bold">v{APP_VERSION}</span></p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
            {RELEASE_NOTES.map((note, index) => (
              <div key={note.version} className="relative pl-8 border-l-2 border-neutral-100 dark:border-neutral-800 last:border-none pb-8 last:pb-0">
                {/* Dot */}
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-neutral-900 ${index === 0 ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">v{note.version}</h3>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {new Date(note.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {index === 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Zap size={10} /> Dernière
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {note.changes.map((change, i) => (
                    <li key={i} className="flex gap-3 text-sm text-neutral-600 dark:text-neutral-400 items-start">
                      <div className="mt-1.5 shrink-0">
                        {i % 3 === 0 ? <Sparkles size={14} className="text-amber-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                      </div>
                      <span className="leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-neutral-500/20"
            >
              Compris
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
