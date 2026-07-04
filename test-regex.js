const css = `
color-mix(in oklab,currentcolor 50%,transparent)
color-mix(in oklab,var(--color-neutral-900) 50%,transparent)
color-mix(in oklab,#bae0fd 50%,transparent)
color-mix(in oklab, rgba(0,0,0,0.5) 20%, transparent)
`;
const result = css
  .replace(/color-mix\(\s*in\s+\w+\s*,\s*([^,]+?)(?:\s+\d+(?:\.\d+)?%)?\s*,\s*transparent\s*\)/g, '$1');
console.log(result);
