// generators/attestation.generator.js
// Générateur de DOCX pour le type "attestation".
// C'est le document le plus complexe : il a un QR code, un filigrane "CERTIFIÉ",
// une police Playfair Display (Premium) / Calibri (Classic), et des bordures d'encadrement.
// Ce générateur est appelé par render.js avec (data, palette, options).

const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, LevelFormat,
  PageNumber,
} = require("docx");
const https = require("https");
const { markdownToDocxElements } = require("../src/markdownToDocx");

/**
 * Télécharge le QR code depuis qrserver.com et retourne un Buffer PNG.
 * Constructeur de l'URL fidèle au code original de App.tsx (ligne 1339-1344).
 */
function buildQrUrl(formData, palette) {
  // Reproduit exactement la logique de l'app :
  // const verificationLink = formData.linkedinLink || formData.githubLink || 'https://github.com';
  const verificationLink = formData.linkedinLink || formData.githubLink || "https://github.com";
  const qrColor = palette.qr.apiColor;  // ex: "0-116-202" ou "22-163-74"
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=${qrColor}&data=${encodeURIComponent(verificationLink)}`;
}

function fetchQrCode(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

/**
 * Point d'entrée du générateur.
 * @param {object} data      - Objet JSON validé (conforme attestation.schema.json)
 * @param {object} palette   - Palette issue de themes/palette.js → getPalette(theme)
 * @param {object} options   - Options supplémentaires (ex: { skipQr: true } pour les tests offline)
 * @returns {Buffer}         - Buffer .docx prêt à écrire sur disque ou envoyer en réponse HTTP
 */
async function generateAttestationDocx(data, palette, options = {}) {
  const { formData } = data;

  // ── 1. Télécharger le QR code (sauf en mode test offline) ──────────────────
  let qrImageBuffer = null;
  if (!options.skipQr) {
    const qrUrl = buildQrUrl(formData, palette);
    qrImageBuffer = await fetchQrCode(qrUrl);
  }

  // ── 2. Remplacer le placeholder QR dans le Markdown avant parsing ────────────
  // L'IA a mis "QR_CODE_AUTHENTICATION_URL_PLACEHOLDER" dans le Markdown.
  // On remplace maintenant par un signal que le parser gérera à part.
  // (Le QR est injecté comme ImageRun, pas comme texte — on extrait les sections avant/après)
  let markdownSource = data.content.attestationMarkdown;
  const QR_PLACEHOLDER = "QR_CODE_AUTHENTICATION_URL_PLACEHOLDER";
  const hasQrPlaceholder = markdownSource.includes(QR_PLACEHOLDER);

  // Sépare le Markdown en deux parties : avant et après le placeholder QR
  let markdownBeforeQr = markdownSource;
  let markdownAfterQr  = "";
  if (hasQrPlaceholder) {
    // On isole tout ce qui est avant la ligne ![QR Code d'authentification](...)
    const qrLineRegex = /!\[QR Code[^\]]*\]\(QR_CODE_AUTHENTICATION_URL_PLACEHOLDER\)/;
    markdownBeforeQr = markdownSource.replace(qrLineRegex, "").trim();
    markdownAfterQr  = "";  // rien après le QR dans la structure actuelle
  }

  // ── 3. Convertir le Markdown en blocs docx ───────────────────────────────────
  const monoFont = palette.monoFont;
  const contentBlocks = markdownToDocxElements(markdownBeforeQr, palette, { monoFont });

  // ── 4. Ajouter le bloc QR en fin de document ─────────────────────────────────
  const qrSection = [];
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
      // Injection de l'image QR (150×150px côté API = 1417200 EMU × 1417200 EMU)
      qrSection.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 80 },
          children: [new ImageRun({
            data: qrImageBuffer,
            transformation: { width: 150, height: 150 },  // px → docx les convertit en EMU
            type: "png",
          })],
        })
      );
    } else {
      // Mode test sans QR : on met une mention textuelle
      qrSection.push(
        new Paragraph({
          children: [new TextRun({ text: "[QR Code non disponible en mode test]", color: palette.text.muted, italics: true })],
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
          new TextRun({ text: `Attestation — ${formData.projectName}`, color: palette.text.muted, size: 16 }),
          new TextRun({ children: [new PageNumber()], color: palette.text.muted, size: 16 }),
        ],
      }),
    ],
  });

  // ── 6. Assemblage du Document ─────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          // Police principale : Playfair Display en Premium, Calibri en Classic
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
        // Bordure d'encadrement du document (fidèle au style .attestation-mode dans l'app)
        // Reproduit via un paragraphe vide avec bordure sur les 4 côtés tout en haut
        new Paragraph({
          border: {
            top:    { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            left:   { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
            right:  { style: BorderStyle.SINGLE, size: 4, color: palette.brand.primary, space: 0 },
          },
          children: [],
        }),

        // Contenu principal (Markdown converti)
        ...contentBlocks,

        // Section QR code
        ...qrSection,
      ],
    }],
  });

  return Packer.toBuffer(doc);  // retourne un Buffer .docx
}

module.exports = { generateAttestationDocx };
