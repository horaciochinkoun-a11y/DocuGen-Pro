# Architecture et Structure du Projet DocuGen Pro

Ce document détaille l'organisation du code source, le rôle de chaque fichier et dossier, ainsi que les concepts architecturaux clés du projet. Il sert de guide de référence pour tout développeur intervenant sur l'application.

## 📂 Arborescence Globale

```text
/
├── src/                        # Code source principal (Frontend React)
│   ├── components/             # Composants UI réutilisables
│   │   └── LandingPage.tsx     # Page d'accueil de présentation
│   ├── services/               # Logique métier et appels API externes
│   │   └── geminiService.ts    # Intégration de l'IA Google Gemini
│   ├── App.tsx                 # Composant racine, routage et état global
│   ├── main.tsx                # Point d'entrée React (montage dans le DOM)
│   ├── index.css               # Styles globaux (Tailwind CSS + Design System)
│   └── firebase.ts             # Configuration et initialisation de Firebase
├── server.ts                   # Serveur Express (Backend de production)
├── package.json                # Dépendances et scripts du projet (npm)
├── vite.config.ts              # Configuration du bundler Vite
├── tsconfig.json               # Configuration TypeScript
├── firebase-applet-config.json # Identifiants du projet Firebase
├── firebase-blueprint.json     # Schéma de base de données Firestore (IR)
├── firestore.rules             # Règles de sécurité de la base de données
└── *.md                        # Fichiers de documentation et de suivi
```

---

## 🔍 Détail des Dossiers et Fichiers

### 1. Dossier `src/` (Frontend)
C'est le cœur de l'application côté client. Il contient toute l'interface utilisateur et la logique d'interaction.

*   **`App.tsx`** : Le chef d'orchestre.
    *   **Responsabilités** : Gère l'état global (thème clair/sombre, système de design Premium/Classic, authentification), le routage conditionnel (Landing Page vs Application), la gestion des erreurs (`ErrorBoundary`), et l'interface principale du générateur de documents.
    *   **Importance** : Critique. C'est le point de convergence de toutes les fonctionnalités.
*   **`main.tsx`** : Le point d'entrée technique.
    *   **Responsabilités** : Initialise React et attache `App.tsx` au document HTML (`#root`).
*   **`index.css`** : Le chef d'orchestre visuel.
    *   **Responsabilités** : Importe Tailwind CSS, définit les polices (Google Fonts), et surtout, déclare les variables CSS pour les deux systèmes de design (`Premium` par défaut et `.classic-design` pour le mode brut). Il contient aussi les styles spécifiques pour le rendu Markdown des documents générés.
*   **`firebase.ts`** : Le pont vers la base de données.
    *   **Responsabilités** : Initialise la connexion à Firebase (Auth et Firestore) en utilisant les variables d'environnement ou le fichier de configuration. Exporte les instances utilisables dans le reste de l'application.

### 2. Dossier `src/components/` (Interface Utilisateur)
Contient les composants React isolés et réutilisables.

*   **`LandingPage.tsx`** : La vitrine.
    *   **Responsabilités** : Afficher la page d'accueil avec les animations (Framer Motion), présenter les fonctionnalités, et inciter l'utilisateur à démarrer l'expérience.
    *   **Importance** : Majeure pour l'acquisition et l'expérience utilisateur (UX) initiale.

### 3. Dossier `src/services/` (Logique Métier & API)
Isole la logique complexe et les appels aux services tiers pour garder les composants UI propres.

*   **`geminiService.ts`** : Le moteur d'Intelligence Artificielle.
    *   **Responsabilités** : Construire les requêtes (prompts) envoyées à l'API Google Gemini, gérer la rotation des clés API par défaut, forcer le format de réponse en JSON (Structured Outputs), et gérer les erreurs (retry automatique en cas de surcharge 503).
    *   **Importance** : Critique. C'est le cœur de la proposition de valeur de l'application (génération de documents).

### 4. Racine du Projet (Configuration & Backend)

*   **`server.ts`** : Le serveur de production.
    *   **Responsabilités** : Servir les fichiers statiques (Frontend compilé) en production via Express. Gérer le fallback SPA (rediriger les requêtes vers `index.html` pour que React Router gère l'URL). Fournir des logs de requêtes.
    *   **Importance** : Indispensable pour le déploiement sur Google Cloud Run.
*   **`package.json`** : La carte d'identité du projet.
    *   **Responsabilités** : Lister les dépendances (React, Tailwind, Gemini SDK, etc.) et définir les scripts de lancement (`npm run dev`, `npm run build`, `npm run start`).
*   **`vite.config.ts`** : Le constructeur.
    *   **Responsabilités** : Configurer la façon dont le code est compilé, minifié et packagé pour la production.
*   **Fichiers Firebase (`firebase-*.json`, `firestore.rules`)** :
    *   **Responsabilités** : Sécuriser l'accès aux données (règles) et définir la structure attendue de la base de données.

### 5. Documentation (Gestion de Projet)
Ces fichiers assurent la pérennité et la traçabilité du projet.

*   **`cahier_des_charges.md`** : Ce que l'application doit faire (exigences, contraintes).
*   **`historique_projet.md`** : Ce qui a été fait (changelog chronologique).
*   **`tasks_tracking.md`** : Ce qui reste à faire (To-Do list, bugs connus).
*   **`decisions_log.md`** : Pourquoi les choses ont été faites ainsi (choix architecturaux).
*   **`chat_history.md`** : La mémoire brute des échanges de conception.
*   **`structure_projet.md`** : Ce document même.

---

## 🔄 Flux de Données (Data Flow) & Concepts Clés
*(Éléments supplémentaires pour une compréhension globale)*

1.  **Architecture "Frontend-First"** : L'application est conçue pour fonctionner de manière autonome dans le navigateur. Le backend (`server.ts`) ne sert qu'à distribuer l'application, il n'y a pas d'API intermédiaire pour la génération. Le navigateur communique directement avec l'API Gemini.
2.  **Gestion des Clés API (Sécurité)** :
    *   L'utilisateur peut entrer sa propre clé API (stockée dans le `localStorage` du navigateur).
    *   S'il n'en a pas, l'application utilise un pool de clés serveur (rotation aléatoire) pour éviter de dépasser les quotas gratuits de Google.
3.  **Système de Design Hybride** : L'application embarque deux feuilles de style. Le changement de mode (Premium vs Classic) modifie une classe CSS à la racine (`<div className="classic-design">`), ce qui surcharge instantanément les variables CSS (couleurs, ombres, bordures) sans recharger la page.
4.  **Résilience de l'IA** : Le service `geminiService.ts` implémente un mécanisme de "Retry" exponentiel. Si l'API de Google est surchargée (Erreur 503), l'application attend quelques secondes et réessaie automatiquement avant d'afficher une erreur à l'utilisateur.
