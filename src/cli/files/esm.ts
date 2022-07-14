import { parseYaml } from '../../deps.ts';
import { Config } from '../config.ts';
import {
  DeploymentPlan,
  getDeploymentContract,
  getIdentifier,
} from '../deployments.ts';
// import { log } from '../logger.ts';
import { Session } from '../session.ts';
import { cwdResolve, getContractName, toCamelCase } from '../utils.ts';
import { generateAccountsCode } from './accounts.ts';

export async function parseDeployment(path: string) {
  const contents = await Deno.readTextFile(path);
  const parsed = parseYaml(contents);
  return parsed as Plan;
}

export const DEPLOYMENT_NETWORKS = [
  'devnet',
  'simnet',
  'testnet',
  'mainnet',
] as const;
export type DeploymentNetwork = typeof DEPLOYMENT_NETWORKS[number];

type Plan = DeploymentPlan | undefined;
type DeploymentsMap = {
  [key in DeploymentNetwork]: Plan;
};

export async function getDeployments(): Promise<DeploymentsMap> {
  const entries = await Promise.all(DEPLOYMENT_NETWORKS.map(async (network) => {
    const file = `default.${network}-plan.yaml`;
    const path = cwdResolve('deployments', file);
    let plan: Plan;
    try {
      plan = await parseDeployment(path);
    } catch (_) {}
    return [network, plan] as [DeploymentNetwork, Plan];
  }));
  return Object.fromEntries(entries) as DeploymentsMap;
}

export async function generateESMFile({
  baseFile,
  session,
  config,
}: { baseFile: string; session: Session; config: Config }) {
  const deployments = await getDeployments();
  const contractDeployments = collectContractDeployments(
    session,
    deployments,
    config,
  );

  const accounts = config.esm?.include_accounts
    ? `\n${generateAccountsCode(session)}\n`
    : '';

  return `${baseFile}
export const deployments = ${JSON.stringify(contractDeployments)} as const;
${accounts}
export const project = {
  contracts,
  deployments,
  ${config.esm?.include_accounts ? 'accounts,' : ''}
} as const;
  `;
}

export type ContractDeployments = {
  [key in DeploymentNetwork]: string | null;
};

export type FullContractDeployments = {
  [contractName: string]: ContractDeployments;
};

function insertNetworkId(
  deployments: FullContractDeployments,
  identifier: string,
  network: DeploymentNetwork,
) {
  const name = getContractName(identifier);
  if (!deployments[name]) {
    // log.debug(`Not setting deployment ID for ${name} on ${network}`);
    return;
  }
  if (deployments[name][network] === null) {
    deployments[name][network] = identifier;
  }
}

export function collectContractDeployments(
  session: Session,
  deployments: DeploymentsMap,
  config: Config,
): FullContractDeployments {
  const full = Object.fromEntries(
    session.contracts.map((contract) => {
      const contractName = getContractName(contract.contract_id);
      const contractDeployments = Object.fromEntries(
        DEPLOYMENT_NETWORKS.map((network) => {
          const deployment = deployments[network];
          if (typeof deployment === 'undefined') {
            return [network, null];
          }
          try {
            const tx = getDeploymentContract(contractName, deployment);
            const id = getIdentifier(tx);
            return [network, id];
          } catch (_) {
            return [network, null];
          }
        }),
      ) as ContractDeployments;
      return [contractName, contractDeployments];
    }),
  ) as FullContractDeployments;

  const deployer = session.accounts.find((a) => a.name === 'deployer');

  // handle defaults when there is no deployment file
  config.clarinet.project.requirements?.forEach(({ contract_id }) => {
    insertNetworkId(full, contract_id, 'mainnet');
    const contractName = contract_id.split('.')[1];
    if (deployer) {
      const devnetId = `${deployer.address}.${contractName}`;
      insertNetworkId(full, devnetId, 'devnet');
    }
  });

  session.contracts.forEach((contract) => {
    insertNetworkId(full, contract.contract_id, 'devnet');
    insertNetworkId(full, contract.contract_id, 'simnet');
  });

  return full;
}
