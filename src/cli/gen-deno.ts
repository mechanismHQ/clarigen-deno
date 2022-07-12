import { Session } from "./index.ts";

export function generateDenoFile(session: Session) {
  if (session.accounts.length === 0) {
    console.warn(
      "[Clarigen] `accounts` is empty - did you forgot to use `--allow-wallets`?",
    );
  }
  const accounts = Object.fromEntries(session.accounts.map((account) => {
    const { name, ...rest } = account;
    return [name, rest];
  }));

  return `import { contracts } from '../index.ts';
export { contracts } from '../index.ts';

export const accounts = ${JSON.stringify(accounts)} as const;

export const simnet = {
  accounts,
  contracts
} as const;
`;
}
