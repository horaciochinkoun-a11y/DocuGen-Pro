const fs = require('fs');
let code = fs.readFileSync('src/components/LegalDocs.ts', 'utf8');
console.log(code);
