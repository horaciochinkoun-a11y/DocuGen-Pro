import React, { useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { motion } from 'motion/react';
import { termsOfServiceRaw, privacyPolicyRaw, legalMentionsRaw, aiPolicyRaw, localDataPolicyRaw } from './LegalDocs';

interface LegalPageProps {
  docType: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data';
  onBack: () => void;
  onHome?: () => void;
  onNavigate?: (doc: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data') => void;
  theme: 'light' | 'dark';
}

export default function LegalPage({ docType, onBack, onHome, onNavigate, theme }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [docType]);

  let content = '';

  switch (docType) {
    case 'cgu':
      content = termsOfServiceRaw;
      break;
    case 'privacy':
      content = privacyPolicyRaw;
      break;
    case 'mentions':
      content = legalMentionsRaw;
      break;
    case 'ai':
      content = aiPolicyRaw;
      break;
    case 'local_data':
      content = localDataPolicyRaw;
      break;
  }

  return (
    <div className={`min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button type="button" onClick={onBack}
            className="group flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Retour à l'application
          </button>

          {onHome && (
            <button type="button" onClick={onHome}
              className="group flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border-l border-neutral-200 dark:border-neutral-800 pl-4"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors">
                <Home size={16} />
              </div>
              Retour à l'accueil
            </button>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-200 dark:border-neutral-800"
        >
          
          <div className="markdown-legal max-w-none">
            <Markdown rehypePlugins={[rehypeSlug]}>{content}</Markdown>
          </div>
        </motion.div>
      </div>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200 dark:border-neutral-800 mt-12 flex flex-col justify-center w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              © 2026 DocuGen Pro. All rights reserved by Horacio Chinkoun.
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
              DocuGen Pro est la propriété personnelle de Horacio Chinkoun.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-500 flex-wrap justify-center">
            {onNavigate && (
              <>
                <button type="button" onClick={() => onNavigate('cgu')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">CGU</button>
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Confidentialité</button>
                <button type="button" onClick={() => onNavigate('mentions')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Mentions Légales</button>
                <button type="button" onClick={() => onNavigate('ai')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Charte IA</button>
                <button type="button" onClick={() => onNavigate('local_data')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Données Locales</button>
                <span className="hidden sm:inline">|</span>
              </>
            )}
            <span>Powered by Horacio Chinkoun</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
