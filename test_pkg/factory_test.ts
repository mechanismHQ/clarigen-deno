import { assertEquals } from '../src/deps.ts';
import { contractFactory, contractsFactory } from '../src/factory.ts';
import {
  contracts as _contracts,
  simnet,
} from '../artifacts/clarigen/index.ts';
import { types } from '../src/deps.ts';

const testerDef = _contracts.tester;

Deno.test('contracts factory', () => {
  const { tester } = contractsFactory(simnet);
  const deployer = simnet.accounts.deployer.address;
  assertEquals(tester.identifier, `${deployer}.tester`);

  assertEquals(tester.fungible_tokens, testerDef.fungible_tokens);

  const call = tester.square(2n);
  assertEquals(call.args, [types.uint(2n)]);
  assertEquals(call.contract.split('.')[1], testerDef.contractName);
  assertEquals(call.fn.name, 'square');

  const callRecord = tester.square({ n: 2 });
  assertEquals(callRecord.args, [types.uint(2n)]);

  const callWithSingleArgTuple = tester.mergeTuple({ i: { minHeight: 1n } });
  assertEquals(callWithSingleArgTuple.args, [
    types.tuple({ 'min-height': 'u1' }),
  ]);
});

Deno.test({
  name: 'contractFactory',
  fn() {
    const alice = simnet.accounts.wallet_1.address;
    const id = `${alice}.${_contracts.counter.contractName}`;
    const counter = contractFactory(_contracts.counter, id);
    assertEquals(counter.contractName, id);
    assertEquals(counter.identifier, id);
    const fn = counter.getCounter();
    assertEquals(fn.contract, id);
  },
});
