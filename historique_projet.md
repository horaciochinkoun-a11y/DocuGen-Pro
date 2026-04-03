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
- **Description de l’architecture globale :** Application Full-Stack avec un frontend React (SPA) et un backend Express léger servant d'API proxy et de serveur de fichiers statiques en production.
- **Technologies utilisées :**
  - **Interface utilisateur :** React 19, Vite, Tailwind CSS, Lucide React (icônes), Framer Motion (animations), React Markdown.
  - **Serveur :** Node.js, Express 5.
  - **Base de données :** Aucune (les données sont traitées en mémoire et via l'API Gemini).
  - **Hébergement :** Google Cloud Run (conteneurisé).
- **Flux de données :** Le client envoie les données du formulaire au backend Express (`/api/generate`). Le backend sécurise la requête, appelle l'API Google Gemini, récupère le JSON généré, et le renvoie au client pour affichage.

## Décisions techniques
- **Liste des principaux choix techniques :**
  - **Proxy Backend Express :** Choisi pour masquer la clé API Gemini par défaut et éviter les problèmes de CORS directs depuis le navigateur.
  - **html2pdf.js :** Utilisé pour la génération PDF côté client afin d'éviter une surcharge serveur.
  - **Esbuild pour le backend :** Utilisé pour bundler le serveur Express en un seul fichier (`dist/server.js`) incluant les dépendances, facilitant le déploiement sur Cloud Run.
- **Justification de chaque décision :** Voir le fichier `decisions_log.md` pour plus de détails.

## Historique des modifications
- **03 Avril 2026**
  - **Description :** Ajout des champs manuels (heure, lieu, statut libre, lien GitHub) et correction majeure du déploiement Cloud Run (port 3000, bind 0.0.0.0, Express 5 `*all`, bundling esbuild).
  - **Impact :** L'application est désormais déployable et fonctionnelle en production. L'utilisateur a plus de flexibilité sur les données générées.
- **03 Avril 2026**
  - **Description :** Création du système de documentation (historique, chat, cahier des charges, décisions, tâches).
  - **Impact :** Meilleure traçabilité et maintenabilité du projet.
