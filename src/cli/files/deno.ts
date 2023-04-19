import { Session } from '../../session.ts';
import { getContractName } from '../../utils.ts';
import { sortContracts } from '../cli-utils.ts';
import { generateAccountsCode } from './accounts.ts';

export function generateIdentifiers(session: Session) {
  const identifiers = Object.fromEntries(
    sortContracts(session.contracts).map((c) => {
      const contractName = getContractName(c.contract_id);
      return [contractName, c.contract_id];
    }),
  );
  return identifiers;
}

export function generateIdentifiersCode(session: Session) {
  const identifiers = generateIdentifiers(session);

  return `export const identifiers = ${JSON.stringify(identifiers)} as const`;
}

export function generateDenoFile(session: Session, baseFile: string) {
  return `${baseFile}

${generateAccountsCode(session)}

${generateIdentifiersCode(session)}

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;
`;
}
