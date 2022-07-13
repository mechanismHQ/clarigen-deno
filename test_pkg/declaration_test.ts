import {
  abiArgType,
  abiFunctionType,
  jsTypeFromAbiType,
} from '../src/cli/declaration.ts';
import { ClarityAbiTypeTuple } from '../src/types.ts';
import { assertEquals } from 'https://deno.land/std@0.144.0/testing/asserts.ts';
import { tupleMock } from './mocks.ts';
import { encodeVariables } from '../src/cli/files/base.ts';

Deno.test('encoding tuple types', () => {
  const tupleType: ClarityAbiTypeTuple = {
    tuple: [
      { name: 'num', type: 'uint128' },
      { name: 'booly-prop', type: 'bool' },
      {
        name: 'tuple-prop',
        type: {
          tuple: [{ name: 'sub-thing', type: 'bool' }],
        },
      },
    ],
  };

  const type = jsTypeFromAbiType(tupleType);
  const boolLine = type.split('\n')[2];
  assertEquals(boolLine.trim(), '"boolyProp": boolean;');
  const subLine = type.split('\n')[4];
  assertEquals(subLine.trim(), '"subThing": boolean;');

  const numLine = type.split('\n')[1];
  assertEquals(numLine.trim(), '"num": bigint;');

  const [_, numLineArg] = jsTypeFromAbiType(tupleType, true).split('\n').map((
    l,
  ) => l.trim());
  assertEquals(numLineArg, '"num": number | bigint;');
});

Deno.test({
  name: 'generating TypedAbiFunction',
  fn() {
    const argType = abiArgType(tupleMock.abiFn.args[0]);
    assertEquals(
      argType,
      `tupleArg: TypedAbiArg<{
  "num": number | bigint;
  "boolyProp": boolean;
  "tupleProp": {
  "subThing": boolean;
};
}, "tupleArg">`,
    );
    const abiType = abiFunctionType(tupleMock.abiFn);
    assertEquals(abiType, `TypedAbiFunction<[${argType}], boolean>`);
  },
});

Deno.test({
  name: 'Encoding variable lines',
  fn() {
    const lines = encodeVariables([{
      type: 'bool',
      name: 'ERR_SOMETHING',
      access: 'constant',
    }, {
      type: 'bool',
      name: 'ERR-SOMETHING',
      access: 'constant',
    }, {
      type: 'bool',
      name: 'err-something',
      access: 'constant',
    }]);

    assertEquals(lines[0].startsWith('ERR_SOMETHING'), true);
    assertEquals(lines[1].startsWith('ERR_SOMETHING'), true);
    assertEquals(lines[2].startsWith('errSomething'), true);
  },
});
