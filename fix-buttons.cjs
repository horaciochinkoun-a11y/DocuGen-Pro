const fs = require('fs');

// Add type="button" to buttons in LandingPage.tsx
let lpCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
lpCode = lpCode.replace(/<button onClick=\{\(\) => onShowLegalDoc\('([^']+)'\)\}/g, '<button type="button" onClick={() => onShowLegalDoc(\'$1\')}');
fs.writeFileSync('src/components/LandingPage.tsx', lpCode);

// Add type="button" to buttons in App.tsx (DocumentationGenerator footer)
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/<button onClick=\{\(\) => onShowLegalDoc\('([^']+)'\)\}/g, '<button type="button" onClick={() => onShowLegalDoc(\'$1\')}');
fs.writeFileSync('src/App.tsx', appCode);

