const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');
code = code.replace(/  let title = '';\n/g, '');
code = code.replace(/      title = "[^"]+";\n/g, '');
fs.writeFileSync('src/components/LegalPage.tsx', code);
