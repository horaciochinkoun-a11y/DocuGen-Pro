/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/src/registry/documentTypes.registry.ts
// Source unique de vérité pour les 8 types de documents réels de DocuGen-Pro.

import {
  attestationSchema,
  technicalSummarySchema,
  cvVersionSchema,
  linkedinVersionSchema,
  roadmapSchema,
  architectureSchema,
  backlogSchema,
  pitchSchema,
} from "./schemas";

import { generateAttestationDocx } from "../../generators/attestation.generator";
import { generateTechnicalSummaryDocx } from "../../generators/technicalSummary.generator";
import { generateCvVersionDocx } from "../../generators/cvVersion.generator";
import { generateLinkedinVersionDocx } from "../../generators/linkedinVersion.generator";
import { generateRoadmapDocx } from "../../generators/roadmap.generator";
import { generateArchitectureDocx } from "../../generators/architecture.generator";
import { generateBacklogDocx } from "../../generators/backlog.generator";
import { generatePitchDocx } from "../../generators/pitch.generator";

export interface DocumentTypeConfig {
  label: string;
  mode: "completion" | "initiation";
  schema: any;
  markdownField: string;
  specialFont?: boolean;
  hasQrCode: boolean;
  watermark: string | null;
  monoBlocks?: boolean;
  hasBlockquote?: boolean;
  generator: (data: any, palette: any, options?: any) => Promise<Buffer>;
}

export const registry: Record<string, DocumentTypeConfig> = {
  // ──── MODE COMPLETION ────────────────────────────────────────────────────────
  attestation: {
    label:           "Attestation professionnelle",
    mode:            "completion",
    schema:          attestationSchema,
    markdownField:   "content.attestationMarkdown",
    specialFont:     true,
    hasQrCode:       true,
    watermark:       "CERTIFIÉ",
    generator:       generateAttestationDocx,
  },

  technicalSummary: {
    label:         "Résumé technique",
    mode:          "completion",
    schema:        technicalSummarySchema,
    markdownField: "content.technicalSummaryMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     generateTechnicalSummaryDocx,
  },

  cvVersion: {
    label:         "Version CV",
    mode:          "completion",
    schema:        cvVersionSchema,
    markdownField: "content.cvMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     generateCvVersionDocx,
  },

  linkedinVersion: {
    label:         "Version LinkedIn",
    mode:          "completion",
    schema:        linkedinVersionSchema,
    markdownField: "content.linkedinMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     generateLinkedinVersionDocx,
  },

  // ──── MODE INITIATION ────────────────────────────────────────────────────────
  roadmap: {
    label:         "Feuille de route",
    mode:          "initiation",
    schema:        roadmapSchema,
    markdownField: "content.roadmapMarkdown",
    hasQrCode:     false,
    watermark:     "ROADMAP",
    generator:     generateRoadmapDocx,
  },

  architecture: {
    label:         "Architecture & Stack",
    mode:          "initiation",
    schema:        architectureSchema,
    markdownField: "content.architectureMarkdown",
    monoBlocks:    true,
    hasQrCode:     false,
    watermark:     null,
    generator:     generateArchitectureDocx,
  },

  backlog: {
    label:         "Backlog & MVP",
    mode:          "initiation",
    schema:        backlogSchema,
    markdownField: "content.backlogMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     generateBacklogDocx,
  },

  pitch: {
    label:         "Pitch & Go-To-Market",
    mode:          "initiation",
    schema:        pitchSchema,
    markdownField: "content.pitchMarkdown",
    hasBlockquote: true,
    hasQrCode:     false,
    watermark:     null,
    generator:     generatePitchDocx,
  },
};

export function getConfig(documentType: string): DocumentTypeConfig {
  const config = registry[documentType];
  if (!config) {
    const valid = Object.keys(registry).join(", ");
    throw new Error(`Type de document inconnu: "${documentType}". Types valides: ${valid}`);
  }
  return config;
}
export { getConfig as default };
