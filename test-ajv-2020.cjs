const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object"
};
const fn = ajv.compile(schema);
console.log("Compiled:", !!fn);
