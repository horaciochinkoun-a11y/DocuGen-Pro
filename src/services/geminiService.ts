import { GoogleGenAI, Type } from '@google/genai';

export interface GeneratedDocs {
  attestation: string;
  technicalSummary: string;
  cvVersion: string;
  linkedinVersion: string;
}

/**
 * Service pour gérer les appels à l'API Gemini.
 * Supporte le mode par défaut (clé serveur) et le mode avancé (clé utilisateur).
 */
export const generateProfessionalDocs = async (prompt: string, userApiKey?: string): Promise<GeneratedDocs> => {
  // Sélection de la clé : clé utilisateur si fournie, sinon clé par défaut injectée par la plateforme
  const apiKey = userApiKey?.trim() || (process.env.GEMINI_API_KEY as string);

  if (!apiKey) {
    throw new Error('Clé API manquante. Veuillez configurer votre clé API Gemini dans les paramètres (Mode Autonome).');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              attestation: {
                type: Type.STRING,
                description: 'Le document d\'attestation professionnelle formaté en Markdown.',
              },
              technicalSummary: {
                type: Type.STRING,
                description: 'Le résumé technique du projet formaté en Markdown.',
              },
              cvVersion: {
                type: Type.STRING,
                description: 'La version CV formatée en Markdown.',
              },
              linkedinVersion: {
                type: Type.STRING,
                description: 'La version LinkedIn formatée en Markdown.',
              },
            },
            required: ['attestation', 'technicalSummary', 'cvVersion', 'linkedinVersion'],
          },
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
