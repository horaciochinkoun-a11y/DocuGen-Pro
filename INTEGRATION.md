# Guide d'intégration — DocuGen-Pro Render Engine

## Ce qui change dans ton app

**Avant :** IA → Markdown → react-markdown → HTML → Blob `.doc` (faux Word)
**Après :** IA → JSON → validation → `docx.js` → vrai `.docx` / PDF

---

## Étape 1 : Installer les dépendances

```bash
npm install docx@^9.6.1 marked@^18.0.0 ajv@^8.17.1 ajv-formats@^3.0.1
```

---

## Étape 2 : Copier le moteur de rendu

Copie les dossiers `themes/`, `generators/`, `src/` dans ton projet (ex: `src/docgen/`).

Structure finale dans ton projet :
```
src/
└── docgen/
    ├── themes/palette.js
    ├── generators/
    │   ├── _base.generator.js
    │   ├── attestation.generator.js
    │   ├── roadmap.generator.js
    │   └── ... (6 autres)
    └── src/
        ├── markdownToDocx.js
        ├── render.js
        └── registry/documentTypes.registry.js
```

---

## Étape 3 : Remplacer la fonction de génération DOCX

Dans ton fichier `App.tsx` (ou là où tu génères le `.doc` actuellement), remplace :

```typescript
// AVANT — faux .doc HTML
const htmlContent = `<html>...${renderedMarkdown}...</html>`;
const blob = new Blob([htmlContent], { type: 'application/msword' });
```

Par :

```typescript
// APRÈS — vrai .docx
import { renderDocument } from './docgen/src/render';

const docxData = {
  meta: {
    documentId:   crypto.randomUUID(),
    documentType: formData.mode === 'completion' ? selectedDocType : selectedDocType,
    theme:        `${designSystem}-${theme}`, // ex: "premium-light", "classic-dark"
    generatedAt:  new Date().toISOString(),
  },
  formData: formData,      // ton ProjectData existant, directement
  content: {
    // Clé dynamique selon le type de document
    [`${selectedDocType}Markdown`]: generatedMarkdown,
  },
};

const { buffer, filename } = await renderDocument(docxData, { skipQr: false });
const blob = new Blob([buffer], {
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
});
const url = URL.createObjectURL(blob);
const a   = document.createElement('a');
a.href    = url;
a.download = filename;  // ex: "attestation_docugen-pro_premium-light.docx"
a.click();
URL.revokeObjectURL(url);
```

---

## Étape 4 : Mapper `designSystem` + `theme` vers le thème palette

Ton app a deux variables : `designSystem` (premium/classic) et `theme` (light/dark).
Le moteur attend une chaîne combinée. Crée un helper :

```typescript
// utils/getDocxTheme.ts
type DesignSystem = 'premium' | 'classic';
type Theme        = 'light'   | 'dark';

export function getDocxTheme(designSystem: DesignSystem, theme: Theme): string {
  return `${designSystem}-${theme}`;  // "premium-light" | "premium-dark" | "classic-light" | "classic-dark"
}
```

---

## Étape 5 : Mapper les types de documents

Ton app utilise des types comme `'attestation'`, `'roadmap'`, etc.
Ils correspondent **exactement** aux clés du registre — pas de mapping nécessaire.

Les clés valides :
- Mode Completion : `attestation`, `technicalSummary`, `cvVersion`, `linkedinVersion`
- Mode Initiation : `roadmap`, `architecture`, `backlog`, `pitch`

---

## Étape 6 : Prompt IA — forcer le JSON

**Actuellement** le prompt demande du Markdown. **Ne change pas ça** — le moteur
accepte du Markdown dans le champ `content.xxxMarkdown`. L'IA continue à générer
du Markdown, le moteur le parse et le convertit en DOCX propre.

Ce que TU dois ajouter dans ton prompt système :

```
RÈGLES DE FORMATAGE STRICTES :
- Utilise uniquement des titres ## et ### (jamais # dans le corps)
- Les listes à puces commencent par "- " (tiret espace)
- Les tableaux utilisent le format Markdown standard | col | col |
- NE PAS utiliser de HTML, de classes CSS, ni de balises <div>
- NE PAS écrire "QR_CODE_AUTHENTICATION_URL_PLACEHOLDER" — c'est injecté automatiquement
```

---

## Étape 7 : QR Code en production

Le QR est récupéré depuis `api.qrserver.com` au moment de la génération.
Si ton app est 100% client-side (pas de serveur), retire `skipQr: true` et laisse
le fetch se faire dans le browser. `https` fetch fonctionne depuis le browser.

Si tu passes à un backend Node.js (recommandé pour la conversion PDF) : le fetch
fonctionne identiquement côté serveur avec le module `https` natif de Node.

---

## Bug connu docx.js v9 — à mémoriser

**Problème :** `border: { left: ..., bottom: ... }` sur un `Paragraph` génère un XML
invalide. L'ordre OOXML requis est `top/left/bottom/right` mais docx.js v9 génère
`top/bottom/left/right`.

**Règle :** dans tout nouveau générateur, n'utilise **jamais** `border` avec plus d'un
côté sur un `Paragraph`. Pour une bordure gauche seule, utilise une `Table` à une
cellule avec `tcBdr.left` (ce pattern est déjà dans `markdownToDocx.js`).

---

## Ajouter un nouveau type de document (rappel)

1. Créer `generators/monType.generator.js` (copier un existant, adapter)
2. Ajouter une entrée dans `src/registry/documentTypes.registry.js`
3. Ajouter un `case "monType":` dans le `switch` de `src/render.js`
4. C'est tout.

---

## Structure des thèmes — référence rapide

| Thème | Accentuation | Fond document | Texte |
|---|---|---|---|
| premium-light | #0C91EB (bleu cobalt) | #FFFFFF | #171717 |
| premium-dark  | #0C91EB (bleu cobalt) | #171717 | #FAFAFA |
| classic-light | #22C55E (vert émeraude) | #FFFFFF | #171717 |
| classic-dark  | #22C55E (vert émeraude) | #171717 | #FAFAFA |

Police attestation en **Premium** : Palatino Linotype (fallback Word pour Playfair Display).
Police attestation en **Classic** : Calibri (même que les autres documents).
