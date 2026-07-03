/* eslint-disable @typescript-eslint/no-explicit-any */
// src/docgen/src/registry/schemas.ts
// Centralise tous les schémas JSON Schema pour les types de documents de DocuGen Pro.

const sharedMeta: any = {
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

export const attestationSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://docugen-pro/schemas/attestation.schema.json",
  "title": "Attestation professionnelle",
  "description": "Schéma pour le type 'attestation' généré par le mode Completion de DocuGen-Pro.",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": {
      "type": "object",
      "additionalProperties": false,
      "required": ["documentId", "documentType", "theme", "generatedAt"],
      "properties": {
        "documentId":   { "type": "string" },
        "documentType": { "type": "string", "const": "attestation" },
        "theme":        { "type": "string", "enum": ["premium-light", "premium-dark", "classic-light", "classic-dark"] },
        "generatedAt":  { "type": "string", "format": "date-time" }
      }
    },
    "formData": {
      "type": "object",
      "additionalProperties": false,
      "required": ["developerName", "developerStatus", "clientName", "companyName", "projectName"],
      "properties": {
        "developerName":   { "type": "string" },
        "developerStatus": { "type": "string" },
        "clientName":      { "type": "string" },
        "companyName":     { "type": "string" },
        "projectName":     { "type": "string" },
        "projectType":     { "type": "string" },
        "technologies":    { "type": "string" },
        "keyFeatures":     { "type": "string" },
        "results":         { "type": "string" },
        "duration":        { "type": "string" },
        "clientContact":   { "type": "string" },
        "manualTime":      { "type": "string" },
        "manualLocation":  { "type": "string" },
        "githubLink":      { "type": "string" },
        "linkedinLink":    { "type": "string" }
      }
    },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["attestationMarkdown"],
      "properties": {
        "attestationMarkdown": {
          "type": "string"
        }
      }
    },
    "computed": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "qrCodeUrl": {
          "type": "string"
        }
      }
    }
  }
};

export const technicalSummarySchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Résumé technique",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "technicalSummary" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["technicalSummaryMarkdown"],
      "properties": {
        "technicalSummaryMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const cvVersionSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Version CV",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "cvVersion" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["cvMarkdown"],
      "properties": {
        "cvMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const linkedinVersionSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Version LinkedIn",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "linkedinVersion" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["linkedinMarkdown"],
      "properties": {
        "linkedinMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const roadmapSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Feuille de route",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "roadmap" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["roadmapMarkdown"],
      "properties": {
        "roadmapMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const architectureSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Architecture & Stack",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "architecture" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["architectureMarkdown"],
      "properties": {
        "architectureMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const backlogSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Backlog & MVP",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "backlog" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["backlogMarkdown"],
      "properties": {
        "backlogMarkdown": {
          "type": "string"
        }
      }
    }
  }
};

export const pitchSchema: any = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Pitch & Go-To-Market",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "formData", "content"],
  "properties": {
    "meta": { ...sharedMeta, properties: { ...sharedMeta.properties, "documentType": { "type": "string", "const": "pitch" } } },
    "formData": { type: "object" },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["pitchMarkdown"],
      "properties": {
        "pitchMarkdown": {
          "type": "string"
        }
      }
    }
  }
};
