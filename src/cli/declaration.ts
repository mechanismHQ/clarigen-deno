import {
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  isClarityAbiResponse,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
} from "../encoder.ts";
import { ClarityAbiType } from "../types.ts";
import { toCamelCase } from "./utils.ts";

export const jsTypeFromAbiType = (
  val: ClarityAbiType,
  isArgument = false,
): string => {
  if (isClarityAbiPrimitive(val)) {
    if (val === "uint128") {
      if (isArgument) return "number | bigint";
      return "bigint";
    } else if (val === "int128") {
      if (isArgument) return "number | bigint";
      return "bigint";
    } else if (val === "bool") {
      return "boolean";
    } else if (val === "principal") {
      return "string";
    } else if (val === "none") {
      return "null";
    } else if (val === "trait_reference") {
      return "string";
    } else {
      throw new Error(
        `Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`,
      );
    }
  } else if (isClarityAbiBuffer(val)) {
    return "Uint8Array";
  } else if (isClarityAbiResponse(val)) {
    const ok = jsTypeFromAbiType(val.response.ok);
    const err = jsTypeFromAbiType(val.response.error);
    return `Response<${ok}, ${err}>`;
  } else if (isClarityAbiOptional(val)) {
    const innerType = jsTypeFromAbiType(val.optional);
    return `${innerType} | null`;
  } else if (isClarityAbiTuple(val)) {
    const tupleDefs: string[] = [];
    val.tuple.forEach(({ name, type }) => {
      const camelName = toCamelCase(name);
      const innerType = jsTypeFromAbiType(type);
      tupleDefs.push(`"${camelName}": ${innerType};`);
    });
    return `{
  ${tupleDefs.join("\n  ")}
}`;
  } else if (isClarityAbiList(val)) {
    const innerType = jsTypeFromAbiType(val.list.type);
    return `${innerType}[]`;
  } else if (isClarityAbiStringAscii(val)) {
    return "string";
  } else if (isClarityAbiStringUtf8(val)) {
    return "string";
  } else if (val === "trait_reference") {
    return "string";
  } else {
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
  }
};

// Check if it's a reserved word, and then camelCase
export function getArgName(name: string) {
  const camel = toCamelCase(name);
  const prefix = RESERVED[camel] ? "_" : "";
  return `${prefix}${camel}`;
}

function _hash(...words: string[]) {
  const h: Record<string, boolean> = {};
  for (const word of words) {
    h[word] = true;
  }
  return h;
}

const RESERVED = _hash(
  // Keywords, ES6 11.6.2.1, http://www.ecma-international.org/ecma-262/6.0/index.html#sec-keywords
  "break",
  "do",
  "in",
  "typeof",
  "case",
  "else",
  "instanceof",
  "var",
  "catch",
  "export",
  "new",
  "void",
  "class",
  "extends",
  "return",
  "while",
  "const",
  "finally",
  "super",
  "with",
  "continue",
  "for",
  "switch",
  "yield",
  "debugger",
  "function",
  "this",
  "default",
  "if",
  "throw",
  "delete",
  "import",
  "try",
  // Future Reserved Words, ES6 11.6.2.2
  // http://www.ecma-international.org/ecma-262/6.0/index.html#sec-future-reserved-words
  "enum",
  "await",
  // NullLiteral & BooleanLiteral
  "null",
  "true",
  "false",
);
