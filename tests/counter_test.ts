import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { accounts, simnet } from '../artifacts/clarigen/index.ts';
import { Chain, contractsFactory, factory, txOk } from '../src/index.ts';
import {
  beforeAll,
  describe,
  it,
  run,
} from 'https://deno.land/x/dspec@v0.2.0/mod.ts';

const { counter } = contractsFactory(simnet);
const { test } = factory(simnet);

test({
  name: 'Ensure counter works',
  fn(chain, accounts) {
    const alice = accounts.get('wallet_1').address;
    const receipt = chain.mineOne(
      txOk(counter.increment(2), alice),
    );
    assertEquals(receipt.value, 3n);
  },
});

// More custom test runner with `Chain`

describe('BDD-style testing', () => {
  let chain: Chain;
  beforeAll(() => {
    chain = Chain.fromSimnet(simnet).chain;
  });
  // const { chain, accounts, contracts: { counter } } = Chain.fromSimnet(simnet);
  const alice = accounts.wallet_1.address;

  it('can increment', () => {
    assertEquals(chain.sessionId, 2);
    const receipt = chain.mineOne(
      txOk(counter.increment(2), alice),
    );
    const count = chain.rovOk(counter.readCounter());
    assertEquals(count, 3n);
    assertEquals(receipt.value, 3n);
  });

  it('can decrement', () => {
    assertEquals(chain.sessionId, 2);
    const count = chain.rovOk(counter.readCounter());
    assertEquals(count, 3n);
    const receipt = chain.mineOne(
      txOk(counter.decrement(1n), alice),
    );
    assertEquals(receipt.value, 2n);
    assertEquals(chain.blockHeight, 3);
  });
});

run();
