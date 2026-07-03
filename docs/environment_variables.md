# Variables d'Environnement — DocuGen Pro

Ce document répertorie et explique les variables d'environnement utilisées par DocuGen Pro en développement et en production.

## Configuration Principale

### 🤖 Services d'Intelligence Artificielle (Gemini API)

#### `GEMINI_API_KEY`
- **Description** : Clé API secrète utilisée par le serveur backend pour effectuer les appels vers l'API Google Gemini via le SDK `@google/genai`.
- **Portée** : Serveur uniquement (`server.ts`).
- **Sécurité** : **Critique**. Ne doit jamais être exposée dans le navigateur ou partagée publiquement.
- **Exemple** : `AIzaSy...`

#### `VITE_GEMINI_API_KEY`
- **Description** : Clé d'API publique optionnelle exposée côté client pour les exécutions directes si l'utilisateur n'utilise pas de clés personnelles ou si la passerelle serveur n'est pas sollicitée.
- **Portée** : Client uniquement (Vite).
- **Exemple** : `AIzaSy...`

### 🌐 Métadonnées de l'Application

#### `APP_URL`
- **Description** : L'URL canonique de déploiement où l'application est hébergée en production. Utilisée pour le SEO et les métadonnées de partage Open Graph.
- **Exemple** : `https://ais-pre-q43ulohc7kvdx6uhwkngzg-145910217857.europe-west3.run.app`

## Instructions de Configuration
1. En local, créez un fichier `.env` à la racine à partir du modèle `.env.example`.
2. Sur l'environnement de déploiement cloud (Cloud Run ou Vercel), configurez ces variables dans les paramètres de la console d'administration.
