// Importation de React et des hooks nécessaires pour l'interactivité de la Landing Page
import React, { useState } from 'react';
// Importation des icônes d'illustration professionnelle de haute qualité depuis lucide-react
import { 
  FileText, 
  Shield, 
  ArrowRight, 
  Linkedin, 
  Sun, 
  Moon, 
  Clock, 
  Laptop, 
  Sparkles, 
  ChevronDown, 
  QrCode, 
  CheckCircle2 
} from 'lucide-react';
// Importation de Framer Motion (re-branché sur motion/react pour la compatibilité du projet)
import { motion } from 'motion/react';

// Définition de l'interface des propriétés reçues par notre composant
interface LandingPageProps {
  // Fonction pour basculer vers la vue principale de l'application
  onStart: () => void;
  // Thème actif passé en paramètre ('light' ou 'dark')
  theme: 'light' | 'dark';
  // Fonction callback pour changer ou inverser le thème actif
  toggleTheme: () => void;
}

// Composant de la Landing Page professionnelle de DocuGen Pro
export default function LandingPage({ onStart, theme, toggleTheme }: LandingPageProps) {
  // État local pour suivre l'ouverture des sections FAQ sous forme d'accordéon interactif
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Fonction pour basculer l'état ouvert/fermé d'une question spécifique de la FAQ
  const toggleFaq = (index: number) => {
    // Si la question cliquée est déjà ouverte, on la ferme (mise à null), sinon on stocke son index
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Liste des questions courantes (FAQ) rédigées selon les meilleures pratiques SEO et UX
  const faqItems = [
    {
      question: "DocuGen Pro est-il gratuit et nécessite-t-il la création d'un compte ?",
      answer: "L'application fonctionne sur un modèle 100% autonome et décentralisé. Aucun compte utilisateur ni mot de passe n'est requis. Vous pouvez configurer votre propre clé d'API Gemini (disponible gratuitement auprès de Google AI Studio) directement de manière locale, ce qui vous offre une souveraineté matérielle complète et sans frais d'infrastructure."
    },
    {
      question: "Comment mes données personnelles et de projets sont-elles protégées ?",
      answer: "Toutes vos données (champs de formulaires saisis, historique de vos 30 derniers documents générés) sont conservées exclusivement au sein du stockage local (localStorage) de votre propre navigateur internet. Aucun serveur distant, aucune base de données cloud tierce ni tracker publicitaire ne stocke ni ne transite vos données d'entreprise."
    },
    {
      question: "Comment le QR code d'authentification numérique fonctionne-t-il ?",
      answer: "En fin d'édition, lorsque vous saisissez vos liens professionnels optionnels (GitHub ou LinkedIn), un QR code vectoriel dynamique est généré directement en fin d'attestation. En le scannant, vos clients, collègues ou recruteurs accèdent instantanément à vos preuves tangibles de réalisation, consolidant ainsi la véracité de votre travail."
    },
    {
      question: "Puis-je exporter et distribuer librement les écrits créés ?",
      answer: "Absolument. Les documents générés vous appartiennent à 100%. Vous disposez de contrôles d'impression natifs ou de copie de texte enrichi formaté en Markdown pour intégration directe dans vos éditeurs de documents préférés (Word, Notion, Obsidian) ou sur vos réseaux sociaux."
    }
  ];

  // Liste des fonctionnalités clés enrichies couvrant l'intégralité du cycle de vie du projet
  const keyFeatures = [
    {
      icon: Clock,
      title: "Planification Stratégique",
      desc: "Établissez des roadmaps structurées, découpez des jalons logiques et concevez des plans d'action transparents pour guider vos nouvelles phases de développement."
    },
    {
      icon: Laptop,
      title: "Conception d'Architecture",
      desc: "Générez des résumés d'architecture globale, identifiez les stacks technologiques recommandées et listez précisément vos dépendances clés d'infrastructure."
    },
    {
      icon: FileText,
      title: "Attestations de Mission",
      desc: "Valorisez vos contrats d'ingénierie et de consulting grâce à des d'attestations de prestation certifiées d'une grande rigueur administrative."
    },
    {
      icon: QrCode,
      title: "Certification Numérique",
      desc: "Renforcez votre authenticité et protégez vos documents professionnels grâce à un QR code unique réorientant vers vos dépôts techniques et comptes certifiés."
    },
    {
      icon: Linkedin,
      title: "Visibilité & Storytelling",
      desc: "Transformez vos victoires techniques en articles LinkedIn captivants ou en pitchs d'expert prêts à convaincre votre réseau."
    },
    {
      icon: Shield,
      title: "Souveraineté des Données",
      desc: "Opérez de manière locale avec un chiffrement à la source : vos secrets d'architecture et clés d'API ne transitent par aucun service tiers."
    }
  ];

  // Cas d'usage réels rédigés sous forme d'illustrations professionnelles et concrètes
  const useCases = [
    {
      badge: "Freelances & Consultants",
      scenario: "Un ingénieur informatique externe termine un contrat de mise en production et génère une attestation de prestation certifiée pour débloquer sa facturation finale.",
      metrics: "Supprime 3 heures de formalités",
      bgClass: "from-brand-50 to-indigo-50/50 dark:from-brand-950/20 dark:to-neutral-900/40"
    },
    {
      badge: "Tech Leads & Architectes",
      scenario: "Un architecte logiciel configure les schémas d'un microservice complexe et formalise instantanément une notice technique propre ainsi qu'un post LinkedIn de partage.",
      metrics: "Valorisation technique inégalée",
      bgClass: "from-indigo-50/50 to-neutral-50 dark:from-neutral-900/40 dark:to-brand-950/10"
    },
    {
      badge: "Product Owners & PMs",
      scenario: "Un product owner structure un plan de livraison et transpose des notes de réunion complexes en un backlog ordonné et fiches de tâches hiérarchisées en 1 clic.",
      metrics: "Alignement d'équipe immédiat",
      bgClass: "from-brand-50/30 to-brand-100/20 dark:from-neutral-900/20 dark:to-brand-950/20"
    }
  ];

  return (
    // Conteneur principal de la page d'accueil avec support de style réactif
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-brand-100 selection:text-brand-900 flex flex-col antialiased">
      
      {/* SECTION : HEADER (Barre de navigation transparente collée en haut de l'écran) */}
      <header className="glass sticky top-0 z-50 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo dynamique associant icône fluide et lettrage épuré */}
          <div className="flex items-center gap-3 group cursor-default">
            {/* Conteneur d'icône dynamique avec transition d'animation au survol */}
            <div className="bg-brand-600 text-white p-2.5 rounded-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-all duration-300">
              <FileText size={20} />
            </div>
            {/* Lettrage de marque */}
            <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
              DocuGen <span className="text-brand-600 dark:text-brand-400">Pro</span>
            </span>
          </div>

          {/* Actions rapides à droite de la barre de navigation */}
          <div className="flex items-center gap-4">
            {/* Bouton de bascule de thèmes d'éclairage (Jour/Nuit) avec ombres subtiles */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400 transition-all rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow active:scale-95 duration-200"
              aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {/* Bouton secondaire d'accès direct */}
            <button 
              onClick={onStart}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-brand-600 dark:text-neutral-300 dark:hover:text-brand-400 transition-colors duration-200"
            >
              Accéder <ArrowRight size={14} />
            </button>
            
            {/* Bouton d'action principal de l'en-tête */}
            <button
              onClick={onStart}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 duration-200"
            >
              Démarrer
            </button>
          </div>
        </div>
      </header>

      {/* SECTION DE CONTENU PRINCIPAL */}
      <main className="flex-grow">

        {/* COMPOSANT VISUEL : HERO SECTION */}
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 overflow-hidden">
          {/* Grille de fond de design moderne de style cartographie ou blueprint */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          {/* Effets lumineux atmosphériques en arrière-plan pour sublimer le layout */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
            <div className="absolute -top-[10%] left-[15%] w-[45%] h-[40%] rounded-full bg-brand-400/10 blur-[130px]" />
            <div className="absolute top-[10%] right-[10%] w-[40%] h-[45%] rounded-full bg-indigo-500/10 blur-[140px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Animation d'introduction progressive de la Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              {/* Badge d'informations de version / statut produit */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-full mb-8">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                  Version 2.3 • Certification & Storytelling
                </span>
              </div>

              {/* Titre Principal accrocheur et de haute qualité typographique */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.05] mb-8">
                Valorisez votre ingénierie.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                  Documentez sans friction.
                </span>
              </h1>

              {/* Proposition de Valeur formulée de manière professionnelle */}
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
                DocuGen Pro fusionne l'intelligence artificielle générative et des systèmes de design rigoureux pour créer instantanément des livrables techniques d'une clarté professionnelle absolue.
              </p>

              {/* Boutons d'Appel à l'action principaux animés de transitions micro-UX */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-8 py-4.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-brand-500/15 hover:shadow-brand-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 duration-200"
                >
                  Concevoir un Projet <ArrowRight size={16} />
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-500/20 dark:hover:border-brand-500/20 text-neutral-700 dark:text-neutral-300 rounded-2xl font-semibold text-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2 duration-200"
                >
                  Explorer les fonctionnalités
                </a>
              </div>

              {/* Label de confiance et de sécurité utilisateur */}
              <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                <Shield size={14} className="text-emerald-500" />
                <span>Architecture 100% Client-Side. Vos secrets de code restent locaux et sécurisés.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* COMPOSANT VISUEL : SECTION DES FONCTIONNALITÉS CLÉS */}
        <section id="features" className="py-24 bg-white dark:bg-neutral-900/40 border-y border-neutral-200/50 dark:border-neutral-800/40 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* En-tête de la section fonctionnalités */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Une suite documentaire unifiée
              </h2>
              <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
                Générez de multiples formats de documents en un seul processus d'ingestion pour accompagner tout le cycle de vie de vos projets d'ingénierie.
              </p>
            </div>

            {/* Grilles de cartes de fonctionnalités interactives */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyFeatures.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="p-8 bg-neutral-50 dark:bg-neutral-900 rounded-[1.5rem] border border-neutral-200/60 dark:border-neutral-800/50 hover:border-brand-500/30 dark:hover:border-brand-500/20 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Conteneur de l'icône de la fonctionnalité */}
                    <div className="w-12 h-12 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 duration-200">
                      <feature.icon size={20} />
                    </div>
                    {/* Titre de fonctionnalité */}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    {/* Description de fonctionnalité */}
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPOSANT VISUEL : SCÉNARIOS & CAS D'USAGE RÉELS */}
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* En-tête de la section Cas d'usage */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Façonné pour vos réalités métier
              </h2>
              <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
                Découvrez des cas de figures concrets où l'automatisation documentaire DocuGen Pro élève l'excellence de votre communication technique.
              </p>
            </div>

            {/* Affichage des cas d'usage réels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`p-8 rounded-[2rem] border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm bg-gradient-to-br ${useCase.bgClass} flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    {/* Badge de qualification de cible */}
                    <span className="inline-block px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-full text-[10px] font-bold text-neutral-600/90 dark:text-neutral-400 uppercase tracking-wider">
                      {useCase.badge}
                    </span>
                    {/* Description du scénario concret */}
                    <blockquote className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      "{useCase.scenario}"
                    </blockquote>
                  </div>

                  {/* Indicateur de performance ou métrique associée */}
                  <div className="mt-8 pt-6 border-t border-neutral-200/40 dark:border-neutral-800/10 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-500" />
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                      {useCase.metrics}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPOSANT VISUEL : GUIDE D'UTILISATION (Comment ça marche ?) */}
        <section className="py-24 bg-white dark:bg-neutral-900/40 border-t border-neutral-200/40 dark:border-neutral-800/30 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Entête de section de processus */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Zéro friction administrative
              </h2>
              <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
                Un processus optimisé de bout en bout pour économiser de précieuses heures d'écriture et de mise en forme.
              </p>
            </div>

            {/* Les 4 étapes d'exécution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                { step: "01", title: "Saisie intuitive", desc: "Décrivez les jalons, la stack technique et les acteurs clés du projet via notre formulaire guidé." },
                { step: "02", title: "Personnalisation", desc: "Optez pour l'esthétique idéale (Moderne vibrant ou Classique Corporate) et importez vos liens professionnels." },
                { step: "03", title: "Synthèse IA", desc: "Notre noyau de traitement compile instantanément vos informations en 4 livrables complémentaires." },
                { step: "04", title: "Certification", desc: "Exportez vos travaux au format optimal. Le QR code dynamiquement injecté garantit la vérification immédiate." }
              ].map((item, i) => (
                <div key={i} className="relative space-y-4">
                  {/* Indice d'étape dynamique */}
                  <span className="text-5xl font-black text-brand-500/10 dark:text-brand-500/5 select-none block">
                    {item.step}
                  </span>
                  {/* Contenu textuel */}
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPOSANT VISUEL : FOIRE AUX QUESTIONS (Accordion) */}
        <section className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            {/* Entête de section FAQ */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Questions Fréquentes
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                Découvrez tout ce qu'il faut savoir sur l'usage souverain, la sécurité de vos clés API, et la conformité de vos livrables.
              </p>
            </div>

            {/* Accordion interactif */}
            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index}
                    className="border border-neutral-200/80 dark:border-neutral-800/60 rounded-2xl bg-white dark:bg-neutral-900/50 overflow-hidden transition-colors duration-200 shadow-sm"
                  >
                    {/* En-tête cliquable d'une question d'un accordéon */}
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-neutral-800 dark:text-neutral-100 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                    >
                      <span className="text-sm sm:text-base tracking-tight leading-snug">{item.question}</span>
                      {/* Flèche d'état d'ouverture animée en CSS classique natif ou Tailwind */}
                      <ChevronDown 
                        size={18} 
                        className={`text-neutral-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {/* Description ou réponse cachée/déroulée dynamiquement */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/40 font-normal">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPOSANT VISUEL : APPEL À L'ACTION FINAL (CTA) */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bannière principale CTA stylisée en boite moderne asymétrique */}
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-brand-900 to-indigo-950 dark:from-brand-950 dark:to-neutral-900/80 py-16 px-8 sm:px-16 text-center shadow-2xl overflow-hidden border border-white/10">
              {/* Effet d'arrière-plan discret */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
              
              <div className="max-w-2xl mx-auto relative z-10 space-y-8">
                {/* Icône décorative supérieure */}
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-brand-400">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                
                {/* Grand titre CTA */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Prêt à professionnaliser vos livrables ?
                </h2>
                
                {/* Description CTA courte */}
                <p className="text-sm sm:text-base text-neutral-200 opacity-90 max-w-lg mx-auto leading-relaxed">
                  Exportez des attestations de projets irréprochables, certifiées par QR code, et partagez vos réussites technologiques dès aujourd'hui.
                </p>

                {/* Bouton declencheur principal */}
                <div>
                  <button
                    onClick={onStart}
                    className="px-10 py-5 bg-white hover:bg-neutral-100 text-brand-950 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 duration-200 mt-2 shadow-xl"
                  >
                    Démarrer l'expérience libre
                  </button>
                </div>
                
                {/* Mention complémentaire de sécurité */}
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Aucun compte requis. Utilisation instantanée dans votre bac à sable souverain.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* SECTION : FOOTER (Pied de page institutionnel) */}
      <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-neutral-900/50">
            {/* Rappel du Logo en pied de page */}
            <div className="flex items-center gap-2.5">
              <div className="bg-brand-600 text-white p-2 rounded-xl">
                <FileText size={18} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                DocuGen <span className="text-brand-500">Pro</span>
              </span>
            </div>

            {/* Liens de bascule rapides de navigation */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <button onClick={onStart} className="hover:text-white transition-colors duration-200">Générateur</button>
              <a href="#features" className="hover:text-white transition-colors duration-200">Fonctionnalités</a>
              <span className="text-neutral-800 pointer-events-none">|</span>
              <span className="cursor-default text-neutral-600 select-none">Aurion Labs G. © 2026</span>
            </div>
          </div>

          {/* Mentions Légales mineures de pied de page */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-600">
            <p>Conçu pour les ingénieurs, freelances et créateurs technologiques.</p>
            <p className="italic">DocuGen Pro est une marque déposée par Aurion Labs-G.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
