const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
console.log("Success");
