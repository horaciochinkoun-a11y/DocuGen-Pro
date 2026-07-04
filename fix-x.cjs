const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/,\n  X\n\} from 'lucide-react';/, "\n} from 'lucide-react';");

fs.writeFileSync('src/App.tsx', code);
