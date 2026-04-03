# Journal des Décisions Architecturales (Decisions Log)

## Titre de la décision : Utilisation d'un Backend Express comme Proxy API
- **Date :** Avril 2026
- **Contexte :** L'application doit appeler l'API Google Gemini. Appeler l'API directement depuis le navigateur expose la clé API secrète du serveur au public.
- **Décision :** Créer un serveur Express (`server.ts`) qui agit comme intermédiaire. Le frontend React appelle ce serveur local, qui lui-même appelle Gemini.
- **Alternatives envisagées :** Appels directs depuis le client (rejeté pour des raisons de sécurité). Utilisation de Firebase Functions (rejeté pour garder une architecture simple et monobloc pour ce MVP).
- **Conséquences :** Nécessite de configurer Vite pour proxyser les requêtes en développement (`/api -> localhost:3001`) et de servir les fichiers statiques React via Express en production.

---

## Titre de la décision : Résolution des erreurs de déploiement Cloud Run
- **Date :** 03 Avril 2026
- **Contexte :** L'application échouait à démarrer sur Cloud Run (erreurs 502/503, service failed state).
- **Décision :** 
  1. Fixer le port de production à `3000` et l'hôte à `0.0.0.0`.
  2. Mettre à jour la route catch-all d'Express 5 de `*` vers `*all`.
  3. Modifier le script de build pour que `esbuild` intègre toutes les dépendances (`--bundle` sans `--packages=external`).
- **Alternatives envisagées :** Installer `node_modules` dans l'image Docker finale (non applicable directement ici car l'environnement gère le conteneur).
- **Conséquences :** Le fichier `dist/server.js` est plus volumineux mais totalement autonome, ce qui garantit un démarrage réussi sur l'infrastructure Cloud Run.
