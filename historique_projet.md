# Historique du Projet et Vue d'Ensemble Technique

## Présentation du projet
- **Nom du projet :** DocuGen Pro
- **Objectif :** Générer automatiquement des documents professionnels (attestations de prestation, résumés techniques, versions CV, posts LinkedIn) à partir des détails d'un projet freelance ou SaaS en utilisant l'IA (Gemini).
- **Utilisateurs cibles :** Développeurs freelances, chefs de projet, architectes logiciels, créateurs de SaaS.
- **Fonctionnalités principales :**
  - Formulaire de saisie détaillé (nom, client, entreprise, durée, technologies, etc.).
  - Champs personnalisables (heure, lieu, statut du développeur, lien GitHub).
  - Génération de 4 types de documents via l'API Gemini.
  - Exportation en PDF et Word.
  - Copie dans le presse-papiers.
  - Gestion sécurisée de la clé API (serveur ou utilisateur).

## Architecture
- **Description de l’architecture globale :** Application Full-Stack avec un frontend React (SPA) gérant directement les appels à l'IA (Gemini SDK) et un backend Express servant uniquement les fichiers statiques et les futures routes d'administration.
- **Technologies utilisées :**
  - **Interface utilisateur :** React 19, Vite, Tailwind CSS, Lucide React, Framer Motion, React Markdown, @google/genai (SDK).
  - **Serveur :** Node.js, Express 5 (Service statique uniquement).
  - **Base de données :** Aucune (les données sont traitées en mémoire et via l'API Gemini).
  - **Hébergement :** Google Cloud Run (conteneurisé).
- **Flux de données :** Le client gère directement la génération de documents via le SDK Google Gemini (`@google/genai`). Les données du formulaire sont envoyées à l'IA, et les documents générés sont affichés et exportés localement. Le backend sert uniquement de serveur de fichiers statiques.

## Décisions techniques
- **Liste des principaux choix techniques :**
  - **Proxy Backend Express :** Choisi pour masquer la clé API Gemini par défaut et éviter les problèmes de CORS directs depuis le navigateur.
  - **html2pdf.js :** Utilisé pour la génération PDF côté client afin d'éviter une surcharge serveur.
  - **Esbuild pour le backend :** Utilisé pour bundler le serveur Express en un seul fichier (`dist/server.js`) incluant les dépendances, facilitant le déploiement sur Cloud Run.
- **Justification de chaque décision :** Voir le fichier `decisions_log.md` pour plus de détails.

## Historique des modifications
- **05 Avril 2026**
  - **Description :** Implémentation d'un commutateur de thème (Mode Clair / Mode Sombre) avec persistance via `localStorage` et détection des préférences système.
  - **Impact :** Amélioration de l'expérience utilisateur et de l'accessibilité visuelle.
- **05 Avril 2026**
  - **Description :** Ajout de `firebase-applet-config.json` au fichier `.gitignore` pour éviter l'exposition de la clé API Firebase sur GitHub (résolution de l'alerte de sécurité "Secret scanning").
  - **Impact :** Amélioration de la sécurité du dépôt Git.
- **05 Avril 2026**
  - **Description :** Validation et conservation du design "Document Officiel" pour l'onglet Attestation (Bordure institutionnelle double et Filigrane "CERTIFIÉ" en arrière-plan).
  - **Impact :** Amélioration visuelle majeure du rendu de l'attestation, renforçant sa crédibilité professionnelle.
- **05 Avril 2026**
  - **Description :** Modification de la mention du footer pour la passer en anglais : "CREATED BY HORACIO CHINKOUN" (toujours en majuscules et sur une ligne dédiée).
  - **Impact :** Respect des consignes de signature.
- **05 Avril 2026**
  - **Description :** Mise à jour du footer de la page d'accueil avec la mention "CRÉÉ PAR HORACIO CHINKOUN" en majuscules sur une ligne dédiée. Rétablissement et amélioration du bouton de données d'exemple (3 profils aléatoires, visible sur mobile).
  - **Impact :** Amélioration de l'UX (données d'exemple) et respect des consignes de signature.
- **05 Avril 2026**
  - **Description :** Rendu de l'application 100% autonome (Standalone Mode). Firebase Auth devient optionnel, la clé API est stockée dans le `localStorage` et le bouton de génération est accessible sans compte.
  - **Impact :** L'application peut être exportée et utilisée sur n'importe quel navigateur ou hébergement sans dépendre d'AI Studio ou d'une base de données.
- **05 Avril 2026**
  - **Description :** Intégration de Firebase (Auth & Firestore) et mise en place d'un ErrorBoundary.
  - **Impact :** Possibilité de se connecter pour synchroniser ses préférences (clé API personnalisée) sur le cloud.
- **05 Avril 2026**
  - **Description :** Migration vers une architecture "Frontend-First" pour les appels Gemini. Création de `geminiService.ts` côté client et suppression de la route proxy `/api/generate`.
  - **Impact :** Résolution définitive de l'erreur 403 `API_KEY_SERVICE_BLOCKED` et amélioration de la sécurité des clés API.
- **05 Avril 2026**
  - **Description :** Optimisation du processus de build et du serveur. Passage à `--packages=external` pour esbuild, ajout de vérifications de l'existence des fichiers statiques au démarrage, et correction de bugs mineurs (imports ESM, variables inutilisées).
  - **Impact :** Déploiement plus robuste et meilleur diagnostic en production.
- **05 Avril 2026**
  - **Description :** Résolution de l'erreur `Unexpected token '<'` en production. Amélioration du routage Express 5, ajout d'un gestionnaire d'erreurs global pour garantir des réponses JSON sur `/api`, et ajout de logs de requête.
  - **Impact :** L'application fonctionne désormais correctement en dehors de l'environnement de développement.
- **05 Avril 2026**
  - **Description :** Résolution de l'erreur `Dynamic require of "node:events" is not supported` lors du déploiement. Ajout d'un banner `createRequire` dans le build esbuild pour supporter les dépendances CommonJS dans un bundle ESM.
  - **Impact :** Le serveur démarre désormais correctement sur Cloud Run malgré le bundling complet.
- **03 Avril 2026**
  - **Description :** Ajout des champs manuels (heure, lieu, statut libre, lien GitHub) et correction majeure du déploiement Cloud Run (port 3000, bind 0.0.0.0, Express 5 `*all`, bundling esbuild).
  - **Impact :** L'application est désormais déployable et fonctionnelle en production. L'utilisateur a plus de flexibilité sur les données générées.
- **03 Avril 2026**
  - **Description :** Création du système de documentation (historique, chat, cahier des charges, décisions, tâches).
  - **Impact :** Meilleure traçabilité et maintenabilité du projet.
