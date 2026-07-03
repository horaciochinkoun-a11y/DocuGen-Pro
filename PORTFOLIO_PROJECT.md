# FICHE PORTFOLIO PROFESSIONNELLE : DocuGen-Pro

---

## Nom du projet
**DocuGen-Pro** (SaaS de Génération de Documentation Professionnelle et Certifiée par IA)

## Résumé en une phrase
DocuGen-Pro transforme instantanément n'importe quelle prestation technique ou idée brute en dossiers de projet irréprochables (attestations certifiées, roadmaps, synthèses d'architecture et posts LinkedIn) prêts pour un usage en entreprise.

## Problème résolu
Les freelances, ingénieurs informatiques et consultants perdent des heures précieuses à rédiger des documents administratifs formels, des résumés techniques de fin de mission ou des plans de lancement structurés. De plus, leurs attestations de réalisation manquent souvent de dispositifs de vérification tangibles pour prouver l'authenticité de leur travail auprès de futurs clients ou banques.

## Public cible
* **Développeurs Freelances & Consultants Tech** souhaitant clôturer leurs contrats avec rigueur administrative pour débloquer leur facturation.
* **Architectes Logiciels & Tech Leads** devant synthétiser rapidement des choix de stack et des architectures système complexes.
* **Entrepreneurs & Porteurs de projet SaaS** cherchant à cadrer une idée brute en roadmap stratégique, backlog MVP et pitch Go-To-Market.
* **ESN & Agences Digitales** industrialisant la documentation post-déploiement de leurs équipes.

## Fonctionnalités principales
* **Génération Dual-Mode intelligente** : Mode *Completion* (clôture de missions techniques) et mode *Initiation* (lancement de nouveaux produits).
* **Production simultanée multi-supports** : Création instantanée de 4 documents coordonnés par session.
* **Éditeur Markdown interactif enrichi** : Prévisualisation en temps réel avec coloration syntaxique et typographies adaptées au contexte (Serif formel pour les attestations, Monospace technique pour l'architecture).
* **Système d'export multi-formats** : Téléchargement direct en documents Word nativement stylisés (`.doc`), export PDF haute définition (`html2pdf.js`) et copie dans le presse-papier.
* **Thèmes visuels personnalisables** : Sélecteur de système de design (*Premium Cobalt* vs *Classic Émeraude*) et bascule Instantanée mode Clair / Sombre.
* **Historique local sécurisé** : Sauvegarde automatique des sessions générées dans le navigateur avec restauration en un clic.

## Fonctionnalités avancées
* **Sceau de certification numérique par QR Code dynamique** : Génération vectorielle d'un QR code d'authentification en fin d'attestation liant directement le document aux preuves de réalisation (dépôt GitHub ou profil LinkedIn).
* **Filigrane d'arrière-plan contextuel** : Affichage en filigrane géant incliné à -45° (*CERTIFIÉ* ou *ROADMAP*) garantissant l'intégrité visuelle des exports.
* **Architecture SaaS résiliente avec Fallback IA** : Prise en charge du mode serveur autonome (rotation automatique de clés API Gemini multiples) et du mode BYOK (*Bring Your Own Key*) avec gestion des erreurs de quota (HTTP 429/503).
* **PWA Offline-Ready** : Installation native sur bureau et mobile via manifeste PWA et Service Workers Vite.

## Mon rôle
Conception intégrale de l'application full-stack en autonomie totale : architecture logicielle, UI/UX design responsive, intégration du moteur d'intelligence artificielle générative Gemini 3, implémentation des algorithmes de rendu Word/PDF client-side et déploiement continu conteneurisé sur Google Cloud Run / Vercel.

## Technologies utilisées
* **Frontend** : React 19, TypeScript 5.9, Vite 8, Tailwind CSS 4, Motion (ex-Framer Motion), Lucide React, React Markdown.
* **Backend** : Node.js, Express 5, API Route Rewrites (Vercel / Cloud Run proxy), dotenv.
* **Base de données & Stockage** : Persistence locale HTML5 (`localStorage`), Firebase Firestore SDK (prêt pour synchronisation cloud multi-utilisateurs).
* **APIs & Services externes** : Google GenAI SDK (`@google/genai`), QRServer Public API.
* **IA utilisée** : Google Gemini 3 Flash Preview (modèles structurés avec schémas JSON stricts).

## Défis rencontrés
1. **Contournement des limites d'export DOCX dans le navigateur** sans alourdir le bundle avec des librairies binaires lourdes de plusieurs mégaoctets.
2. **Respect strict du formatage administratif français** par un modèle d'IA générative polyglotte.
3. **Instabilité et latence des quotas d'API IA gratuites** lors de pics de requêtes simultanées.

## Solutions apportées
1. **Encapsulation XML/MS-Office** : Création d'un wrapper HTML spécifique avec en-têtes Microsoft Office (`xmlns:w`) et styles CSS inline converti en `Blob` binaire `application/msword`.
2. **Prompt Engineering structuré par schémas** : Injection de schémas JSON stricts (`responseSchema`) couplés à des directives de ton administratif et des délimiteurs Markdown explicites.
3. **Algorithme de Backoff Exponentiel & BYOK** : Implémentation d'une boucle de réessai automatique (jusqu'à 3 tentatives) et d'un sélecteur de clé personnelle sécurisé.

## Valeur ajoutée
DocuGen-Pro crédibilise instantanément le travail des indépendants, accélère de 95% le temps consacré aux tâches administratives et offre un standard juridique visuel d'entreprise aux projets techniques.

## Cas d'utilisation
1. **Fin de mission freelance** : Un développeur React livre une plateforme e-commerce, saisit ses livrables et édite une attestation de prestation signée pour accompagner sa facture finale.
2. **Réponse à appel d'offres** : Un consultant tech utilise le mode *Initiation* pour fournir à son prospect une feuille de route détaillée sur 6 mois et une stack technique justifiée en moins de 3 minutes.
3. **Enrichissement de portfolio** : Un ingénieur junior exporte les résumés techniques de ses projets personnels GitHub avec QR codes de vérification pour ses entretiens d'embauche.

## Ce qui différencie ce projet
Contrairement aux simples wrappers de ChatGPT qui génèrent du texte kilométrique brut, DocuGen-Pro applique une **rigueur de mise en page documentaire type imprimerie** (filigranes, typographies Serif, QR codes de preuve matérielle, exports Word propres) transformant l'IA en véritable secrétariat technique exécutif.

## Compétences démontrées
* Architecture Full-Stack TypeScript & State Management avancé.
* Prompt Engineering & Intégration d'API d'IA générative structurée (JSON Schema).
* Ingénierie documentaire web (DOM to PDF / DOM to MSWord).
* UI/UX Design moderne (Design System atomique, Responsive mobile-first, Micro-interactions).

## Captures recommandées pour le portfolio
1. **Vue principale Écran Scindé** : Formulaire de saisie à gauche et rendu formel de l'Attestation professionnelle à droite avec son sceau QR Code.
2. **Sélecteur de Thèmes** : Comparaison côte à côte du thème *Premium Cobalt* et du thème *Classic Émeraude*.
3. **Modal de Configuration IA** : Interface de bascule entre le mode serveur partagé et le mode clé API autonome.
4. **Export Word en action** : Document `.doc` ouvert dans Microsoft Word montrant la fidélité parfaite du style.

---

## Description courte pour portfolio (max 50 mots)
DocuGen-Pro est une plateforme SaaS full-stack (React/TypeScript/Gemini) qui transforme les missions techniques et idées de projets en documentation d’entreprise irréprochable. Générez instantanément attestations certifiées par QR code, roadmaps stratégiques, synthèses techniques et exports Word/PDF en un clic.

## Description moyenne pour portfolio (max 150 mots)
Conçu pour les freelances tech, consultants et architectes logiciels, **DocuGen-Pro** industrialise la création de documentation post-mission. Grâces à son moteur propulsé par Google Gemini 3, l'application génère simultanément 4 documents professionnels coordonnés selon deux modes : clôture de prestation (attestation formelle, résumé technique, CV, post LinkedIn) ou lancement de produit (roadmap, architecture, backlog MVP, pitch commercial).

L'application se distingue par son exigence typographique et administrative : prévisualisation Markdown enrichie, filigranes d’authenticité, certification dynamique par QR code vectoriel pointant vers les dépôts GitHub/LinkedIn, et export natif en fichiers Microsoft Word (.doc) ou PDF haute définition. Une solution PWA complète alliant design atomique Tailwind et résilience cloud.

## Description longue pour étude de cas (max 500 mots)
### Le Contexte
Dans l'écosystème tech actuel, la valeur d'un ingénieur ou d'un consultant ne réside pas uniquement dans le code qu'il produit, mais dans sa capacité à documenter, certifier et communiquer ses réalisations. Pourtant, la rédaction de bilans de mission formels, d'attestations de prestation ou de dossiers d'architecture représente une tâche fastidieuse, souvent négligée faute de temps. **DocuGen-Pro** est né de ce constat : offrir aux experts techniques un secrétariat exécutif automatisé par intelligence artificielle.

### L'Architecture & Les Défis Techniques
Développé en TypeScript avec React 19 et Vite, le cœur de DocuGen-Pro repose sur une architecture orientée composants couplée à l'API Google Gemini 3 Flash. Le principal défi technique consistait à obtenir des sorties documentaires strictement pré-formatées en français formel. Pour y parvenir, le système s'appuie sur des schémas JSON contraints (`responseSchema`) garantissant que le modèle génère invariablement les quatre clés requises par session, sans hallucination structurelle.

Le second enjeu majeur fut l'ingénierie d'export. Les bibliothèques standards de génération Word côté client pèsent plusieurs mégaoctets et dégradent les performances. La solution mise en œuvre repose sur un convertisseur XML/MS-Office fait maison : le DOM HTML est stylisé dynamiquement par CSS conditionnel puis sérialisé en un objet `Blob` binaire mimant le type MIME natif de Word (`application/msword`). Ce procédé garantit un téléchargement instantané (< 50ms) d'un document parfaitement lisible sous toute suite bureautique.

### L'Expérience Utilisateur
L'interface adopte les standards des logiciels de productivité modernes : une vue scindée interactive offrant une rétroaction instantanée. L'utilisateur dispose d'un contrôle total sur l'esthétique documentaire grâce à un double système de design (*SaaS Premium Bleu* ou *Corporate Émeraude Vert*) et l'injection automatique d'un QR code de vérification généré via l'API QRServer liant le document physique aux preuves numériques de réalisation.

---

## Mots-clés SEO & Portfolio
`SaaS Tech`, `Générateur de Documentation IA`, `React 19`, `TypeScript`, `Google Gemini API`, `Export DOCX Client-Side`, `PWA`, `Tailwind CSS`, `Outil Freelance`, `Tech Lead Portfolio`, `Automatisation Administrative`.

---

# 🎒 SYNTHÈSE ADAPTÉE POUR UN ADOLESCENT (Humanisation & Simplification)

Salut ! Imagine que tu viens de passer deux semaines à monter un super PC gaming sur mesure pour un pote ou à coder un bot Discord ultra complet. Ton pote est super content, mais toi, pour prouver à d'autres gens (ou à des futurs clients) que tu sais faire ça comme un pro, il te faut un **papier officiel qui en jette**.

Le problème ? Écrire un rapport sérieux de 4 pages avec du vocabulaire d'adulte, c’est hyper long et ennuyeux.

C’est exactement là qu’intervient mon site, **DocuGen-Pro** ! C’est un peu comme un assistant personnel magique :

1. **Tu lui racontes ton exploit en deux phrases** (ex: *"J'ai créé un site internet pour la pizzeria du coin avec React"*).
2. **Tu appuies sur le bouton magique.**
3. **ET BOOM ! En 5 secondes, l'intelligence artificielle te rédige 4 trucs incroyables :**
   * Un **diplôme/certificat officiel** hyper classe qui dit : *"Je soussigné certifie que ce travail a été réalisé à la perfection"*.
   * Un **résumé technique** clair qui explique tous tes choix d'expert.
   * Un **texte résumé** tout prêt à coller dans ton CV.
   * Un **post stylé** pour briller sur LinkedIn ou les réseaux sociaux.

**Le détail qui tue ?** Le site rajoute tout seul un **vrai QR Code** en bas du papier. Si quelqu'un le scanne avec son téléphone, il tombe direct sur ton GitHub ou ton profil pour vérifier que c'est bien toi le génie derrière le projet ! Et bien sûr, tu peux télécharger tout ça en vrai fichier Word (.doc) ou PDF pour l'imprimer. C'est le cheat code ultime pour faire pro ! 🚀
