import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Logger de requêtes pour le débogage en production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});


import { GoogleGenAI, Type } from '@google/genai';

app.post('/api/generate', async (req, res, next) => {
  try {
    const { prompt, userApiKey, mode } = req.body;
    
    // Sélection de la clé : clé utilisateur si fournie, sinon rotation des clés par défaut
    const defaultKeys = (process.env.GEMINI_API_KEY || "").split(',').map(k => k.trim()).filter(Boolean);
    const apiKey = userApiKey?.trim() || defaultKeys[Math.floor(Math.random() * defaultKeys.length)];

    if (!apiKey) {
      return res.status(401).json({ error: 'Clé API manquante. Veuillez configurer votre clé API Gemini dans les paramètres.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    if (response && response.text) {
      return res.json(JSON.parse(response.text));
    }
    throw new Error('Réponse vide de l\'IA.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erreur API Gemini:', error);
    if (error.message?.includes('API_KEY_INVALID')) {
      return res.status(401).json({ error: 'La clé API est invalide.' });
    }
    if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Quota dépassé. Veuillez patienter ou utiliser votre propre clé API.' });
    }
    next(error);
  }
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client');
  console.log(`Configuring static files from: ${clientPath}`);
  
  app.use(express.static(clientPath));
  
  // Fallback SPA : gère toutes les requêtes GET qui ne correspondent pas à un fichier statique ou à une API
  app.get('*all', (req, res, next) => {
    // Si c'est une requête API qui arrive ici, c'est une erreur 404 pour l'API
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Gestionnaire 404 personnalisé pour les routes API afin de garantir une réponse JSON
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route API non trouvée : ${req.method} ${req.path}` });
});

// Gestionnaire d'erreurs global pour garantir une réponse JSON pour les erreurs API
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
    return res.status(err.status || 500).json({
      error: err.message || 'Une erreur interne du serveur s\'est produite.',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  next(err);
});

// En développement, exécuter sur le port 3001 pour que Vite puisse faire un proxy depuis le port 3000
const ACTUAL_PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;

console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
console.log(`__dirname: ${__dirname}`);
const clientPath = path.join(__dirname, 'client');
console.log(`clientPath: ${clientPath}`);

// Vérifier si le dossier clientPath existe
if (existsSync(clientPath)) {
  console.log(`clientPath exists. Contents: ${readdirSync(clientPath).join(', ')}`);
} else {
  console.log(`WARNING: clientPath does not exist: ${clientPath}`);
}

// Seulement écouter sur le port si nous ne sommes pas dans un environnement Serverless comme Vercel
if (!process.env.VERCEL) {
  app.listen(ACTUAL_PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${ACTUAL_PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode: serving static files enabled.');
    }
  });
}

export default app;
