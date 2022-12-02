import { ClarinetAccount } from './clarinet-deps.ts';
import { ClarityAbi } from './types.ts';

export interface SessionContract {
  contract_id: string;
  contract_interface: ClarityAbi;
  source: string;
  dependencies: string[];
}

export type SessionAccount = Omit<ClarinetAccount, 'mnemonic' | 'derivation'>;

export interface Session {
  session_id: number;
  accounts: SessionAccount[];
  contracts: SessionContract[];
}

export interface SessionWithVariables extends Session {
  variables: string[];
}

export function getSession(): Session {
  const result = JSON.parse(
    // deno-lint-ignore no-explicit-any
    (Deno as any).core.opSync('api/v1/new_session', {
      name: 'Clarigen: session',
      loadDeployment: true,
      // deploymentPath: "./deployments/default.simnet-plan.yaml",
    }),
  );
  return result;
}
