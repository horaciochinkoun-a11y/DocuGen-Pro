const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change currentView type
code = code.replace(
  "const [currentView, setCurrentView] = useState<'home' | 'app'>('home');",
  "const [currentView, setCurrentView] = useState<'home' | 'app' | 'legal'>('home');"
);

// Replace handleSetShowLegalDoc
code = code.replace(
  /const handleSetShowLegalDoc = \([^}]*\} else \{[^}]*\}\n\s*\};\n/s,
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

// Add legal to handlePopState
code = code.replace(
  `} else if (state.view === 'app') {`,
  `} else if (state.view === 'legal') {
        setCurrentView('legal');
        if (state.doc) setShowLegalDoc(state.doc);
        setShowExitConfirm(false);
      } else if (state.view === 'app') {`
);

// Change rendering
// Right now we have:
//   return (
//     ...
//     {currentView === 'home' ? ( <LandingPage ... /> ) : ( <DocumentationGenerator ... /> )}
//   )
// And the AnimatePresence for the modal.
code = code.replace(
  /\{currentView === 'home' \? \([\s\S]*?<\/DocumentationGenerator>\n\s*\)\}/s,
  `{currentView === 'home' && (
          <LandingPage 
            onStart={() => {
              window.history.pushState({ view: 'app' }, '');
              setCurrentView('app');
            }} 
            theme={theme} 
            toggleTheme={toggleTheme}
            onShowLegalDoc={handleSetShowLegalDoc}
          />
        )}
        {currentView === 'app' && (
          <DocumentationGenerator 
            onNavigateHome={() => {
              if (window.history.state?.view === 'app') {
                window.history.back();
              } else {
                window.history.pushState({ view: 'home' }, '');
                setCurrentView('home');
              }
            }} 
            theme={theme} 
            toggleTheme={toggleTheme}
            designSystem={designSystem}
            setDesignSystem={setDesignSystem}
            showSettings={showSettings}
            setShowSettings={handleSetShowSettings}
            showHistory={showHistory}
            setShowHistory={handleSetShowHistory}
            showReleaseNotes={showReleaseNotes}
            setShowReleaseNotes={handleSetShowReleaseNotes}
            onShowLegalDoc={handleSetShowLegalDoc}
          />
        )}
        {currentView === 'legal' && showLegalDoc && (
          <LegalPage 
            docType={showLegalDoc}
            onBack={() => handleSetShowLegalDoc(null)}
            theme={theme}
          />
        )}`
);

// Remove the Legal Document Modal
code = code.replace(
  /\s*{\/\* Legal Document Modal \*\/}[\s\S]*?<\/AnimatePresence>\s*<\/div>\s*<\/ErrorBoundary>\s*\);\s*}/s,
  `\n      </div>\n    </ErrorBoundary>\n  );\n}`
);


fs.writeFileSync('src/App.tsx', code);
