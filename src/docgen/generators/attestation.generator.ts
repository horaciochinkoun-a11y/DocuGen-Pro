/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/generators/attestation.generator.ts
// Générateur de DOCX pour le type "attestation".

import {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Footer, AlignmentType,
  BorderStyle, LevelFormat, PageNumber,
} from "docx";
import { markdownToDocxElements } from "../src/markdownToDocx";
import { ColorThemePalette } from "../themes/palette";

/**
 * Télécharge le QR code depuis qrserver.com et retourne un ArrayBuffer PNG.
 */
function buildQrUrl(formData: any, palette: ColorThemePalette): string {
  const verificationLink = formData.linkedinLink || formData.githubLink || "https://github.com";
  const qrColor = palette.qr.apiColor;  // ex: "0-116-202" ou "22-163-74"
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=${qrColor}&data=${encodeURIComponent(verificationLink)}`;
}

async function fetchQrCode(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch QR code: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Point d'entrée du générateur.
 */
export async function generateAttestationDocx(data: any, palette: ColorThemePalette, options: any = {}): Promise<Buffer> {
  const { formData } = data;

  // ── 1. Télécharger le QR code (sauf en mode test offline) ──────────────────
  let qrImageBuffer: Uint8Array | null = null;
  if (!options.skipQr) {
    try {
      const qrUrl = buildQrUrl(formData, palette);
      qrImageBuffer = await fetchQrCode(qrUrl);
    } catch (err) {
      console.error("Erreur de téléchargement du QR code:", err);
      // Fallback sur offline
    }
  }

  // ── 2. Remplacer le placeholder QR dans le Markdown avant parsing ────────────
  const markdownSource = data.content.attestationMarkdown || "";
  const QR_PLACEHOLDER = "QR_CODE_AUTHENTICATION_URL_PLACEHOLDER";
  const hasQrPlaceholder = markdownSource.includes(QR_PLACEHOLDER);

  let markdownBeforeQr = markdownSource;
  if (hasQrPlaceholder) {
    const qrLineRegex = /!\[QR Code[^\]]*\]\(QR_CODE_AUTHENTICATION_URL_PLACEHOLDER\)/;
    markdownBeforeQr = markdownSource.replace(qrLineRegex, "").trim();
  }

  // ── 3. Convertir le Markdown en blocs docx ───────────────────────────────────
  const monoFont = palette.monoFont;
  const contentBlocks = markdownToDocxElements(markdownBeforeQr, palette, { monoFont });

  // ── 4. Ajouter le bloc QR en fin de document ─────────────────────────────────
  const qrSection: any[] = [];
  if (hasQrPlaceholder) {
    qrSection.push(
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: palette.page.border, space: 8 } },
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: "Validation & Authenticité numérique", bold: true, size: 24, color: palette.brand.dark })],
      }),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [new TextRun({
          text: "Ce document officiel est certifié numériquement. Pour vérifier l'authenticité de cette attestation, scannez le code QR ci-dessous :",
          color: palette.text.secondary, size: 20, italics: true,
        })],
      })
    );

    if (qrImageBuffer) {
      qrSection.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 80 },
          children: [new ImageRun({
            data: qrImageBuffer,
            transformation: { width: 150, height: 150 },
            type: "png",
          })],
        })
      );
    } else {
      qrSection.push(
        new Paragraph({
          children: [new TextRun({ text: "[QR Code non disponible]", color: palette.text.muted, italics: true })],
        })
      );
    }
  }

  // ── 5. Pied de page : nom du document + numéro de page ───────────────────────
  const footer = new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: palette.page.border, space: 6 } },
        spacing: { before: 120 },
        children: [
          new TextRun({ text: `Attestation — ${formData?.projectName || "Projet"}`, color: palette.text.muted, size: 16 }),
          new TextRun({ children: [PageNumber.CURRENT], color: palette.text.muted, size: 16 }),
        ],
      }),
    ],
  });

  // ── 6. Assemblage du Document ─────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: palette.attestationFont, size: 22, color: palette.text.primary },
        },
      },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: palette.attestationFont, color: palette.text.primary },
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
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },  // marges 1440 DXA = 1 inch
        },
      },
      footers: { default: footer },
      children: [
        // Bordure d'encadrement
        new Paragraph({
          border: {
            top:    { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            left:   { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            right:  { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
          },
          children: [],
        }),

        ...contentBlocks,
        ...qrSection,
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
