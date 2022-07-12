export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { "string-ascii": { length: number } };
export type ClarityAbiTypeStringUtf8 = { "string-utf8": { length: number } };
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

export type ClarityAbiTypeUInt128 = "uint128";
export type ClarityAbiTypeInt128 = "int128";
export type ClarityAbiTypeBool = "bool";
export type ClarityAbiTypePrincipal = "principal";
export type ClarityAbiTypeTraitReference = "trait_reference";
export type ClarityAbiTypeNone = "none";

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

export interface ClarityAbiFunction {
  name: string;
  access: "private" | "public" | "read_only";
  args: {
    name: string;
    type: ClarityAbiType;
  }[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiFunction<T extends any[], R> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: "variable" | "constant";
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
    [key: string]: TypedAbiFunction<unknown[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
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
    "functions": {
      num: {
        "name": "num",
        "access": "public",
        "args": [{ "name": "n", "type": "uint128" }],
        "outputs": {
          "type": { "response": { "ok": "uint128", "error": "none" } },
        },
      } as TypedAbiFunction<[n: number | bigint], Response<bigint, null>>,
      retError: {
        "name": "ret-error",
        "access": "public",
        "args": [{ "name": "with-err", "type": "bool" }],
        "outputs": {
          "type": { "response": { "ok": "bool", "error": "uint128" } },
        },
      } as TypedAbiFunction<[withErr: boolean], Response<boolean, bigint>>,
      getTup: {
        "name": "get-tup",
        "access": "read_only",
        "args": [],
        "outputs": {
          "type": {
            "tuple": [{ "name": "a", "type": "uint128" }, {
              "name": "b",
              "type": "bool",
            }, {
              "name": "c",
              "type": {
                "tuple": [{
                  "name": "d",
                  "type": { "string-ascii": { "length": 4 } },
                }],
              },
            }],
          },
        },
      } as TypedAbiFunction<[], {
        "a": bigint;
        "b": boolean;
        "c": {
          "d": string;
        };
      }>,
      square: {
        "name": "square",
        "access": "read_only",
        "args": [{ "name": "n", "type": "uint128" }],
        "outputs": { "type": "uint128" },
      } as TypedAbiFunction<[n: number | bigint], bigint>,
    },
    "maps": {},
    "variables": {},
    constants: {},
    "fungible_tokens": [],
    "non_fungible_tokens": [],
    contractName: "tester",
  },
} as const;

export const accounts = {
  "deployer": {
    "address": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "balance": 100000000000000,
  },
  "wallet_1": {
    "address": "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
    "balance": 100000000000000,
  },
  "wallet_2": {
    "address": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    "balance": 100000000000000,
  },
  "wallet_3": {
    "address": "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC",
    "balance": 100000000000000,
  },
  "wallet_4": {
    "address": "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
    "balance": 100000000000000,
  },
  "wallet_5": {
    "address": "ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB",
    "balance": 100000000000000,
  },
  "wallet_6": {
    "address": "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
    "balance": 100000000000000,
  },
  "wallet_7": {
    "address": "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
    "balance": 100000000000000,
  },
  "wallet_8": {
    "address": "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
    "balance": 100000000000000,
  },
  "wallet_9": {
    "address": "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6",
    "balance": 100000000000000,
  },
} as const;

export const simnet = {
  contracts,
  accounts,
} as const;
