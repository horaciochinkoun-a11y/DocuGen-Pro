const css = `
color-mix(in oklab,currentcolor 50%,transparent)
oklab(92.1906% 2.98023e-8 0/.4)
color: oklch(50% 0.1 200);
`;
const result = css
  .replace(/okl(ch|ab)\((?:[^)(]+|\([^)(]*\))*\)/g, 'rgb(115, 115, 115)')
  .replace(/in okl(ch|ab)/g, 'in srgb');
console.log(result);
