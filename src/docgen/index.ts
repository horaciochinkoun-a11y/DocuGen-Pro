/**
 * DocuGen Pro (Horacio Chinkoun) - Document Generation Module
 * Centralise les outils d'exportation de documents (.docx) et de validation (Ajv)
 */

export { convertMarkdownToDocx, type DocxConversionOptions } from "./markdownToDocx";
export { validateFormFields, type ValidationResult } from "./schemaValidator";
export { THEMES, FONTS, SPACING, type ColorTheme } from "./docxStyles";
export { Packer } from "docx";

// Nouveaux exports de l'engin de rendu unifié DocuGen-Pro
export { renderDocument, type RenderOptions, type RenderResult } from "./src/render";
export { getPalette, PALETTES } from "./themes/palette";
export { registry, getConfig } from "./src/registry/documentTypes.registry";
export { markdownToDocxElements } from "./src/markdownToDocx";
