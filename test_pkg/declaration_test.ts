import { jsTypeFromAbiType } from "../src/cli/declaration.ts";
import { ClarityAbiTypeTuple } from "../src/types.ts";
import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";

Deno.test("encoding tuple types", () => {
  const tupleType: ClarityAbiTypeTuple = {
    tuple: [
      { name: "num", type: "uint128" },
      { name: "booly-prop", type: "bool" },
      {
        name: "tuple-prop",
        type: {
          tuple: [{ name: "sub-thing", type: "bool" }],
        },
      },
    ],
  };

  const type = jsTypeFromAbiType(tupleType);
  const boolLine = type.split("\n")[2];
  assertEquals(boolLine.trim(), '"boolyProp": boolean;');
  const subLine = type.split("\n")[4];
  assertEquals(subLine.trim(), '"subThing": boolean;');
});
