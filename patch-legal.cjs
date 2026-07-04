const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleSetShowLegalDoc = [\s\S]*?\n  };\n/m,
  `const handleSetShowLegalDoc = (val: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data' | null) => {
    if (val) {
      window.history.pushState({ view: 'legal', doc: val }, '');
      setCurrentView('legal');
      setShowLegalDoc(val);
    } else {
      if (window.history.state?.view === 'legal') {
        window.history.back();
      } else {
        setCurrentView('home');
        setShowLegalDoc(null);
      }
    }
  };\n`
);

fs.writeFileSync('src/App.tsx', code);
