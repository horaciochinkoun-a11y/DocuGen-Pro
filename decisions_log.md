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

---

## Titre de la décision : Architecture Frontend-First pour Gemini
- **Date :** 05 Avril 2026
- **Contexte :** Les appels à l'API Gemini depuis le backend étaient bloqués (Erreur 403) et la gestion dual-mode des clés API était complexe à sécuriser via un proxy.
- **Décision :** Déplacer toute la logique de génération de contenu vers le frontend en utilisant le SDK `@google/genai`.
- **Alternatives envisagées :** Utiliser des Cloud Functions (plus complexe à mettre en œuvre rapidement).
- **Conséquences :** Meilleure performance (moins de latence réseau), résolution des blocages IP serveur, et gestion simplifiée des clés API utilisateurs.

---

## Titre de la décision : Utilisation de --packages=external pour le bundle serveur
- **Date :** 05 Avril 2026
- **Contexte :** Le bundling complet des dépendances Node.js provoquait des erreurs complexes liées aux modules natifs et aux requires dynamiques.
- **Décision :** Utiliser `--packages=external` avec `esbuild` pour ne bundler que le code source de l'application, laissant les dépendances être gérées par le runtime Node.js via `node_modules`.
- **Alternatives envisagées :** Continuer à bundler avec des bannières complexes (trop fragile).
- **Conséquences :** Nécessite que `node_modules` soit présent dans l'environnement de production (standard sur Cloud Run).

---

## Titre de la décision : Garantie des réponses JSON pour les routes API
- **Date :** 05 Avril 2026
- **Contexte :** En production, les erreurs 404 ou les erreurs de middleware sur les routes `/api` renvoyaient par défaut une page HTML (le fallback SPA), provoquant une erreur de parsing JSON côté client.
- **Décision :** 
  1. Utiliser `app.get('*', ...)` avec un check `req.path.startsWith('/api')` pour ne pas intercepter les appels API dans le fallback SPA.
  2. Ajouter un middleware `app.use('/api', ...)` pour capturer les 404 API et renvoyer du JSON.
  3. Ajouter un gestionnaire d'erreurs global qui renvoie du JSON si le chemin commence par `/api`.
- **Alternatives envisagées :** Gérer les erreurs individuellement dans chaque route (trop verbeux et risqué).
- **Conséquences :** Le frontend reçoit toujours un objet JSON même en cas d'erreur serveur ou de route inexistante, permettant d'afficher des messages d'erreur propres au lieu d'un crash de parsing.

---

## Titre de la décision : Support des dépendances CommonJS dans un bundle ESM (esbuild)
- **Date :** 05 Avril 2026
- **Contexte :** Le bundling complet du serveur avec `esbuild` en format ESM provoquait une erreur `Dynamic require of "node:events" is not supported` au runtime, car certaines dépendances (comme Express) utilisent `require` en interne.
- **Décision :** Ajouter un banner `createRequire` au script de build esbuild : `--banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);"`.
- **Alternatives envisagées :** Revenir à un format CJS (rejeté car le projet est configuré en `type: module`). Ne pas bundler les dépendances (rejeté pour garantir l'autonomie du déploiement).
- **Conséquences :** Le bundle ESM peut désormais exécuter du code CJS qui utilise `require` de manière dynamique, résolvant ainsi les plantages au démarrage sur Cloud Run.

---

## Titre de la décision : Optimisation SEO et Charte Graphique
- **Date :** 08 Avril 2026
- **Contexte :** L'application manquait de visibilité sur les moteurs de recherche et de documentation sur son identité visuelle.
- **Décision :** 
  1. Implémenter une stratégie SEO complète (Meta tags, Open Graph, Twitter Cards).
  2. Créer un document de référence pour la charte graphique.
- **Alternatives envisagées :** Utiliser un plugin SEO automatique (rejeté pour garder un contrôle total sur les balises).
- **Conséquences :** Amélioration du taux de clic lors du partage sur les réseaux sociaux et cohérence visuelle accrue pour les futurs développements.
