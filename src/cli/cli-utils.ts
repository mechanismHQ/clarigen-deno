import { dirname, relative, resolve } from '../deps.ts';
import { SessionContract } from '../session.ts';
import { getContractName, toCamelCase } from '../utils.ts';
export { getContractName, toCamelCase, toKebabCase } from '../utils.ts';

export function encodeVariableName(name: string) {
  if (/^[A-Z\-_]*$/.test(name)) return name.replaceAll('-', '_');
  return toCamelCase(name);
}

export async function fileExists(filename: string): Promise<boolean> {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}

export async function writeFile(path: string, contents: string) {
  const dir = dirname(path);
  await Deno.mkdir(dir, { recursive: true });
  await Deno.writeTextFile(path, contents);
  return path;
}

export function cwdResolve(...paths: string[]) {
  return resolve(Deno.cwd(), ...paths);
}

export function cwdRelative(path: string) {
  return relative(Deno.cwd(), path);
}

// Sort contracts alphabetically by their contract name.
// Used to preserve ordering when generating files
export function sortContracts(contracts: SessionContract[]) {
  const nameSorted = [...contracts].sort((a, b) => {
    if (getContractName(a.contract_id) < getContractName(b.contract_id)) {
      return -1;
    }
    return 1;
  });
  return nameSorted;
}
