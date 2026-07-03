/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/src/markdownToDocx.ts
// Convertit un string Markdown (sorti de l'IA) en tableau d'éléments docx.js.

import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType,
  ShadingType,
} from "docx";

import { marked } from "marked";
import { ColorThemePalette } from "../themes/palette";

export interface MarkdownToDocxOptions {
  monoBlocks?: boolean;
  monoFont?: string;
  hasBlockquote?: boolean;
}

/**
 * Point d'entrée principal.
 */
export function markdownToDocxElements(
  markdown: string,
  palette: ColorThemePalette,
  options: MarkdownToDocxOptions = {}
): any[] {
  const tokens = marked.lexer(markdown);   // tokenize le Markdown en AST
  const elements: any[] = [];             // tableau de blocs docx en sortie

  for (const token of tokens) {
    const blocks = tokenToDocx(token, palette, options);
    elements.push(...blocks);
  }

  return elements;
}

// ─── Convertit un token Marked en blocs docx ─────────────────────────────────

function tokenToDocx(token: any, palette: ColorThemePalette, options: MarkdownToDocxOptions): any[] {
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
      return listToDocx(token, palette);

    case "code":
      return [codeBlockToDocx(token, palette, options)];

    case "blockquote":
      return blockquoteToDocx(token, palette);

    case "table":
      return [tableToDocx(token, palette)];

    case "space":
      // Ligne vide → paragraphe vide pour l'espacement
      return [new Paragraph({ children: [new TextRun("")], spacing: { before: 80, after: 80 } })];

    default:
      console.warn(`[markdownToDocx] Token ignoré (type: ${token.type})`);
      return [];
  }
}

// ─── Titres H1 / H2 / H3 ─────────────────────────────────────────────────────

function headingToDocx(token: any, palette: ColorThemePalette): Paragraph {
  const configMap: Record<number, { level: HeadingLevel; size: number; color: string; spacing: any }> = {
    1: { level: HeadingLevel.HEADING_1, size: 32, color: palette.text.primary, spacing: { before: 320, after: 160 } },
    2: { level: HeadingLevel.HEADING_2, size: 26, color: palette.brand.dark,   spacing: { before: 240, after: 120 } },
    3: { level: HeadingLevel.HEADING_3, size: 22, color: palette.text.primary, spacing: { before: 180, after: 80  } },
  };

  const config = configMap[token.depth] || { level: HeadingLevel.HEADING_3, size: 20, color: palette.text.secondary, spacing: { before: 120, after: 60 } };

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

function paragraphToDocx(token: any, palette: ColorThemePalette): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: inlineToRuns(token.tokens || [], palette, {}),
  });
}

// ─── Blocs de code (architecture document) ───────────────────────────────────

function codeBlockToDocx(token: any, palette: ColorThemePalette, options: MarkdownToDocxOptions): Paragraph {
  const font = options.monoFont || "Courier New";  // JetBrains Mono → Courier New dans Word
  const lines = token.text.split("\n");

  return new Paragraph({
    shading: { fill: palette.page.background === "FAFAFA" ? "F1F5F9" : "1E293B", type: ShadingType.CLEAR },
    spacing: { before: 120, after: 120 },
    indent: { left: 360 },
    children: lines.map((line: string, i: number) => [
      new TextRun({ text: line, font, size: 18, color: palette.text.primary }),
      ...(i < lines.length - 1 ? [new TextRun({ break: 1 })] : []),
    ]).flat(),
  });
}

// ─── Blockquote (pitch document : Elevator Pitch) ────────────────────────────

function blockquoteToDocx(token: any, palette: ColorThemePalette): any[] {
  const innerTokens = token.tokens || [];
  const children = innerTokens.flatMap((t: any) =>
    t.type === "paragraph" ? inlineToRuns(t.tokens || [], palette, { italics: true, color: palette.blockquote.text })
    : []
  );

  const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto", space: 0 };
  return [
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      borders: {
        top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER,
        insideH: NONE_BORDER, insideV: NONE_BORDER,
      },
      rows: [new TableRow({
        children: [new TableCell({
          borders: {
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

function listToDocx(token: any, palette: ColorThemePalette): Paragraph[] {
  return token.items.map((item: any) => {
    const ref = token.ordered ? "numbers" : "bullets";
    return new Paragraph({
      numbering: { reference: ref, level: 0 },
      spacing: { before: 60, after: 60 },
      children: inlineToRuns(item.tokens || [], palette, {}),
    });
  });
}

// ─── Tableaux ─────────────────────────────────────────────────────────────────

function tableToDocx(token: any, palette: ColorThemePalette): Table {
  const TOTAL_WIDTH = 9026;  // A4 avec marges 1440 DXA chaque côté (11906 - 2*1440)
  const colCount   = token.header.length;
  const colWidth   = Math.floor(TOTAL_WIDTH / colCount);

  const border = { style: BorderStyle.SINGLE, size: 2, color: palette.page.border };
  const borders = { top: border, bottom: border, left: border, right: border };

  // Ligne d'en-tête
  const headerRow = new TableRow({
    tableHeader: true,
    children: token.header.map((cell: any, i: number) =>
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
  const dataRows = token.rows.map((row: any, rowIndex: number) =>
    new TableRow({
      children: row.map((cell: any, i: number) =>
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

function inlineToRuns(tokens: any[], palette: ColorThemePalette, baseStyle: any = {}): TextRun[] {
  return tokens.flatMap((token: any) => {
    switch (token.type) {
      case "text":
        return [new TextRun({
          text: token.raw || token.text,
          ...buildRunStyle(baseStyle, palette),
        })];

      case "strong":
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, bold: true });

      case "em":
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, italics: true });

      case "codespan":
        return [new TextRun({
          text: token.text,
          font: "Courier New",
          size: 18,
          color: palette.brand.dark,
          ...buildRunStyle(baseStyle, palette),
        })];

      case "link":
        return inlineToRuns(token.tokens || [], palette, { ...baseStyle, color: palette.brand.primary, underline: {} });

      case "br":
        return [new TextRun({ break: 1 })];

      case "escape":
        return [new TextRun({ text: token.text, ...buildRunStyle(baseStyle, palette) })];

      default:
        if (token.text) {
          return [new TextRun({ text: token.text, ...buildRunStyle(baseStyle, palette) })];
        }
        return [];
    }
  });
}

// ─── Construction du style TextRun depuis un objet style partial ──────────────

function buildRunStyle(style: any, palette: ColorThemePalette): any {
  return {
    bold:     style.bold     ?? false,
    italics:  style.italics  ?? false,
    color:    style.color    || palette.text.primary,
    underline: style.underline,
    size:     style.size     || 22,  // 11pt par défaut
  };
}
