// src/docgen/themes/palette.ts
// Source unique de vérité pour les 4 variantes visuelles de DocuGen-Pro.
// Toutes les valeurs hexadécimales sont extraites directement de /src/index.css.

export interface BrandPalette {
  primary: string;
  dark: string;
  darker: string;
}

export interface PagePalette {
  background: string;
  card: string;
  border: string;
}

export interface TextPalette {
  primary: string;
  secondary: string;
  muted: string;
  onDark: string;
}

export interface BlockquotePalette {
  border: string;
  background: string;
  text: string;
}

export interface QrPalette {
  apiColor: string;
}

export interface ColorThemePalette {
  brand: BrandPalette;
  page: PagePalette;
  text: TextPalette;
  blockquote: BlockquotePalette;
  qr: QrPalette;
  attestationFont: string;
  bodyFont: string;
  monoFont: string;
}

export const PALETTES: Record<string, ColorThemePalette> = {
  // ─── PREMIUM LIGHT ───────────────────────────────────────────
  "premium-light": {
    brand: {
      primary:   "0C91EB",  // --color-brand-500
      dark:      "0074CA",  // --color-brand-600
      darker:    "015CA3",  // --color-brand-700
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
      border:     "0C91EB",
      background: "F0F7FF",
      text:       "064F86",
    },
    qr: {
      apiColor: "0-116-202",
    },
    attestationFont: "Palatino Linotype",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },

  // ─── PREMIUM DARK ────────────────────────────────────────────
  "premium-dark": {
    brand: {
      primary:   "0C91EB",
      dark:      "36ACF7",
      darker:    "7CC8FB",
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
      border:     "0C91EB",
      background: "072A4A",
      text:       "BAE0FD",
    },
    qr: {
      apiColor: "0-116-202",
    },
    attestationFont: "Palatino Linotype",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },

  // ─── CLASSIC LIGHT ───────────────────────────────────────────
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
      background: "F0FDF4",
      text:       "166534",
    },
    qr: {
      apiColor: "22-163-74",
    },
    attestationFont: "Calibri",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },

  // ─── CLASSIC DARK ────────────────────────────────────────────
  "classic-dark": {
    brand: {
      primary:   "22C55E",
      dark:      "4ADE80",
      darker:    "86EFAC",
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
      background: "052E16",
      text:       "BBF7D0",
    },
    qr: {
      apiColor: "22-163-74",
    },
    attestationFont: "Calibri",
    bodyFont:        "Calibri",
    monoFont:        "Courier New",
  },
};

export const VALID_THEMES = Object.keys(PALETTES);

export function getPalette(theme: string): ColorThemePalette {
  if (!PALETTES[theme]) {
    throw new Error(
      `Thème inconnu: "${theme}". Thèmes valides: ${VALID_THEMES.join(", ")}`
    );
  }
  return PALETTES[theme];
}
