import { getArgName, jsTypeFromAbiType } from "./declaration.ts";
import type { Session, SessionContract } from "./index.ts";
import { toCamelCase } from "./utils.ts";
import * as path from "https://deno.land/std@0.144.0/path/mod.ts";
import { types } from "./type-stub.ts";

export function generateContractMeta(contract: SessionContract) {
  const abi = contract.contract_interface;
  const functionLines: string[] = [];
  const { functions, variables, maps, ...rest } = abi;
  functions.forEach((func) => {
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map((arg) => {
      return `${getArgName(arg.name)}: ${jsTypeFromAbiType(arg.type, true)}`;
    });
    const argsTuple = `[${args.join(", ")}]`;
    const funcDef = JSON.stringify(func);
    functionLine += funcDef;
    const retType = jsTypeFromAbiType(func.outputs.type);
    functionLine += ` as TypedAbiFunction<${argsTuple}, ${retType}>`;
    functionLines.push(functionLine);
  });

  const mapLines = maps.map((map) => {
    let mapLine = `${toCamelCase(map.name)}: `;
    const keyType = jsTypeFromAbiType(map.key);
    const valType = jsTypeFromAbiType(map.value);
    mapLine += JSON.stringify(map);
    mapLine += ` as TypedAbiMap<${keyType}, ${valType}>`;
    return mapLine;
  });

  const otherAbi = JSON.stringify(rest);
  const contractName = contract.contract_id.split(".")[1];

  // const contractFile = path.relative(Deno.cwd(), contract.);

  return `{
  ${serializeLines("functions", functionLines)}
  ${serializeLines("maps", mapLines)}
  ${otherAbi.slice(1, -1)},
  contractName: '${contractName}',
  }`;
}

export async function generateSingleFile(
  config: Session,
) {
  const contractDefs = config.contracts.map((contract) => {
    const meta = generateContractMeta(contract);
    const id = contract.contract_id.split(".")[1];
    const keyName = toCamelCase(id);
    return `${keyName}: ${meta}`;
  });

  const file = `
${types}

export const contracts = {
  ${contractDefs.join(",\n")}
} as const;

`;
  return file;
}

export function serialize(obj: any) {
  return Deno.inspect(obj, {
    showHidden: false,
    iterableLimit: 100000,
    compact: false,
    trailingComma: true,
    depth: 100,
    colors: false,
    // strAbbreviateSize: 100000,
  });
}

function serializeLines(key: string, lines: string[]) {
  return `"${key}": {
    ${lines.join(",\n    ")}
  },`;
}
