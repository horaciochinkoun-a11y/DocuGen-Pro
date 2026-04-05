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
  Settings
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

// Error Boundary Component
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

function DocumentationGenerator({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [formData, setFormData] = useState<ProjectData>(initialFormData);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof GeneratedDocs>('attestation');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Local API Key state (Standalone mode)
  const [localApiKey, setLocalApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  // Auth Listener
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

  // Profile Listener
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
      const prompt = `
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

CONTRAINTES :
- Éviter les phrases génériques.
- Être précis et crédible.
- Utiliser des résultats mesurables ou réalistes.
- NE PAS avoir l'air d'une IA.
`;

      const data = await generateProfessionalDocs(prompt, localApiKey);
      setGeneratedDocs(data);
      setActiveTab('attestation');
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
    setFormData({
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
    });
  };

  const tabs = [
    { id: 'attestation', label: 'Attestation', icon: FileText },
    { id: 'technicalSummary', label: 'Résumé Technique', icon: Code },
    { id: 'cvVersion', label: 'Version CV', icon: Briefcase },
    { id: 'linkedinVersion', label: 'Post LinkedIn', icon: Linkedin },
  ] as const;

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onNavigateHome}
            title="Retour à l'accueil"
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">DocuGen Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={fillSampleData}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:inline"
            >
              Charger des données d'exemple
            </button>

            {/* Always visible Settings/API Key button */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 p-2 px-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors border border-transparent hover:border-neutral-200"
              title="Configuration API"
            >
              <Key size={18} className={localApiKey ? "text-green-500" : "text-amber-500"} />
              <span className="hidden sm:inline text-sm font-medium">Clé API</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-neutral-200">
                <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon size={16} className="text-neutral-500" />
                  )}
                  <span className="text-sm font-medium text-neutral-700 hidden md:inline">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-all ml-2"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Connexion (Optionnel)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Modal */}
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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-neutral-200"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Configuration de l'Application
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-neutral-600">
                    <AlertCircle size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                      <Key size={16} className="text-blue-500" />
                      Votre Clé API Gemini
                    </label>
                    <input
                      type="password"
                      value={localApiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="AIza..."
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-mono"
                    />
                    <div className="text-xs text-neutral-500 space-y-1">
                      <p>✅ Stockée localement dans votre navigateur.</p>
                      <p>✅ Totalement sécurisé et indépendant.</p>
                      {user && <p>✅ Synchronisée avec votre compte cloud.</p>}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-100">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer et fermer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Détails du Projet</h2>
              <p className="text-sm text-neutral-500 mt-1">Saisissez les informations du projet pour générer la documentation professionnelle.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              
              {!localApiKey && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <Key size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Mode Autonome : Clé API requise</p>
                    <p>Pour utiliser l'application sans compte, veuillez renseigner votre propre clé API Gemini.</p>
                    <button type="button" onClick={() => setShowSettings(true)} className="mt-2 font-bold underline">Configurer la clé API</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <UserIcon size={14} className="text-neutral-400"/> Nom du Développeur
                    </label>
                    <input
                      required
                      type="text"
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-neutral-400"/> Statut
                    </label>
                    <input
                      list="status-options"
                      name="developerStatus"
                      value={formData.developerStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <UserIcon size={14} className="text-neutral-400"/> Nom du Client
                    </label>
                    <input
                      required
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Marie Martin"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Building2 size={14} className="text-neutral-400"/> Entreprise
                    </label>
                    <input
                      required
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-neutral-400"/> Heure / Date
                    </label>
                    <input
                      type="text"
                      name="manualTime"
                      value={formData.manualTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="ex: 02 Avril 2026"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Building2 size={14} className="text-neutral-400"/> Lieu
                    </label>
                    <input
                      type="text"
                      name="manualLocation"
                      value={formData.manualLocation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="ex: Paris, France"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-neutral-400"/> Durée
                    </label>
                    <input
                      required
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="ex: 3 mois"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <Laptop size={14} className="text-neutral-400"/> Type du Projet
                    </label>
                    <input
                      list="project-types"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                    <Laptop size={14} className="text-neutral-400"/> Nom du Projet
                  </label>
                  <input
                    required
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Projet Alpha"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                    <Code size={14} className="text-neutral-400"/> Lien GitHub du dépôt (Optionnel)
                  </label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="https://github.com/votre-pseudo/votre-projet"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Description</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Décrivez brièvement ce que fait le projet..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Technologies Utilisées</label>
                  <input
                    required
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="React, Node.js, PostgreSQL..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Fonctionnalités Clés Livrées</label>
                  <textarea
                    required
                    name="keyFeatures"
                    value={formData.keyFeatures}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Authentification utilisateur, intégration de paiement, tableau de bord en temps réel..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Résultats Obtenus</label>
                  <textarea
                    required
                    name="results"
                    value={formData.results}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Augmentation de la conversion de 20%, réduction du temps de chargement de 2s..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Contact Client (Optionnel)</label>
                  <input
                    type="text"
                    name="clientContact"
                    value={formData.clientContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="email@exemple.com ou numéro de téléphone"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Génération des documents...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Générer la Documentation
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8">
            {generatedDocs ? (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden h-full flex flex-col min-h-[600px]">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-neutral-200 bg-neutral-50/50 scrollbar-hide">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as keyof GeneratedDocs)}
                        className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative whitespace-nowrap ${
                          isActive ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto relative bg-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-sm sm:prose-base prose-neutral max-w-none"
                    >
                      <div className="flex justify-end mb-4 sticky top-0 z-10 gap-2">
                        <button
                          type="button"
                          onClick={exportToPDF}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors shadow-sm border border-red-100"
                        >
                          <FileDown size={14} />
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={exportToWord}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors shadow-sm border border-blue-100"
                        >
                          <Download size={14} />
                          Word
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedDocs[activeTab], activeTab)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors shadow-sm border border-neutral-200"
                        >
                          {copiedTab === activeTab ? (
                            <>
                              <CheckCircle2 size={14} className="text-green-600" />
                              <span className="text-green-700">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copier
                            </>
                          )}
                        </button>
                      </div>
                      <div id="markdown-content" className={`markdown-${activeTab} font-serif leading-relaxed text-neutral-800`}>
                        <Markdown>{generatedDocs[activeTab]}</Markdown>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] bg-neutral-50/50 rounded-2xl border border-neutral-200 border-dashed flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mb-4">
                  <FileText size={32} className="text-neutral-300" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Aucun document généré pour le moment</h3>
                <p className="text-neutral-500 max-w-md">
                  Remplissez le formulaire des détails du projet et cliquez sur générer pour créer des attestations professionnelles, des résumés techniques, des entrées de CV et des publications LinkedIn.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'app'>('home');

  return (
    <ErrorBoundary>
      {currentView === 'home' ? (
        <LandingPage onStart={() => setCurrentView('app')} />
      ) : (
        <DocumentationGenerator onNavigateHome={() => setCurrentView('home')} />
      )}
    </ErrorBoundary>
  );
}
