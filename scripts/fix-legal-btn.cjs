const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');
code = code.replace(/<button \n          onClick=\{onBack\}/, '<button type="button" onClick={onBack}');
fs.writeFileSync('src/components/LegalPage.tsx', code);
