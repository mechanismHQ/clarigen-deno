import { assertEquals } from '../src/deps.ts';
import {
  collectContractDeployments,
  DEPLOYMENT_NETWORKS,
} from '../src/cli/files/esm.ts';

Deno.test({
  name: 'collecting deployment paths',
  fn() {
    const external = 'external.ext-contract';
    const session = {
      contracts: [{
        contract_id: 'deployer.contract',
      }, {
        contract_id: external,
      }],
      accounts: [{ name: 'deployer', address: 'deployer' }],
    };

    const config = {
      clarinet: {
        project: { requirements: [{ contract_id: external }] },
      },
    };

    const deploymentFiles = Object.fromEntries(
      DEPLOYMENT_NETWORKS.map((n) => [n, null]),
    );

    const deployments = collectContractDeployments(
      session as any,
      deploymentFiles as any,
      config as any,
    );

    assertEquals(deployments.extContract.devnet, 'deployer.ext-contract');
  },
});
