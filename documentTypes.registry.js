// src/registry/documentTypes.registry.js
// Source unique de vérité pour les 8 types de documents réels de DocuGen-Pro.
// Clé = valeur de `documentType` dans le JSON produit par l'IA.

const path = require("path");
const attestationSchema = require(path.join(__dirname, "../../schemas/attestation.schema.json"));
const { technicalSummarySchema, cvVersionSchema, linkedinVersionSchema,
        roadmapSchema, architectureSchema, backlogSchema, pitchSchema }
  = require(path.join(__dirname, "../../schemas/all-schemas.js"));

const registry = {

  // ──── MODE COMPLETION ────────────────────────────────────────────────────────
  attestation: {
    label:           "Attestation professionnelle",
    mode:            "completion",
    schema:          attestationSchema,
    // Champ du JSON IA contenant le Markdown source
    markdownField:   "content.attestationMarkdown",
    // Police spéciale attestation : varie selon le design system (géré dans le générateur)
    specialFont:     true,
    // Ce type génère un QR code (uniquement l'attestation)
    hasQrCode:       true,
    // Filigrane texte dans le document (géré dans le générateur)
    watermark:       "CERTIFIÉ",
    // Générateur de DOCX
    generator:       require("../../generators/attestation.generator"),
  },

  technicalSummary: {
    label:         "Résumé technique",
    mode:          "completion",
    schema:        technicalSummarySchema,
    markdownField: "content.technicalSummaryMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/technicalSummary.generator"),
  },

  cvVersion: {
    label:         "Version CV",
    mode:          "completion",
    schema:        cvVersionSchema,
    markdownField: "content.cvMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/cvVersion.generator"),
  },

  linkedinVersion: {
    label:         "Version LinkedIn",
    mode:          "completion",
    schema:        linkedinVersionSchema,
    markdownField: "content.linkedinMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/linkedinVersion.generator"),
  },

  // ──── MODE INITIATION ────────────────────────────────────────────────────────
  roadmap: {
    label:         "Feuille de route",
    mode:          "initiation",
    schema:        roadmapSchema,
    markdownField: "content.roadmapMarkdown",
    hasQrCode:     false,
    watermark:     "ROADMAP",  // filigrane spécifique à la roadmap dans l'app originale
    generator:     require("../../generators/roadmap.generator"),
  },

  architecture: {
    label:         "Architecture & Stack",
    mode:          "initiation",
    schema:        architectureSchema,
    markdownField: "content.architectureMarkdown",
    // Ce document utilise une police monospace pour les blocs de code
    monoBlocks:    true,
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/architecture.generator"),
  },

  backlog: {
    label:         "Backlog & MVP",
    mode:          "initiation",
    schema:        backlogSchema,
    markdownField: "content.backlogMarkdown",
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/backlog.generator"),
  },

  pitch: {
    label:         "Pitch & Go-To-Market",
    mode:          "initiation",
    schema:        pitchSchema,
    markdownField: "content.pitchMarkdown",
    // Ce document met l'Elevator Pitch en blockquote centré
    hasBlockquote: true,
    hasQrCode:     false,
    watermark:     null,
    generator:     require("../../generators/pitch.generator"),
  },
};

function getConfig(documentType) {
  const config = registry[documentType];
  if (!config) {
    const valid = Object.keys(registry).join(", ");
    throw new Error(`Type de document inconnu: "${documentType}". Types valides: ${valid}`);
  }
  return config;
}

module.exports = { registry, getConfig };
