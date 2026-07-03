# Transfert de Projet (Project Handover) — DocuGen Pro

Ce document sert de guide de transition pour tout développeur ou équipe reprenant la maintenance ou l'évolution de DocuGen Pro.

## 📌 Présentation Rapide
DocuGen Pro est un générateur de documentation professionnelle intelligent destiné aux freelances et créateurs de projets SaaS. Il automatise la rédaction de livrables formels (attestations, rapports techniques, CV, etc.) grâce à l'IA.

## 🏗️ Architecture Technique Récapitulative
- **Frontend** : React (v19) + Vite (v8) + Tailwind CSS (v4) + Framer Motion (animations).
- **Backend** : Serveur Express simple (`server.ts`) configuré pour servir les fichiers statiques en production et gérer le routage SPA.
- **Base de données** : 100% locale par défaut (`localStorage`). Intégration optionnelle de Firebase Firestore pour la synchronisation.
- **Génération Word** : Utilisation de la bibliothèque native `docx` pour produire des fichiers `.docx` hautement professionnels et épurés directement depuis le navigateur.

## 🔑 Éléments Nécessitant une Attention Particulière
1. **Migration LocalStorage** : Si le nombre de documents sauvegardés augmente, il faudra migrer du `localStorage` vers `IndexedDB` pour dépasser la limite de 5 Mo (voir `docs/known_limitations.md`).
2. **Clés Gemini** : Les quotas de l'API Gemini gratuite peuvent être limités. Pour une mise en production commerciale de grande échelle, il est recommandé de faire transiter les appels par un micro-service de proxy serveur payant avec authentification utilisateur pour protéger les clés secrètes.
3. **Mises à jour PWA** : Le service worker gérant la PWA (Vite PWA Plugin) est configuré pour notifier l'utilisateur lorsqu'une mise à jour est disponible. Veillez à tester rigoureusement la mise en cache des assets lors des déploiements.

## ⚙️ Commandes Essentielles pour la Reprise
- `npm install` : Installation des dépendances.
- `npm run dev` : Lancement en mode local.
- `npm run lint` : Vérification du linter.
- `npm run build` : Compilation complète de production.
- `npm run start` : Lancement du serveur de production compilé.
