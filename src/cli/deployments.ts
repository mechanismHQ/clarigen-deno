import { parse } from 'https://deno.land/std@0.95.0/encoding/yaml.ts';
import * as path from 'https://deno.land/std@0.144.0/path/mod.ts';

export async function parseDeployment(path: string) {
  const contents = await Deno.readTextFile(path);
  const parsed = parse(contents);
  return parsed;
}

export async function generateDeployment(network: string, outputDir: string) {
  const file = `default.${network}-plan.yaml`;
  const deploymentPath = path.resolve(
    Deno.cwd(),
    'deployments',
    file,
  );
  try {
    const plan = await parseDeployment(deploymentPath);
    const varName = `${network}Deployment`;
    const contents = `export const ${varName} = ${
      JSON.stringify(
        plan,
      )
    } as const;
    `;
    const outputFile = path.resolve(
      outputDir,
      'deployments',
      `${network}.ts`,
    );
    await Deno.writeTextFile(outputFile, contents);
    // await writeFile(outputFile, contents);
  } catch (_error) {
    //
  }
}

export async function generateDeployments(outputDir: string) {
  const networks = ['devnet', 'simnet', 'testnet', 'mainnet'];
  const folder = path.resolve(outputDir, 'deployments');
  await Deno.mkdir(folder, { recursive: true });
  const generates = networks.map((n) => generateDeployment(n, outputDir));
  await Promise.all(generates);
}
