# Suivi des Tâches (Tasks Tracking)

## Fonctionnalités implémentées
- [x] Interface utilisateur (formulaire et visualisation des résultats).
- [x] Intégration de l'API Google Gemini via un backend Express.
- [x] Génération de 4 documents (Attestation, Résumé, CV, LinkedIn).
- [x] Exportation en PDF (via html2pdf.js).
- [x] Exportation en Word (.doc).
- [x] Copie dans le presse-papiers.
- [x] Champs de saisie manuelle pour l'heure, le lieu, et le lien GitHub.
- [x] Datalists pour permettre la saisie libre sur le statut et le type de projet.
- [x] Gestion des erreurs API (retry sur 503, messages clairs pour quota/clé invalide).

## Bogues corrigés
- [x] Échec du déploiement Cloud Run (Port binding 0.0.0.0:3000).
- [x] Erreur de routage Express 5 (remplacement de `*` par `*all`).
- [x] Dépendances manquantes en production (bundling complet avec esbuild).

## Tâches en cours
- [ ] Maintenance et mise à jour continue de la documentation du projet.
- [ ] Surveillance de la stabilité du déploiement suite aux dernières corrections.
