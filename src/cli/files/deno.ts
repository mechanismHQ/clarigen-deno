import { Session } from '../session.ts';

export function generateDenoFile(session: Session, baseFile: string) {
  const accounts = Object.fromEntries(session.accounts.map((account) => {
    const { name, ...rest } = account;
    return [name, rest];
  }));

  return `${baseFile}

export const accounts = ${JSON.stringify(accounts)} as const;

export const simnet = {
  accounts,
  contracts
} as const;
`;
}
