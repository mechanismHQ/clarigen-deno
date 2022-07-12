import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { contractsFactory } from "../src/factory.ts";
import {
  contracts as _contracts,
  simnet,
} from "../artifacts/clarigen/index.ts";
import { types } from "https://deno.land/x/clarinet@v0.31.0/index.ts";

const testerDef = _contracts.tester;

Deno.test("contracts factory", () => {
  const { tester } = contractsFactory(simnet);
  const deployer = simnet.accounts.deployer.address;
  assertEquals(tester.identifier, `${deployer}.tester`);

  assertEquals(tester.fungible_tokens, testerDef.fungible_tokens);

  const call = tester.square(2n);
  assertEquals(call.args, [types.uint(2n)]);
  assertEquals(call.contract, testerDef.contractName);
  assertEquals(call.fn.name, "square");
});
