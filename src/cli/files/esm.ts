import { parse } from 'https://deno.land/std@0.95.0/encoding/yaml.ts';
import { cwdResolve } from '../utils.ts';

export async function parseDeployment(path: string) {
  const contents = await Deno.readTextFile(path);
  const parsed = parse(contents);
  return parsed as Plan;
}

const DEPLOYMENT_NETWORKS = ['devnet', 'simnet', 'testnet', 'mainnet'] as const;
type DeploymentNetwork = typeof DEPLOYMENT_NETWORKS[number];

type Plan = Record<string, unknown> | undefined;
type DeploymentsMap = {
  [key in DeploymentNetwork]: Record<string, unknown> | undefined;
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

export async function generateESMFile(baseFile: string) {
  const deployments = await getDeployments();

  return `${baseFile}
export const deployments = ${JSON.stringify(deployments)} as const;
  `;
}
