import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { simnet } from '../artifacts/clarigen/index.ts';
import { describe, it } from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { Chain, txOk } from '../src/index.ts';
import { accounts, counter, test } from './helper.ts';

const alice = accounts.addr('wallet_1');

test({
  name: 'Ensure counter works',
  fn(chain) {
    const receipt = chain.mineOne(
      txOk(counter.increment(2), alice),
    );
    assertEquals(receipt.value, 3n);

    const currentCount = chain.rov(counter.getCounter());
    assertEquals(currentCount, 3n);
  },
});

test({
  name: 'Definition includes constants',
  fn() {
    assertEquals(counter.constants.counter, 1n);
  },
});

// BDD-style testing with `Chain`

describe('BDD-style testing', () => {
  const { chain } = Chain.fromSimnet(simnet);

  it('can increment', () => {
    assertEquals(chain.sessionId, 1);
    const receipt = chain.mineOne(
      txOk(counter.increment(2), alice),
    );
    const count = chain.rov(counter.getCounter());
    assertEquals(count, 3n);
    assertEquals(receipt.value, 3n);
  });

  it('can decrement', () => {
    assertEquals(chain.sessionId, 1);
    const count = chain.rov(counter.getCounter());
    assertEquals(count, 3n);
    const receipt = chain.mineOne(
      txOk(counter.decrement(1n), alice),
    );
    assertEquals(receipt.value, 2n);
    assertEquals(chain.blockHeight, 4);
  });
});
