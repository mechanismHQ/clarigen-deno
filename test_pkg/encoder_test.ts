import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { types } from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { cvToValue, hexToBytes } from "../src/encoder.ts";
import { ClarityAbiType } from "../src/types.ts";

function expectValue(input: string, type: ClarityAbiType, expected: any) {
  const decoded = cvToValue(input, type);
  assertEquals(decoded, expected);
}

Deno.test("decoding cv", () => {
  expectValue(types.ascii("asdf"), { "string-ascii": { length: 1 } }, "asdf");
  expectValue(types.utf8("asdf"), { "string-utf8": { length: 1 } }, "asdf");

  expectValue(types.bool(true), "bool", true);
  expectValue(types.bool(false), "bool", false);

  expectValue(types.uint(100), "uint128", 100n);
  expectValue(types.int(123), "int128", 123n);

  expectValue(types.principal("asdf"), "principal", "asdf");
  expectValue(types.principal("asdf"), "trait_reference", "asdf");

  const buff = hexToBytes("aaff");
  expectValue(types.buff(buff), { "buffer": { length: 1 } }, buff);

  expectValue(types.none(), { optional: "bool" }, null);
  expectValue(types.some(types.bool(true)), { optional: "bool" }, true);

  expectValue(types.none(), "none", null);

  const list = "[u128, u233]";

  expectValue(list, { "list": { type: "uint128", length: 2 } }, [128n, 233n]);
});
