# Cahier des Charges

## Invite initiale
L'invite initiale demandait la création d'une application permettant de générer automatiquement des documents professionnels (attestations, résumés techniques, CV, LinkedIn) à partir des détails d'un projet. L'utilisateur a ensuite précisé le besoin d'ajouter des champs manuels (heure, lieu, statut non restreint, lien GitHub) et a signalé des erreurs de déploiement sur Cloud Run à corriger en priorité.

## Exigences fonctionnelles
- **Page d'accueil :** Une Landing Page de présentation de l'outil.
- **Formulaire de saisie :** Permettre à l'utilisateur d'entrer les détails du projet (nom, client, entreprise, description, technologies, résultats, etc.).
- **Champs libres :** Le statut du développeur et le type de projet doivent accepter des entrées manuelles (datalist).
- **Génération IA :** Utiliser l'API Google Gemini pour générer 4 documents distincts en français et formatés en Markdown.
- **Exportation :** Permettre le téléchargement des documents générés en PDF et en document Word (.doc).
- **Presse-papiers :** Permettre la copie rapide du contenu généré.
- **Mode Autonome :** L'application doit fonctionner sans backend, en utilisant la clé API fournie par l'utilisateur et stockée dans le `localStorage`.
- **Authentification (Optionnelle) :** Permettre la connexion via Firebase pour synchroniser la clé API.

## Exigences non fonctionnelles
- **Performances :** L'application doit être réactive. La génération IA doit gérer les erreurs 503 (surcharge) avec un mécanisme de nouvelle tentative (retry).
- **Sécurité :** La clé API de l'utilisateur est stockée localement.
- **Évolutivité :** L'architecture Frontend-First doit permettre une utilisation autonome et exportable.
- **Interface :** Design professionnel, épuré, responsive (Tailwind CSS) avec mention de l'auteur dans le footer.

## Contraintes
- **Hébergement :** L'application doit être déployable sur Google Cloud Run.
- **Réseau :** Le serveur de production doit impérativement écouter sur l'hôte `0.0.0.0` et le port `3000`.
- **Dépendances :** Le build de production doit être autonome (bundling via esbuild) pour éviter les erreurs de modules introuvables au démarrage du conteneur.
