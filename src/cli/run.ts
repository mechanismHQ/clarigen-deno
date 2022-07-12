import { generateDenoFile } from './gen-deno.ts';
import { getSession } from './index.ts';
import { generateSingleFile } from './single.ts';

const session = getSession();
const singleFile = generateSingleFile(session);
const denoFile = generateDenoFile(session);

await Deno.mkdir('./artifacts/clarigen/deno', { recursive: true });
await Promise.all([
  Deno.writeTextFile('./artifacts/clarigen/index.ts', singleFile),
  Deno.writeTextFile('./artifacts/clarigen/deno/index.ts', denoFile),
]);
