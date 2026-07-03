/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType
} from "docx";
import { marked } from "marked";
import { THEMES, FONTS, SPACING } from "./docxStyles";

interface TextStyle {
  bold?: boolean;
  italics?: boolean;
  font?: string;
  color?: string;
  size?: number;
  underline?: boolean;
}

/**
 * Parcourt de manière récursive les jetons Markdown en ligne (inline tokens)
 * pour générer une liste de TextRun Word stylés correspondants.
 */
function traverseInline(
  tokens: any[],
  style: TextStyle,
  runs: TextRun[],
  themeKey: 'premium' | 'classic'
) {
  if (!tokens) return;
  
  const colors = THEMES[themeKey];
  const fonts = FONTS[themeKey];

  for (const token of tokens) {
    if (token.type === 'strong') {
      traverseInline(token.tokens, { ...style, bold: true }, runs, themeKey);
    } else if (token.type === 'em') {
      traverseInline(token.tokens, { ...style, italics: true }, runs, themeKey);
    } else if (token.type === 'codespan') {
      runs.push(new TextRun({
        text: token.text,
        font: fonts.mono,
        bold: style.bold,
        italics: style.italics,
        color: "991B1B", // Rouge foncé pour le code en ligne
        size: 19,        // ~9.5pt
        shading: {
          fill: "F1F5F9",
        }
      }));
    } else if (token.type === 'link') {
      traverseInline(token.tokens, { ...style, color: colors.primary, underline: true }, runs, themeKey);
    } else if (token.type === 'text') {
      runs.push(new TextRun({
        text: token.text,
        font: style.font || fonts.body,
        bold: style.bold,
        italics: style.italics,
        underline: style.underline ? {} : undefined,
        color: style.color || colors.text,
        size: style.size || 22, // 11pt par défaut
      }));
    } else {
      // Traitement par défaut pour tout autre type de token en ligne contenant du texte brut
      if (token.text) {
        runs.push(new TextRun({
          text: token.text,
          font: style.font || fonts.body,
          bold: style.bold,
          italics: style.italics,
          underline: style.underline ? {} : undefined,
          color: style.color || colors.text,
          size: style.size || 22,
        }));
      }
    }
  }
}

/**
 * Options pour la conversion du Markdown en fichier .docx Word.
 */
export interface DocxConversionOptions {
  title: string;
  designSystem: 'premium' | 'classic';
  documentType: string;
  developerName?: string;
  clientName?: string;
  projectName?: string;
}

/**
 * Compile une chaîne de caractères Markdown en une instance de document docx.Document de haute qualité.
 */
export function convertMarkdownToDocx(
  markdown: string,
  options: DocxConversionOptions
): Document {
  const themeKey = options.designSystem;
  const colors = THEMES[themeKey];
  const fonts = FONTS[themeKey];

  // Analyse syntaxique du Markdown en jetons (tokens) via marked
  const tokens = marked.lexer(markdown);
  const children: any[] = [];

  // 1. En-tête professionnel ou en-tête institutionnel
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: options.documentType.toUpperCase(),
        bold: true,
        font: fonts.heading,
        color: colors.primary,
        size: 20, // 10pt
      })
    ],
    spacing: { before: 100, after: 60 }
  }));

  children.push(new Paragraph({
    children: [
      new TextRun({
        text: options.projectName || "PROJET PROFESSIONNEL",
        bold: true,
        font: fonts.heading,
        color: colors.secondary,
        size: 40, // 20pt
      })
    ],
    spacing: { before: 60, after: 300 }
  }));

  // 2. Traitement itératif des jetons Markdown principaux
  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const runs: TextRun[] = [];
        const headingSize = token.depth === 1 ? 32 : (token.depth === 2 ? 26 : 22);
        const headingColor = token.depth === 1 ? colors.primary : colors.secondary;

        traverseInline(token.tokens, {
          bold: true,
          font: fonts.heading,
          size: headingSize,
          color: headingColor
        }, runs, themeKey);

        let headingLevel = HeadingLevel.HEADING_1;
        if (token.depth === 2) headingLevel = HeadingLevel.HEADING_2;
        if (token.depth === 3) headingLevel = HeadingLevel.HEADING_3;
        if (token.depth > 3) headingLevel = HeadingLevel.HEADING_4;

        const spacingBefore = token.depth === 1 ? SPACING.heading1Before : (token.depth === 2 ? SPACING.heading2Before : SPACING.heading3Before);
        const spacingAfter = token.depth === 1 ? SPACING.heading1After : (token.depth === 2 ? SPACING.heading2After : SPACING.heading3After);

        children.push(new Paragraph({
          children: runs,
          heading: headingLevel,
          spacing: {
            before: spacingBefore,
            after: spacingAfter,
          },
          keepWithNext: true,
        }));
        break;
      }

      case 'paragraph': {
        // Ignorer ou formater spécialement les en-têtes complexes ou d'authenticité
        const isQrPlaceholder = token.text.includes('QR_CODE_AUTHENTICATION_URL_PLACEHOLDER') || 
                               token.text.includes('api.qrserver.com');

        if (isQrPlaceholder) {
          children.push(new Paragraph({
            children: [
              new TextRun({
                text: "📷 [QR Code d'Authenticité Numérique - Intégré à l'application web DocuGen Pro]",
                bold: true,
                font: fonts.body,
                color: colors.primary,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }));
          break;
        }

        const runs: TextRun[] = [];
        traverseInline(token.tokens, {
          font: fonts.body,
          size: 22,
          color: colors.text
        }, runs, themeKey);

        children.push(new Paragraph({
          children: runs,
          spacing: {
            before: SPACING.paragraphBefore,
            after: SPACING.paragraphAfter
          },
          alignment: AlignmentType.JUSTIFY,
        }));
        break;
      }

      case 'list': {
        for (const item of token.items) {
          const runs: TextRun[] = [];
          traverseInline(item.tokens, {
            font: fonts.body,
            size: 22,
            color: colors.text
          }, runs, themeKey);

          // Puces sécurisées avec mise en retrait (indent)
          const bulletSymbol = token.ordered ? `${item.order || 1}. ` : "•  ";
          const itemRuns = [
            new TextRun({
              text: bulletSymbol,
              bold: true,
              color: colors.primary,
              font: fonts.heading,
              size: 22,
            }),
            ...runs
          ];

          children.push(new Paragraph({
            children: itemRuns,
            indent: { left: 480 },
            spacing: {
              before: SPACING.listBefore,
              after: SPACING.listAfter
            },
          }));
        }
        break;
      }

      case 'blockquote': {
        const runs: TextRun[] = [];
        const blockquoteTokens = token.tokens || [];
        
        for (const bToken of blockquoteTokens) {
          if (bToken.type === 'paragraph' || bToken.type === 'text') {
            traverseInline(bToken.tokens || [bToken], {
              font: fonts.body,
              size: 22,
              italics: true,
              color: colors.muted
            }, runs, themeKey);
          }
        }

        children.push(new Paragraph({
          children: runs,
          indent: { left: 720 },
          shading: { fill: colors.background },
          spacing: {
            before: SPACING.blockquoteBefore,
            after: SPACING.blockquoteAfter
          },
          border: {
            left: {
              color: colors.primary,
              size: 24, // 3pt
              style: BorderStyle.SINGLE,
              space: 12,
            }
          }
        }));
        break;
      }

      case 'hr': {
        children.push(new Paragraph({
          children: [
            new TextRun({
              text: "__________________________________________________________________",
              color: colors.border,
              size: 18,
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 }
        }));
        break;
      }

      case 'table': {
        const tableRows: TableRow[] = [];

        // Ligne d'en-tête (Header Row)
        const headerCells: TableCell[] = [];
        for (let colIdx = 0; colIdx < token.header.length; colIdx++) {
          const headerCellText = token.header[colIdx].text;
          headerCells.push(new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: headerCellText,
                    bold: true,
                    font: fonts.heading,
                    size: 20,
                    color: "FFFFFF",
                  })
                ],
                alignment: AlignmentType.LEFT,
              })
            ],
            shading: { fill: colors.primary },
            margins: { top: 120, bottom: 120, left: 160, right: 160 }
          }));
        }
        tableRows.push(new TableRow({ children: headerCells }));

        // Lignes de données (Data Rows)
        for (let rowIdx = 0; rowIdx < token.rows.length; rowIdx++) {
          const row = token.rows[rowIdx];
          const dataCells: TableCell[] = [];
          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            const cellTokens = row[colIdx].tokens;
            const runs: TextRun[] = [];
            
            traverseInline(cellTokens, {
              font: fonts.body,
              size: 20,
              color: colors.text
            }, runs, themeKey);

            dataCells.push(new TableCell({
              children: [
                new Paragraph({
                  children: runs,
                  alignment: AlignmentType.LEFT,
                })
              ],
              shading: { fill: rowIdx % 2 === 0 ? colors.background : "FFFFFF" },
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: colors.border },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: colors.border },
                left: { style: BorderStyle.SINGLE, size: 4, color: colors.border },
                right: { style: BorderStyle.SINGLE, size: 4, color: colors.border }
              }
            }));
          }
          tableRows.push(new TableRow({ children: dataCells }));
        }

        children.push(new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          spacing: {
            before: SPACING.tableBefore,
            after: SPACING.tableAfter
          }
        }));
        break;
      }

      default:
        break;
    }
  }

  // 3. Pied de page discret
  children.push(new Paragraph({
    children: [
      new TextRun({
        text: "Document certifié par DocuGen Pro — Propriété personnelle de Horacio Chinkoun",
        italics: true,
        font: fonts.body,
        color: colors.muted,
        size: 16, // 8pt
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 100 }
  }));

  // Initialisation finale de l'instance docx.Document
  return new Document({
    creator: "DocuGen Pro (Horacio Chinkoun)",
    title: options.title,
    description: `Généré automatiquement par DocuGen Pro pour ${options.developerName || "Développeur"}.`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 pouce (1440 dxa)
              bottom: 1440,
              left: 1440,
              right: 1440,
            }
          }
        },
        children: children,
      }
    ]
  });
}
