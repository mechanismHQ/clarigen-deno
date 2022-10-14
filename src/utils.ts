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

export function getContractName(identifier: string, camelCase = true) {
  const name = identifier.split('.')[1];
  return camelCase ? toCamelCase(name) : name;
}
