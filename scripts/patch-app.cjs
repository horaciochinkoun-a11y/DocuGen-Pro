const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "console.error('Erreur lors de l\\'export Word (.docx) :', err);",
  "console.error('Erreur lors de l\\'export Word (.docx) :', err, err.details || '');"
);
fs.writeFileSync('src/App.tsx', code);
