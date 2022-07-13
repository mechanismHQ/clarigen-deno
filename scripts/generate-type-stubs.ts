import { resolve } from '../src/deps.ts';

const sourceFile = resolve(Deno.cwd(), 'src/types.ts');
const sourceCode = await Deno.readTextFile(sourceFile);

const output = `export const types = \`
${sourceCode}
\`;
`;

const outputFile = resolve(Deno.cwd(), 'src/cli/type-stub.ts');
await Deno.writeTextFile(outputFile, output);
