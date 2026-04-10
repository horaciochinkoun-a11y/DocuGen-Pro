import { GoogleGenAI, Type } from '@google/genai';

export interface GeneratedDocs {
  // Mode Completion (Default)
  attestation?: string;
  technicalSummary?: string;
  cvVersion?: string;
  linkedinVersion?: string;
  
  // Mode Initiation
  roadmap?: string;
  architecture?: string;
  backlog?: string;
  pitch?: string;
}

/**
 * Service pour gérer les appels à l'API Gemini.
 * Supporte le mode par défaut (clé serveur) et le mode avancé (clé utilisateur).
 */
export const generateProfessionalDocs = async (
  prompt: string, 
  userApiKey?: string,
  mode: 'initiation' | 'completion' = 'completion'
): Promise<GeneratedDocs> => {
  // Sélection de la clé : clé utilisateur si fournie, sinon rotation des clés par défaut
  const defaultKeys = ((import.meta.env.VITE_GEMINI_API_KEY as string) || (process.env.GEMINI_API_KEY as string) || "").split(',').map(k => k.trim()).filter(Boolean);
  const apiKey = userApiKey?.trim() || defaultKeys[Math.floor(Math.random() * defaultKeys.length)];

  if (!apiKey) {
    throw new Error('Clé API manquante. Veuillez configurer votre clé API Gemini dans les paramètres (Mode Autonome).');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  let retries = 0;
  const maxRetries = 2;

  const schema = mode === 'completion' ? {
    type: Type.OBJECT,
    properties: {
      attestation: { type: Type.STRING, description: 'Attestation professionnelle Markdown' },
      technicalSummary: { type: Type.STRING, description: 'Résumé technique Markdown' },
      cvVersion: { type: Type.STRING, description: 'Version CV Markdown' },
      linkedinVersion: { type: Type.STRING, description: 'Post LinkedIn Markdown' },
    },
    required: ['attestation', 'technicalSummary', 'cvVersion', 'linkedinVersion'],
  } : {
    type: Type.OBJECT,
    properties: {
      roadmap: { type: Type.STRING, description: 'Feuille de route et jalons Markdown' },
      architecture: { type: Type.STRING, description: 'Architecture et Stack recommandée Markdown' },
      backlog: { type: Type.STRING, description: 'Backlog initial et MVP Markdown' },
      pitch: { type: Type.STRING, description: 'Pitch et stratégie de lancement Markdown' },
    },
    required: ['roadmap', 'architecture', 'backlog', 'pitch'],
  };

  while (retries <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      if (response && response.text) {
        return JSON.parse(response.text) as GeneratedDocs;
      }
      throw new Error('Réponse vide de l\'IA.');

    } catch (err: unknown) {
      const error = err as Error;
      const isRetryable = error.message?.includes('503') || 
                          error.message?.includes('UNAVAILABLE') || 
                          error.message?.includes('high demand');
      
      if (isRetryable && retries < maxRetries) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        continue;
      }
      
      // Gestion des erreurs spécifiques pour le SaaS
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error(userApiKey ? 'Votre clé API est invalide.' : 'La clé API par défaut est invalide.', { cause: err });
      }
      if (error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('Quota dépassé. Veuillez patienter ou utiliser votre propre clé API.', { cause: err });
      }
      
      throw error;
    }
  }
  
  throw new Error('Échec de la génération après plusieurs tentatives.');
};
