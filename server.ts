import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    const providedKey = apiKey?.trim();
    const finalApiKey = providedKey || process.env.GEMINI_API_KEY;

    if (!finalApiKey) {
      return res.status(400).json({ error: 'La clé API Gemini est manquante. Veuillez en fournir une dans le formulaire.' });
    }

    if (finalApiKey && !finalApiKey.startsWith('AIza')) {
      return res.status(400).json({ 
        error: 'La clé API fournie semble invalide (elle doit commencer par "AIza"). Si vous n\'en avez pas, laissez le champ vide pour utiliser la clé du serveur.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: finalApiKey });

    let response;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        response = await ai.models.generateContent({
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
        break; // Success, exit loop
      } catch (err: unknown) {
        const error = err as Error;
        const isUnavailable = error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.message?.includes('high demand');
        if (isUnavailable && retries < maxRetries) {
          retries++;
          console.log(`Model busy, retry ${retries}/${maxRetries} after delay...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
          continue;
        }
        throw err; // Re-throw if not a retryable error or max retries reached
      }
    }

    if (response && response.text) {
      const parsedDocs = JSON.parse(response.text);
      return res.json(parsedDocs);
    } else {
      throw new Error('Échec de la génération du contenu.');
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('API Route Error:', error);
    
    let errorMessage = 'Une erreur inattendue s\'est produite lors de la génération.';
    const errorString = JSON.stringify(error);
    
    if (error.message?.includes('API key not valid') || error.message?.includes('API_KEY_INVALID') || errorString.includes('API_KEY_INVALID')) {
      if (providedKey) {
        errorMessage = 'La clé API fournie dans le formulaire est invalide. Veuillez vérifier votre clé API Gemini.';
      } else {
        errorMessage = 'La clé API du serveur est invalide. Veuillez fournir votre propre clé API Gemini dans le formulaire.';
      }
    } else if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED') || errorString.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'Le quota de l\'API a été dépassé. Veuillez patienter quelques instants ou utiliser votre propre clé API Gemini pour augmenter les limites.';
    } else if (error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.message?.includes('high demand')) {
      errorMessage = 'Le service Gemini est actuellement saturé. Veuillez patienter quelques secondes et réessayer.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({ error: errorMessage });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client');
  app.use(express.static(clientPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
// In dev, run on 3001 so Vite can proxy from 3000
const ACTUAL_PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;

console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
console.log(`__dirname: ${__dirname}`);
console.log(`clientPath: ${path.join(__dirname, 'client')}`);

app.listen(ACTUAL_PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${ACTUAL_PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving static files from dist/client');
  }
});
