/**
 * Styles et configurations visuelles pour la génération de documents Word (.docx)
 * Gère deux thèmes : Premium SaaS et Classic.
 */

export interface ColorTheme {
  primary: string;      // HEX sans le #
  secondary: string;    // HEX sans le #
  text: string;         // HEX sans le #
  muted: string;        // HEX sans le #
  background: string;   // HEX sans le #
  border: string;       // HEX sans le #
}

export const THEMES: Record<'premium' | 'classic', ColorTheme> = {
  premium: {
    primary: "0074CA",      // Bleu Cobalt
    secondary: "1E293B",    // Slate 800
    text: "1E293B",         // Slate 800
    muted: "64748B",        // Slate 500
    background: "F8FAFC",   // Slate 50
    border: "E2E8F0",       // Slate 200
  },
  classic: {
    primary: "16A34A",      // Vert Émeraude
    secondary: "1F2937",    // Gray 800
    text: "1F2937",         // Gray 800
    muted: "4B5563",        // Gray 600
    background: "F9FAFB",   // Gray 50
    border: "E5E7EB",       // Gray 200
  }
};

export const FONTS = {
  premium: {
    heading: "Segoe UI",
    body: "Segoe UI",
    mono: "Consolas",
  },
  classic: {
    heading: "Arial",
    body: "Arial",
    mono: "Courier New",
  }
};

export const SPACING = {
  heading1Before: 400,
  heading1After: 160,
  heading2Before: 280,
  heading2After: 120,
  heading3Before: 200,
  heading3After: 80,
  paragraphBefore: 100,
  paragraphAfter: 120,
  listBefore: 60,
  listAfter: 60,
  blockquoteBefore: 180,
  blockquoteAfter: 180,
  tableBefore: 200,
  tableAfter: 200,
};
