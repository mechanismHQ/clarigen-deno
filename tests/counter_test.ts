import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { simnet } from '../artifacts/clarigen/index.ts';
import { factory, txOk } from '../src/index.ts';

const { contracts: { counter }, test } = factory(simnet);

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

// From clarinet examples:
//
// Clarinet.test({
//   name:
//     'Ensure that counter can be incremented multiples per block, accross multiple blocks',
//   fn(
//     chain: ClarinetChain,
//     accounts: Map<string, ClarinetAccount>,
//     contracts: Map<string, Contract>,
//   ) {
//     let wallet_1 = accounts.get('wallet_1')!;
//     let wallet_2 = accounts.get('wallet_2')!;

//     let block = chain.mineBlock([
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(1)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(4)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(10)],
//         wallet_1.address,
//       ),
//     ]);
//     assertEquals(block.height, 2);
//     block.receipts[0].result
//       .expectOk()
//       .expectUint(2);
//     block.receipts[1].result
//       .expectOk()
//       .expectUint(6);
//     block.receipts[2].result
//       .expectOk()
//       .expectUint(16);

//     block = chain.mineBlock([
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(1)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(4)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(10)],
//         wallet_1.address,
//       ),
//       Tx.transferSTX(1, wallet_2.address, wallet_1.address),
//     ]);

//     assertEquals(block.height, 3);
//     block.receipts[0].result
//       .expectOk()
//       .expectUint(17);
//     block.receipts[1].result
//       .expectOk()
//       .expectUint(21);
//     block.receipts[2].result
//       .expectOk()
//       .expectUint(31);

//     let result = chain.getAssetsMaps();
//     assertEquals(result.assets['STX'][wallet_1.address], 99999999999999);

//     let call = chain.callReadOnlyFn(
//       'counter',
//       'read-counter',
//       [],
//       wallet_1.address,
//     );
//     call.result
//       .expectOk()
//       .expectUint(31);

//     '0x0001020304'.expectBuff(new Uint8Array([0, 1, 2, 3, 4]));
//     'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.plaid-token'.expectPrincipal(
//       'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.plaid-token',
//     );
//   },
// });

// Clarinet.test({
//   name: 'Test with pre-setup',
//   preDeployment: (
//     chain: ClarinetChain,
//   ) => {
//     chain.mineEmptyBlock(100);
//   },
//   fn(
//     chain: ClarinetChain,
//     accounts: Map<string, ClarinetAccount>,
//   ) {
//     let wallet_1 = accounts.get('wallet_1')!;
//     let wallet_2 = accounts.get('wallet_2')!;

//     let block = chain.mineBlock([
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(1)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(4)],
//         wallet_1.address,
//       ),
//       Tx.contractCall(
//         'counter',
//         'increment',
//         [types.uint(10)],
//         wallet_1.address,
//       ),
//     ]);
//     assertEquals(block.height, 102);
//     block.receipts[0].result
//       .expectOk()
//       .expectUint(2);
//     block.receipts[1].result
//       .expectOk()
//       .expectUint(6);
//     block.receipts[2].result
//       .expectOk()
//       .expectUint(16);
//   },
// });
