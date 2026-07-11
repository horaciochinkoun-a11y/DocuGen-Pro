// src/render.js
// Orchestrateur central du nouveau pipeline de génération.
// Reçoit un objet JSON brut (sorti de l'IA ou du formulaire),
// valide, enrichit, sélectionne le générateur, retourne { docxBuffer, pdfPath }.
// NE contient aucune logique spécifique à un type de document : tout est dans registry + generators.

const fs   = require("fs");
const path = require("path");
const Ajv  = require("ajv");
const addFormats = require("ajv-formats");

const { getPalette }  = require("../themes/palette");
const { getConfig }   = require("./registry/documentTypes.registry");

const ajv = new Ajv({ allErrors: true, strict: false });  // strict:false car les schémas utilisent $ref cross-fichiers
addFormats(ajv);

// ─── Étape 1 : validation JSON Schema ────────────────────────────────────────

function validate(schema, data) {
  const fn = ajv.compile(schema);
  const ok = fn(data);
  if (!ok) {
    // Les erreurs Ajv sont suffisamment détaillées pour être renvoyées à l'IA (retry prompt)
    const details = fn.errors.map(e => `• ${e.instancePath || "(racine)"}: ${e.message}`).join("\n");
    throw Object.assign(new Error("Validation JSON échouée"), { validationErrors: fn.errors, details });
  }
}

// ─── Étape 2 : enrichissement serveur ────────────────────────────────────────
// Données que l'IA ne doit JAMAIS produire (identifiants, dates serveur, URL QR).

function enrich(data, config, theme) {
  const enriched = { ...data };

  // documentId : UUID généré si absent (côté serveur = fiable, pas l'IA)
  if (!enriched.meta?.documentId) {
    enriched.meta = { ...(enriched.meta || {}), documentId: generateUUID() };
  }

  // Timestamp de génération (toujours le serveur, jamais l'IA)
  enriched.meta.generatedAt = new Date().toISOString();
  enriched.meta.theme       = theme;

  // Construction de l'URL QR pour l'attestation
  if (config.hasQrCode) {
    const palette = getPalette(theme);
    const fd      = enriched.formData;
    const link    = fd.linkedinLink || fd.githubLink || "https://github.com";
    enriched.computed = {
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=${palette.qr.apiColor}&data=${encodeURIComponent(link)}`
    };
  }

  return enriched;
}

// ─── Étape 3 : génération DOCX ────────────────────────────────────────────────

async function generateDocx(enrichedData, config, palette, options) {
  // Chaque générateur expose une fonction unique `generate*Docx(data, palette, options)`
  // Le registre mappe documentType → module générateur
  const generatorModule = config.generator;

  // Convention : la fonction exportée du module s'appelle toujours generate[Type]Docx
  // On cherche la première fonction exportée dont le nom commence par "generate"
  const generatorFn = Object.values(generatorModule).find(
    v => typeof v === "function" && v.name.startsWith("generate")
  );

  if (!generatorFn) {
    throw new Error(`Le générateur pour "${config.label}" n'exporte pas de fonction generate*()`);
  }

  return generatorFn(enrichedData, palette, options);
}

// ─── Étape 4 : conversion PDF via Gotenberg ──────────────────────────────────
// Gotenberg = microservice Docker basé sur LibreOffice headless.
// Ne jamais appeler LibreOffice directement dans le thread principal (instabilité concurrence).

async function convertToPdf(docxBuffer, gotenbergUrl, filename) {
  const FormData = require("form-data");
  const axios    = require("axios");

  const form = new FormData();
  form.append("files", docxBuffer, { filename: `${filename}.docx`, contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  const response = await axios.post(
    `${gotenbergUrl}/forms/libreoffice/convert`,
    form,
    { headers: form.getHeaders(), responseType: "arraybuffer" }
  );
  return Buffer.from(response.data);
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

/**
 * @param {object} rawData         - JSON brut (sorti de l'IA + formulaire)
 * @param {string} theme           - ex: "premium-light", "classic-dark"
 * @param {object} [opts]
 * @param {string}  opts.gotenbergUrl  - URL Gotenberg (requis si exportPdf=true)
 * @param {boolean} opts.exportPdf     - true pour convertir en PDF aussi
 * @param {boolean} opts.skipQr        - true pour les tests sans réseau
 * @returns {{ docxBuffer: Buffer, pdfBuffer?: Buffer, meta: object }}
 */
async function render(rawData, theme, opts = {}) {
  const documentType = rawData?.meta?.documentType;

  // 1. Récupère la config depuis le registre (lève une erreur si type inconnu)
  const config  = getConfig(documentType);
  const palette = getPalette(theme);

  // 2. Valide le JSON
  validate(config.schema, rawData);

  // 3. Enrichit les données serveur
  const enriched = enrich(rawData, config, theme);

  // 4. Génère le DOCX
  const docxBuffer = await generateDocx(enriched, config, palette, { skipQr: opts.skipQr });

  // 5. Convertit en PDF si demandé
  let pdfBuffer;
  if (opts.exportPdf) {
    if (!opts.gotenbergUrl) throw new Error("gotenbergUrl requis pour exportPdf=true");
    pdfBuffer = await convertToPdf(docxBuffer, opts.gotenbergUrl, `${documentType}-${enriched.meta.documentId}`);
  }

  return { docxBuffer, pdfBuffer, meta: enriched.meta };
}

// ─── Utilitaire UUID simple ───────────────────────────────────────────────────
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

module.exports = { render, validate, enrich };
