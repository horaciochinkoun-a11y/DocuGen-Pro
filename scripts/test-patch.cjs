const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleSetShowLegalDoc = [\s\S]*?\n  };\n/m,
  `const handleSetShowLegalDoc = (val: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data' | null) => {
    console.log("handleSetShowLegalDoc called with", val);
    if (val) {
      window.history.pushState({ view: 'legal', doc: val }, '', window.location.pathname);
      setCurrentView('legal');
      setShowLegalDoc(val);
      window.scrollTo(0, 0);
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
