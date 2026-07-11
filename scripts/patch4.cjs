const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');

code = code.replace(
  "import Markdown from 'react-markdown';",
  "import Markdown from 'react-markdown';\nimport rehypeSlug from 'rehype-slug';"
);

code = code.replace(
  "<Markdown>{content}</Markdown>",
  "<Markdown rehypePlugins={[rehypeSlug]}>{content}</Markdown>"
);

fs.writeFileSync('src/components/LegalPage.tsx', code);
