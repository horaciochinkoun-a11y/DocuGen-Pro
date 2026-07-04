const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const insertPoint = code.indexOf('// Servir les fichiers statiques en production');
const apiCode = `
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
    throw new Error('Réponse vide de l\\'IA.');
  } catch (err: any) {
    console.error('Erreur API Gemini:', err);
    if (err.message?.includes('API_KEY_INVALID')) {
      return res.status(401).json({ error: 'La clé API est invalide.' });
    }
    if (err.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Quota dépassé. Veuillez patienter ou utiliser votre propre clé API.' });
    }
    next(err);
  }
});
`;

code = code.substring(0, insertPoint) + apiCode + '\n' + code.substring(insertPoint);
fs.writeFileSync('server.ts', code);
