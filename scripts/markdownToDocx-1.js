// src/markdownToDocx.js
// Convertit un string Markdown (sorti de l'IA) en tableau d'éléments docx.js.
// C'est la pièce centrale qui remplace le pipeline Markdown → react-markdown → HTML → .doc.
// Stratégie : on tokenize le Markdown avec `marked`, puis on mappe chaque token
// en un ou plusieurs éléments docx (Paragraph, TextRun, Table, etc.).

const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat,
} = require("docx");

const { marked } = require("marked");

/**
 * Point d'entrée principal.
 * @param {string} markdown    - Texte Markdown brut sorti de l'IA
 * @param {object} palette     - Palette du thème (issue de themes/palette.js)
 * @param {object} options     - Options de rendu optionnelles
 * @param {boolean} options.monoBlocks  - Si true, les blocs ```code``` utilisent la police mono
 * @param {string}  options.monoFont    - Nom de la police monospace (depuis la palette)
 * @returns {Array}  Tableau d'objets docx (Paragraph | Table)
 */
function markdownToDocxElements(markdown, palette, options = {}) {
  const tokens = marked.lexer(markdown);   // tokenize le Markdown en AST
  const elements = [];                      // tableau de blocs docx en sortie

  for (const token of tokens) {
    const blocks = tokenToDocx(token, palette, options);
    elements.push(...blocks);
  }

  return elements;
}

// ─── Convertit un token Marked en blocs docx ─────────────────────────────────

function tokenToDocx(token, palette, options) {
  switch (token.type) {

    case "heading":
      return [headingToDocx(token, palette)];

    case "paragraph":
      return [paragraphToDocx(token, palette)];

    case "hr":
      // Ligne horizontale → paragraphe avec bordure basse (pas de table — les tables ont une hauteur min)
      return [new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: palette.brand.primary, space: 4 }
        },
        spacing: { before: 160, after: 160 },
        children: [],
      })];

    case "list":
      return listToDocx(token, palette, options);

    case "code":
      return [codeBlockToDocx(token, palette, options)];

    case "blockquote":
      return blockquoteToDocx(token, palette, options);

    case "table":
      return [tableToDocx(token, palette)];

    case "space":
      // Ligne vide → paragraphe vide pour l'espacement
      return [new Paragraph({ children: [new TextRun("")], spacing: { before: 80, after: 80 } })];

    default:
      // Type inconnu : on logue et on ignore plutôt que de planter
      console.warn(`[markdownToDocx] Token ignoré (type: ${token.type})`);
      return [];
  }
}

// ─── Titres H1 / H2 / H3 ─────────────────────────────────────────────────────

function headingToDocx(token, palette) {
  // Map du niveau Markdown vers le HeadingLevel docx et les propriétés de rendu
  const config = {
    1: { level: HeadingLevel.HEADING_1, size: 32, color: palette.text.primary, spacing: { before: 320, after: 160 } },
    2: { level: HeadingLevel.HEADING_2, size: 26, color: palette.brand.dark,   spacing: { before: 240, after: 120 } },
    3: { level: HeadingLevel.HEADING_3, size: 22, color: palette.text.primary, spacing: { before: 180, after: 80  } },
  }[token.depth] || { level: HeadingLevel.HEADING_3, size: 20, color: palette.text.secondary, spacing: { before: 120, after: 60 } };

  const runs = inlineToRuns(token.tokens || [], palette, { bold: true, color: config.color });

  return new Paragraph({
    heading: config.level,
    spacing: config.spacing,
    border: token.depth === 2
      ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: palette.page.border, space: 4 } }
      : undefined,
    children: runs,
  });
}

// ─── Paragraphe standard ─────────────────────────────────────────────────────

function paragraphToDocx(token, palette) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: inlineToRuns(token.tokens || [], palette, {}),
  });
}

// ─── Blocs de code (architecture document) ───────────────────────────────────

function codeBlockToDocx(token, palette, options) {
  const font = options.monoFont || "Courier New";  // JetBrains Mono → Courier New dans Word
  const lines = token.text.split("\n");

  return new Paragraph({
    shading: { fill: palette.page.background === "FAFAFA" ? "F1F5F9" : "1E293B", type: ShadingType.CLEAR },
    // Note: bordure gauche seule invalide en OOXML — on utilise indent + shading
    spacing: { before: 120, after: 120 },
    indent: { left: 360 },
    children: lines.map((line, i) => [
      new TextRun({ text: line, font, size: 18, color: palette.text.primary }),
      // Retour à la ligne entre les lignes du bloc code, sauf après la dernière
      ...(i < lines.length - 1 ? [new TextRun({ break: 1 })] : []),
    ]).flat(),
  });
}

// ─── Blockquote (pitch document : Elevator Pitch) ────────────────────────────

function blockquoteToDocx(token, palette, options) {
  // Rassemble tout le texte du blockquote
  const innerTokens = token.tokens || [];
  const children = innerTokens.flatMap(t =>
    t.type === "paragraph" ? inlineToRuns(t.tokens || [], palette, { italics: true, color: palette.blockquote.text })
    : []
  );

  // FIX docx.js v9 : border.left seul sur un Paragraph génère un w:pBdr avec
  // l'ordre top/bottom/left/right (invalide, OOXML exige top/left/bottom/right).
  // Solution : Table à une seule cellule avec tcBdr.left — les w:tcBdr n'ont pas ce bug.
  // Résultat visuel identique : fond coloré + barre gauche colorée.
  const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto", space: 0 };
  return [
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      borders: {
        // Pas de bordure extérieure de table — on ne veut que la bordure gauche de la cellule
        top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER,
        insideH: NONE_BORDER, insideV: NONE_BORDER,
      },
      rows: [new TableRow({
        children: [new TableCell({
          borders: {
            // tcBdr : ordre top/left/bottom/right/insideH/insideV — docx.js le gère correctement
            top:    NONE_BORDER,
            left:   { style: BorderStyle.THICK, size: 16, color: palette.blockquote.border, space: 10 },
            bottom: NONE_BORDER,
            right:  NONE_BORDER,
          },
          shading: { fill: palette.blockquote.background, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 480, right: 240 },
          width: { size: 9026, type: WidthType.DXA },
          children: [new Paragraph({
            spacing: { before: 80, after: 80 },
            children,
          })],
        })],
      })],
    }),
  ];
}

// ─── Listes à puces et numérotées ────────────────────────────────────────────
// IMPORTANT : la config numbering doit être déclarée dans le Document principal.
// Les références "bullets" et "numbers" doivent exister dans document.numbering.config.

function listToDocx(token, palette, options) {
  return token.items.map((item) => {
    const ref = token.ordered ? "numbers" : "bullets";
    return new Paragraph({
      numbering: { reference: ref, level: 0 },
      spacing: { before: 60, after: 60 },
      children: inlineToRuns(item.tokens || [], palette, {}),
    });
  });
}

// ─── Tableaux ─────────────────────────────────────────────────────────────────

function tableToDocx(token, palette) {
  const TOTAL_WIDTH = 9026;  // A4 avec marges 1440 DXA chaque côté (11906 - 2*1440)
  const colCount   = token.header.length;
  const colWidth   = Math.floor(TOTAL_WIDTH / colCount);

  const border = { style: BorderStyle.SINGLE, size: 2, color: palette.page.border };
  const borders = { top: border, bottom: border, left: border, right: border };

  // Ligne d'en-tête
  const headerRow = new TableRow({
    tableHeader: true,
    children: token.header.map((cell, i) =>
      new TableCell({
        borders,
        width: { size: i < colCount - 1 ? colWidth : TOTAL_WIDTH - colWidth * (colCount - 1), type: WidthType.DXA },
        shading: { fill: palette.brand.dark, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: inlineToRuns(cell.tokens || [], palette, { bold: true, color: palette.text.onDark }),
        })],
      })
    ),
  });

  // Lignes de données
  const dataRows = token.rows.map((row, rowIndex) =>
    new TableRow({
      children: row.map((cell, i) =>
        new TableCell({
          borders,
          width: { size: i < colCount - 1 ? colWidth : TOTAL_WIDTH - colWidth * (colCount - 1), type: WidthType.DXA },
          shading: {
            fill: rowIndex % 2 === 0 ? palette.page.card : palette.page.background,
            type: ShadingType.CLEAR,
          },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: inlineToRuns(cell.tokens || [], palette, { color: palette.text.primary }),
          })],
        })
      ),
    })
  );

  return new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: Array(colCount).fill(colWidth),
    rows: [headerRow, ...dataRows],
  });
}

// ─── Texte inline (gras, italique, code, lien, texte pur) ────────────────────

function inlineToRuns(tokens, palette, baseStyle = {}) {
  return tokens.flatMap((token) => {
    switch (token.type) {
      case "text":
        return [new TextRun({
          text: token.raw || token.text,
          ...buildRunStyle(baseStyle, palette),
        })];

      case "strong":
        // Texte gras → on merge le style parent + bold
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, bold: true });

      case "em":
        // Texte italique
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, italics: true });

      case "codespan":
        // `code inline` → monospace, fond légèrement coloré
        return [new TextRun({
          text: token.text,
          font: "Courier New",
          size: 18,
          color: palette.brand.dark,
          ...buildRunStyle(baseStyle, palette),
        })];

      case "link":
        // Liens : on rend juste le texte (les URLs actives ne passent pas bien dans Word)
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, color: palette.brand.primary, underline: {} });

      case "br":
        return [new TextRun({ break: 1 })];

      case "escape":
        return [new TextRun({ text: token.text, ...buildRunStyle(baseStyle, palette) })];

      default:
        // Tout ce qu'on ne sait pas parser : on essaie d'extraire le texte brut
        if (token.text) {
          return [new TextRun({ text: token.text, ...buildRunStyle(baseStyle, palette) })];
        }
        return [];
    }
  });
}

// ─── Construction du style TextRun depuis un objet style partial ──────────────

function buildRunStyle(style, palette) {
  return {
    bold:     style.bold     ?? false,
    italics:  style.italics  ?? false,
    color:    style.color    || palette.text.primary,
    underline: style.underline,
    size:     style.size     || 22,  // 11pt par défaut
  };
}

module.exports = { markdownToDocxElements };
