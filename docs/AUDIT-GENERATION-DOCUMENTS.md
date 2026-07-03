# AUDIT COMPLET DU SYSTÈME DE GÉNÉRATION DE DOCUMENTS (DocuGen-Pro)

Ce document rassemble l'intégralité des informations techniques réelles extraites du code source de l'application **DocuGen-Pro** (`ai-studio-applet v2.5.0`). Il est destiné à permettre la reconstruction à l'identique des templates DOCX et PDF générés par le système.

---

## 1. LOCALISATION DU CODE

### Fichiers impliqués dans la chaîne de génération et d'export :
1. `/src/App.tsx` : Orchestrateur principal de l'application. Gère la collecte des données formulaire, l'assemblage du prompt IA, l'injection post-traitement du QR Code, l'affichage conditionnel avec filigranes, et les routines d'export (`exportToPDF` et `exportToWord`).
2. `/src/services/geminiService.ts` : Service d'interfaçage avec l'API `@google/genai`. Définit les schémas de réponse JSON contraints imposés au modèle `gemini-3-flash-preview` selon le mode de projet (`completion` vs `initiation`).
3. `/src/index.css` : Contient l'ensemble des règles de mise en page, typographies, bordures et couleurs appliquées aux documents rendus dans le DOM (ex: `.markdown-attestation`, `.markdown-roadmap`, `.markdown-architecture`, etc.).
4. `/package.json` : Déclare les dépendances utilisées pour le rendu et la conversion en fichiers téléchargeables.

### Résultat des recherches de mots-clés dans le dépôt :
* `generatePDF` / `generateDocx` / `html-to-docx` / `jspdf` / `pdfkit` / `wkhtmltopdf` / `marked` / `puppeteer` : **Explicitement absents du code.**
* `html2pdf.js` : Présent. Importé de manière asynchrone dans `/src/App.tsx` (ligne 447) pour convertir le DOM HTML en fichier PDF côté client.
* `Blob` / `application/msword` : Présents dans `/src/App.tsx` (ligne 495). L'export Word ne fait **pas** appel à une librairie de manipulation binaire DOCX (comme `docx` ou `docxtemplater`). Il encapsule le HTML rendu dans une structure XML/HTML compatible Microsoft Word (`.doc`).

---

## 2. TYPES DE DOCUMENTS

L'application fonctionne selon **2 modes de projet distincts**, produisant au total **8 types de documents réels** :

### Mode 1 : `completion` (Clôture / Fin de projet - Mode par défaut)
Géré par `/src/App.tsx` (lignes 329-363) et `/src/services/geminiService.ts` :
1. **Attestation professionnelle** (`attestation`) : Attestation officielle formelle de réalisation de prestation, certifiée numériquement avec signature et QR Code.
2. **Résumé technique du projet** (`technicalSummary`) : Synthèse d'architecture, technologies, contraintes et défis rencontrés.
3. **Version CV (Courte)** (`cvVersion`) : Encadré synthétique orienté impact et chiffres clés pour le CV du développeur.
4. **Version LinkedIn** (`linkedinVersion`) : Post narratif (Storytelling : Problème $\rightarrow$ Solution $\rightarrow$ Résultat).

### Mode 2 : `initiation` (Lancement / Cadrage d'idée)
Géré par `/src/App.tsx` (lignes 385-408) et `/src/services/geminiService.ts` :
5. **Feuille de route & Jalons** (`roadmap`) : Planification stratégique découpée en phases (Fondations, MVP, Scale) avec jalons et délais.
6. **Architecture & Stack recommandée** (`architecture`) : Justification des choix technologiques, schéma conceptuel Markdown et recommandations de scalabilité.
7. **Backlog initial & Définition du MVP** (`backlog`) : Liste des User Stories prioritaires sous forme de checklist (Périmètre In Scope / Out of Scope).
8. **Pitch & Stratégie de lancement** (`pitch`) : Elevator pitch (30s), proposition de valeur unique (USP) et canaux d'acquisition Go-To-Market.

*(Note importante : Les documents de type "Business Plan complet", "Rapport d'audit bancaire", "Cahier des charges exhaustif", "Contrat juridique" ou "Facture comptable" mentionnés dans la question ne sont **pas** générés par cette application).*

---

## 3. POUR CHAQUE TYPE DE DOCUMENT

### Mécanisme architectural de rendu
Le flux de production suit exactement cette séquence :
1. L'IA génère le texte au format **Markdown** structuré en réponse au prompt contraint.
2. Pour l'Attestation, l'application remplace par Regex le placeholder `QR_CODE_AUTHENTICATION_URL_PLACEHOLDER` par une URL d'image générée dynamiquement.
3. Le composant `<Markdown>` (`react-markdown`) convertit le Markdown en HTML DOM à l'intérieur d'un conteneur `<div id="markdown-content">`.
4. Lors du clic sur **Exporter en Word** (`exportToWord`), le code injecte ce HTML dans le squelette MS-Office suivant :

```html
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${activeTab}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; }
    h1 { color: #0f172a; font-size: 24pt; margin-top: 24pt; margin-bottom: 12pt; font-weight: bold; }
    h2 { color: #1e293b; font-size: 18pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4pt; }
    h3 { color: #334155; font-size: 14pt; margin-top: 16pt; margin-bottom: 8pt; font-weight: bold; }
    p { margin-bottom: 10pt; text-align: justify; }
    ul, ol { margin-bottom: 10pt; }
    li { margin-bottom: 5pt; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 15pt; color: #475569; font-style: italic; margin: 15pt 0; background: #f8fafc; padding-top: 10pt; padding-bottom: 10pt; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 20pt 0; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 15pt; }
    th, td { border: 1px solid #e2e8f0; padding: 8pt; text-align: left; }
    th { background-color: #f8fafc; font-weight: bold; }
    .certifie { color: #94a3b8; font-size: 40pt; text-align: center; transform: rotate(-45deg); opacity: 0.1; }
    img { max-width: 150px; height: auto; }
    
    /* Spécifique pour l'Attestation */
    .attestation-mode h1 { text-align: center; text-transform: uppercase; letter-spacing: 2pt; color: #000; }
    .attestation-mode { padding: 40pt; border: 1pt solid #cbd5e1; }
  </style>
</head>
<body class="${activeTab}-mode">
  <!-- Contenu HTML rendu par react-markdown -->
</body>
</html>
```

### Liste exacte des variables / interpolations injectées
Toutes les données sont issues de l'objet `formData` (`ProjectData`) :
* `formData.developerName` : Nom du développeur / consultant
* `formData.developerStatus` : Statut professionnel (ex: Senior, Lead Developer, Architecte)
* `formData.clientName` : Nom du client ou de la cible
* `formData.companyName` : Nom de l'entreprise ou du SaaS
* `formData.projectName` : Nom du projet
* `formData.projectType` : Type de projet (ex: Application Web, SaaS, Mobile)
* `formData.description` : Description détaillée ou vision
* `formData.technologies` : Technologies utilisées ou envisagées
* `formData.keyFeatures` : Fonctionnalités clés livrées ou attendues
* `formData.results` : Résultats obtenus ou objectifs mesurables
* `formData.duration` : Durée du projet
* `formData.clientContact` : Email de contact client
* `formData.manualTime` : Date de signature/livraison (ex: `02 Avril 2026`)
* `formData.manualLocation` : Lieu de signature (ex: `Paris, France`)
* `formData.githubLink` : URL du dépôt GitHub optionnelle
* `formData.linkedinLink` : URL du profil LinkedIn optionnelle

### Structure et conventions de contenu par document

1. **Attestation (`attestation`)** :
   * **Titre principal** : `# ATTESTATION DE RÉALISATION DE PRESTATION` (centré, majuscules, espacé de 2pt dans Word).
   * **Séparateurs** : Lignes `---` (<hr>) avant le corps du texte et avant le bloc de signature.
   * **Signature** : Texte aligné en fin de document : `Fait à ${manualLocation}, le ${manualTime} \n\n **[Nom du Client]**`.
   * **Section Authentification (imposée en fin de Markdown)** :
     ```markdown
     ---
     ### Validation & Authenticité numérique
     Ce document officiel est certifié numériquement. Pour vérifier l'authenticité de cette attestation de prestation et consulter les travaux ou le profil professionnel associé, veuillez scanner le code QR ci-dessous :

     ![QR Code d'authentification](QR_CODE_AUTHENTICATION_URL_PLACEHOLDER)
     ```

2. **Résumé Technique (`technicalSummary`)** :
   * **Titre** : `# RÉSUMÉ TECHNIQUE : [Nom du Projet]`.
   * **Sous-titres** : `##` pour structurer l'architecture, la stack, le rôle et les défis techniques.
   * **Listes** : Puces pures avec marqueurs circulaires colorés en CSS.

3. **Version CV (`cvVersion`)** :
   * **Titre** : `# [Nom du Développeur] - ${developerStatus} [Type de projet]`.
   * **Sous-titres** : `## PROJET RÉCENT`, `## TECHNOLOGIES`, `## RÉALISATIONS`.
   * **Style** : Encadré avec bordure supérieure épaisse (`border-t-4`), indicateurs chiffrés en **gras**.

4. **Version LinkedIn (`linkedinVersion`)** :
   * **Structure** : Narration type Storytelling (Problème $\rightarrow$ Solution $\rightarrow$ Résultat mesurable). Paragraphes courts et espacés.

5. **Feuille de Route (`roadmap`)** :
   * **Titre** : `# FEUILLE DE ROUTE STRATÉGIQUE : [Nom du Projet]`.
   * **Structure** : Découpage séquentiel en `## Phase 1 : Fondations`, `## Phase 2 : MVP`, `## Phase 3 : Scale`. Encadrés jalons `###`.

6. **Architecture (`architecture`)** :
   * **Titre** : `# ARCHITECTURE TECHNIQUE ET STACK LOGICIELLE`.
   * **Spécificité** : Rendu en police Monospace (`JetBrains Mono`), blocs de code `code` pour les dépendances.

7. **Backlog (`backlog`)** :
   * **Titre** : `# BACKLOG PRODUIT ET PÉRIMÈTRE MVP`.
   * **Spécificité** : Éléments de liste stylisés avec un caractère case à cocher vide `☐` (`before:content-['☐']`).

8. **Pitch (`pitch`)** :
   * **Titre** : `# PITCH COMMERCIAL ET STRATÉGIE GO-TO-MARKET`.
   * **Spécificité** : Rendu centré, mise en avant par citation `blockquote` pour l'Elevator Pitch 30 secondes.

---

## 4. SYSTÈME DE COULEURS / MODES D'AFFICHAGE

### Confirmation du nombre réel de modes
Il existe exactement **4 variations visuelles dans le code** résulantes du croisement de :
* **2 Systèmes de Design** (`designSystem` dans `App.tsx`) : `'premium'` (par défaut) vs `'classic'`.
* **2 Thèmes de Luminosité** (`theme` dans `App.tsx`) : `'light'` vs `'dark'`.

### Noms exacts dans le code et palettes hexadécimales (`/src/index.css`)

#### 1. Système de Design : `premium` (Moderne / SaaS - Bleu Cobalt)
* `--color-brand-50`: `#f0f7ff`
* `--color-brand-100`: `#e0effe`
* `--color-brand-200`: `#bae0fd`
* `--color-brand-300`: `#7cc8fb`
* `--color-brand-400`: `#36acf7`
* **`--color-brand-500` (Couleur Primaire / Accents)** : `#0c91eb`
* `--color-brand-600`: `#0074ca`
* `--color-brand-700`: `#015ca3`
* `--color-brand-800`: `#064f86`
* `--color-brand-900`: `#0b426f`
* `--color-brand-950`: `#072a4a`

#### 2. Système de Design : `classic` (Corporate / Minimaliste - Vert Émeraude)
Déclenché par l'application de la classe CSS `.classic-design` sur le body/conteneur :
* `--color-brand-50`: `#f0fdf4`
* `--color-brand-100`: `#dcfce7`
* `--color-brand-200`: `#bbf7d0`
* `--color-brand-300`: `#86efac`
* `--color-brand-400`: `#4ade80`
* **`--color-brand-500` (Couleur Primaire / Accents)** : `#22c55e`
* `--color-brand-600`: `#16a34a`
* `--color-brand-700`: `#15803d`
* `--color-brand-800`: `#166534`
* `--color-brand-900`: `#14532d`
* `--color-brand-950`: `#052e16`

#### Couleurs de Fond et de Texte Globales (`@layer base`)
* **Mode Light (`light`)** :
  * Arrière-plan de page : `#fafafa` (`neutral-50`)
  * Texte principal : `#171717` (`neutral-900`)
  * Fond des cartes/documents : `#ffffff` (`bg-white`)
  * Bordures : `#e5e5e5` (`neutral-200`)
* **Mode Dark (`dark`)** :
  * Arrière-plan de page : `#0a0a0a` (`neutral-950`)
  * Texte principal : `#fafafa` (`neutral-50`)
  * Fond des cartes/documents : `#171717` (`neutral-900`)
  * Bordures : `#262626` (`neutral-800`)

### Typographies configurées (`/src/index.css:3`)
* **Sans-serif** (`--font-sans`) : `"Inter", ui-sans-serif, system-ui, sans-serif` (UI générale, Technical Summary, LinkedIn, CV, Roadmap, Backlog, Pitch).
* **Monospace** (`--font-mono`) : `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace` (Architecture et balises `code`).
* **Serif** (`--font-serif`) : `"Playfair Display", ui-serif, Georgia, serif` (Réservée exclusivement à **l'Attestation** en mode Premium). En mode Classic, `.classic-design .font-serif` écrase cette règle pour forcer la police Sans-serif.

### Qu'est-ce qui déclenche le choix du mode pour un document donné ?
Le choix est **100% interactif et dicté par la préférence utilisateur en direct dans l'interface** via les boutons de la barre d'en-tête (sélecteur de palette et toggle jour/nuit). Il n'est pas lié au profil client ou au type de compte.

Code exact gérant ce choix dans `/src/App.tsx` (lignes 178-180 et 680-715) :
```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [designSystem, setDesignSystem] = useState<'premium' | 'classic'>('premium');

// Application dynamique dans le rendu JSX :
<div className={`min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col font-sans transition-colors duration-200 ${designSystem === 'classic' ? 'classic-design' : ''}`}>
```

---

## 5. QR CODES

### Types de documents concernés
Uniquement **l'Attestation professionnelle** (`attestation`).

### Librairie utilisée
**Aucune dépendance npm de cryptographie QR n'est installée localement** (pas de `qrcode` dans `package.json`). L'encodage est délégué au service web public **QRServer API**.

### Donnée exacte encodée
La chaîne encodée est l'URL de vérification externe pointant vers : `formData.linkedinLink || formData.githubLink || 'https://github.com'`.

### Code exact de construction (`/src/App.tsx:1339-1344`)
```tsx
if (activeTab === 'attestation') {
  const verificationLink = formData.linkedinLink || formData.githubLink || 'https://github.com';
  const qrColor = designSystem === 'classic' ? '22-163-74' : '0-116-202';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=${qrColor}&data=${encodeURIComponent(verificationLink)}`;
  docContent = docContent.replace(/QR_CODE_AUTHENTICATION_URL_PLACEHOLDER/g, qrCodeUrl);
}
```

### Taille, position et format
* **Taille** : Image générée en `150x150 px` côté serveur, contrainte à `max-width: 140px` dans le navigateur et `max-width: 150px` dans l'export Word.
* **Position** : Fin absolue du document, sous le titre `### Validation & Authenticité numérique`.
* **Format** : Image raster **PNG** servie via flux HTTP par `api.qrserver.com`.
* **Couleurs du QR** :
  * Mode Premium : RVB `0-116-202` (Bleu `#0074ca`).
  * Mode Classic : RVB `22-163-74` (Vert `#16a34a`).

---

## 6. AUTRES ÉLÉMENTS DYNAMIQUES

1. **Filigranes géants d'arrière-plan (`/src/App.tsx:1330-1334`)** :
   Pour les onglets `attestation` et `roadmap`, un texte filigrane géant s'affiche en arrière-plan à $-45^\circ$ :
   * Texte : `'CERTIFIÉ'` (pour l'attestation) ou `'ROADMAP'` (pour la feuille de route).
   * Rendu DOM : `text-7xl md:text-[120px] font-black tracking-widest text-neutral-900 dark:text-white -rotate-45 select-none opacity-[0.04] dark:opacity-[0.08]`.
   * Rendu Word : Classe `.certifie` à `font-size: 40pt; opacity: 0.1; transform: rotate(-45deg);`.

2. **Tampon / Sceau visuel** : Aucun tampon image binaire circulaire ou graphique n'est appliqué hors du filigrane texte.

3. **Marges d'impression PDF (`exportToPDF`)** : Marges fixes de `15 mm` sur format A4 Portrait. Pas de gestion automatisée des numéros de bas de page (`Page X / Y`) par `html2pdf.js`.

---

## 7. PROMPTS IA ACTUELS

Texte exact et intégral des prompts système et utilisateur injectés lors de l'appel (extraits de `/src/App.tsx:303-408`) :

### Prompt Mode `completion` (Projets terminés)
```text
Tu es un expert en documentation professionnelle pour les projets freelance et SaaS.
Agis en tant que chef de projet senior et expert en audit. Ton objectif est de générer des documents qui pourraient passer pour de vrais dossiers internes d'entreprise.

DONNÉES D'ENTRÉE :
- Nom du développeur : ${formData.developerName}
- Statut du développeur : ${formData.developerStatus}
- Nom du client : ${formData.clientName}
- Nom de l'entreprise : ${formData.companyName}
- Nom du projet : ${formData.projectName}
- Type de projet : ${formData.projectType}
- Description du projet : ${formData.description}
- Technologies utilisées : ${formData.technologies}
- Fonctionnalités clés livrées : ${formData.keyFeatures}
- Résultats obtenus : ${formData.results}
- Durée du projet : ${formData.duration}
- Contact client : ${formData.clientContact}
- Lien GitHub : ${formData.githubLink || 'Non spécifié'}
- Lien LinkedIn : ${formData.linkedinLink || 'Non spécifié'}
- Heure manuelle : ${formData.manualTime || 'Non spécifiée'}
- Lieu manuel : ${formData.manualLocation || 'Non spécifié'}

TÂCHE :
Génère les 4 documents suivants en te basant sur les données d'entrée.
IMPORTANT : TOUS LES DOCUMENTS DOIVENT ÊTRE RÉDIGÉS EN FRANÇAIS ET FORMATÉS EN MARKDOWN.

1. ATTESTATION PROFESSIONNELLE (attestation)
- Utilise un titre principal `# ATTESTATION DE RÉALISATION DE PRESTATION`.
- Ton administratif et très formel.
- Structuré comme un document officiel imprimé.
- Utilise `---` pour créer des lignes de séparation avant le corps du texte et avant la signature.
- Inclure un bloc de signature clair à la fin (ex: Fait à ${formData.manualLocation || '[Ville]'}, le ${formData.manualTime || '[Date]'} \n\n **[Nom du Client]**).
- Mentionne explicitement le statut du développeur (${formData.developerStatus}).
- Si un lien GitHub est fourni (${formData.githubLink}), l'inclure dans une section "Ressources" ou "Lien du dépôt".
- À la toute fin du document (après la signature et séparé par un `---`), ajoute une section d'authentification structurée comme suit :
  ```markdown
  ### Validation & Authenticité numérique
  Ce document officiel est certifié numériquement. Pour vérifier l'authenticité de cette attestation de prestation et consulter les travaux ou le profil professionnel associé, veuillez scanner le code QR ci-dessous :

  ![QR Code d'authentification](QR_CODE_AUTHENTICATION_URL_PLACEHOLDER)
  ```

2. RÉSUMÉ TECHNIQUE DU PROJET (technicalSummary)
- Utilise `# RÉSUMÉ TECHNIQUE : [Nom du Projet]`.
- Clair et structuré avec des sous-titres `##`.
- Mettre en évidence les choix d'architecture et les technologies.
- Mentionne le rôle du développeur (${formData.developerStatus}) dans le projet.
- Inclure le lien GitHub (${formData.githubLink}) si disponible.
- Ajouter des contraintes ou des défis réalistes rencontrés pour augmenter la crédibilité.

3. VERSION CV (COURTE) (cvVersion)
- Utilise `# [Nom du Développeur] - ${formData.developerStatus} [Type de projet]` comme titre principal.
- Utilise `##` pour les sections (ex: `## PROJET RÉCENT`, `## TECHNOLOGIES`, `## RÉALISATIONS`).
- Utilise des points puces (bullet points) pour les réalisations.
- Orienté sur l'impact (chiffres en gras).

4. VERSION LINKEDIN (linkedinVersion)
- Style storytelling (narration).
- Engageant mais toujours professionnel.
- Mettre l'accent sur le schéma : problème -> solution -> résultat.
- Mentionne subtilement l'expertise en tant que ${formData.developerStatus}.
```

### Prompt Mode `initiation` (Nouveaux projets / Idées)
```text
Tu es un consultant en stratégie produit et architecte logiciel senior.
Ton objectif est d'aider un utilisateur à lancer un nouveau projet en transformant une idée brute en un plan d'action professionnel et structuré.

DONNÉES D'ENTRÉE :
- Porteur du projet : ${formData.developerName}
- Rôle visé : ${formData.developerStatus}
- Client/Cible : ${formData.clientName}
- Nom de l'entreprise/SaaS : ${formData.companyName}
- Nom du projet : ${formData.projectName}
- Type de projet : ${formData.projectType}
- Vision du projet : ${formData.description}
- Technologies envisagées : ${formData.technologies}
- Fonctionnalités principales souhaitées : ${formData.keyFeatures}
- Objectifs attendus : ${formData.results}
- Durée estimée du lancement : ${formData.duration}

TÂCHE :
Génère les 4 documents stratégiques suivants.
IMPORTANT : TOUS LES DOCUMENTS DOIVENT ÊTRE RÉDIGÉS EN FRANÇAIS ET FORMATÉS EN MARKDOWN.

1. FEUILLE DE ROUTE & JALONS (roadmap)
- Titre : `# FEUILLE DE ROUTE STRATÉGIQUE : [Nom du Projet]`.
- Découpage en phases (Phase 1 : Fondations, Phase 2 : MVP, Phase 3 : Scale).
- Jalons clairs avec livrables attendus.
- Estimation réaliste des délais.

2. ARCHITECTURE & STACK RECOMMANDÉE (architecture)
- Titre : `# ARCHITECTURE TECHNIQUE ET STACK LOGICIELLE`.
- Justification des choix technologiques par rapport au projet.
- Schéma conceptuel de l'architecture (en texte/Markdown).
- Recommandations sur l'hébergement et la scalabilité.

3. BACKLOG INITIAL & DÉFINITION DU MVP (backlog)
- Titre : `# BACKLOG PRODUIT ET PÉRIMÈTRE MVP`.
- Liste des User Stories prioritaires pour le lancement.
- Définition stricte de ce qui est "In Scope" et "Out of Scope" pour la V1.
- Critères d'acceptation pour les fonctionnalités clés.

4. PITCH & STRATÉGIE DE LANCEMENT (pitch)
- Titre : `# PITCH COMMERCIAL ET STRATÉGIE GO-TO-MARKET`.
- Elevator Pitch (30 secondes).
- Analyse de la proposition de valeur unique (USP).
- Canaux d'acquisition suggérés pour les premiers utilisateurs.
```

---

## 8. DÉPENDANCES

Extraits exacts de `package.json` liés au cycle de génération :

```json
{
  "dependencies": {
    "@google/genai": "^1.17.0",
    "html2pdf.js": "^0.14.0",
    "react-markdown": "^10.1.0"
  }
}
```

---

## 9. EXEMPLES RÉELS

Voici 3 exemples réels de documents générés (code HTML final tel qu'injecté dans le fichier `.doc` lors de l'export Word).

### Exemple 1 : Export Word brut d'une Attestation (Mode Completion - Thème Premium Bleu)

```html
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>attestation</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; }
    h1 { color: #0f172a; font-size: 24pt; margin-top: 24pt; margin-bottom: 12pt; font-weight: bold; }
    h2 { color: #1e293b; font-size: 18pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4pt; }
    h3 { color: #334155; font-size: 14pt; margin-top: 16pt; margin-bottom: 8pt; font-weight: bold; }
    p { margin-bottom: 10pt; text-align: justify; }
    ul, ol { margin-bottom: 10pt; }
    li { margin-bottom: 5pt; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 15pt; color: #475569; font-style: italic; margin: 15pt 0; background: #f8fafc; padding-top: 10pt; padding-bottom: 10pt; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 20pt 0; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 15pt; }
    th, td { border: 1px solid #e2e8f0; padding: 8pt; text-align: left; }
    th { background-color: #f8fafc; font-weight: bold; }
    .certifie { color: #94a3b8; font-size: 40pt; text-align: center; transform: rotate(-45deg); opacity: 0.1; }
    img { max-width: 150px; height: auto; }
    
    /* Specific for Attestation */
    .attestation-mode h1 { text-align: center; text-transform: uppercase; letter-spacing: 2pt; color: #000; }
    .attestation-mode { padding: 40pt; border: 1pt solid #cbd5e1; }
  </style>
</head>
<body class="attestation-mode">
  <h1>ATTESTATION DE RÉALISATION DE PRESTATION</h1>
  <hr />
  <p>Je soussignée, <strong>Sarah Jenkins</strong>, agissant en qualité de représentante légale de la société <strong>Nexus Logistique</strong>, certifie par la présente que M. <strong>Alex Mercer</strong>, intervenant en qualité d'<strong>Architecte Logiciel</strong>, a réalisé avec succès la prestation d'ingénierie informatique relative au projet SaaS dénommé <strong>RouteOptima</strong>.</p>
  <p>La prestation s'est déroulée sur une durée de <strong>6 mois</strong> et a impliqué le déploiement des technologies suivantes : React, Next.js, Node.js, PostgreSQL, API Google Maps, Redis.</p>
  <h2>Périmètre et Fonctionnalités Livrées</h2>
  <ul>
    <li>Suivi des chauffeurs en temps réel</li>
    <li>Calcul automatisé des itinéraires</li>
    <li>Tableau de bord de répartition par glisser-déposer</li>
    <li>Notifications SMS aux clients</li>
  </ul>
  <h2>Résultats Constatés</h2>
  <p>Les travaux livrés ont permis une réduction des coûts de carburant moyens de 18 %, une amélioration du taux de livraison à temps de 82 % à 96 %, ainsi que l'intégration de 50 chauffeurs le premier mois.</p>
  <p>Cette attestation est délivrée pour valoir ce que de droit.</p>
  <hr />
  <p style="text-align: right;">Fait à Paris, France, le 02 Avril 2026</p>
  <p style="text-align: right;"><strong>Sarah Jenkins</strong><br />Nexus Logistique</p>
  <hr />
  <h3>Validation & Authenticité numérique</h3>
  <p>Ce document officiel est certifié numériquement. Pour vérifier l'authenticité de cette attestation de prestation et consulter les travaux ou le profil professionnel associé, veuillez scanner le code QR ci-dessous :</p>
  <p><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0-116-202&data=https%3A%2F%2Flinkedin.com%2Fin%2Falexmercer" alt="QR Code d'authentification" /></p>
</body>
</html>
```

### Exemple 2 : Feuille de route & Jalons (Mode Initiation - Thème Classic Vert)

```html
<div class="markdown-roadmap font-sans">
  <h1>FEUILLE DE ROUTE STRATÉGIQUE : PawConnect</h1>
  <p>Plan d'action structuré pour le déploiement de l'application mobile collaborative PawConnect par Thomas Klein (Entrepreneur Tech).</p>
  
  <h2>Phase 1 : Fondations & Conception (Mois 1)</h2>
  <h3>Jalon 1.1 : Maquettes et Architecture</h3>
  <ul>
    <li>Finalisation du parcours utilisateur UI/UX</li>
    <li>Initialisation du projet React Native et configuration Firebase</li>
    <li>Mise en place de l'authentification et des profils de chiens</li>
  </ul>
  
  <h2>Phase 2 : Développement du MVP (Mois 2)</h2>
  <h3>Jalon 2.1 : Cœur fonctionnel</h3>
  <ul>
    <li>Intégration du Google Maps SDK pour la géolocalisation en temps réel</li>
    <li>Développement du module de messagerie instantanée</li>
    <li>Tests internes de charge et de batterie</li>
  </ul>
  
  <h2>Phase 3 : Lancement Bêta & Validation (Mois 3)</h2>
  <h3>Jalon 3.1 : Go-To-Market Berlin</h3>
  <ul>
    <li>Déploiement sur les stores (iOS App Store & Google Play)</li>
    <li>Campagne d'acquisition sur Berlin pour atteindre 1000 utilisateurs actifs</li>
    <li>Collecte des retours et validation du modèle de gardiennage collaboratif</li>
  </ul>
</div>
```

### Exemple 3 : Backlog initial MVP (Mode Initiation)

```html
<div class="markdown-backlog font-sans">
  <h1>BACKLOG PRODUIT ET PÉRIMÈTRE MVP</h1>
  <p>Projet : PawConnect | Porteur : Thomas Klein</p>
  
  <h2>Périmètre In Scope (MVP V1)</h2>
  <ul>
    <li>Création de compte propriétaire et profil détaillé du chien (race, caractère)</li>
    <li>Carte interactive affichant les promeneurs actifs à moins de 2km</li>
    <li>Chat temps réel 1-to-1 pour organiser une promenade commune</li>
    <li>Demande de gardiennage ponctuel avec validation par notification push</li>
    <li>Système de notation à 5 étoiles post-gardiennage</li>
  </ul>
  
  <h2>Périmètre Out of Scope (Post-V1 / V2)</h2>
  <ul>
    <li>Paiement intégré ou monétisation par abonnement Premium</li>
    <li>Boutique en ligne d'accessoires pour animaux</li>
    <li>Assurance santé animale intégrée</li>
  </ul>
</div>
```

---

## 10. MODÈLE DE DONNÉES

Interfaces TypeScript officielles extraites du dépôt :

### Interface Formulaire (`ProjectData` dans `/src/App.tsx`)
```typescript
export interface ProjectData {
  developerName: string;
  developerStatus: string;
  clientName: string;
  companyName: string;
  projectName: string;
  projectType: string;
  description: string;
  technologies: string;
  keyFeatures: string;
  results: string;
  duration: string;
  clientContact: string;
  manualTime: string;
  manualLocation: string;
  githubLink: string;
  linkedinLink: string;
}
```

### Interface Réponse IA (`GeneratedDocs` dans `/src/services/geminiService.ts`)
```typescript
export interface GeneratedDocs {
  // Mode Completion (Fin de projet)
  attestation?: string;
  technicalSummary?: string;
  cvVersion?: string;
  linkedinVersion?: string;
  
  // Mode Initiation (Idée / Cadrage)
  roadmap?: string;
  architecture?: string;
  backlog?: string;
  pitch?: string;
}
```

### Interface Historique Local (`HistoryItem` dans `/src/App.tsx`)
```typescript
export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: ProjectData;
  generatedDocs: GeneratedDocs;
  phase: 'completion' | 'initiation';
}
```
