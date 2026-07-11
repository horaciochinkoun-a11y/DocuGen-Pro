// themes/palette.js
// Source unique de vérité pour les 4 variantes visuelles de DocuGen-Pro.
// Toutes les valeurs hexadécimales sont extraites directement de /src/index.css.
// Aucun générateur ne doit coder des couleurs en dur - il importe ce fichier.

const PALETTES = {

  // ─── PREMIUM LIGHT ───────────────────────────────────────────
  // designSystem: "premium" + theme: "light" (configuration par défaut de l'app)
  "premium-light": {
    // Couleurs de marque (bleu cobalt)
    brand: {
      primary:   "0C91EB",  // --color-brand-500 : accents, soulignements, bordures colorées
      dark:      "0074CA",  // --color-brand-600 : titres H1, éléments forts
      darker:    "015CA3",  // --color-brand-700 : usage rare, emphase sur fond clair
    },
    // Couleurs de document
    page: {
      background: "FAFAFA",  // fond de page général (neutral-50)
      card:       "FFFFFF",  // fond du document / carte blanche
      border:     "E5E5E5",  // bordures légères (neutral-200)
    },
    // Couleurs de texte
    text: {
      primary:   "171717",  // texte courant (neutral-900)
      secondary: "525252",  // texte secondaire (neutral-600)
      muted:     "737373",  // métadonnées, légendes (neutral-500)
      onDark:    "FFFFFF",  // texte sur fond coloré (ex: entête de tableau)
    },
    // Couleurs spéciales pour le blockquote (Pitch document)
    blockquote: {
      border:     "0C91EB",  // bordure gauche
      background: "F0F7FF",  // fond léger (brand-50)
      text:       "064F86",  // texte (brand-800)
    },
    // QR code (attestation uniquement) - paramètre API qrserver
    qr: {
      apiColor: "0-116-202",  // RVB format qrserver (= #0074CA)
    },
    // Police de l'attestation (Playfair Display en Premium)
    attestationFont: "Palatino Linotype",  // fallback Word pour Playfair Display
    bodyFont:        "Calibri",             // fallback Word pour Inter
    monoFont:        "Courier New",         // fallback Word pour JetBrains Mono
  },

  // ─── PREMIUM DARK ────────────────────────────────────────────
  // designSystem: "premium" + theme: "dark"
  "premium-dark": {
    brand: {
      primary:   "0C91EB",
      dark:      "36ACF7",  // brand-400 plus lisible sur fond sombre
      darker:    "7CC8FB",  // brand-300 pour les titres sur fond très sombre
    },
    page: {
      background: "0A0A0A",  // neutral-950
      card:       "171717",  // neutral-900 : fond du document
      border:     "262626",  // neutral-800 : bordures
    },
    text: {
      primary:   "FAFAFA",  // neutral-50
      secondary: "D4D4D4",  // neutral-300
      muted:     "A3A3A3",  // neutral-400
      onDark:    "FFFFFF",
    },
    blockquote: {
      border:     "0C91EB",
      background: "072A4A",  // brand-950
      text:       "BAE0FD",  // brand-200
    },
    qr: {
      apiColor: "0-116-202",
    },
    attestationFont: "Palatino Linotype",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },

  // ─── CLASSIC LIGHT ───────────────────────────────────────────
  // designSystem: "classic" + theme: "light" (.classic-design CSS class)
  "classic-light": {
    brand: {
      primary:   "22C55E",  // --color-brand-500 (vert émeraude)
      dark:      "16A34A",  // --color-brand-600
      darker:    "15803D",  // --color-brand-700
    },
    page: {
      background: "FAFAFA",
      card:       "FFFFFF",
      border:     "E5E5E5",
    },
    text: {
      primary:   "171717",
      secondary: "525252",
      muted:     "737373",
      onDark:    "FFFFFF",
    },
    blockquote: {
      border:     "22C55E",
      background: "F0FDF4",  // brand-50 vert
      text:       "166534",  // brand-800 vert
    },
    qr: {
      apiColor: "22-163-74",  // RVB format qrserver (= #16A34A)
    },
    // En mode Classic : l'attestation utilise AUSSI sans-serif (pas Playfair Display)
    attestationFont: "Calibri",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },

  // ─── CLASSIC DARK ────────────────────────────────────────────
  // designSystem: "classic" + theme: "dark"
  "classic-dark": {
    brand: {
      primary:   "22C55E",
      dark:      "4ADE80",  // brand-400 plus lisible sur fond sombre
      darker:    "86EFAC",  // brand-300
    },
    page: {
      background: "0A0A0A",
      card:       "171717",
      border:     "262626",
    },
    text: {
      primary:   "FAFAFA",
      secondary: "D4D4D4",
      muted:     "A3A3A3",
      onDark:    "FFFFFF",
    },
    blockquote: {
      border:     "22C55E",
      background: "052E16",  // brand-950 vert
      text:       "BBF7D0",  // brand-200 vert
    },
    qr: {
      apiColor: "22-163-74",
    },
    attestationFont: "Calibri",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },
};

// Toutes les variantes valides (utilisées pour valider les paramètres entrants)
const VALID_THEMES = Object.keys(PALETTES);

/**
 * Retourne la palette du thème demandé.
 * Lève une erreur immédiatement si le thème n'existe pas — pas de fallback silencieux.
 */
function getPalette(theme) {
  if (!PALETTES[theme]) {
    throw new Error(
      `Thème inconnu: "${theme}". Thèmes valides: ${VALID_THEMES.join(", ")}`
    );
  }
  return PALETTES[theme];
}

module.exports = { getPalette, VALID_THEMES, PALETTES };
