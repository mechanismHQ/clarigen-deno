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

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
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
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export const contracts = {
  tester: {
    functions: {
      num: {
        access: 'public',
        args: [{ name: 'n', type: 'uint128' }],
        name: 'num',
        outputs: { type: { response: { error: 'none', ok: 'uint128' } } },
      } as TypedAbiFunction<[n: number | bigint], Response<bigint, null>>,
      retError: {
        access: 'public',
        args: [{ name: 'with-err', type: 'bool' }],
        name: 'ret-error',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<[withErr: boolean], Response<boolean, bigint>>,
      getTup: {
        access: 'read_only',
        args: [],
        name: 'get-tup',
        outputs: {
          type: {
            tuple: [
              { name: 'a', type: 'uint128' },
              { name: 'b', type: 'bool' },
              {
                name: 'c',
                type: {
                  tuple: [
                    { name: 'd', type: { 'string-ascii': { length: 4 } } },
                  ],
                },
              },
            ],
          },
        },
      } as TypedAbiFunction<
        [],
        {
          a: bigint;
          b: boolean;
          c: {
            d: string;
          };
        }
      >,
      square: {
        access: 'read_only',
        args: [{ name: 'n', type: 'uint128' }],
        name: 'square',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[n: number | bigint], bigint>,
    },
    variables: {},
    maps: {},
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'tester',
    contractFile: 'contracts/tester.clar',
  },
} as const;

export const accounts = {
  deployer: {
    mnemonic:
      'twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw',
    balance: 100000000000000n,
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
  wallet_1: {
    mnemonic:
      'sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild',
    balance: 100000000000000n,
    address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  },
  wallet_2: {
    mnemonic:
      'hold excess usual excess ring elephant install account glad dry fragile donkey gaze humble truck breeze nation gasp vacuum limb head keep delay hospital',
    balance: 100000000000000n,
    address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  },
  wallet_3: {
    mnemonic:
      'cycle puppy glare enroll cost improve round trend wrist mushroom scorpion tower claim oppose clever elephant dinosaur eight problem before frozen dune wagon high',
    balance: 100000000000000n,
    address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  },
  wallet_4: {
    mnemonic:
      'board list obtain sugar hour worth raven scout denial thunder horse logic fury scorpion fold genuine phrase wealth news aim below celery when cabin',
    balance: 100000000000000n,
    address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
  },
  wallet_5: {
    mnemonic:
      'hurry aunt blame peanut heavy update captain human rice crime juice adult scale device promote vast project quiz unit note reform update climb purchase',
    balance: 100000000000000n,
    address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
  },
  wallet_6: {
    mnemonic:
      'area desk dutch sign gold cricket dawn toward giggle vibrant indoor bench warfare wagon number tiny universe sand talk dilemma pottery bone trap buddy',
    balance: 100000000000000n,
    address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
  },
  wallet_7: {
    mnemonic:
      'prevent gallery kind limb income control noise together echo rival record wedding sense uncover school version force bleak nuclear include danger skirt enact arrow',
    balance: 100000000000000n,
    address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
  },
  wallet_8: {
    mnemonic:
      'female adjust gallery certain visit token during great side clown fitness like hurt clip knife warm bench start reunion globe detail dream depend fortune',
    balance: 100000000000000n,
    address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
  },
  wallet_9: {
    mnemonic:
      'shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform',
    balance: 100000000000000n,
    address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
  },
} as const;
