# Fiche Portfolio : DocuGen Pro

## Nom du projet
DocuGen Pro (propriété personnelle de Horacio Chinkoun)

## Résumé en une phrase
Un générateur automatisé de documentation professionnelle et contractuelle propulsé par l'intelligence artificielle pour les développeurs freelances, SaaS et porteurs de projet.

## Problème résolu
Les freelances, développeurs et porteurs de projets consacrent un temps considérable (souvent plusieurs heures par projet) à la rédaction de documents administratifs, techniques et commerciaux obligatoires ou recommandés (attestations de prestation, CV à jour, résumés techniques pour les clients, posts LinkedIn, roadmaps de projet, backlogs produit). DocuGen Pro automatise entièrement ce processus fastidieux en traduisant de simples notes de projet en livrables professionnels, normés et prêts à l'emploi en quelques secondes.

## Public cible
- **Développeurs freelances et consultants** : pour attester de leurs prestations et valoriser leurs réalisations.
- **Architectes logiciels et Directeurs Techniques (CTO)** : pour concevoir des synthèses techniques de projets.
- **Créateurs de SaaS et Entrepreneurs** : pour structurer leur pré-projet en phase d'idéation (cadrage de MVP, backlog, pitch).
- **Recruteurs et Managers** : pour analyser la stack d'un profil ou standardiser des fiches d'expérience.

## Fonctionnalités principales
- **Mode Dual-Phase** :
  - **Phase de Livraison (Completion)** : Génère une Attestation de Réalisation formelle, un Résumé Technique structuré, une Version CV d'une expérience et un Post LinkedIn optimisé pour le personal branding.
  - **Phase d'Idéation (Initiation)** : Génère une Feuille de Route Stratégique, une Recommandation d'Architecture, un Backlog Produit et un Pitch commercial d'une idée.
- **Formulaire de Saisie Intelligent** : Saisie guidée avec suggestion dynamique des statuts développeur et technologies, complétée par des champs libres (lien GitHub, Heure, Lieu).
- **Export Multi-format Côté Client** : Exportation directe en PDF (mise en page vectorielle fidèle) et Word (.doc) sans surcharge serveur.
- **Sauvegarde et Historique Local** : Système de persistance locale dans le `localStorage` conservant les 30 dernières générations, permettant le rechargement instantané d'anciens formulaires ou de documents générés, et option de suppression.
- **Visualisation de Documents Typée** : Rendu dynamique différencié et enrichi par markdown (fonds imitant le papier légal avec filigrane "CERTIFIÉ" pour les attestations, mise en page moderne pour le CV).

## Fonctionnalités avancées
- **Architecture Frontend-First Hybride (Standalone & Cloud Sync)** :
  - L'application réalise elle-même l'appel direct au SDK Gemini côté client pour éviter la latence réseau d'un proxy standard.
  - Fonctionnement totalement sans dépendance cloud (Standalone) sécurisé par stockage crypté de la clé personnelle dans le navigateur.
  - Authentification Firebase optionnelle permettant de synchroniser les préférences de clé API sur le cloud.
- **Rotation et Équilibrage des Clés API** : Mécanisme d'équilibrage et de rotation de quotas sur des clés d'environnement fournies par défaut.
- **Double Système de Design (Premium vs Classic)** : Un commutateur de design complet modifiant l'ensemble du profil esthétique (Premium : moderne, glassmorphism, courbes arrondies ; Classic : minimaliste, corporate, plat, vert émeraude, angles droits).
- **Résilience de Génération (Retry 503)** : Gestion dynamique des surcharges de l'API de modèle avec mécanisme de ré-essais automatiques.

## Mon rôle
En tant que **Lead Technique et Architecte Logiciel Senior**, j'ai dirigé la conception technique globale et l'implémentation complète de l'application :
- Définition de l'architecture découplée Frontend-First avec serveur proxy Express de secours.
- Éclaircissement des goulots d'étranglement de déploiement en configurant le bundler `esbuild` de manière autonome pour le run Express dans un environnement Google Cloud Run conteneurisé.
- Conception des algorithmes de prompt engineering pour la standardisation des 8 types de documents formels.
- Implémentation du système d'historique local dans le `localStorage` avec gestion fine de la mémoire.
- Mise en œuvre d'une charte graphique poussée et adaptative (Premium vs Classic) en pur Tailwind CSS avec transition par Framer Motion.

## Technologies utilisées
- **Frontend** : React 19, Vite, Tailwind CSS, Framer Motion (animations), React-Markdown (moteur de rendu).
- **Backend** : Node.js, Express 5 (gestion statique, configuration de secours des API routes).
- **Base de données** : Firebase Firestore (synchronisation de clé et profil utilisateur optionnels), LocalStorage (persistance locale de l'historique de 30 projets).
- **APIs** : SDK Google Gemini (`@google/genai`), Firebase Auth (Google Sign-In).
- **IA utilisée** : Modèle Gemini 1.5 pour la structuration textuelle complexe et le respect rigoureux des consignes de structure métier.

## Défis rencontrés
1. **Échecs Systématiques au Lancement du Conteneur sur Cloud Run (Erreurs 502/503)** : Les déploiements plantaient car l'image de conteneur nécessitait un port d'entrée rigoureux (`3000`) et une écoute sur l'hôte `0.0.0.0` alors que le système d'orchestration externe coupait le démarrage au bout de quelques secondes de latence.
2. **Dynamic require of "node:events" unsupported dans le bundle ESM** : En assemblant le backend Express en format ES Modules via esbuild, les paquets tiers hérités de l'environnement CommonJS provoquaient des plantages système.
3. **Erreur 403 API_KEY_SERVICE_BLOCKED sur le proxy tiers** : Les clés API partagées ou les requêtes groupées depuis le même serveur back-end étaient temporairement pénalisées par l'infrastructure cloud.

## Solutions apportées
1. **Fixation du Port et Bundling Autonome** : Configuration absolue d'Express pour lier l'application au port `3000` et à l'hôte `0.0.0.0`. Mise en place d'un script de build intégrant compiler TypeScript et bundler avec l'option `--packages=external` pour isoler proprement le serveur Express tout en laissant le runtime Node charger les modules du conteneur.
2. **Bannière d'Injection de Require CJS** : Ajout d'une directive de compilation avec esbuild injectant un polyfill dynamique de require : `import { createRequire } from 'module'; const require = createRequire(import.meta.url);` en tête de fichier pour autoriser la rétrocompatibilité ESM.
3. **Migration "Frontend-First" et Rotation de Clé** : Basculement de l'application vers un mode hybride local. Le client utilise directement le SDK `@google/genai` avec sa propre clé stockée localement dans le premier cas, ou utilise un pool de clés d'environnement avec rotation automatique gérée au frontend pour parer aux limites de quotas.

## Valeur ajoutée
DocuGen Pro renforce la crédibilité des freelances en leur fournissant des documents contractuels certifiés tout en réduisant de plus de **90 %** le temps nécessaire à la production de documentation. En phase d'idéation, il offre un bond de productivité majeur en fournissant instantanément un premier jet documenté de l'architecture et du backlog produit d'une idée de SaaS, limitant ainsi la phase de syndrome de la page blanche.

## Cas d'utilisation
- **Cas 1 (Freelance en clôture de mission)** : Un développeur freelance termine une mission de 3 mois. En complétant le formulaire de DocuGen Pro, il génère son attestation de réalisation (pour le dossier de compétences de son client), le résumé technique et un post d'annonce sur LinkedIn pour valoriser sa disponibilité et l'achèvement du projet.
- **Cas 2 (Entrepreneur SaaS en phase de cadrage)** : Un porteur d'idée souhaite cadrer son concept. Il saisit l'idée globale et sélectionne le mode "Idéation". DocuGen Pro lui fournit une roadmap sur 3 phases, une stack recommandée justifiée, et un backlog MVP structuré prêt à être importé dans Jira ou Trello.

## Ce qui différencie ce projet
Contrairement aux générateurs de texte génériques d'IA, DocuGen Pro applique une **modélisation stylistique rigoureuse par type de document** (cadres administratifs réels imitant le papier à en-tête d'entreprise, CV denses avec puces textuelles orientées impact, templates de posts LinkedIn engageants mais sans clichés d'IA). Son approche hybride d'accessibilité (utilisable instantanément sans compte, localement et sécurisé) en fait un modèle de produit "Privacy-by-Design".

## Compétences démontrées
- **Architecture Applicative** : Clean Architecture, découplage Frontend/Backend sous conteneur.
- **Cloud Engineering / DevOps** : Bundling haute performance avec esbuild, débogage et résolution d'échecs de conteneurs sur Google Cloud Run.
- **Prompt Engineering & Intégration IA** : Maîtrise avancée du SDK Gemini, modélisation de consignes de restriction et de stylisation sémantique stricte.
- **UX/UI Design de Précision** : Création de systèmes de styles réactifs dynamiques complets à la volée (thèmes Premium vs Classic) avec transition fluide (Framer Motion).
- **Sécurité et RGPD (Privacy)** : Approche de sécurité "Zero Trust" locale, authentification tierce non bloquante.

## Captures recommandées
1. **La Landing Page Épurée** : Mettant en avant l'identité sémantique personnelle de Horacio Chinkoun, le pitch d'accroche et les fonctionnalités clés sous forme de cartes.
2. **Le Formulaire de Saisie Dynamique (Desktop)** : Présentant la grille réactive de formulaires à deux colonnes avec l' Empty State engageant dans la zone de prévisualisation droite.
3. **Le Rendu de l'Attestation Certifiée** : L'écran de prévisualisation affichant la double-bordure élégante, le filigrane semi-transparent et la mise en page formelle prête à être exportée en PDF.
4. **La Modale d'Historique de Projets** : L'interface répertoriant les documents sauvegardés localement avec leurs pastilles de type (Livraison vs Idéation) et de suppression.

## Description courte pour portfolio
> DocuGen Pro est un générateur de documents professionnels par IA (Gemini) destiné aux freelances et créateurs de SaaS. Il traduit instantanément les contours d'un projet en livrables certifiés (attestations, feuilles de route, backlogs, posts LinkedIn) et offre une double interface esthétique interchangeable (Premium vs Classic) avec persistance 100% locale.

## Description moyenne pour portfolio
> DocuGen Pro (par Horacio Chinkoun) est un outil de productivité complet à destination des écosystèmes entrepreneuriaux et technologiques. Construit sur un modèle hybride d'appels IA côté client via le SDK Gemini et de synchronisation optionnelle Firebase, il permet de générer à la volée 8 types de documents formels (administratifs, techniques et commerciaux) répartis en phases de Livraison ou d'Idéation.
>
> Pensé pour les développeurs, le projet résout les problématiques d'administration chronophages. Il intègre un système d'historique local crypté et persistant dans le `localStorage` (jusqu'à 30 entrées), des fonctions d'exportation de qualité vectorielle en PDF/Word, et un commutateur de double identité visuelle (Premium SaaS versus Classic flat design). Un soin particulier a été apporté à la chaîne de déploiement en production sur Google Cloud Run, surmontant des défis d'intégration de conteneurs via un bundling esbuild sur mesure.

## Description longue pour étude de cas
> DocuGen Pro, conçu par Horacio Chinkoun, est né d'un constat simple de terrain : la documentation projet est de première importance pour l'évolution d'un professionnel de la tech, mais sa rédaction constitue une charge mentale et administrative chronophage. 
> 
> Pour y pallier, j'ai développé une solution full-stack complète découplée. Le frontend, reposant sur React 19 et Vite, adopte une architecture "Frontend-First" : toute la puissance des requêtes textuelles de l'API Gemini 1.5 est canalisée directement depuis le navigateur du visiteur. Cette approche offre trois avantages architecturaux critiques : une élimination de l'effet d'entonnoir d'un proxy serveur commun, une performance d'exécution en temps réel sans latence d'IP intermédiaire, et une sécurité "Zero Trust" de premier ordre (la clé d'API personnelle de l'utilisateur n'est jamais exposée ni envoyée à un serveur tiers non légitime). Pour les utilisateurs recherchant la portabilité, une authentification sécurisée optionnelle Google Sign-In par Firebase Auth permet de synchroniser sa configuration sur le cloud.
> 
> Un important travail d'ingénierie DevOps a été mené pour rendre l'interface de production robuste et déployable en continu sur Google Cloud Run. Les conteneurs d'intégration échouant par défaut face aux exigences réseau d'entrée et aux dépendances disparates, j'ai conçu un pipeline de build avancé via esbuild. En enveloppant le serveur avec injection de polyfills dynamiques de rétrocompatibilité pour les bibliothèques CommonJS dans des fichiers modules (.mjs), et en limitant les appels d'API Express au format strict d'Express 5 (`*all` routes et middlewares d'erreur au format JSON natif), j'ai garanti une disponibilité de l'application à 100% sans aucun crash de démarrage sur l'infrastructure d'hébergement.
> 
> Au niveau visuel, DocuGen Pro brise les codes des applications par défaut en proposant un switcher de design complet à l'utilisateur : le mode "Premium SaaS", exploitant les styles élégants de la marque personnelle de Horacio Chinkoun (effets de verre trempé, ombres satinées, typographies Playfair Display), et le mode "Classic", réintroduit par souci d'ergonomie suite aux retours de la communauté technologique (aplats, vert émeraude, réduction drastique des arrondis et suppression d'éléments collants). L'exportation côté client génère des PDF de haute qualité prêts pour signature grâce au moteur d'html2pdf optimisé de façon sémantique. L'application intègre également un système de sauvegarde d'historique local automatique qui stocke jusqu'à 30 projets sans base de données tierce.

## Mots-clés
`DocuGen Pro`, `Portfolio tech`, `React 19`, `Gemini API`, `Prompt Engineering`, `Full-Stack Javascript`, `Google Cloud Run`, `DevOps container`, `esbuild bundling`, `PWA`, `Tailwind CSS`, `Framer Motion`, `LocalStorage backup`, `Horacio Chinkoun`, `Génération de documents IA`, `Productivité de projet`, `SaaS MVP`.
