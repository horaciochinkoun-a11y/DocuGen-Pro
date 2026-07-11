// schemas/shared-meta.schema.js
// Bloc meta commun à tous les documents (pour référence dans les 7 autres schémas)
// Copier-coller ce bloc dans chaque schéma, en ajustant documentType.const

const sharedMeta = {
  "type": "object",
  "additionalProperties": false,
  "required": ["documentId", "documentType", "theme", "generatedAt"],
  "properties": {
    "documentId":   { "type": "string" },
    "documentType": { "type": "string" },
    "theme":        { "type": "string", "enum": ["premium-light", "premium-dark", "classic-light", "classic-dark"] },
    "generatedAt":  { "type": "string", "format": "date-time" }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MODE COMPLETION : 3 documents restants
// ─────────────────────────────────────────────────────────────────────────────

const technicalSummarySchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Résumé technique",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "technicalSummary" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["technicalSummaryMarkdown"],
      "properties": {
        "technicalSummaryMarkdown": {
          "type": "string",
          "description": "Markdown complet du résumé technique. Titres ## attendus : Architecture, Stack, Rôle, Défis."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

const cvVersionSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Version CV",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "cvVersion" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["cvMarkdown"],
      "properties": {
        "cvMarkdown": {
          "type": "string",
          "description": "Markdown du bloc CV. Sections ## attendues : PROJET RÉCENT, TECHNOLOGIES, RÉALISATIONS. Chiffres en gras."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

const linkedinVersionSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Version LinkedIn",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "linkedinVersion" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["linkedinMarkdown"],
      "properties": {
        "linkedinMarkdown": {
          "type": "string",
          "description": "Post LinkedIn en Markdown. Structure storytelling : Problème → Solution → Résultat. Paragraphes courts."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

// ─────────────────────────────────────────────────────────────────────────────
// MODE INITIATION : 4 documents
// ─────────────────────────────────────────────────────────────────────────────

const roadmapSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Feuille de route",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "roadmap" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["roadmapMarkdown"],
      "properties": {
        "roadmapMarkdown": {
          "type": "string",
          "description": "Markdown de la roadmap. Titre H1, puis ## Phase 1 : Fondations, ## Phase 2 : MVP, ## Phase 3 : Scale avec jalons ### imbriqués."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

const architectureSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Architecture & Stack",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "architecture" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["architectureMarkdown"],
      "properties": {
        "architectureMarkdown": {
          "type": "string",
          "description": "Markdown d'architecture. Peut contenir des blocs ```code``` qui seront rendus en JetBrains Mono/Courier New dans le DOCX."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

const backlogSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Backlog & MVP",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "backlog" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["backlogMarkdown"],
      "properties": {
        "backlogMarkdown": {
          "type": "string",
          "description": "Markdown du backlog. Items de liste avec ☐ prefix. Sections ## In Scope et ## Out of Scope."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

const pitchSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Pitch & Go-To-Market",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "pitch" } } },
    "formData": { "$ref": "#/$defs/formData" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["pitchMarkdown"],
      "properties": {
        "pitchMarkdown": {
          "type": "string",
          "description": "Markdown du pitch. Elevator Pitch en blockquote (> texte). Sections ## USP, ## Canaux d'acquisition."
        }
      }
    }
  },
  "$defs": { "formData": { "$ref": "attestation.schema.json#/properties/formData" } }
};

module.exports = {
  technicalSummarySchema,
  cvVersionSchema,
  linkedinVersionSchema,
  roadmapSchema,
  architectureSchema,
  backlogSchema,
  pitchSchema
};
