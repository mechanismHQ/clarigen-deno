// A simple test for fixing the `deployContract` tx type in Clarinet

// import { Clarinet, Tx } from '../src/clarinet-deps.ts';
import { Clarinet, Tx } from 'https://deno.land/x/clarinet@v1.0.3/index.ts';

Clarinet.test({
  name: 'deploy a contract',
  fn(chain) {
    const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const contractName = 'contract';
    const src = '(define-read-only (test-fn) u123)';
    chain.mineBlock([
      Tx.deployContract(contractName, src, deployer),
    ]);

    const receipt = chain.callReadOnlyFn(contractName, 'test-fn', [], deployer);

    receipt.result.expectUint(123);
  },
});
