import { ClarityAbiFunction, ClarityAbiTypeTuple } from '../src/types.ts';
import { types } from 'https://deno.land/x/clarinet@v0.28.0/index.ts';

export const tupleType: ClarityAbiTypeTuple = {
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

export const tupleKebab = {
  num: types.uint(2n),
  'booly-prop': 'true',
  'tuple-prop': types.tuple({ 'sub-thing': 'false' }),
};

export const tupleMock = {
  type: tupleType,
  jsValue: {
    num: 2n,
    boolyProp: true,
    tupleProp: {
      subThing: false,
    },
  },
  kebabValue: tupleKebab,
  encoded: types.tuple(tupleKebab),
  abiFn: {
    name: 'my-tuple',
    args: [{
      type: tupleType,
      name: 'tuple-arg',
    }],
    outputs: {
      type: 'bool',
    },
  } as ClarityAbiFunction,
} as const;
