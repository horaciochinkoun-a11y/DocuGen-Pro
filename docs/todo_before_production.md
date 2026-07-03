# À Faire Avant Production (Todo Before Production) — DocuGen Pro

Ce document récapitule la checklist de validation finale à dérouler avant de déployer officiellement DocuGen Pro en production sous le domaine définitif.

## 📋 Checklist de Validation

### 1. Sécurité et Clés d'API
- [ ] Retirer toute clé d'API de test codée en dur dans le code source.
- [ ] S'assurer que la clé `GEMINI_API_KEY` du serveur est configurée dans l'environnement sécurisé de l'hébergeur (ex: Cloud Run secrets).
- [ ] Vérifier que la variable d'environnement `NODE_ENV` est bien positionnée sur `production`.

### 2. Expérience Utilisateur et Performance
- [ ] Tester le bon chargement des polices de caractères Inter et JetBrains Mono.
- [ ] Vérifier que le mécanisme de retry automatique sur erreur 503 fonctionne correctement en simulant une coupure réseau.
- [ ] S'assurer que le limiteur d'historique de 30 projets bloque proprement les nouvelles entrées sans faire planter l'application.

### 3. Progressive Web App (PWA)
- [ ] Valider que les icônes de l'application (Favicon, Apple Touch Icon, Android Icon) se chargent et s'affichent correctement sur mobile et desktop.
- [ ] Tester l'installation de la PWA sur un smartphone physique (Android et iOS).
- [ ] Valider la réception de la notification de mise à jour ("Nouvelle version disponible !").

### 4. Juridique et RGPD
- [ ] S'assurer que les mentions légales (`LEGAL_MENTIONS.md`) et les CGU (`TERMS_OF_SERVICE.md`) sont à jour avec les coordonnées réelles de l'éditeur (Horacio Chinkoun).
- [ ] Vérifier que le fichier `LICENSE` propriétaire est bien présent à la racine du dépôt public.
- [ ] Valider qu'aucune information personnelle sensible (comme les clés d'API utilisateur) n'est envoyée vers des serveurs d'analyse tiers.

### 5. SEO et Référencement
- [ ] Vérifier que la balise `<link rel="canonical">` dans `index.html` pointe vers l'adresse finale officielle de l'application.
- [ ] Tester la validité de la meta description Open Graph lors d'un partage sur les réseaux sociaux (LinkedIn, Twitter, etc.).
