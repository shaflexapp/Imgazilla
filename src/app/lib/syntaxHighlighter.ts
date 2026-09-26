import { PrismLight } from 'react-syntax-highlighter';

import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import clike from 'react-syntax-highlighter/dist/esm/languages/prism/clike';
import regex from 'react-syntax-highlighter/dist/esm/languages/prism/regex';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import cssExtras from 'react-syntax-highlighter/dist/esm/languages/prism/css-extras';
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import javadoclike from 'react-syntax-highlighter/dist/esm/languages/prism/javadoclike';
import jsTemplates from 'react-syntax-highlighter/dist/esm/languages/prism/js-templates';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsdoc from 'react-syntax-highlighter/dist/esm/languages/prism/jsdoc';
import jsExtras from 'react-syntax-highlighter/dist/esm/languages/prism/js-extras';

// The full Prism build registers about 300 languages when it is imported. The
// plugin only highlights 'javascript', but some of those languages change the
// javascript grammar (js-extras, jsdoc, js-templates) or the grammars it embeds
// (css-extras, yaml in markdown). Registering exactly these, in the order
// refractor/all uses, gives the same javascript grammar and the same output as
// the full build without shipping or registering the rest.
const languages = [
  ['markup', markup],
  ['css', css],
  ['clike', clike],
  ['regex', regex],
  ['javascript', javascript],
  ['sql', sql],
  ['yaml', yaml],
  ['markdown', markdown],
  ['css-extras', cssExtras],
  ['graphql', graphql],
  ['javadoclike', javadoclike],
  ['js-templates', jsTemplates],
  ['typescript', typescript],
  ['jsdoc', jsdoc],
  ['js-extras', jsExtras],
] as const;

languages.forEach(([name, language]) =>
  PrismLight.registerLanguage(name, language),
);

export { PrismLight as SyntaxHighlighter };
