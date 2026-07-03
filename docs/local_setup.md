# Configuration Locale (Local Setup) — DocuGen Pro

Ce guide vous aide à installer, exécuter et tester DocuGen Pro sur votre machine de développement locale.

## Prérequis
- **Node.js** : v20.x ou supérieure (recommandé v20.x LTS)
- **npm** : v10.x ou supérieure

## Étape 1 : Cloner et naviguer dans le projet
```bash
git clone <url-du-depot>
cd <nom-du-dossier>
```

## Étape 2 : Installer les dépendances
```bash
npm install
```

## Étape 3 : Configurer les variables d'environnement
Copiez le fichier d'exemple pour créer votre fichier `.env` local :
```bash
cp .env.example .env
```
Renseignez vos clés dans le fichier `.env` (notamment `GEMINI_API_KEY` pour le serveur ou configurez-la dans l'interface de l'application).

## Étape 4 : Lancer en mode développement
Cette commande lance simultanément le serveur Express et le serveur de développement Vite via `concurrently` :
```bash
npm run dev
```
L'application est alors accessible localement à l'adresse suivante :
`http://localhost:3000` (ou le port spécifié).

## Étape 5 : Lancer le Linter (Vérification du code)
Pour valider que le code respecte les standards de qualité et de type du projet :
```bash
npm run lint
```

## Étape 6 : Compiler pour la production
Pour tester le build de production localement :
```bash
npm run build
```
Cette commande compile le frontend React dans `dist/` et compile le serveur TypeScript dans `dist/server.js` à l'aide d'esbuild.

## Étape 7 : Démarrer le build de production
Pour exécuter l'application compilée en conditions réelles de production :
```bash
npm run start
```
