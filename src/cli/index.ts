import { ClarityAbi } from "../types.ts";

export interface SessionContract {
  contract_id: string;
  contract_interface: ClarityAbi;
  source: string;
  dependencies: string[];
}

export interface Session {
  session_id: number;
  accounts: any[];
  contracts: SessionContract[];
}

export function getSession(): Session {
  let result = JSON.parse(
    (Deno as any).core.opSync("api/v1/new_session", {
      name: "running script",
      loadDeployment: true,
      // deploymentPath: "./deployments/default.simnet-plan.yaml",
    }),
  );
  return result;
}
