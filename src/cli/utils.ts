export const toCamelCase = (
  input: string | number | symbol,
  titleCase?: boolean,
) => {
  const inputStr = typeof input === "string" ? input : String(input);
  const [first, ...parts] = inputStr.replace("!", "").replace("?", "").split(
    "-",
  );
  const firstChar = titleCase ? first[0].toUpperCase() : first[0].toLowerCase();
  let result = `${firstChar}${first.slice(1)}`;
  parts.forEach((part) => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};