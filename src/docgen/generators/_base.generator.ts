/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/generators/_base.generator.ts
// Générateur de base réutilisable pour tous les documents standard Markdown (hors attestation).

import {
  Document, Packer, Paragraph, TextRun,
  Footer, AlignmentType,
  BorderStyle, LevelFormat, PageNumber,
} from "docx";
import { markdownToDocxElements } from "../src/markdownToDocx";
import { ColorThemePalette } from "../themes/palette";

export interface BaseGeneratorOptions {
  monoBlocks?: boolean;
  monoFont?: string;
  hasBlockquote?: boolean;
}

export async function generateBaseDocx(
  data: any,
  palette: ColorThemePalette,
  markdownText: string,
  documentTypeLabel: string,
  options: BaseGeneratorOptions = {}
): Promise<Buffer> {
  const { formData } = data;
  const projectName = formData?.projectName || "Projet";

  // 1. Convertir le Markdown en blocs docx
  const contentBlocks = markdownToDocxElements(markdownText, palette, {
    monoBlocks: options.monoBlocks,
    monoFont: palette.monoFont,
    hasBlockquote: options.hasBlockquote,
  });

  // 2. Pied de page discret
  const footer = new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: palette.page.border, space: 6 } },
        spacing: { before: 120 },
        children: [
          new TextRun({ text: `${documentTypeLabel} — ${projectName} — DocuGen Pro`, color: palette.text.muted, size: 16 }),
          new TextRun({ children: [PageNumber.CURRENT], color: palette.text.muted, size: 16 }),
        ],
      }),
    ],
  });

  // 3. Document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: palette.bodyFont, size: 22, color: palette.text.primary },
        },
      },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: palette.bodyFont, color: palette.text.primary },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: palette.bodyFont, color: palette.brand.dark },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 22, bold: true, font: palette.bodyFont, color: palette.text.primary },
          paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
      ],
    },
    numbering: {
      config: [
        { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },          // A4 portrait
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },  // marges 1"
        },
      },
      footers: { default: footer },
      children: [
        ...contentBlocks,
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
