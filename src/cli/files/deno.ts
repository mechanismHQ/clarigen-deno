import { Session } from '../session.ts';
import { generateAccountsCode } from './accounts.ts';

export function generateDenoFile(session: Session, baseFile: string) {
  return `${baseFile}

${generateAccountsCode(session)}

export const simnet = {
  accounts,
  contracts
} as const;
`;
}
