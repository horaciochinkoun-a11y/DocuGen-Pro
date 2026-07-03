import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Intercept and suppress html2canvas warnings about unsupported oklab/oklch color functions across all console methods
const suppressOklab = (originalFn: (...args: unknown[]) => void) => {
  return (...args: unknown[]) => {
    const shouldSuppress = args.some(arg => {
      if (!arg) return false;
      const str = typeof arg === 'string' ? arg : String(arg);
      if (
        str.includes('unsupported color function') ||
        str.includes('Attempting to parse an unsupported color function') ||
        str.includes('oklab') ||
        str.includes('oklch')
      ) {
        return true;
      }
      if (arg instanceof Error) {
        const msg = arg.message || '';
        const stack = arg.stack || '';
        if (
          msg.includes('unsupported color function') ||
          msg.includes('oklab') ||
          msg.includes('oklch') ||
          stack.includes('unsupported color function') ||
          stack.includes('oklab') ||
          stack.includes('oklch')
        ) {
          return true;
        }
      }
      return false;
    });

    if (shouldSuppress) {
      return;
    }
    originalFn.apply(console, args);
  };
};

console.error = suppressOklab(console.error);
console.warn = suppressOklab(console.warn);
console.log = suppressOklab(console.log);
console.info = suppressOklab(console.info);

// Global event listeners to suppress uncaught exceptions from html2canvas color parsing
window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    msg.includes('unsupported color function') ||
    msg.includes('oklab') ||
    msg.includes('oklch')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (!reason) return;
  const msg = typeof reason === 'string' ? reason : (reason.message || '');
  if (
    msg.includes('unsupported color function') ||
    msg.includes('oklab') ||
    msg.includes('oklch')
  ) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
