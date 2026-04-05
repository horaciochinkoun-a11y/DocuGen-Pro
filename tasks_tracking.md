# Suivi des Tâches (Tasks Tracking)

## Fonctionnalités implémentées
- [x] Interface utilisateur (formulaire et visualisation des résultats).
- [x] Architecture "Frontend-First" pour l'IA (sécurité et performance).
- [x] Intégration de Firebase Auth (Google Login).
- [x] Intégration de Firestore pour les profils utilisateurs et préférences.
- [x] Mode Dual-Clé : Utilisation de la clé système ou d'une clé utilisateur personnalisée.
- [x] Génération de 4 documents (Attestation, Résumé, CV, LinkedIn).
- [x] Exportation en PDF (via html2pdf.js).
- [x] Exportation en Word (.doc).
- [x] Copie dans le presse-papiers.
- [x] Champs de saisie manuelle pour l'heure, le lieu, et le lien GitHub.
- [x] Datalists pour permettre la saisie libre sur le statut et le type de projet.
- [x] Gestion des erreurs API (retry sur 503, messages clairs pour quota/clé invalide).
- [x] ErrorBoundary pour la capture et l'affichage des erreurs critiques.

## Bogues corrigés
- [x] Échec du déploiement Cloud Run (Port binding 0.0.0.0:3000).
- [x] Erreur de routage Express 5 (remplacement de `*` par `*all`).
- [x] Dépendances manquantes en production (bundling complet avec esbuild).
- [x] Erreur `Dynamic require of "node:events"` (ajout du banner createRequire).
- [x] Erreur `Unexpected token '<'` en production (garantie des réponses JSON sur `/api`).
- [x] Optimisation du build serveur (`--packages=external` et logs améliorés).
- [x] Résolution de l'erreur 403 Gemini en passant par le SDK Frontend.

## Tâches en cours
- [ ] Maintenance et mise à jour continue de la documentation du projet.
- [ ] Surveillance de la stabilité du déploiement suite aux dernières corrections.
