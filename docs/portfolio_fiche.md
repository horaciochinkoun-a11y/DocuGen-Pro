# Fiche Portfolio : DocuGen Pro (produit de Aurion Labs-G)

## Nom du projet
**DocuGen Pro** (by **Aurion Labs-G**)

## Résumé en une phrase
Un outil web full-stack d'automatisation de la documentation professionnelle et technique propulsé par l'IA (Gemini SDK), conçu spécifiquement pour les développeurs freelances, SaaS et porteurs de projet.

---

## Problème résolu
Les freelances et porteurs de projets perdent un temps précieux (souvent estimé à plusieurs dizaines d'heures par an) à concevoir et consolider la documentation écrite associée à la clôture ou au lancement d'un projet. Côté **livraison**, il s'agit de rédiger des attestations juridico-commerciales, des résumés techniques crédibles pour les clients, de restructurer un CV, ou de créer des posts LinkedIn engageants pour leur image de marque. Côté **idéation**, le challenge est de transformer une concept-board floue en roadmap produit saine, en architecture logicielle cohérente ou en backlog de MVP. DocuGen Pro résout ces frictions à travers un framework unifié capable de générer instantanément des documents de niveau exécutif à partir de simples descriptions et métadonnées.

---

## Public cible
- **Développeurs freelances et consultants indépendants** : pour automatiser la contractualisation de fin de mission et valoriser leur e-réputation professionnelle.
- **Architectes logiciels et Directeurs de Projet (CTO/Lead Dev)** : pour normaliser les notes techniques d'onboarding et standardiser le transfert d'informations.
- **Porteurs de projet SaaS & Solopreneurs** : pour structurer de manière rationnelle la phase de cadrage produit et le cahier des charges initial.
- **Product Owners et Managers Agile** : pour exporter un backlog MVP exploitable et définir des périmètres techniques solides de lancement de produit.

---

## Fonctionnalités principales
- **Moteur Dual-Phase (Livraison & Idéation)** :
  - *Phase de Livraison (Completion)* : Production automatique d'une Attestation de Prestation juridiquement normée, d'un Résumé Technique complet, d'une Fiche d'Expérience CV orientée impact (chiffres clés), et d'un Post LinkedIn de personal branding de haute qualité.
  - *Phase d'Idéation (Initiation)* : Production instantanée d'une Feuille de Route Stratégique, d'une Recommandation d'Architecture, d'un Backlog Produit avec définition de MVP (In-Scope/Out-of-Scope), et d'un Pitch commercial prêt à l'emploi.
- **Interface à deux Colonnes Réactive** : Saisie guidée via formulaires dynamiques intelligents avec datalists adaptables et prévisualisation instantanée haute performance au format Markdown sur le panneau de droite.
- **Export Multi-format Natif Côté Client** : Exportation directe et optimisée au format **PDF** vectoriel (avec feuille de style d'impression) et **Word** (.doc) standardisé sans dépendance vis-à-vis d'un serveur d'impression lourd.
- **Support Multilingue natif et Rendu Typographique Soigné** : Formatage des livrables selon des styles CSS spécifiques (polices serif traditionnelles pour les attestations, styles techniques type code-block mono pour l'architecture, etc.).

---

## Fonctionnalités avancées
- **Architecture Hybride d'Appels IA "Frontend-First"** :
  - Intégration directe du nouveau SDK officiel `@google/genai` sur le client web, garantissant une latence réseau minimale et un isolement total de la couche d'appel.
  - Sauvegarde locale cryptée des clés d'API personnelles des utilisateurs dans le navigateur pour garantir une politique de sécurité rigoureuse "Privacy-by-Design".
- **Rotation Sémantique et Équilibrage des Quotas** : Intégration d'un pool d'environnement de clés API Gemini de secours avec algorithme d'équilibrage de charge pour parer aux contraintes d'infrastructure.
- **Commutateur de Design System à la Volée (Premium vs Classic)** :
  - *Premium (Modern & Rounded)* : Esthétique soignée avec fond en "verre dépoli" (glassmorphism), ombres diffuses complexes, coins très arrondis (3xl), et typographies élégantes.
  - *Classic (Flat & Sharp)* : Esthétique sobre, brute et ultra-professionnelle avec palette vert émeraude, suppression des transparences et ombres, angles de bordure droits, et structure de navigation fixe pour une meilleure accessibilité mobile.
- **Persistance de l'Historique dans l'Appareil** : Système de gestion et de stockage local automatisé (`localStorage`) de l'historique des **30 derniers documents**, permettant de recharger un état complet de formulaire et de ses livrables d'un simple clic.
- **Résilience Structurelle face au Crash de Service (Auto-Retry 503)** : Gestion active des codes de surcharges d'API Gemini ou de quotas limités avec rafraîchissement d'état et temporisation ajustable.

---

## Mon rôle
En tant que **Lead Technique et Architecte Documentaliste Senior / Développeur Full-Stack**, j'ai conçu, restructuré et finalisé l'intégralité du cycle de vie opérationnel de ce projet :
- **Ingénierie Frontend** : Écriture de l'application en React 19 et Vite, structuration de l’état réactif global, et écriture des composants complexes responsives.
- **Conception du Prompt Engineering** : Rédaction des structures sémantiques strictes et directives système fournies en entrée du SDK Gemini pour que les réponses garantissent un rendu irréprochable et uniforme, sans dérive créative verbeuse ni hallucinations d'IA standard (retrait des "slops" d'IA classiques).
- **Développement System & Back-end** : Construction du serveur de proxy Node.js/Express, routage des livrables statiques et protection des routes d'API Express contre les erreurs d'exécution pour des sorties systématiquement au format JSON natif.
- **DevOps & Déploiement** : Analyse approfondie et résolution réussie des échecs d'intégration de conteneurs sur Google Cloud Run en affinant et automatisant la chaîne de compilation native `esbuild` en mode module (ESM).

---

## Technologies utilisées
- **Frontend** : React 19, Vite, Tailwind CSS, Framer Motion (Moteur d'animations), React-Markdown (Moteur de rendu de documents), html2pdf.js (Export vectoriel PDF).
- **Backend** : Node.js, Express 5.
- **Base de données / Persistance** : Firebase Firestore (Option de synchronisation cloud), Clientes de LocalStorage (Sauvegarde de l'historique dans le navigateur).
- **APIs** : SDK Google Gemini (`@google/genai`), Firebase Auth (Connexion sécurisée via providers Google).
- **IA utilisée** : Modèle de langage Gemini 1.5 pour la structuration textuelle critique et le respect d'un ton d'écriture expert.

---

## Défis rencontrés
1. **Échecs Systématiques au démarrage du conteneur en production sur Google Cloud Run (Erreurs de Gateways 502/503)** : Le système de routage Cloud Run n'arrivait pas à lier l'application car l'infrastructure réseau requiert explicitement une écoute hôte sur `0.0.0.0` et un port statique `3000` sans délais excessifs sous peine d'écarter le nœud comme instable.
2. **Plantages au Runtime liés à l'intégration CommonJS (CJS) versus ES Modules (ESM)** : L'application utilisant une compilation esbuild moderne en format ESM, les dépendances tierces d'Express en arrière-plan tentaient un appel de require natif, levant l'erreur critique : `Dynamic require of "node:events" not supported in ESM`.
3. **Erreurs d'accès serveur "API_KEY_SERVICE_BLOCKED" ou Gateway Timeout** : Limites de requêtes sur les clés API Gemini serveur, posant des pannes répétables au niveau des générations de documents.

---

## Solutions apportées
1. **Conteneurisation et Configuration Réseau Stricte** : Fixation absolue de l'écoute du port sur `3000` et de l'hôte réseau Express sur `0.0.0.0`. Mise en place d'un dictionnaire de middleware Express 5 remplaçant le wildcard global `*` par `*all` pour forcer la sécurité et le routage catch-all.
2. **Polyfill d'Importation Automatisé pour esbuild** : Résolution du plantage ESM/CJS grâce à un script de bundling dynamique injectant les bannières de require compatibles : `--banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);"`.
3. **Migration vers une Architecture Frontend-First** : Résolution de l'impasse des clés bloquées en redirigeant les requêtes Gemini via l'exécution du SDK au niveau de l'utilisateur. Le client peut utiliser sans restriction sa clé locale ou un protocole de clés d'urgence partagées configurées avec rotation automatique.

---

## Valeur ajoutée
DocuGen Pro réduit de plus de **90 %** l'effort de production de documentation professionnelle pour un freelance. Il transforme de simples listes de notes techniques désorganisées en packages complets de livrables professionnels, crédibles et exploitables, permettant par la même occasion de structurer rationnellement la phase d'idéation de tout projet en limitant le syndrome de la page blanche.

---

## Cas d'utilisation
- **Cas 1 : Finalisation de Mission de Conseil** : Un consultant Senior termine un mandat Agile complexe auprès d'une PME. Il saisit ses jalons dans DocuGen Pro, télécharge l'Attestation formelle signée d'un clic pour ses archives, exporte le Résumé Technique pour le Directeur, et copie la Version CV pour actualiser instantanément son profil de recrutement.
- **Cas 2 : Cadrage Produit Initial** : Un créateur de SaaS souhaite structurer sa vision technique. Il saisit l'idée de départ dans le mode "Idéation". L'IA lui fournit un backlog structuré, un pitch prêt pour la prospection, une roadmap sur 3 phases et une stack technique d'architecture justifiée selon ses exigences.

---

## Ce qui différencie ce projet
Contrairement aux outils d'IA généralistes qui génèrent des blocs de textes désordonnés, DocuGen Pro impose une **mise en page typographique et de design rigoureuse d'usine** : structures formelles à double ligne pour les attestations administratives, CV sous format bullet-points condensés type "résultats par impact", et publications LinkedIn conformes aux meilleures pratiques actuelles. Son offre de personnalisation de design system (Premium vs Classic) en fait un outil hautement adaptable à la sensibilité technique de chaque profil.

---

## Compétences démontrées
- **Développement Full-Stack & Clean Architecture** : Maîtrise avancée du découplage d'applications de production sous conteneur.
- **Génie Logiciel & DevOps** : Bundling de haute technicité via esbuild, configuration de conteneur, et résolution de contentieux liés au cycle de compilation / exécution en production (Cloud Run).
- **Prompt Engineering Spécialisé** : Création de templates de structures sémantiques robustes pour empêcher les hallucinations logiques (IA).
- **Conception UI/UX Réactive et Interactive** : Maîtrise fine des animations Framer Motion, transition de thèmes, et layouts fluides multi-colonnes en Tailwind CSS.
- **Système de Sécurisation Local-First** : Politique de traitement sûre de la donnée ("Privacy-by-Design") via cryptage et sauvegarde au LocalStorage dans le navigateur.

---

## Captures recommandées
1. **La Page Principale d'Accueil (Landing Page)** : Capturant l'esthétique soignée d'Aurion Labs-G, le pitch d'accroche et le dual-mode.
2. **Le Formulaire de Saisie et l'État Vide (Empty State) de Résultats** : L'écran initial, montrant l'équilibre graphique global des deux colonnes.
3. **Le Rendu de l’Attestation Certifiée (Figma/PDF Look-alike)** : Montrant la bordure administrative institutionnelle, le filigrane "CERTIFIÉ" transparent, et le rendu papier.
4. **La Modale d'Historique Client** : Montrant la liste de persistance des compilations précédentes classées par typologies.

---

## Description courte pour portfolio (47 mots)
> DocuGen Pro (par Aurion Labs-G) est un outil web intelligent d'automatisation de la documentation technique pour freelances et solopreneurs. Basé sur le SDK Gemini et une persistance au LocalStorage, il génère instantanément 8 types de livrables d'ingénierie et de cadrage au format PDF et Word.

---

## Description moyenne pour portfolio (140 mots)
> DocuGen Pro est un générateur autonome de documentation professionnelle et contractuelle conçu par la marque technologique **Aurion Labs-G**. Pensé spécifiquement pour l'écosystème agile (freelances, SaaS et solopreneurs), ce produit à architecture hybride exploite le SDK Gemini de manière "Frontend-First" pour garantir une rapidité d'exécution maximale et un respect de la vie privée ("Privacy-by-Design").
> 
> L'outil offre deux modes adaptés au cycle de vie du projet : la phase de Livraison (générant des attestations administratives à filigrane, des synthèses pour CV et posts LinkedIn) et la phase d'Idéation (produisant des backlogs de MVP, des architectures techniques justifiées et des roadmaps). Équipé d'un historique local persistant stockant jusqu'à 30 entrées, d'exports PDF/Word vectoriels réactifs, et d'une double identité de design interchangeable (Premium dynamic-glass ou Classic sharp-green), le projet démontre une rigueur DevOps résiliente prête pour un déploiement Cloud Run.

---

## Description longue pour étude de cas (490 mots)
> ### Genèse et Rationale du Projet
> La documentation technique et administrative rigoureuse est le garant de la crédibilité de tout ingénieur freelance ou créateur de produit. Cependant, cette composante requiert une charge mentale et de temps excessive qui vient pénaliser la phase de développement pur. Pour résoudre cette friction au sein de la tech, j'ai conçu et développé **DocuGen Pro**, un générateur d'écrits techniques et contractuels automatisé, développé sous l'égide de la marque **Aurion Labs-G**.
> 
> ### Architecture Logicielle et Choix Techniques
> L'une des décisions architecturales majeures de DocuGen Pro a été la migration vers une **architecture hybride d'appel IA "Frontend-First"**. Initialement, le serveur backend Express faisait office de proxy sécurisé vers l'API Google Gemini. Cependant, cette topologie s'avérait sujette aux blocages de ports de quotas collectifs (erreur 403) et aux lenteurs d'infrastructure. Pour parer à cela, j'ai déplacé toute l'intelligence générative au niveau du navigateur du visiteur en exploitant le SDK `@google/genai`. 
> 
> Cette mutation offre des garanties exceptionnelles de sécurité (l’utilisateur peut saisir sa clé personnelle dans une modale dédiée, elle est chiffrée et conservée localement sans jamais quitter son navigateur) et accroît la scalabilité à l'extrême car l'effort matériel de génération est délégué au client final. L'application possède un mode "zéro compte" (offline-ready) et une intégration optionnelle avec Firebase Auth pour la portabilité de la clé sur le Cloud.
> 
> ### DevOps & Résolution de Problématiques de Conteneurisation
> Le déploiement de production sur Google Cloud Run représentait un ensemble d'exigences d'ingénierie DevOps poussées. Le service de conteneurisation défaillait au démarrage en raison de liaisons de ports de gateways incorrectes et de conflits complexes entre dépendances héritées de CommonJS et les ES Modules par défaut (levée de l'erreur `Dynamic require of "node:events" not supported`). 
> 
> Pour y remédier de manière définitive, j'ai configuré de manière autonome le compilateur `esbuild` de l'application avec un polyfill de require au format banner (`createRequire(import.meta.url)`) pour autoriser la rétrocompatibilité ESM. De plus, j'ai réécrit le sous-système de routage Express 5 avec une structure catch-all stricte (`*all` au lieu du wildcard vague `*`) pour garantir des réponses systématiquement typées au format JSON.
> 
> ### Intégrité Visuelle et UI/UX
> L'application propose deux interfaces interchangeables d'un clic : le système de design **"Premium SaaS"** (glassmorphism très soigné, transitions Framer Motion, coins arrondis, tons bleu-indigo et typographies Serif de prestige pour les documents formels), et le système de design **"Classic"** (look épuré "flat", tons vert émeraude, angles de bordure à 90° et suppression des éléments collants pour une performance accrue sur mobile). L'outil intègre un historique local à persistance temporelle retenant jusqu'à 30 projets d'un clic, faisant de DocuGen Pro une étude de cas d'école réunissant ingénierie Cloud, IA Générative et design d'interface moderne.

---

## Mots-clés
`DocuGen Pro`, `Portfolio Web Dev`, `SaaS Architecture`, `Gemini SDK AI`, `Prompt Engineering`, `Cloud Run Deploy`, `esbuild bundle`, `Firebase Firestore`, `React 19`, `Tailwind CSS`, `Framer Motion`, `PWA App`, `Privacy-by-design`, `Aurion Labs-G`, `Générateur de documents`, `Outils productivité dev`.
