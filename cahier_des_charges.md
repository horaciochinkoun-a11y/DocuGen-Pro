# Cahier des Charges

## Invite initiale
L'invite initiale demandait la création d'une application permettant de générer automatiquement des documents professionnels (attestations, résumés techniques, CV, LinkedIn) à partir des détails d'un projet. L'utilisateur a ensuite précisé le besoin d'ajouter des champs manuels (heure, lieu, statut non restreint, lien GitHub) et a signalé des erreurs de déploiement sur Cloud Run à corriger en priorité.

## Exigences fonctionnelles
- **Formulaire de saisie :** Permettre à l'utilisateur d'entrer les détails du projet (nom, client, entreprise, description, technologies, résultats, etc.).
- **Champs libres :** Le statut du développeur et le type de projet doivent accepter des entrées manuelles (datalist).
- **Génération IA :** Utiliser l'API Google Gemini pour générer 4 documents distincts en français et formatés en Markdown.
- **Exportation :** Permettre le téléchargement des documents générés en PDF et en document Word (.doc).
- **Presse-papiers :** Permettre la copie rapide du contenu généré.
- **Clé API :** Permettre à l'utilisateur de fournir sa propre clé API Gemini ou d'utiliser celle du serveur par défaut.

## Exigences non fonctionnelles
- **Performances :** L'application doit être réactive. La génération IA doit gérer les erreurs 503 (surcharge) avec un mécanisme de nouvelle tentative (retry).
- **Sécurité :** La clé API du serveur ne doit pas être exposée côté client. Les appels à Gemini doivent passer par un backend proxy.
- **Évolutivité :** L'architecture Full-Stack (React + Express) doit permettre l'ajout futur de bases de données ou de nouveaux modèles d'IA.
- **Interface :** Design professionnel, épuré, responsive (Tailwind CSS).

## Contraintes
- **Hébergement :** L'application doit être déployable sur Google Cloud Run.
- **Réseau :** Le serveur de production doit impérativement écouter sur l'hôte `0.0.0.0` et le port `3000`.
- **Dépendances :** Le build de production doit être autonome (bundling via esbuild) pour éviter les erreurs de modules introuvables au démarrage du conteneur.
