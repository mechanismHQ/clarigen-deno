export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = 'uint128';
export type ClarityAbiTypeInt128 = 'int128';
export type ClarityAbiTypeBool = 'bool';
export type ClarityAbiTypePrincipal = 'principal';
export type ClarityAbiTypeTraitReference = 'trait_reference';
export type ClarityAbiTypeNone = 'none';

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<T extends TypedAbiArg<unknown, string>[], R> =
  & ClarityAbiFunction
  & {
    _t?: T;
    _r?: R;
  };

export interface ClarityAbiVariable {
  name: string;
  access: 'variable' | 'constant';
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: ClarityAbiTypeNonFungibleToken[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  tester: {
    'functions': {
      complexArgs: {
        'name': 'complex-args',
        'access': 'public',
        'args': [
          { 'name': 'numba', 'type': 'int128' },
          { 'name': 'opt-numba', 'type': { 'optional': 'int128' } },
          { 'name': 'opt-unumba', 'type': { 'optional': 'uint128' } },
          { 'name': 'buffa', 'type': { 'buffer': { 'length': 10 } } },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'none' } },
        },
      } as TypedAbiFunction<
        [
          numba: TypedAbiArg<number | bigint, 'numba'>,
          optNumba: TypedAbiArg<number | bigint | null, 'optNumba'>,
          optUnumba: TypedAbiArg<number | bigint | null, 'optUnumba'>,
          buffa: TypedAbiArg<Uint8Array, 'buffa'>,
        ],
        Response<boolean, null>
      >,
      num: {
        'name': 'num',
        'access': 'public',
        'args': [{ 'name': 'n', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<
        [n: TypedAbiArg<number | bigint, 'n'>],
        Response<bigint, null>
      >,
      retError: {
        'name': 'ret-error',
        'access': 'public',
        'args': [{ 'name': 'with-err', 'type': 'bool' }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [withErr: TypedAbiArg<boolean, 'withErr'>],
        Response<boolean, bigint>
      >,
      getTup: {
        'name': 'get-tup',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': {
            'tuple': [{ 'name': 'a', 'type': 'uint128' }, {
              'name': 'bool-prop',
              'type': 'bool',
            }, {
              'name': 'tuple-prop',
              'type': {
                'tuple': [{
                  'name': 'sub-prop',
                  'type': { 'string-ascii': { 'length': 4 } },
                }],
              },
            }],
          },
        },
      } as TypedAbiFunction<[], {
        'a': bigint;
        'boolProp': boolean;
        'tupleProp': {
          'subProp': string;
        };
      }>,
      mergeTuple: {
        'name': 'merge-tuple',
        'access': 'read_only',
        'args': [{
          'name': 'i',
          'type': { 'tuple': [{ 'name': 'min-height', 'type': 'uint128' }] },
        }],
        'outputs': {
          'type': {
            'tuple': [{ 'name': 'max-height', 'type': 'uint128' }, {
              'name': 'min-height',
              'type': 'uint128',
            }],
          },
        },
      } as TypedAbiFunction<[
        i: TypedAbiArg<{
          'minHeight': number | bigint;
        }, 'i'>,
      ], {
        'maxHeight': bigint;
        'minHeight': bigint;
      }>,
      square: {
        'name': 'square',
        'access': 'read_only',
        'args': [{ 'name': 'n', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[n: TypedAbiArg<number | bigint, 'n'>], bigint>,
    },
    'maps': {
      demoMap: {
        'name': 'demo-map',
        'key': { 'tuple': [{ 'name': 'a', 'type': 'uint128' }] },
        'value': 'bool',
      } as TypedAbiMap<{
        'a': number | bigint;
      }, boolean>,
    },
    'variables': {
      ERR_UNAUTHORIZED: {
        name: 'ERR_UNAUTHORIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
    },
    constants: {},
    'fungible_tokens': [],
    'non_fungible_tokens': [],
    contractName: 'tester',
  },
  ftTrait: {
    'functions': {},
    'maps': {},
    'variables': {},
    constants: {},
    'fungible_tokens': [],
    'non_fungible_tokens': [],
    contractName: 'ft-trait',
  },
  counter: {
    'functions': {
      decrement: {
        'name': 'decrement',
        'access': 'public',
        'args': [{ 'name': 'step', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<
        [step: TypedAbiArg<number | bigint, 'step'>],
        Response<bigint, null>
      >,
      increment: {
        'name': 'increment',
        'access': 'public',
        'args': [{ 'name': 'step', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<
        [step: TypedAbiArg<number | bigint, 'step'>],
        Response<bigint, null>
      >,
      readCounter: {
        'name': 'read-counter',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<[], Response<bigint, null>>,
    },
    'maps': {},
    'variables': {
      counter: {
        name: 'counter',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    constants: {},
    'fungible_tokens': [],
    'non_fungible_tokens': [],
    contractName: 'counter',
  },
} as const;

export const accounts = {
  'deployer': {
    'address': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'balance': 100000000000000,
  },
  'wallet_1': {
    'address': 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    'balance': 100000000000000,
  },
  'wallet_2': {
    'address': 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    'balance': 100000000000000,
  },
  'wallet_3': {
    'address': 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
    'balance': 100000000000000,
  },
  'wallet_4': {
    'address': 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
    'balance': 100000000000000,
  },
  'wallet_5': {
    'address': 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
    'balance': 100000000000000,
  },
  'wallet_6': {
    'address': 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
    'balance': 100000000000000,
  },
  'wallet_7': {
    'address': 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
    'balance': 100000000000000,
  },
  'wallet_8': {
    'address': 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
    'balance': 100000000000000,
  },
  'wallet_9': {
    'address': 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
    'balance': 100000000000000,
  },
} as const;

export const simnet = {
  accounts,
  contracts,
} as const;
