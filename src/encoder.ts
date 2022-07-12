// deno-lint-ignore-file no-explicit-any
import type {
  ClarityAbiFunction,
  ClarityAbiType,
  ClarityAbiTypeBool,
  ClarityAbiTypeBuffer,
  ClarityAbiTypeInt128,
  ClarityAbiTypeList,
  ClarityAbiTypeNone,
  ClarityAbiTypeOptional,
  ClarityAbiTypePrimitive,
  ClarityAbiTypePrincipal,
  ClarityAbiTypeResponse,
  ClarityAbiTypeStringAscii,
  ClarityAbiTypeStringUtf8,
  ClarityAbiTypeTraitReference,
  ClarityAbiTypeTuple,
  ClarityAbiTypeUInt128,
  Response,
} from "./types.ts";
import { err, ok } from "./types.ts";
import { types } from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { toCamelCase, toKebabCase } from "./cli/utils.ts";

export const isClarityAbiPrimitive = (
  val: ClarityAbiType,
): val is ClarityAbiTypePrimitive => typeof val === "string";
export const isClarityAbiBuffer = (
  val: ClarityAbiType,
): val is ClarityAbiTypeBuffer =>
  (val as ClarityAbiTypeBuffer).buffer !== undefined;
export const isClarityAbiStringAscii = (
  val: ClarityAbiType,
): val is ClarityAbiTypeStringAscii =>
  (val as ClarityAbiTypeStringAscii)["string-ascii"] !== undefined;
export const isClarityAbiStringUtf8 = (
  val: ClarityAbiType,
): val is ClarityAbiTypeStringUtf8 =>
  (val as ClarityAbiTypeStringUtf8)["string-utf8"] !== undefined;
export const isClarityAbiResponse = (
  val: ClarityAbiType,
): val is ClarityAbiTypeResponse =>
  (val as ClarityAbiTypeResponse).response !== undefined;
export const isClarityAbiOptional = (
  val: ClarityAbiType,
): val is ClarityAbiTypeOptional =>
  (val as ClarityAbiTypeOptional).optional !== undefined;
export const isClarityAbiTuple = (
  val: ClarityAbiType,
): val is ClarityAbiTypeTuple =>
  (val as ClarityAbiTypeTuple).tuple !== undefined;
export const isClarityAbiList = (
  val: ClarityAbiType,
): val is ClarityAbiTypeList => (val as ClarityAbiTypeList).list !== undefined;

export function valueToCV(input: any, type: ClarityAbiType): string {
  if (isClarityAbiTuple(type)) {
    if (typeof input !== "object") {
      throw new Error("Invalid input: not object.");
    }
    const tuple: Record<string, any> = {};
    type.tuple.forEach((key) => {
      const jsKey = findJsTupleKey(key.name, input);
      const val = input[jsKey];
      tuple[key.name] = valueToCV(val, key.type);
    });
    return types.tuple(tuple);
  } else if (isClarityAbiList(type)) {
    const inputs = input as any[];
    const values: any[] = inputs.map((i) => {
      return valueToCV(i, type.list.type);
    });
    return types.list(values);
  } else if (isClarityAbiOptional(type)) {
    if (!input) return types.none();
    return types.some(valueToCV(input, type.optional));
  } else if (isClarityAbiStringAscii(type)) {
    return types.ascii(input);
  } else if (isClarityAbiStringUtf8(type)) {
    return types.utf8(input);
  } else if (type === "bool") {
    return types.bool(input);
  } else if (type === "uint128") {
    return types.uint(input);
  } else if (type === "int128") {
    return types.int(input);
  } else if (type === "trait_reference") {
    return types.principal(input);
  } else if (type === "principal") {
    return types.principal(input);
  } else if (type === "none") {
    return types.none();
  } else if (isClarityAbiBuffer(type)) {
    return types.buff(input);
  } else if (isClarityAbiResponse(type)) {
    if (!("isOk" in input) || !("value" in input)) {
      throw new Error("Invalid response argument.");
    }
    const res = input as Response<any, any>;
    if (res.isOk) {
      return types.ok(valueToCV(res.value, type.response.ok));
    }
    return types.err(valueToCV(res.value, type.response.error));
  }
  throw new Error(
    `[Clarigen] Unable to to convert argument type ${type}. Please file an issue.`,
  );
}

export function transformArgsToCV(func: ClarityAbiFunction, args: any[]) {
  return args.map((arg, index) => valueToCV(arg, func.args[index].type));
}

function unwrap(input: string, prefix = "") {
  return input.slice(prefix.length + 2, -1);
}

export type AbiPrimitiveTo<T extends ClarityAbiTypePrimitive> = T extends
  ClarityAbiTypeInt128 ? bigint
  : T extends ClarityAbiTypeUInt128 ? bigint
  : T extends ClarityAbiTypeBool ? boolean
  : T extends ClarityAbiTypePrincipal ? string
  : T extends ClarityAbiTypeTraitReference ? string
  : T extends ClarityAbiTypeNone ? never
  : T;

export type AbiTypeTo<T extends ClarityAbiType, A = any> = T extends
  ClarityAbiTypePrimitive ? AbiPrimitiveTo<T> : A;

export function cvToValue<AbiType extends ClarityAbiType>(
  input: string,
  type: AbiType,
): AbiTypeTo<AbiType>;
export function cvToValue<T = any>(input: string, type: ClarityAbiType): T;
export function cvToValue<T = any>(
  input: string,
  type: ClarityAbiType,
): T {
  if (isClarityAbiTuple(type)) {
    const decoded = input.expectTuple();
    const tuple: Record<string, any> = {};
    const tupleReduced = Object.entries(decoded).reduce((acc, [key, val]) => {
      const keyFixed = key.trim();
      return {
        ...acc,
        [keyFixed]: val.trim(),
      };
    }, {} as Record<string, any>);
    type.tuple.forEach(({ name, type: _type }) => {
      const camelName = toCamelCase(name);
      tuple[camelName] = cvToValue(tupleReduced[name], _type);
    });
    return tuple as unknown as T;
    // throw new Error("Unable to parse tuple yet.");
  } else if (isClarityAbiList(type)) {
    const elements: string[] = (input.expectList() as string[]);
    return elements.map((e) => cvToValue(e, type.list.type)) as unknown as T;
    // throw new Error("Unable to parse list");
  } else if (isClarityAbiOptional(type)) {
    if (input === "none") return null as unknown as T;
    return cvToValue(unwrap(input, "some"), type.optional);
  } else if (isClarityAbiStringAscii(type)) {
    return input.slice(1, -1) as unknown as T;
  } else if (isClarityAbiStringUtf8(type)) {
    return input.slice(2, -1) as unknown as T;
  } else if (type === "bool") {
    return (input === "true") as unknown as T;
  } else if (type === "uint128") {
    // if (!input) console.log("no input", input);
    // if (input.charAt(0) !== "u") console.log("weird uint", input);
    return BigInt(input.slice(1)) as unknown as T;
  } else if (type === "int128") {
    return BigInt(input) as unknown as T;
  } else if (type === "trait_reference") {
    return input.replace(/^\'/, "") as unknown as T;
  } else if (type === "principal") {
    return input.replace(/^\'/, "") as unknown as T;
  } else if (type === "none") {
    return null as unknown as T;
  } else if (isClarityAbiBuffer(type)) {
    const buff = hexToBytes(input.slice(2));
    return buff as unknown as T;
  } else if (isClarityAbiResponse(type)) {
    if (input.startsWith("(ok")) {
      const inner = unwrap(input, "ok");
      return ok(cvToValue(inner, type.response.ok)) as unknown as T;
    }
    const inner = unwrap(input, "err");
    return err(cvToValue(inner, type.response.error)) as unknown as T;
  }
  throw new Error(`Unable to parse cv string to value: ${input} ${type}`);
}

export function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2) {
    throw new Error(
      `hexToBytes: received invalid unpadded hex, got: ${hex.length}`,
    );
  }
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    array[i] = Number.parseInt(hex.slice(j, j + 2), 16);
  }
  return array;
}

const byteToHexCache: string[] = new Array(0xff);

for (let n = 0; n <= 0xff; ++n) {
  byteToHexCache[n] = n.toString(16).padStart(2, "0");
}

export function bytesToHex(uint8a: Uint8Array) {
  const hexOctets = new Array(uint8a.length);
  for (let i = 0; i < uint8a.length; ++i) {
    hexOctets[i] = byteToHexCache[uint8a[i]];
  }
  return hexOctets.join("");
}

export function findTupleKey(jsKey: string, type: ClarityAbiTypeTuple) {
  const found = type.tuple.find((t) => {
    const camelEq = t.name === jsKey;
    const kebabEq = t.name === toKebabCase(jsKey);
    return camelEq || kebabEq;
  });
  if (!found) throw new Error(`Invalid tuple key: ${jsKey}`);
  return found.name;
}

export function findJsTupleKey(key: string, input: Record<string, any>) {
  const found = Object.keys(input).find((k) => {
    const camelEq = key === k;
    const kebabEq = key === toKebabCase(k);
    return camelEq || kebabEq;
  });
  if (!found) {
    throw new Error(`Error encoding JS tuple: ${key} not found in input.`);
  }
  return found;
}
