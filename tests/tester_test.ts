import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { contracts } from "../artifacts/clarigen/single.ts";
import { factory, ok, tx, txErr, txOk } from "../src/index.ts";

const { contracts: { tester }, test } = factory({
  contracts,
});

test({
  name: "Running type-safe clarinet tests",
  fn(chain, accounts) {
    const alice = accounts.get("wallet_1")!.address;

    const sq = chain.ro(tester.square(2), alice);
    assertEquals(sq.value, 4n);

    const tupReceipt = chain.ro(tester.getTup(), alice);
    assertEquals(tupReceipt.value.a, 1n);

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
    assertEquals(tup.a, 1n);
    assertEquals(tup.c.d, "asdf");

    const n = chain.rovOk(tester.num(2));
    assertEquals(n, 2n);

    try {
      chain.rovErr(tester.num(2));
      throw new Error("Expected tx to throw");
      // deno-lint-ignore no-empty
    } catch (_error) {}

    const err = chain.rovErr(tester.retError(true));
    assertEquals(err, 1n);

    // without block wrapper
    const [numReceipt] = chain.mine(txOk(tester.num(2), alice));
    assertEquals(numReceipt.value, 2n);

    // just one
    assertEquals(chain.mineOne(txOk(tester.num(2), alice)).value, 2n);
  },
});

// Clarinet.test({
//   name: "Ensure that <...>",
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     const alice = accounts.get("wallet_1")!.address;

//     const sq = ro(chain, tester.square(2), alice);
//     assertEquals(sq.value, 4n);

//     const tupReceipt = ro(chain, tester.getTup(), alice);
//     assertEquals(tupReceipt.value.a, 1n);

//     let { receipts } = mineBlock(
//       chain,
//       txOk(tester.retError(false), alice),
//       txOk(tester.num(2), alice),
//       txErr(tester.retError(true), alice),
//       tx(tester.num(2n), alice),
//     );
//     assertEquals(receipts[0].value, true);
//     assertEquals(receipts[1].value, 2n);
//     assertEquals(receipts[2].value, 1n);
//     assertEquals(receipts[3].value, ok(2n));

//     const tup = rov(chain, tester.getTup(), alice);
//     assertEquals(tup.a, 1n);
//     assertEquals(tup.c.d, "asdf");

//     const n = rovOk(chain, tester.num(2), alice);
//     assertEquals(n, 2n);

//     try {
//       rovErr(chain, tester.num(2), alice);
//       throw new Error("Expected tx to throw");
//     } catch (error) {
//     }

//     const err = rovErr(chain, tester.retError(true), alice);
//     assertEquals(err, 1n);
//     // sqRes.

//     // block = chain.mineBlock([
//     //   /*
//     //          * Add transactions with:
//     //          * Tx.contractCall(...)
//     //         */
//     // ]);
//     // assertEquals(block.receipts.length, 0);
//     // assertEquals(block.height, 2);

//     // block = chain.mineBlock([
//     //   /*
//     //          * Add transactions with:
//     //          * Tx.contractCall(...)
//     //         */
//     // ]);
//     // assertEquals(block.receipts.length, 0);
//     // assertEquals(block.height, 3);
//   },
// });
