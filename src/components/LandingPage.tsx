import React from 'react';
import { FileText, Shield, ArrowRight, Code, Briefcase, Linkedin, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function LandingPage({ onStart, theme, toggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <FileText size={20} />
            </div>
            <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">DocuGen Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={onStart}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Accéder à l'application
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 leading-tight">
                Votre documentation de projet,<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  générée par l'IA en quelques secondes.
                </span>
              </h1>
              <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                DocuGen Pro transforme les détails de vos missions freelance ou projets SaaS en attestations professionnelles, résumés techniques, et posts LinkedIn prêts à l'emploi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  Commencer gratuitement <ArrowRight size={20} />
                </button>
              </div>
              <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
                <Shield size={16} className="text-green-500" /> 100% Autonome. Vos données restent privées.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">4 documents générés en 1 clic</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Gagnez du temps à la fin de chaque projet et valorisez votre expertise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: FileText, title: 'Attestation', desc: 'Un document formel certifiant votre prestation pour vos clients.' },
                { icon: Code, title: 'Résumé Technique', desc: 'Une synthèse claire de l\'architecture et des technologies utilisées.' },
                { icon: Briefcase, title: 'Version CV', desc: 'Des points d\'impact prêts à être copiés-collés dans votre CV.' },
                { icon: Linkedin, title: 'Post LinkedIn', desc: 'Un storytelling engageant pour partager votre réussite sur les réseaux.' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                >
                  <div className="w-14 h-14 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <FileText size={20} />
            </div>
            <span className="text-xl font-semibold text-white">DocuGen Pro</span>
          </div>
          <p className="text-sm">© 2026 DocuGen Pro. Conçu pour les freelances et créateurs.</p>
          <p className="text-sm font-bold mt-2 tracking-wider text-neutral-300">CREATED BY HORACIO CHINKOUN</p>
        </div>
      </footer>
    </div>
  );
}
