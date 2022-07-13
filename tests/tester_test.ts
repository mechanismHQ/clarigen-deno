import { assertEquals } from '../src/deps.ts';
import { types } from '../src/deps.ts';
import { accounts, simnet } from '../artifacts/clarigen/index.ts';
import { factory, ok, tx, txErr, txOk } from '../src/index.ts';

// addr by compiled accounts
const _alice = accounts.wallet_1.address;

const { contracts: { tester }, test } = factory(simnet);

test({
  name: 'Running type-safe clarinet tests',
  fn(chain, a) {
    // addr by Map interface - backwards compat and better types
    const alice = a.get('wallet_1').address;

    const sq = chain.ro(tester.square(2), alice);
    assertEquals(sq.value, 4n);

    const tupReceipt = chain.ro(tester.getTup(), alice);
    assertEquals(tupReceipt.value.a, 1n);
    assertEquals(tupReceipt.value, {
      a: 1n,
      boolProp: true,
      tupleProp: {
        subProp: 'asdf',
      },
    });

    const { receipts } = chain.mineBlock(
      txOk(tester.retError(false), alice),
      txOk(tester.num(2), alice),
      txErr(tester.retError(true), alice),
      tx(tester.num(2n), alice),
    );
    assertEquals(receipts[0].value, true);
    assertEquals(receipts[1].value, 2n);
    assertEquals(receipts[2].value, 1n);
    assertEquals(receipts[3].value, ok(2n));

    const tup = chain.rov(tester.getTup());
    assertEquals(tup.tupleProp.subProp, 'asdf');

    const n = chain.rovOk(tester.num(2));
    assertEquals(n, 2n);

    try {
      chain.rovErr(tester.num(2));
      throw new Error('Expected tx to throw');
      // deno-lint-ignore no-empty
    } catch (_error) {}

    const err = chain.rovErr(tester.retError(true));
    assertEquals(err, 1n);

    // without block wrapper
    const [numReceipt] = chain.mine(txOk(tester.num(2), alice));
    assertEquals(numReceipt.value, 2n);

    // just one
    assertEquals(chain.mineOne(txOk(tester.num(2), alice)).value, 2n);

    // tuple arguments
    const merged = chain.rov(tester.mergeTuple({ minHeight: 1n }));
    assertEquals(merged, { minHeight: 1n, maxHeight: 100000n });

    const mergedResWithObjectArg = chain.rov(
      tester.mergeTuple({ i: { minHeight: 1n } }),
    );
    assertEquals(mergedResWithObjectArg, { minHeight: 1n, maxHeight: 100000n });

    const tupleArgWithInt = tester.mergeTuple({ minHeight: 1 });
    assertEquals(tupleArgWithInt.args[0], types.tuple({ 'min-height': 'u1' }));
  },
});
