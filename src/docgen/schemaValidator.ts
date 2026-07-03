import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { ProjectData } from "../types";

// Initialisation de l'instance d'Ajv avec l'accumulation de toutes les erreurs
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Schéma de validation JSON Schema pour les données de formulaire DocuGen Pro.
 */
const projectDataSchema: JSONSchemaType<ProjectData> = {
  type: "object",
  properties: {
    developerName: { type: "string", minLength: 2 },
    developerStatus: { type: "string", minLength: 2 },
    clientName: { type: "string", minLength: 2 },
    companyName: { type: "string", minLength: 2 },
    projectName: { type: "string", minLength: 2 },
    projectType: { type: "string", minLength: 2 },
    description: { type: "string", minLength: 10 },
    technologies: { type: "string", minLength: 2 },
    keyFeatures: { type: "string", minLength: 10 },
    results: { type: "string", minLength: 5 },
    duration: { type: "string", minLength: 2 },
    clientContact: { type: "string" },
    manualTime: { type: "string" },
    manualLocation: { type: "string" },
    githubLink: { type: "string" },
    linkedinLink: { type: "string" }
  },
  required: [
    "developerName",
    "developerStatus",
    "clientName",
    "companyName",
    "projectName",
    "projectType",
    "description",
    "technologies",
    "keyFeatures",
    "results",
    "duration"
  ],
  additionalProperties: true
};

const ajvValidate = ajv.compile(projectDataSchema);

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Valide un objet ProjectData en utilisant Ajv (JSON Schema).
 * Retourne un diagnostic clair avec les messages d'erreur traduits.
 */
export function validateFormFields(data: ProjectData): ValidationResult {
  const isValid = ajvValidate(data);
  if (!isValid) {
    const errors = ajvValidate.errors?.map(err => {
      const rawPath = err.instancePath || err.schemaPath;
      const field = rawPath.replace(/^\//, "") || err.params.missingProperty || "champ";
      
      // Traduction des messages d'erreur courants pour une meilleure expérience utilisateur (UX)
      const FrenchMessage = err.message;
      if (err.keyword === 'required') {
        return `Le champ "${err.params.missingProperty}" est obligatoire et doit être renseigné.`;
      }
      if (err.keyword === 'minLength') {
        return `Le champ "${field}" est trop court (requis : minimum ${err.params.limit} caractères).`;
      }
      
      return `Erreur sur le champ "${field}" : ${FrenchMessage}`;
    }) || [];
    
    return { isValid: false, errors };
  }
  return { isValid: true };
}
