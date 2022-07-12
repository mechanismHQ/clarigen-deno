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

// deno-lint-ignore no-explicit-any
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
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
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

export function ok<T, Err = never>(value: T): ResponseOk<T, Err> {
  return {
    isOk: true,
    value,
  };
}

export function err<Ok = never, T = unknown>(value: T): ResponseErr<Ok, T> {
  return {
    isOk: false,
    value,
  };
}

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  tester: {
    'functions': {
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
          'minHeight': bigint;
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
    'maps': {},
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
} as const;
