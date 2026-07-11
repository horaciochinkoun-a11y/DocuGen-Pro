const fs = require('fs');
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');

code = `
import { GeneratedDocs } from '../types';

/**
 * Service pour gérer les appels à l'API Gemini via notre backend.
 * Supporte le mode par défaut (clé serveur) et le mode avancé (clé utilisateur).
 */
export const generateProfessionalDocs = async (
  prompt: string, 
  userApiKey?: string,
  mode: 'initiation' | 'completion' = 'completion'
): Promise<GeneratedDocs> => {
  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          userApiKey,
          mode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || \`HTTP error! status: \${response.status}\`);
      }

      return await response.json() as GeneratedDocs;
    } catch (err: unknown) {
      const error = err as Error;
      const isRetryable = error.message?.includes('503') || 
                          error.message?.includes('UNAVAILABLE') || 
                          error.message?.includes('high demand') ||
                          error.message?.includes('502');
          
      if (isRetryable && retries < maxRetries) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        continue;
      }
          
      throw error;
    }
  }
  
  throw new Error('Échec de la génération après plusieurs tentatives.');
};
`;

fs.writeFileSync('src/services/geminiService.ts', code);
