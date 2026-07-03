# Guide de Déploiement — DocuGen Pro

Ce document détaille les étapes pour déployer DocuGen Pro en production, avec un focus particulier sur l'environnement d'hébergement cible Google Cloud Run (ou alternativement Vercel).

## 🐳 Déploiement sur Google Cloud Run (Recommandé)

DocuGen Pro est conçu pour s'exécuter dans un conteneur Node.js managé et scalable.

### Étape 1 : Builder l'image Docker
Un fichier `Dockerfile` ou le service de build automatique de Cloud Run est utilisé pour packager l'application. La commande de compilation principale est :
```bash
npm run build
```
Cela produit :
1. Le dossier `dist/` contenant les assets statiques compilés pour le frontend React.
2. Le fichier `dist/server.js` contenant le serveur backend Node.js prêt à tourner.

### Étape 2 : Configurer les Variables d'Environnement
Dans la console de Google Cloud Run, ajoutez les variables suivantes :
- `GEMINI_API_KEY` : Votre clé secrète Google Gemini.
- `NODE_ENV` : `production`.
- `APP_URL` : L'URL publique fournie par Cloud Run.

### Étape 3 : Spécifier le port
Le serveur Express de production écoute sur le port **3000** (ou celui configuré par l'infrastructure). Configurez le port d'ingress sur 3000 dans Cloud Run.

---

## ⚡ Déploiement sur Vercel (Alternative SPA)

Si vous souhaitez déployer DocuGen Pro en mode SPA pure (Frontend sans backend personnalisé Express, où les appels Gemini sont faits directement côté client avec la clé d'API de l'utilisateur) :

1. Reliez votre dépôt GitHub à la console de Vercel.
2. Configurez les paramètres de build suivants :
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
3. Ajoutez les variables d'environnement dans la console de Vercel (ex: `VITE_GEMINI_API_KEY` ou laissez l'utilisateur saisir sa propre clé).
