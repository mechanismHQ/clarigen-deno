import {
  Account,
  Chain,
  Clarinet,
  Tx,
  types,
} from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { accounts, contracts } from "../demo-types/single.ts";
import {
  contractsFactory,
  ErrType,
  ExpectType,
  FunctionsToContractCalls,
  getValues,
  mineBlock,
  ok,
  OkType,
  Receipts,
  ReceiptValues,
  // ReceiptValues,
  Response,
  ro,
  tx,
  TxCall,
  TxCallErr,
  TxCallOk,
  txErr,
  txOk,
  TxValueType,
} from "../src/index.ts";

const { tester } = contractsFactory(contracts);

Clarinet.test({
  name: "Ensure that <...>",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get("wallet_1")!.address;

    const sq = ro(chain, tester.square(2), alice);
    assertEquals(sq.value, 4n);

    const tup = ro(chain, tester.getTup(), alice);
    assertEquals(tup.value.a, 1n);

    let { receipts } = mineBlock(
      chain,
      txOk(tester.retError(false), alice),
      txOk(tester.num(2), alice),
      txErr(tester.retError(true), alice),
      tx(tester.num(2n), alice),
    );
    assertEquals(receipts[0].value, true);
    assertEquals(receipts[1].value, 2n);
    assertEquals(receipts[2].value, 1n);
    assertEquals(receipts[3].value, ok(2n));
    // sqRes.

    // block = chain.mineBlock([
    //   /*
    //          * Add transactions with:
    //          * Tx.contractCall(...)
    //         */
    // ]);
    // assertEquals(block.receipts.length, 0);
    // assertEquals(block.height, 2);

    // block = chain.mineBlock([
    //   /*
    //          * Add transactions with:
    //          * Tx.contractCall(...)
    //         */
    // ]);
    // assertEquals(block.receipts.length, 0);
    // assertEquals(block.height, 3);
  },
});
