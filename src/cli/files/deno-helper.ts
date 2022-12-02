import { VERSION } from '../version.ts';
import { dirname, relative } from '../../deps.ts';
import { sortContracts, toCamelCase } from '../cli-utils.ts';
import { getContractName } from '../../utils.ts';

export const IMPORT_URL = `https://deno.land/x/clarigen@${VERSION}/mod.ts`;

interface ContractObject {
  contract_id: string;
}

export function makeHelper(
  contracts: ContractObject[],
  typesPath: string,
  helperPath: string,
) {
  const typeImportPath = relative(dirname(helperPath), typesPath);
  const contractNames = sortContracts(contracts).map((c) => {
    const keyName = toCamelCase(getContractName(c.contract_id));
    return keyName;
  });
  const file = `
export {
  Chain,
  err,
  factory,
  hexToBytes,
  ok,
  tx,
  txErr,
  txOk,
  // } from "../../deno-clarigen/src/index.ts";
} from "${IMPORT_URL}";
import { factory } from "${IMPORT_URL}";
import { simnet } from "./${typeImportPath}";

export const { test, contracts } = factory(simnet);

export const {
  ${contractNames.join(',\n  ')}
} = contracts;
`;

  return file;
}
