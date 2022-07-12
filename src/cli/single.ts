import { getArgName, jsTypeFromAbiType } from './declaration.ts';
import type { Session, SessionContract } from './index.ts';
import { toCamelCase } from './utils.ts';
import { types } from './type-stub.ts';

export function generateContractMeta(contract: SessionContract) {
  const abi = contract.contract_interface;
  const functionLines: string[] = [];
  const { functions, maps, variables, ...rest } = abi;
  functions.forEach((func) => {
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map((arg) => {
      return `${getArgName(arg.name)}: ${jsTypeFromAbiType(arg.type, true)}`;
    });
    const argsTuple = `[${args.join(', ')}]`;
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
  const contractName = contract.contract_id.split('.')[1];

  const variableLines = variables.map((v) => {
    let varLine = `${toCamelCase(v.name)}: `;
    const type = jsTypeFromAbiType(v.type);
    const varJSON = serialize(v);
    varLine += `${varJSON} as TypedAbiVariable<${type}>`;
    return varLine;
  });

  return `{
  ${serializeLines('functions', functionLines)}
  ${serializeLines('maps', mapLines)}
  ${serializeLines('variables', variableLines)}
  constants: {},
  ${otherAbi.slice(1, -1)},
  contractName: '${contractName}',
  }`;
}

export function generateSingleFile(
  session: Session,
) {
  const contractDefs = session.contracts.map((contract) => {
    const meta = generateContractMeta(contract);
    const id = contract.contract_id.split('.')[1];
    const keyName = toCamelCase(id);
    return `${keyName}: ${meta}`;
  });

  const file = `
${types}

export const contracts = {
  ${contractDefs.join(',\n')}
} as const;

`;
  return file;
}

// deno-lint-ignore no-explicit-any
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
    ${lines.join(',\n    ')}
  },`;
}
