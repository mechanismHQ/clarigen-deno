import { makeHelper } from '../src/cli/files/deno-helper.ts';
import { assert } from '../src/dev-deps.ts';

Deno.test({
  name: 'Deno helper file',
  fn() {
    const contracts = [{
      contract_id: 'deployer.counter',
    }, { contract_id: 'deployer.stream' }];

    const baseFile = './artifacts/clarigen.ts';
    const helperPath = './artifacts/helper.ts';

    const file = makeHelper(contracts, baseFile, helperPath);

    assert(file.includes(`import { simnet } from "./clarigen.ts";`));
  },
});
