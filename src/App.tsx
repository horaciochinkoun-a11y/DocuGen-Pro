import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  FileText, 
  Briefcase, 
  Code, 
  Linkedin, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  Building2,
  User as UserIcon,
  Clock,
  Laptop,
  Key,
  Download,
  FileDown,
  LogIn,
  LogOut,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Palette,
  MapPin,
  History,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateProfessionalDocs, GeneratedDocs } from './services/geminiService';
import LandingPage from './components/LandingPage';
import { 
  auth, 
  db, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  googleProvider,
  handleFirestoreError,
  OperationType,
  User
} from './firebase';

// Composant de gestion des erreurs (Error Boundary)
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue s'est produite.";
      try {
        if (this.state.error?.message) {
          const parsedError = JSON.parse(this.state.error.message);
          if (parsedError.error) {
            errorMessage = `Erreur Firestore (${parsedError.operationType}) : ${parsedError.error}`;
          }
        }
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oups ! Quelque chose s'est mal passé</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// User Profile Interface
interface UserProfile {
  uid: string;
  email: string;
  useCustomApiKey: boolean;
  userApiKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the form data structure
interface ProjectData {
  developerName: string;
  developerStatus: string;
  clientName: string;
  companyName: string;
  projectName: string;
  projectType: string;
  description: string;
  technologies: string;
  keyFeatures: string;
  results: string;
  duration: string;
  clientContact: string;
  manualTime: string;
  manualLocation: string;
  githubLink: string;
}

const initialFormData: ProjectData = {
  developerName: '',
  developerStatus: 'Senior',
  clientName: '',
  companyName: '',
  projectName: '',
  projectType: 'Application Web',
  description: '',
  technologies: '',
  keyFeatures: '',
  results: '',
  duration: '',
  clientContact: '',
  manualTime: '',
  manualLocation: '',
  githubLink: '',
};

// History Item Interface
interface HistoryItem {
  id: string;
  timestamp: number;
  formData: ProjectData;
  generatedDocs: GeneratedDocs;
  phase: 'completion' | 'initiation';
}

function DocumentationGenerator({ 
  onNavigateHome, 
  theme, 
  toggleTheme,
  designSystem,
  setDesignSystem
}: { 
  onNavigateHome: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  designSystem: 'premium' | 'classic';
  setDesignSystem: (ds: 'premium' | 'classic') => void;
}) {
  const [formData, setFormData] = useState<ProjectData>(initialFormData);
  const [projectPhase, setProjectPhase] = useState<'completion' | 'initiation'>('completion');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof GeneratedDocs>('attestation');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('docugen_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // État local de la clé API (Mode autonome sans backend)
  const [localApiKey, setLocalApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  // Écouteur d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser) {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Écouteur pour récupérer et synchroniser le profil utilisateur depuis Firestore
  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setProfile(data);
        // Sync Firebase key to local storage if local is empty
        if (data.userApiKey && !localStorage.getItem('gemini_api_key')) {
          setLocalApiKey(data.userApiKey);
          localStorage.setItem('gemini_api_key', data.userApiKey);
        }
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          uid: user.uid,
          email: user.email || '',
          useCustomApiKey: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setDoc(profileRef, initialProfile).catch(err => handleFirestoreError(err, OperationType.CREATE, 'users'));
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login error:", err);
      setError("Échec de la connexion. Veuillez réessayer.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowSettings(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleApiKeyChange = (val: string) => {
    setLocalApiKey(val);
    localStorage.setItem('gemini_api_key', val);
    
    // Sync with Firebase if logged in
    if (user && profile) {
      updateDoc(doc(db, 'users', user.uid), {
        userApiKey: val,
        useCustomApiKey: true,
        updatedAt: new Date()
      }).catch(err => console.error("Failed to sync API key to profile", err));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = projectPhase === 'completion' ? `
Tu es un expert en documentation professionnelle pour les projets freelance et SaaS.
Agis en tant que chef de projet senior et expert en audit. Ton objectif est de générer des documents qui pourraient passer pour de vrais dossiers internes d'entreprise.

DONNÉES D'ENTRÉE :
- Nom du développeur : ${formData.developerName}
- Statut du développeur : ${formData.developerStatus}
- Nom du client : ${formData.clientName}
- Nom de l'entreprise : ${formData.companyName}
- Nom du projet : ${formData.projectName}
- Type de projet : ${formData.projectType}
- Description du projet : ${formData.description}
- Technologies utilisées : ${formData.technologies}
- Fonctionnalités clés livrées : ${formData.keyFeatures}
- Résultats obtenus : ${formData.results}
- Durée du projet : ${formData.duration}
- Contact client : ${formData.clientContact}
- Lien GitHub : ${formData.githubLink || 'Non spécifié'}
- Heure manuelle : ${formData.manualTime || 'Non spécifiée'}
- Lieu manuel : ${formData.manualLocation || 'Non spécifié'}

TÂCHE :
Génère les 4 documents suivants en te basant sur les données d'entrée.
IMPORTANT : TOUS LES DOCUMENTS DOIVENT ÊTRE RÉDIGÉS EN FRANÇAIS ET FORMATÉS EN MARKDOWN.

1. ATTESTATION PROFESSIONNELLE (attestation)
- Utilise un titre principal \`# ATTESTATION DE RÉALISATION DE PRESTATION\`.
- Ton administratif et très formel.
- Structuré comme un document officiel imprimé.
- Utilise \`---\` pour créer des lignes de séparation avant le corps du texte et avant la signature.
- Inclure un bloc de signature clair à la fin (ex: Fait à ${formData.manualLocation || '[Ville]'}, le ${formData.manualTime || '[Date]'} \n\n **[Nom du Client]**).
- Mentionne explicitement le statut du développeur (${formData.developerStatus}).
- Si un lien GitHub est fourni (${formData.githubLink}), l'inclure dans une section "Ressources" ou "Lien du dépôt".

2. RÉSUMÉ TECHNIQUE DU PROJET (technicalSummary)
- Utilise \`# RÉSUMÉ TECHNIQUE : [Nom du Projet]\`.
- Clair et structuré avec des sous-titres \`##\`.
- Mettre en évidence les choix d'architecture et les technologies.
- Mentionne le rôle du développeur (${formData.developerStatus}) dans le projet.
- Inclure le lien GitHub (${formData.githubLink}) si disponible.
- Ajouter des contraintes ou des défis réalistes rencontrés pour augmenter la crédibilité.

3. VERSION CV (COURTE) (cvVersion)
- Utilise \`# [Nom du Développeur] - ${formData.developerStatus} [Type de projet]\` comme titre principal.
- Utilise \`##\` pour les sections (ex: \`## PROJET RÉCENT\`, \`## TECHNOLOGIES\`, \`## RÉALISATIONS\`).
- Utilise des points puces (bullet points) pour les réalisations.
- Orienté sur l'impact (chiffres en gras).

4. VERSION LINKEDIN (linkedinVersion)
- Style storytelling (narration).
- Engageant mais toujours professionnel.
- Mettre l'accent sur le schéma : problème -> solution -> résultat.
- Mentionne subtilement l'expertise en tant que ${formData.developerStatus}.
` : `
Tu es un consultant en stratégie produit et architecte logiciel senior.
Ton objectif est d'aider un utilisateur à lancer un nouveau projet en transformant une idée brute en un plan d'action professionnel et structuré.

DONNÉES D'ENTRÉE :
- Porteur du projet : ${formData.developerName}
- Rôle visé : ${formData.developerStatus}
- Client/Cible : ${formData.clientName}
- Nom de l'entreprise/SaaS : ${formData.companyName}
- Nom du projet : ${formData.projectName}
- Type de projet : ${formData.projectType}
- Vision du projet : ${formData.description}
- Technologies envisagées : ${formData.technologies}
- Fonctionnalités principales souhaitées : ${formData.keyFeatures}
- Objectifs attendus : ${formData.results}
- Durée estimée du lancement : ${formData.duration}

TÂCHE :
Génère les 4 documents stratégiques suivants.
IMPORTANT : TOUS LES DOCUMENTS DOIVENT ÊTRE RÉDIGÉS EN FRANÇAIS ET FORMATÉS EN MARKDOWN.

1. FEUILLE DE ROUTE & JALONS (roadmap)
- Titre : \`# FEUILLE DE ROUTE STRATÉGIQUE : [Nom du Projet]\`.
- Découpage en phases (Phase 1 : Fondations, Phase 2 : MVP, Phase 3 : Scale).
- Jalons clairs avec livrables attendus.
- Estimation réaliste des délais.

2. ARCHITECTURE & STACK RECOMMANDÉE (architecture)
- Titre : \`# ARCHITECTURE TECHNIQUE ET STACK LOGICIELLE\`.
- Justification des choix technologiques par rapport au projet.
- Schéma conceptuel de l'architecture (en texte/Markdown).
- Recommandations sur l'hébergement et la scalabilité.

3. BACKLOG INITIAL & DÉFINITION DU MVP (backlog)
- Titre : \`# BACKLOG PRODUIT ET PÉRIMÈTRE MVP\`.
- Liste des User Stories prioritaires pour le lancement.
- Définition stricte de ce qui est "In Scope" et "Out of Scope" pour la V1.
- Critères d'acceptation pour les fonctionnalités clés.

4. PITCH & STRATÉGIE DE LANCEMENT (pitch)
- Titre : \`# PITCH COMMERCIAL ET STRATÉGIE GO-TO-MARKET\`.
- Elevator Pitch (30 secondes).
- Analyse de la proposition de valeur unique (USP).
- Canaux d'acquisition suggérés pour les premiers utilisateurs.
`;

      const data = await generateProfessionalDocs(prompt, localApiKey, projectPhase);
      setGeneratedDocs(data);
      setActiveTab(projectPhase === 'completion' ? 'attestation' : 'roadmap');

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        formData: { ...formData },
        generatedDocs: data,
        phase: projectPhase
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 30); // Keep last 30
      setHistory(updatedHistory);
      localStorage.setItem('docugen_history', JSON.stringify(updatedHistory));
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erreur de génération:', error);
      setError(error.message || 'Une erreur inattendue s\'est produite lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const exportToPDF = async () => {
    if (!generatedDocs) return;
    const element = document.getElementById('markdown-content');
    if (!element) return;

    try {
      // @ts-expect-error html2pdf is not typed
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 15,
        filename: `${activeTab}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      // @ts-expect-error html2pdf is not typed
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Erreur lors de l\'export PDF:', err);
    }
  };

  const exportToWord = () => {
    if (!generatedDocs) return;
    const element = document.getElementById('markdown-content');
    if (!element) return;

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export</title></head><body>";
    const footer = "</body></html>";
    const html = header + element.innerHTML + footer;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fillSampleData = () => {
    const completionSamples: ProjectData[] = [
      {
        developerName: 'Alex Mercer',
        developerStatus: 'Architecte',
        clientName: 'Sarah Jenkins',
        companyName: 'Nexus Logistique',
        projectName: 'RouteOptima',
        projectType: 'SaaS',
        description: 'Une plateforme d\'optimisation d\'itinéraires basée sur le cloud pour les flottes de livraison de taille moyenne, afin de réduire la consommation de carburant et d\'améliorer les délais de livraison.',
        technologies: 'React, Next.js, Node.js, PostgreSQL, API Google Maps, Redis',
        keyFeatures: 'Suivi des chauffeurs en temps réel, calcul automatisé des itinéraires, tableau de bord de répartition par glisser-déposer, notifications SMS aux clients.',
        results: 'Réduction des coûts de carburant moyens de 18 %, amélioration du taux de livraison à temps de 82 % à 96 %, intégration de 50 chauffeurs le premier mois.',
        duration: '6 mois',
        clientContact: 's.jenkins@nexuslogistique.com',
        manualTime: '02 Avril 2026',
        manualLocation: 'Paris, France',
        githubLink: 'https://github.com/alexmercer/route-optima',
      },
      {
        developerName: 'Emma Dubois',
        developerStatus: 'Lead Developer',
        clientName: 'Marc Lemoine',
        companyName: 'FinTech Solutions',
        projectName: 'PayFlow',
        projectType: 'Application Web',
        description: 'Application de gestion financière pour les PME permettant de centraliser les factures et d\'automatiser les relances.',
        technologies: 'Vue.js, Python, Django, Stripe API, AWS',
        keyFeatures: 'Tableau de bord financier, intégration Stripe, génération de factures PDF, système de relance automatique par email.',
        results: 'Diminution des retards de paiement de 30%, gain de temps estimé à 10h/semaine pour les équipes comptables.',
        duration: '4 mois',
        clientContact: 'm.lemoine@fintech-solutions.fr',
        manualTime: '15 Mars 2026',
        manualLocation: 'Lyon, France',
        githubLink: 'https://github.com/emmadubois/payflow',
      }
    ];

    const initiationSamples: ProjectData[] = [
      {
        developerName: 'Thomas Klein',
        developerStatus: 'Entrepreneur Tech',
        clientName: 'Propriétaires de chiens',
        companyName: 'PawConnect',
        projectName: 'PawConnect',
        projectType: 'Application Mobile',
        description: 'Une application de mise en relation entre propriétaires de chiens pour des promenades groupées et du gardiennage collaboratif.',
        technologies: 'React Native, Firebase, Google Maps SDK',
        keyFeatures: 'Géolocalisation en temps réel, messagerie instantanée, profils de chiens, système de notation.',
        results: 'Atteindre 1000 utilisateurs actifs en 3 mois, valider le concept de gardiennage gratuit entre voisins.',
        duration: '3 mois (Phase MVP)',
        clientContact: '',
        manualTime: '',
        manualLocation: 'Berlin, Allemagne',
        githubLink: '',
      },
      {
        developerName: 'Julie Morel',
        developerStatus: 'Full-Stack Dev',
        clientName: 'Restaurants Locaux',
        companyName: 'ZeroWaste Menu',
        projectName: 'ZeroWaste Menu',
        projectType: 'SaaS B2B',
        description: 'Outil de gestion de stock intelligent pour restaurants permettant de réduire le gaspillage alimentaire en suggérant des menus basés sur les produits proches de la péremption.',
        technologies: 'Next.js, Tailwind CSS, OpenAI API (pour suggestions)',
        keyFeatures: 'Scan de factures, alertes péremption, générateur de menus IA, analytics de gaspillage.',
        results: 'Réduire le gaspillage de 25% chez les restaurateurs partenaires.',
        duration: '5 mois',
        clientContact: '',
        manualTime: '',
        manualLocation: 'Nantes, France',
        githubLink: '',
      }
    ];

    const samples = projectPhase === 'completion' ? completionSamples : initiationSamples;
    const randomIndex = Math.floor(Math.random() * samples.length);
    setFormData(samples[randomIndex]);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setFormData(item.formData);
    setGeneratedDocs(item.generatedDocs);
    setProjectPhase(item.phase);
    setActiveTab(item.phase === 'completion' ? 'attestation' : 'roadmap');
    setShowHistory(false);
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('docugen_history', JSON.stringify(updatedHistory));
  };

  const tabs = projectPhase === 'completion' ? [
    { id: 'attestation', label: 'Attestation', icon: FileText },
    { id: 'technicalSummary', label: 'Résumé Technique', icon: Code },
    { id: 'cvVersion', label: 'Version CV', icon: Briefcase },
    { id: 'linkedinVersion', label: 'Post LinkedIn', icon: Linkedin },
  ] : [
    { id: 'roadmap', label: 'Roadmap', icon: Clock },
    { id: 'architecture', label: 'Architecture', icon: Laptop },
    { id: 'backlog', label: 'Backlog/MVP', icon: Code },
    { id: 'pitch', label: 'Pitch/Stratégie', icon: Linkedin },
  ];

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-brand-100 selection:text-brand-900">
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group transition-all min-w-0"
            onClick={onNavigateHome}
            title="Retour à l'accueil"
          >
            <div className="bg-brand-600 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform shrink-0">
              <FileText size={18} className="sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white truncate">
              DocuGen <span className="text-brand-600 dark:text-brand-400">Pro</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 p-1.5 px-2 sm:p-2 sm:px-3 transition-all rounded-xl border shadow-sm ${
                showHistory 
                  ? "bg-brand-600 border-brand-600 text-white" 
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              }`}
              title="Historique des documents"
            >
              <History size={16} />
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Historique</span>
            </button>

            <button
              type="button"
              onClick={fillSampleData}
              className="flex items-center gap-1.5 p-1.5 px-2 sm:p-2 sm:px-3 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/10 shadow-sm"
              title="Charger un exemple"
            >
              <Sparkles size={16} />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Exemple</span>
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 p-1.5 sm:p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm"
              title="Configuration API"
            >
              <Key size={16} className={`sm:w-[18px] sm:h-[18px] ${localApiKey ? "text-green-500" : "text-amber-500"}`} />
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Clé API</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400 transition-all rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
            >
              {theme === 'light' ? <Moon size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 ml-0.5 sm:ml-2 pl-1.5 sm:pl-4 border-l border-neutral-200 dark:border-neutral-800">
                <button 
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-brand-600 text-white p-1.5 sm:px-5 sm:py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
              >
                <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modal Historique */}
        <AnimatePresence>
          {showHistory && (
            <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[70vh]"
              >
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                      <History size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Historique</h2>
                      <p className="text-xs text-neutral-500">Vos 30 dernières générations</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                  >
                    <AlertCircle size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {history.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <History size={32} className="text-neutral-400" />
                      </div>
                      <p className="text-neutral-500 font-medium">Aucun document dans l'historique</p>
                      <p className="text-xs text-neutral-400 mt-1">Générez votre premier document pour le voir ici</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="group flex items-center justify-between p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            item.phase === 'completion' 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          }`}>
                            {item.phase === 'completion' ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-neutral-900 dark:text-white truncate">
                              {item.formData.projectName || "Projet sans nom"}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                              <span>{new Date(item.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
                              <span className={item.phase === 'completion' ? 'text-blue-600' : 'text-purple-600'}>
                                {item.phase === 'completion' ? 'Livraison' : 'Idéation'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => deleteHistoryItem(e, item.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                          <ChevronRight size={20} className="text-neutral-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Fenêtre modale des paramètres */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            >
              <div 
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-neutral-200 dark:border-neutral-800"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-600" />
                    Configuration de l'Application
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300">
                    <AlertCircle size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sélecteur du système de design */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <Palette size={16} className="text-brand-500" />
                      Système de Design
                    </label>
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={() => setDesignSystem('premium')}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                          designSystem === 'premium' 
                            ? 'bg-white dark:bg-neutral-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        Premium
                      </button>
                      <button
                        onClick={() => setDesignSystem('classic')}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                          designSystem === 'classic' 
                            ? 'bg-white dark:bg-neutral-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        Classic
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <Key size={16} className="text-brand-500" />
                      Votre Clé API Gemini
                    </label>
                    <input
                      type="password"
                      value={localApiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="AIza..."
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-mono dark:text-white"
                    />
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                      <p>✅ Stockée localement dans votre navigateur.</p>
                      <p>✅ Totalement sécurisé et indépendant.</p>
                      {user && <p>✅ Synchronisée avec votre compte cloud.</p>}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98]"
                    >
                      Enregistrer et fermer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-soft">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">Configuration</h2>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {projectPhase === 'completion' ? 'Phase de Livraison' : 'Phase d\'Idéation'}
                  </p>
                </div>
              </div>
              
              <div className="flex p-1.5 bg-neutral-100 dark:bg-neutral-950 rounded-2xl w-full mb-10">
                <button
                  onClick={() => {
                    setProjectPhase('completion');
                    setGeneratedDocs(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    projectPhase === 'completion'
                      ? 'bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-soft'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  Terminé
                </button>
                <button
                  onClick={() => {
                    setProjectPhase('initiation');
                    setGeneratedDocs(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    projectPhase === 'initiation'
                      ? 'bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-soft'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <Sparkles size={16} />
                  Nouveau
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-soft">
              
              {!localApiKey && (
                <div className="mb-8 p-5 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                    <Key size={20} />
                  </div>
                  <div className="text-sm text-brand-900 dark:text-brand-100">
                    <p className="font-bold mb-1">Mode Autonome : Clé API requise</p>
                    <p className="opacity-80">Pour utiliser l'application sans compte, veuillez renseigner votre propre clé API Gemini.</p>
                    <button type="button" onClick={() => setShowSettings(true)} className="mt-3 font-black uppercase tracking-widest text-xs underline hover:text-brand-700 transition-colors">
                      Configurer maintenant
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <UserIcon size={12} className="text-brand-500" />
                      {projectPhase === 'completion' ? 'Développeur' : 'Porteur du Projet'}
                    </label>
                    <input
                      required
                      type="text"
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder={projectPhase === 'completion' ? "Jean Dupont" : "Votre nom"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Briefcase size={12} className="text-brand-500" />
                      {projectPhase === 'completion' ? 'Statut' : 'Rôle visé'}
                    </label>
                    <input
                      list="status-options"
                      name="developerStatus"
                      value={formData.developerStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="ex: Architecte Senior"
                    />
                    <datalist id="status-options">
                      <option value="Junior" />
                      <option value="Senior" />
                      <option value="Architecte" />
                      <option value="Analyste" />
                      <option value="Lead Developer" />
                      <option value="Consultant" />
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <UserIcon size={12} className="text-brand-500"/> {projectPhase === 'completion' ? 'Nom du Client' : 'Cible / Client visé'}
                    </label>
                    <input
                      required
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder={projectPhase === 'completion' ? "Marie Martin" : "ex: Freelances, PME..."}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Building2 size={12} className="text-brand-500"/> {projectPhase === 'completion' ? 'Entreprise' : 'Nom du SaaS / Entité'}
                    </label>
                    <input
                      required
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Clock size={12} className="text-brand-500"/> Heure / Date
                    </label>
                    <input
                      type="text"
                      name="manualTime"
                      value={formData.manualTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="ex: 02 Avril 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <MapPin size={12} className="text-brand-500"/> Lieu
                    </label>
                    <input
                      type="text"
                      name="manualLocation"
                      value={formData.manualLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="ex: Paris, France"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Clock size={12} className="text-brand-500"/> Durée
                    </label>
                    <input
                      required
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="ex: 3 mois"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <Laptop size={12} className="text-brand-500"/> Type du Projet
                    </label>
                    <input
                      list="project-types"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                      placeholder="ex: SaaS B2B"
                    />
                    <datalist id="project-types">
                      <option value="SaaS" />
                      <option value="Application Web" />
                      <option value="Application Mobile" />
                      <option value="API / Backend" />
                      <option value="E-commerce" />
                      <option value="Dashboard" />
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Laptop size={12} className="text-brand-500" /> Nom du Projet
                  </label>
                  <input
                    required
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                    placeholder="Projet Alpha"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Code size={12} className="text-brand-500" /> Lien GitHub (Optionnel)
                  </label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <FileText size={12} className="text-brand-500" />
                    {projectPhase === 'completion' ? 'Description' : 'Vision du Projet'}
                  </label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none dark:text-white"
                    placeholder={projectPhase === 'completion' ? "Décrivez brièvement ce que fait le projet..." : "Quelle est l'idée principale et le problème résolu ?"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Laptop size={12} className="text-brand-500" />
                    {projectPhase === 'completion' ? 'Technologies Utilisées' : 'Technologies Envisagées'}
                  </label>
                  <input
                    required
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                    placeholder="React, Node.js, PostgreSQL..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-500" />
                    {projectPhase === 'completion' ? 'Fonctionnalités Clés Livrées' : 'Fonctionnalités Principales Souhaitées'}
                  </label>
                  <textarea
                    required
                    name="keyFeatures"
                    value={formData.keyFeatures}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none dark:text-white"
                    placeholder="Authentification utilisateur, intégration de paiement, tableau de bord en temps réel..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-500" />
                    {projectPhase === 'completion' ? 'Résultats Obtenus' : 'Objectifs Attendus'}
                  </label>
                  <textarea
                    required
                    name="results"
                    value={formData.results}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none dark:text-white"
                    placeholder={projectPhase === 'completion' ? "Augmentation de la conversion de 20%..." : "Quels sont les indicateurs de succès visés ?"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Contact Client (Optionnel)</label>
                  <input
                    type="text"
                    name="clientContact"
                    value={formData.clientContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="email@exemple.com ou numéro de téléphone"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Générer la Documentation
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8 h-full">
            {generatedDocs ? (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-soft overflow-hidden h-full flex flex-col min-h-[700px]">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 scrollbar-hide p-2 gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as keyof GeneratedDocs)}
                        className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap relative ${
                          isActive 
                            ? 'bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-soft' 
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto relative bg-white dark:bg-neutral-900">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none"
                    >
                      <div className="flex justify-end mb-6 sticky top-0 z-10 gap-3">
                        <button
                          type="button"
                          onClick={exportToPDF}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-white dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shadow-soft border border-neutral-200 dark:border-neutral-800"
                        >
                          <FileDown size={14} />
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={exportToWord}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-white dark:bg-neutral-900 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all shadow-soft border border-neutral-200 dark:border-neutral-800"
                        >
                          <Download size={14} />
                          Word
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedDocs[activeTab], activeTab)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-all shadow-soft border border-neutral-200 dark:border-neutral-800"
                        >
                          {copiedTab === activeTab ? (
                            <>
                              <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                              <span className="text-green-700 dark:text-green-300">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copier
                            </>
                          )}
                        </button>
                      </div>
                      <div 
                        id="markdown-content" 
                        className={`markdown-${activeTab} font-serif leading-relaxed text-neutral-800 dark:text-neutral-200 relative ${
                          activeTab === 'attestation' || activeTab === 'roadmap'
                            ? 'border-4 border-double border-neutral-300 dark:border-neutral-600 p-8 sm:p-12 bg-white dark:bg-neutral-900 shadow-sm min-h-[500px]' 
                            : ''
                        }`}
                      >
                        {(activeTab === 'attestation' || activeTab === 'roadmap') && (
                          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.04] dark:opacity-[0.08]">
                            <span className="text-7xl md:text-[120px] font-black tracking-widest text-neutral-900 dark:text-white -rotate-45 select-none">
                              {activeTab === 'attestation' ? 'CERTIFIÉ' : 'ROADMAP'}
                            </span>
                          </div>
                        )}
                        <div className="relative z-10">
                          <Markdown>{generatedDocs[activeTab]}</Markdown>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] sm:min-h-[600px] bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-6 sm:p-12 shadow-soft">
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-50 dark:bg-brand-900/20 rounded-2xl sm:rounded-3xl flex items-center justify-center animate-pulse">
                    <FileText size={32} className="text-brand-200 dark:text-brand-800 sm:hidden" />
                    <FileText size={48} className="text-brand-200 dark:text-brand-800 hidden sm:block" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-neutral-800 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center border border-neutral-100 dark:border-neutral-700">
                    <Sparkles size={16} className="text-brand-500 sm:hidden" />
                    <Sparkles size={20} className="text-brand-500 hidden sm:block" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-3 sm:mb-4 tracking-tight">Prêt à générer ?</h3>
                <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed font-medium">
                  Remplissez les détails de votre projet à gauche et laissez l'IA créer votre documentation professionnelle en quelques secondes.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
                  {['Attestations', 'Roadmaps', 'CV Technique', 'Posts LinkedIn'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-50 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-neutral-100 dark:border-neutral-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200 dark:border-neutral-800 mt-auto h-[340px] flex flex-col justify-center w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              © 2026 DocuGen Pro. All rights reserved by Aurion Labs-G.
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
              DocuGen Pro is a product of Aurion Labs-G.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
            <span>Powered by Aurion Labs-G</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'app'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [designSystem, setDesignSystem] = useState<'premium' | 'classic'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('designSystem');
      return (saved === 'classic' || saved === 'premium') ? saved : 'classic';
    }
    return 'classic';
  });

  useEffect(() => {
    localStorage.setItem('designSystem', designSystem);
  }, [designSystem]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ErrorBoundary>
      <div className={designSystem === 'classic' ? 'classic-design' : ''}>
        {currentView === 'home' ? (
          <LandingPage onStart={() => setCurrentView('app')} theme={theme} toggleTheme={toggleTheme} />
        ) : (
          <DocumentationGenerator 
            onNavigateHome={() => setCurrentView('home')} 
            theme={theme} 
            toggleTheme={toggleTheme}
            designSystem={designSystem}
            setDesignSystem={setDesignSystem}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
