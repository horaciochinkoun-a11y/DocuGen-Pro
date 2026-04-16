import React from 'react';
import { FileText, Shield, ArrowRight, Linkedin, Sun, Moon, Clock, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function LandingPage({ onStart, theme, toggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-brand-100 selection:text-brand-900 flex flex-col">
      {/* En-tête (Header) */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">DocuGen <span className="text-brand-600 dark:text-brand-400">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400 transition-all rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
              title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={onStart}
              className="text-sm font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Accéder
            </button>
          </div>
        </div>
      </header>

      {/* Section Principale (Hero) */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Décoration d'arrière-plan */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-400/10 blur-3xl" />
            <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-4"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-neutral-900 dark:text-white mb-8 leading-[1.1] md:leading-[0.9] break-words">
                Votre documentation<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                  propulsée par l'IA.
                </span>
              </h1>
              <p className="mt-8 text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                DocuGen Pro transforme vos idées en plans d'action ou vos missions terminées en documentation professionnelle certifiée.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-brand-500/40 flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  Démarrer l'expérience <ArrowRight size={20} />
                </button>
              </div>
              <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
                <Shield size={16} className="text-green-500" /> 100% Autonome. Vos données restent privées.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section des Fonctionnalités */}
        <section className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">Cycle de vie complet</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 font-medium">De l'idée initiale à la certification finale, valorisez votre expertise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Clock, title: 'Planification', desc: 'Roadmap stratégique et jalons clairs pour vos nouveaux projets.' },
                { icon: Laptop, title: 'Architecture', desc: 'Recommandations de stack technique et structure logicielle.' },
                { icon: FileText, title: 'Certification', desc: 'Attestations professionnelles formelles pour vos clients.' },
                { icon: Linkedin, title: 'Visibilité', desc: 'Storytelling LinkedIn et pitchs commerciaux percutants.' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 shadow-soft hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Pied de page (Footer) */}
      <footer className="bg-neutral-950 text-neutral-400 py-20 text-center relative z-10 border-t border-neutral-900 h-[340px] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8 group cursor-default">
            <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">DocuGen Pro</span>
          </div>
          <p className="text-sm font-medium opacity-60">© 2026 DocuGen Pro. All rights reserved by Aurion Labs-G.</p>
          <p className="text-xs mt-2 opacity-40 italic">DocuGen Pro is a product of Aurion Labs-G.</p>
          <div className="mt-10 pt-10 border-t border-neutral-900/50">
            <p className="text-xs font-black tracking-[0.3em] text-neutral-500 uppercase">Powered by Aurion Labs-G</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
