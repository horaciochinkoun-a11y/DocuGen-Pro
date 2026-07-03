# Charte Graphique — DocuGen Pro
> Système de design hybride et modulaire (Premium SaaS vs Classic Flat) conçu pour les créateurs indépendants, freelances et ingénieurs SaaS.

**Version :** 1.2  
**Thème :** Système (Support natif du mode Sombre et Clair)  
**Dernière mise à jour :** 03 Juillet 2026  
**Propriétaire :** Horacio Chinkoun (Propriété exclusive et personnelle)

---

## Table des matières
1. [Philosophie du Design & Rationale](#1-philosophie-du-design--rationale)
2. [Palette de Couleurs & Tokens de Teinte](#2-palette-de-couleurs--tokens-de-teinte)
3. [Typographie, Rôles & Échelle Typographique](#3-typographie-rôles--échelle-typographique)
4. [Échelle d'Espacement & Paramètres de Layout](#4-échelle-despacement--paramètres-de-layout)
5. [Border Radius & Règles Géométriques](#5-border-radius--règles-géométriques)
6. [Composants UI & États Interactifs](#6-composants-ui--états-interactifs)
7. [Variantes du Logo & Directives de Marque](#7-logo--directives-de-marque)
8. [Système Iconographique](#8-système-iconographique)
9. [Surfaces, Élévation & Règle Anti-Empilement Mobile (8bis)](#9-surfaces-élévation--règle-anti-empilement-mobile-8bis)
10. [Imagerie & Traitements Graphiques](#10-imagerie--traitements-graphiques)
11. [Système de Grille & Breakpoints](#11-système-de-grille--breakpoints)
12. [Do's & Don'ts](#12-dos--donts)
13. [Accessibilité & Directives WCAG](#13-accessibilité--directives-wcag)
14. [Tokens CSS — Quick Start](#14-tokens-css--quick-start)

---

## 1. Philosophie du Design & Rationale

DocuGen Pro résout un défi de conception unique : offrir à la fois une interface immersive haut de gamme ("Premium SaaS") et une interface utilitaire ultra-efficace, épurée et sans distraction ("Classic Flat"). 

- **Mode Premium SaaS** : Adopte des effets de verre trempé (glassmorphism), des dégradés subtils, des ombres satinées douces et de grands rayons d'arrondis. Sa personnalité inspire la sophistication, la confiance et le niveau de qualité d'un outil moderne et valorisant.
- **Mode Classic Flat** : Réintroduit un design plat, carré, sans ombre ni transparence, basé sur des aplats de vert émeraude robustes et des angles vifs. Sa personnalité évoque la robustesse technique, la rapidité d'exécution et la sobriété administrative des outils internes classiques.

La transition d'un mode à l'autre s'effectue dynamiquement côté client sans perturber la structure logique de la page, démontrant l'indépendance sémantique des styles.

---

## 2. Palette de Couleurs & Tokens de Teinte

### A. Thème Premium SaaS (Bleu & Indigo)

| Nom sémantique | Valeur Hex | Token CSS | Rôle primaire | Restrictions | Niveau d'autorité |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand 50 (Ice Blue)** | `#f0f7ff` | `--color-brand-50` | Fond alternatif très doux, badges actifs | Ne pas utiliser comme texte principal | Décorative |
| **Brand 500 (Vibrant Sky)** | `#0c91eb` | `--color-brand-500` | Accents visuels, focus rings, pastilles d'état | Pas de texte normal sur fond blanc (AA risqué) | Secondaire |
| **Brand 600 (Action Blue)** | `#0074ca` | `--color-brand-600` | Couleur d'action clé, CTA principaux, boutons actifs | Ne pas utiliser sur fond sombre sans l'adapter | Principale |
| **Brand 800 (Deep Navy)** | `#064f86` | `--color-brand-800` | Liens au survol, en-têtes d'importance secondaire | Ne pas utiliser pour de grands fonds | Secondaire |
| **Brand 950 (Midnight Abyss)** | `#072a4a` | `--color-brand-950` | Bordures très sombres, arrière-plan de pied de page | Ne pas appliquer au corps de texte courant | Décorative |

### B. Thème Classic Flat (Émeraude & Forêt)

| Nom sémantique | Valeur Hex | Token CSS | Rôle primaire | Restrictions | Niveau d'autorité |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Classic 50 (Emerald Mist)** | `#f0fdf4` | `--color-brand-50` | Fond de succès, surbrillance d'éléments actifs | Ne pas utiliser pour du texte courant | Décorative |
| **Classic 500 (Vibrant Emerald)** | `#22c55e` | `--color-brand-500` | Pastille de validation, icônes de succès | Pas de texte normal sur fond blanc | Secondaire |
| **Classic 600 (Corporate Green)** | `#16a34a` | `--color-brand-600` | Action d'édition, boutons et CTA en mode Classic | Ne pas utiliser sur fond gris foncé en petite taille | Principale |
| **Classic 950 (Dark Pine)** | `#052e16` | `--color-brand-950` | Fond de bouton sélectionné, bordure de table Classic | Ne pas utiliser en couleur de fond globale | Décorative |

### C. Teintes Neutres Partagées

| Nom sémantique | Valeur Hex | Token CSS | Rôle primaire | Restrictions | Niveau d'autorité |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas Light** | `#fafafa` | `--color-neutral-50` | Fond de page par défaut (Clair) | Ne pas appliquer aux textes | Principale |
| **Canvas Dark** | `#0a0a0a` | `--color-neutral-950` | Fond de page par défaut (Sombre) | Ne pas utiliser en mode clair | Principale |
| **Text Dark** | `#171717` | `--color-neutral-900` | Texte principal en mode Clair | Ne pas utiliser sur fond sombre | Principale |
| **Text Light** | `#fafafa` | `--color-neutral-50` | Texte principal en mode Sombre | Ne pas utiliser sur fond clair | Principale |
| **Border Light** | `#e5e5e5` | `--color-neutral-200` | Bordures de séparation en mode Clair | Ne pas appliquer au texte | Décorative |
| **Border Dark** | `#262626` | `--color-neutral-800` | Bordures de séparation en mode Sombre | Ne pas appliquer au texte | Décorative |

---

## 3. Typographie, Rôles & Échelle Typographique

### A. Polices de Caractères

1. **Inter** (Google Fonts)
   - **Substituts** : `ui-sans-serif`, `system-ui`, `sans-serif`.
   - **Poids utilisés** : `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold), `800` (Extra-Bold).
   - **Rationale** : Inter offre une lisibilité maximale pour les interfaces denses, les formulaires complexes et les outils de saisie de DocuGen Pro. Elle neutralise la fatigue visuelle.
2. **Playfair Display** (Google Fonts)
   - **Substituts** : `ui-serif`, `Georgia`, `serif`.
   - **Poids utilisés** : `700` (Bold), `900` (Black).
   - **Rationale** : Apporte une touche éditoriale d'autorité et d'élégance aux en-têtes et aux documents certifiés (comme l'Attestation) en mode Premium.
3. **JetBrains Mono** (Google Fonts)
   - **Substituts** : `ui-monospace`, `SFMono-Regular`, `monospace`.
   - **Poids utilisés** : `400` (Regular), `500` (Medium).
   - **Rationale** : Parfaite pour les métadonnées, le code source ou la structure de projet, elle évoque la précision de l'ingénierie logicielle.

### B. Échelle Typographique

| Rôle | Taille (px) | Line-height | Letter-spacing | Token CSS | Règle de tracking / Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `48px` | `1.1` | `-0.02em` | `--text-hero` | `tracking-tight` pour éviter l'éparpillement sur grands écrans |
| **Display Title** | `30px` | `1.2` | `-0.01em` | `--text-display` | `tracking-tight` pour un effet éditorial fort |
| **Section Title** | `20px` | `1.3` | `0` | `--text-section` | Neutre, pour préserver la structure naturelle des blocs |
| **Subheading** | `16px` | `1.4` | `0` | `--text-subheading` | Neutre, assure la liaison avec les paragraphes |
| **Body text** | `14px` | `1.6` | `0` | `--text-body` | Grand line-height pour faciliter la lecture fluide |
| **Caption / Label**| `12px` | `1.5` | `0.05em` | `--text-caption` | `uppercase` et légèrement espacé pour contrer la petitesse |

---

## 4. Échelle d'Espacement & Paramètres de Layout

### A. Échelle de base
Le système d'espacement de DocuGen Pro repose sur un **incrément de 4px** basé sur les standards modernes de grille de pixels.

- **4px (`0.25rem`)** : Micro-ajustements (espace entre icône et texte).
- **8px (`0.5rem`)** : Espacement intra-composant (padding interne de petit badge).
- **12px (`0.75rem`)** : Espacement de contrôle (padding vertical d'input).
- **16px (`1rem`)** : Espacement standard de composant (padding de bouton, petits écarts).
- **24px (`1.5rem`)** : Espacement de mise en page standard (padding de carte, gap de grille).
- **32px (`2rem`)** : Grand espacement (padding de section sur tablette/desktop).
- **48px (`3rem`)** : Espacement macro (écarts entre sections structurelles).

### B. Paramètres globaux de Layout
- **Densité générale** : 
  - *Premium* : **Spacious** (généreuse, respirante, favorisant l'élégance).
  - *Classic* : **Compact** (optimisée pour la densité d'information visible sans défilement).
- **Max-width principal** : `80rem` (`1280px` - Tailwind `max-w-7xl`).
- **Marges de page latérales (Gutter)** :
  - Mobile : `16px` (`p-4`)
  - Tablette/Desktop : `32px` (`p-8`)

---

## 5. Border Radius & Règles Géométriques

| Composant | Premium Radius | Classic Radius | Token CSS | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Bouton d'Action** | `12px` (`rounded-xl`) | `8px` (`rounded-lg`) | `--radius-action` | Premium privilégie un toucher fluide, Classic reste rigoureux |
| **Input / Formulaire** | `12px` (`rounded-xl`) | `8px` (`rounded-lg`) | `--radius-input` | Alignement structurel avec la taille des boutons |
| **Petits Badges / Tags**| `8px` (`rounded-lg`) | `4px` (`rounded-md`) | `--radius-badge` | Ne doit pas ressembler à une pilule ronde pour éviter le look "gadget" |
| **Cartes & Conteneurs** | `24px` (`rounded-3xl`) | `8px` (`rounded-lg`) | `--radius-container` | Premium offre un grand arrondi satiné, Classic referme la structure |
| **Modales de dialogue** | `32px` (`rounded-full`*) | `8px` (`rounded-lg`) | `--radius-modal` | *Premium utilise un grand arrondi pour détacher la boîte du fond |

---

## 6. Composants UI & États Interactifs

### A. Bouton d'Action Principal (Action Button)
- **Background** : Premium: `--color-brand-600` (`#0074ca`) / Classic: `--color-brand-600` (`#16a34a`)
- **Couleur Texte** : `#ffffff`
- **Taille & Poids** : `14px`, `700` (Bold)
- **Casse & Padding** : Premium: `uppercase`, `tracking-wider`, `12px 24px` / Classic: `none`, `12px 20px`
- **Border-radius** : Premium: `12px` / Classic: `8px`

#### États de Contrôle
- **Default** : Fond principal de la marque, ombre moyenne (`shadow-md`), transition douce.
- **Hover** : Augmentation subtile de la luminosité du fond, léger scale up (`scale-[1.01]`).
- **Focus-visible** : Outline prononcée de `--color-brand-500` avec offset de `2px`.
- **Active** : Enfoncement physique (`scale-[0.98]`), assombrissement de 5% du fond.
- **Disabled** : Opacité `0.5`, curseur `not-allowed`, suppression des effets de hover.
- **Loading** : Remplacement de l'icône de gauche par un spinner rotatif SVG standard (`animate-spin`).

### B. Onglets de Navigation (Tab System)
- **Background** : Premium: Transparent, actif avec fond blanc glassmorphic / Classic: Gris très clair, actif avec fond émeraude plat
- **Couleur Texte** : Inactif: `--color-neutral-500` / Actif: `--color-brand-600`
- **Taille & Poids** : `12px`, `800` (Extra-Bold)
- **Casse & Padding** : Premium: `uppercase`, `tracking-widest`, `10px 20px` / Classic: `none`, `10px 16px`

#### États de Contrôle
- **Default** : Couleur gris neutre inactif, sans bordure.
- **Hover** : Texte gris foncé, fond de bouton légèrement blanc (`bg-white/40`).
- **Focus-visible** : Outline neutre visible autour de l'onglet actif.
- **Active / Actif** : Rendu clair avec ombre légère (Premium) ou aplat vif de vert sans ombre (Classic).
- **Disabled** : Ignoré dans la navigation, caché ou grisé.

---

## 7. Logo & Directives de Marque

Le logo de DocuGen Pro est un **wordmark technique** associé à une icône d'autorité.

- **Variantes** :
  - *Wordmark complet (Principal)* : Icône `Sparkles` suivie du texte "DocuGen Pro".
  - *Version signature* : Signe "Propriété personnelle de Horacio Chinkoun" en pied de page.
- **Couleurs** :
  - Mode Premium : Bleu cobalt (`#0074ca`) associé au gris foncé (`neutral-900`) en mode clair, et blanc pur sur sombre.
  - Mode Classic : Vert émeraude (`#16a34a`) associé au gris neutre.
- **Taille recommandée** :
  - En-tête : `24px` de hauteur d'icône, texte à `18px`.
  - Favicon : `32x32px` d'icône seule simplifiée.
- **Zone de protection** : Un espace vide équivalent à la hauteur d'une lettre majuscule "D" doit entourer le logo de tous les côtés.
- **Fonds autorisés** : Uniquement sur les surfaces de niveau de base ou de niveau 1 (pas de superposition sur des motifs complexes).
- **Interdictions** : Ne jamais modifier les proportions, ne jamais utiliser de gradients agressifs autres que ceux spécifiés, ne pas appliquer d'ombres dures.

---

## 8. Système Iconographique

- **Source exclusive** : `Lucide React` (aucun SVG fait maison ou import externe non uniforme).
- **Style géométrique** : Icônes filaires d'aspect épuré et ouvert.
- **Stroke (Épaisseur du trait)** : `1.5px` ou `2px` (standardisé pour correspondre au poids visuel du texte courant).
- **Tailles utilisées** :
  - Boutons & Badges : `14px` ou `16px`.
  - Titres et En-têtes : `20px` ou `24px`.
  - Zones d'Empty State : `48px` (pulse animé).
- **Couleurs autorisées** :
  - *Actif / Succès* : `--color-brand-500` (`#0c91eb` ou `#22c55e`).
  - *Inactif / Neutre* : `--color-neutral-400` / `neutral-500`.
- **Règle d'usage** : Une icône seule doit **systématiquement** porter un attribut `aria-label` ou `title` explicite. Le label visuel à côté de l'icône est fortement recommandé pour garantir une excellente accessibilité cognitive.

---

## 9. Surfaces, Élévation & Règle Anti-Empilement Mobile (8bis)

### A. Philosophie d'Élévation
DocuGen Pro utilise la couleur et le contraste plutôt que l'empilement d'ombres pour marquer la hiérarchie.
- **Niveau 0 (Canvas)** : `#fafafa` (Clair) / `#0a0a0a` (Sombre). C'est le fond général.
- **Niveau 1 (Surface/Card)** : `#ffffff` (Clair) / `#171717` (Sombre). Reçoit les formulaires et les zones de texte.
- **Niveau 2 (Overlay/Modal)** : `#ffffff` (Clair) / `#262626` (Sombre). Se détache nettement de l'arrière-plan.

### B. Règle de Séparation Visuelle Responsive (Anti-Empilement) ⚠️ OBLIGATOIRE

> **Principe clé** : Sur mobile (écrans inférieurs à `640px`), la densité d'affichage doit être maximale et la structure doit s'aplatir pour éviter la surcharge cognitive et la perte d'espace utile.

1. **Un seul signal à la fois** : Sur mobile, un conteneur structurel (section, card, bloc de formulaire) ne peut porter **qu'un seul** signal de séparation actif parmi les 4 suivants :
   - ✅ Bordure seule  
   - ✅ Ombre seule  
   - ✅ Rayon de coin (radius) seul  
   - ✅ Changement de couleur de fond seul  
   *Les 3 autres signaux doivent être neutralisés (valeur nulle).*
2. **Interdiction d'imbrication** : Il est strictement interdit d'imbriquer un conteneur délimité (portant une bordure ou une ombre) dans un autre conteneur lui-même délimité. Maximum **1 niveau** de délimitation visuelle actif à la fois.
3. **Syntaxe responsive obligatoire** : Les classes de bordure, d'ombre ou de rayon doivent être réinitialisées en version mobile-first, puis appliquées à partir des breakpoints `sm:` ou `md:`.
   *Exemple correct* : `border-0 shadow-none rounded-none sm:border sm:border-neutral-200 sm:shadow-sm sm:rounded-2xl`
4. **Séparateur par défaut** : Sur mobile, l'espace vertical libre (`gap-y-*`, `space-y-*`) constitue le seul séparateur légitime entre les sections. Pas de "boîtes" dessinées visibles.

---

## 10. Imagerie & Traitements Graphiques

- **Types autorisés** : Graphismes vectoriels purs, tracés d'icônes animés avec `motion/react`, illustrations schématiques géométriques.
- **Style visuel** : Abstrait, technologique, à fort contraste, s'adaptant dynamiquement au mode sombre et clair.
- **Restrictions strictes** : **Interdiction absolue** d'utiliser des photos de stock pixelisées ou des illustrations 3D de type "AI Slop" déconnectées de la sobriété technique de l'application.
- **Traitement d'overlay** : Les arrières-plans d'empty state intègrent un motif filigrane semi-transparent (opacité à `4%` en clair, `8%` en sombre) avec une rotation à `-45°` pour imiter la certification de documents papier réels.

---

## 11. Système de Grille & Breakpoints

DocuGen Pro s'aligne sur les breakpoints standardisés de Tailwind CSS pour garantir un rendu irréprochable sur tous les terminaux de l'écosystème.

- **Mobile (Base)** : `< 640px`  
  - Disposition à colonne unique.
  - Saisie et prévisualisation s'empilent verticalement.
  - Application stricte de la règle 8bis (anti-boîte).
- **Tablette (`sm:` / `md:`)** : `640px` à `1024px`  
  - Transition vers un agencement plus aéré.
  - Activation de petites bordures et d'arrondis légers (`rounded-xl`).
- **Desktop (`lg:`)** : `1024px`  
  - Grille à double colonne asymétrique (Colonne de saisie à gauche: 5 fractions, Colonne de prévisualisation à droite: 7 fractions).
  - Activation complète des effets de verre trempé (Premium) et du panneau de prévisualisation collant (`sticky`).
- **Grand Écran (`xl:`)** : `1280px` et plus  
  - Limitation de la largeur maximale à `max-w-7xl` pour éviter d'étirer inutilement les champs de saisie.
  - Marges latérales généreuses pour équilibrer la mise en page.

---

## 12. Do's & Don'ts

### ✅ DO (À faire absolument)

1. **Do** utiliser `Inter` pour l'interface de l'application et réserver `Playfair Display` spécifiquement aux en-têtes officiels ou documents certifiés.
2. **Do** réinitialiser les ombres et les bordures complexes sur mobile pour n'activer les cartes délimitées qu'à partir de `sm:`.
3. **Do** veiller à ce que chaque icône interactive sans texte explicite possède un attribut `title` ou `aria-label` descriptif pour l'accessibilité.
4. **Do** limiter la sauvegarde d'historique local à un maximum de 30 projets pour préserver la mémoire du navigateur sans plantage de quota.
5. **Do** aligner parfaitement les contrôles de formulaire (inputs, sélecteurs, boutons) sur une même grille de bordure et de rayon (`radius-xl`).
6. **Do** utiliser des transitions de fondu (`motion.div` de 0.2s) lors de l'affichage des résultats pour adoucir le chargement de l'IA.
7. **Do** mentionner clairement "Propriété exclusive de Horacio Chinkoun" sur l'ensemble des documents juridiques et des mentions légales.

### ❌ DON'T (À ne jamais faire)

1. **Don't** imbriquer une carte dotée d'une bordure ou d'une ombre dans une autre boîte elle-même bordée (respect strict du niveau d'imbrication maximal de 1).
2. **Don't** coder des clés d'API Gemini en dur dans le frontend. La clé d'API personnelle de l'utilisateur doit rester dans le `localStorage` local.
3. **Don't** afficher de métriques, statistiques ou données techniques simulées (ex: "Ping: 24ms", "Port: 3000") pour décorer artificiellement l'interface.
4. **Don't** utiliser de dégradés multicolores agressifs pour les arrières-plans de formulaire. Privilégier des teintes neutres douces (`neutral-50` ou `neutral-950`).
5. **Don't** modifier l'identité visuelle de la marque sans mettre à jour en parfaite cohérence l'historique de projet et le document de log de décision.
6. **Don't** surcharger l'application de fenêtres de dialogue intempestives de type `window.alert`, privilégier des bandeaux de notification intégrés au design.
7. **Don't** utiliser des photos de stock génériques ou des illustrations colorées complexes pour illustrer l'empty state de génération.

---

## 13. Accessibilité & Directives WCAG

### A. Ratios de Contraste Calculés (WCAG 2.1 AA)
- **Mode Clair** :
  - Texte principal (`neutral-900` sur `#fafafa`) : **16.5:1** (Niveau AAA validé ✅).
  - Texte secondaire (`neutral-500` sur `#fafafa`) : **4.6:1** (Niveau AA validé ✅).
  - Couleur d'action (`#0074ca` sur blanc) : **4.5:1** (Niveau AA validé ✅).
- **Mode Sombre** :
  - Texte principal (`neutral-50` sur `#0a0a0a`) : **19.2:1** (Niveau AAA validé ✅).
  - Texte secondaire (`neutral-400` sur `#0a0a0a`) : **6.8:1** (Niveau AA validé ✅).
  - Bouton inactif (`neutral-800` sur `#0a0a0a`) : Ne contient pas de texte critique (AA validé ✅).

### B. Directives d'Interaction
- **Focus visible** : Tout élément interactif survolé ou activé au clavier reçoit un anneau d'accentuation `--color-brand-500` de `2px` d'épaisseur avec un décalage (offset) de `2px`.
- **Réduction des mouvements** : Toutes les animations de transition et de chargement respectent la directive système `prefers-reduced-motion` en basculant automatiquement vers un fondu d'opacité simple et instantané sans déplacement spatial.
- **Textes alternatifs** : Le filigrane en arrière-plan d'attestation ("CERTIFIÉ") est explicitement ignoré par les lecteurs d'écran à l'aide de l'attribut `aria-hidden="true"` pour éviter de polluer la restitution vocale du contenu officiel.

---

## 14. Tokens CSS — Quick Start

### A. Déclaration dans `index.css` (Tailwind CSS v4)
```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
  
  --color-brand-50: #f0f7ff;
  --color-brand-100: #e0effe;
  --color-brand-200: #bae0fd;
  --color-brand-300: #7cc8fb;
  --color-brand-400: #36acf7;
  --color-brand-500: #0c91eb;
  --color-brand-600: #0074ca;
  --color-brand-700: #015ca3;
  --color-brand-800: #064f86;
  --color-brand-900: #0b426f;
  --color-brand-950: #072a4a;
}
```

### B. Configuration de la classe d'override Classic Flat
Pour activer instantanément le design Classic sur l'ensemble de l'application, appliquez la classe `.classic-design` sur le conteneur racine :
```css
.classic-design {
  --color-brand-50: #f0fdf4;
  --color-brand-100: #dcfce7;
  --color-brand-200: #bbf7d0;
  --color-brand-300: #86efac;
  --color-brand-400: #4ade80;
  --color-brand-500: #22c55e;
  --color-brand-600: #16a34a;
  --color-brand-700: #15803d;
  --color-brand-800: #166534;
  --color-brand-900: #14532d;
  --color-brand-950: #052e16;
}
```

---

## 15. Moteur de Rendu Word / DOCX (DocuGen-Pro Render Engine)

Le moteur de rendu unifié de DocuGen-Pro est l'extension physique du système de design web directement dans l'écosystème de bureautique natif Microsoft Word. Il assure la fidélité de marque entre l'écran interactif de l'application et les documents imprimables produits.

### A. Philosophie & Rationale (Pourquoi ?)
- **Continuité d'identité** : Un document exporté ne doit pas rompre le lien de confiance visuel établi dans le SaaS. Si un utilisateur sélectionne l'identité "Premium Dark" ou "Classic Light", le document `.docx` généré adopte immédiatement la palette exacte de teintes, de contrastes, d'espacements et d'autorité typographique correspondante.
- **Structure native unifiée (No HTML-to-Blob hacks)** : Contrairement aux anciennes versions qui encapsulaient du code HTML brut dans des fichiers d'extension fictive `.doc` (provoquant des avertissements de sécurité et des ruptures d'alignement), l'utilisation d'éléments OpenXML natifs garantit la conformité totale aux standards ISO de l'office automation.
- **Sobriété et élégance administrative** : Les espacements et hauteurs de lignes ont été optimisés pour que les documents tiennent naturellement sur le nombre de pages prévu, évitant les lignes orphelines et les ruptures de paragraphes abruptes.

### B. Mappage des Thèmes & Polices (Quoi ?)

Le moteur applique dynamiquement l'une des 4 combinaisons de styles sémantiques basées sur la configuration choisie :

| Thème Document | Accentuation | Fond Document | Texte Principal | Police Titres & Corps | Rationale Visuel |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **premium-light** | `#0C91EB` (Bleu Cobalt) | `#FAFAFA` / `#FFFFFF` | `#171717` | *Attestation* : Palatino Linotype<br>*Général* : Calibri | Sophistication éditoriale moderne, clarté administrative, confiance |
| **premium-dark** | `#0C91EB` (Bleu Cobalt) | `#171717` (Charcoal) | `#FAFAFA` | *Attestation* : Palatino Linotype<br>*Général* : Calibri | Rendu "Écran Sombre" haut de gamme, idéal pour la lecture nocturne |
| **classic-light** | `#22C55E` (Vert Émeraude) | `#FAFAFA` / `#FFFFFF` | `#171717` | *Tous* : Calibri | Robustesse technique standardisée, clarté absolue, neutralité |
| **classic-dark** | `#22C55E` (Vert Émeraude) | `#171717` (Charcoal) | `#FAFAFA` | *Tous* : Calibri | Version utilitaire sobre à forte densité visuelle |

### C. Règles d'Usage & Implémentation Visuelle (Comment ?)

#### 1. Titres et Hiérarchie Sémantique
- **Comportement de saut** : Les titres de niveau H2 appliquent une bordure basse discrète (`border-bottom` de `size: 4` de couleur `--color-neutral-200`) pour marquer visuellement la structure des chapitres sans encombrer la page.
- **Règle anti-orphelins** : Tous les paragraphes de titres (`Heading1`, `Heading2`, `Heading3`) portent impérativement la propriété `keepWithNext: true` pour contraindre MS Word à conserver le titre sur la même page que le paragraphe qui le suit.

#### 2. Bloc de citation & Éléments en exergue (Blockquotes)
- **Déviation standard** : L'utilisation de bordures gauches directes sur un `Paragraph` docx.js pose de sévères problèmes d'espacement de texte (padding interne).
- **Solution de design** : Les citations et pitchs d'importance sont encapsulés dans une `Table` invisible d'une seule cellule (`width: 9026 dxa`), dotée d'une bordure gauche épaisse (`size: 16` de couleur `--color-brand-500`) et d'un ombrage de fond complet correspondant à la couleur d'arrière-plan du thème blockquote. Cela préserve un retrait parfait de `480 dxa` à gauche et un confort de lecture optimal.

#### 3. Blocs de Code & Spécifications (Code blocks)
- Les listes ou blocs de codes techniques (notamment sur l'architecture) utilisent exclusivement la police monospace `Courier New` (à défaut de JetBrains Mono sur le poste utilisateur).
- L'espacement interligne est compressé, la taille de police est de `9pt` (`size: 18`) et le fond reçoit un ombrage gris clair (`#F1F5F9`) ou anthracite sombre (`#1E293B`) selon le mode.

#### 4. Intégration et Validation de Sécurité (QR Codes)
- **Authenticité numérique** : Les documents de type `attestation` intègrent obligatoirement un code QR d'authenticité reliant le document physique au profil numérique certifié du développeur (GitHub ou LinkedIn).
- **Règle d'isomorphisme réseau** : Le code QR est téléchargé dynamiquement sous forme de flux binaire (PNG) via `globalThis.fetch` et injecté sous forme d'élément vectoriel `ImageRun` de dimensions `150x150 pixels`.
- **Règle de robustesse locale** : Si le réseau est indisponible ou en environnement isolé (par ex. pendant des phases de test local), le paramètre `skipQr: true` désactive élégamment le téléchargement et injecte une mention alternative textuelle propre pour ne pas bloquer le flux d'exportation de l'application.

#### 5. Gestion des Bugs OOXML (docx.js v9)
- ⚠️ **Alerte technique** : Définir des bordures composites (`top`, `bottom`, `left`, `right`) sur un élément `Paragraph` génère un XML corrompu sous Microsoft Word en raison de l'inversion d'écriture des balises OOXML par la bibliothèque docx.js (ordre `top/bottom/left/right` généré au lieu de `top/left/bottom/right`).
- **Règle de rechange** : Pour appliquer un encadrement complet ou des bordures latérales opposées, utiliser **toujours** des cellules de tableaux (`TableCell`) avec leurs propriétés d'ombrage et de bordure interne, plutôt que de manipuler directement les bordures de paragraphes.

---

## Éléments à définir

Tous les éléments d'interface du système de design hybride de DocuGen Pro ont été spécifiés et validés à l'aide de l'implémentation opérationnelle. Aucun statut indéfini persistant n'est à déclarer pour cette version de production.
- [x] Couleur sémantique d'erreur
- [x] Rayon de courbure des cartes Premium
- [x] Échelle d'espacement de base
- [x] Directives de séparation visuelle mobile responsive

