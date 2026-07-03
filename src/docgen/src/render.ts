/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/src/render.ts
// Orchestrateur central du nouveau pipeline de génération.

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { getPalette } from "../themes/palette";
import { getConfig } from "./registry/documentTypes.registry";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// ─── Étape 1 : validation JSON Schema ────────────────────────────────────────

export function validate(schema: any, data: any) {
  const fn = ajv.compile(schema);
  const ok = fn(data);
  if (!ok) {
    const details = fn.errors?.map(e => `• ${e.instancePath || "(racine)"}: ${e.message}`).join("\n") || "";
    throw Object.assign(new Error("Validation JSON échouée"), { validationErrors: fn.errors, details });
  }
}

// ─── Étape 2 : enrichissement ────────────────────────────────────────────────

export function enrich(data: any, config: any, theme: string): any {
  const enriched = { ...data };

  if (!enriched.meta) {
    enriched.meta = {};
  }

  if (!enriched.meta.documentId) {
    enriched.meta.documentId = generateUUID();
  }

  enriched.meta.generatedAt = new Date().toISOString();
  enriched.meta.theme       = theme;

  if (config.hasQrCode) {
    const palette = getPalette(theme);
    const fd      = enriched.formData || {};
    const link    = fd.linkedinLink || fd.githubLink || "https://github.com";
    enriched.computed = {
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=${palette.qr.apiColor}&data=${encodeURIComponent(link)}`
    };
  }

  return enriched;
}

// ─── Étape 3 : génération DOCX ────────────────────────────────────────────────

async function generateDocx(enrichedData: any, config: any, palette: any, options: any): Promise<Buffer> {
  const generatorFn = config.generator;
  if (!generatorFn || typeof generatorFn !== "function") {
    throw new Error(`Le générateur pour "${config.label}" n'est pas défini correctement.`);
  }
  return generatorFn(enrichedData, palette, options);
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

export interface RenderOptions {
  skipQr?: boolean;
}

export interface RenderResult {
  buffer: Buffer;
  filename: string;
  meta: any;
}

/**
 * Point d'entrée conforme à INTEGRATION.md
 */
export async function renderDocument(rawData: any, opts: RenderOptions = {}): Promise<RenderResult> {
  const documentType = rawData?.meta?.documentType;
  const theme = rawData?.meta?.theme || "premium-light";

  const config  = getConfig(documentType);
  const palette = getPalette(theme);

  // 1. Valider le JSON
  validate(config.schema, rawData);

  // 2. Enrichir les données
  const enriched = enrich(rawData, config, theme);

  // 3. Générer le DOCX (avec options passées)
  const docxBuffer = await generateDocx(enriched, config, palette, { skipQr: opts.skipQr });

  const filename = `${documentType}_docugen-pro_${theme}.docx`;

  return {
    buffer: docxBuffer,
    filename,
    meta: enriched.meta
  };
}

// ─── Utilitaire UUID simple ───────────────────────────────────────────────────
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
