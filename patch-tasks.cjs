const fs = require('fs');
let code = fs.readFileSync('docs/tasks_tracking.md', 'utf8');
code = code.replace(
  /- \[x\] Intégration des liens vers les documents légaux dans les pieds de page \(Landing Page - \[x\] Intégration des liens vers les documents légaux dans les pieds de page \(Landing Page - \[x\] Intégration des liens vers les documents légaux dans les pieds de page \(Landing Page & Générateur\). Générateur\). Générateur\)./g,
  '- [x] Intégration des liens vers les documents légaux dans les pieds de page (Landing Page, Application, Mentions).'
);
fs.writeFileSync('docs/tasks_tracking.md', code);
