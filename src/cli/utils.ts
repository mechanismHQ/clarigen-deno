import { resolve } from '../deps.ts';

export const toCamelCase = (
  input: string | number | symbol,
  titleCase?: boolean,
) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  const [first, ...parts] = inputStr.replace('!', '').replace('?', '').split(
    '-',
  );
  const firstChar = titleCase ? first[0].toUpperCase() : first[0].toLowerCase();
  let result = `${firstChar}${first.slice(1)}`;
  parts.forEach((part) => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

export function toKebabCase(
  input: string,
): string {
  const matches = input
    .match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
    );
  if (!matches) return input;
  return matches.join('-').toLowerCase();
}

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

export function cwdResolve(...paths: string[]) {
  return resolve(Deno.cwd(), ...paths);
}
