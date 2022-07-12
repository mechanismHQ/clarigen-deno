import { resolve } from 'https://deno.land/std@0.144.0/path/mod.ts';

const sourceFile = resolve(Deno.cwd(), 'src/types.ts');
const sourceCode = await Deno.readTextFile(sourceFile);

const output = `export const types = \`
${sourceCode}
\`;
`

const outputFile = resolve(Deno.cwd(), 'src/cli/type-stub.ts');
await Deno.writeTextFile(outputFile, output);