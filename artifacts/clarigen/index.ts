export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
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

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
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
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
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
      getCounter: {
        'name': 'get-counter',
        'access': 'read_only',
        'args': [],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[], bigint>,
    },
    'maps': {},
    'variables': {
      ERR_TEST: {
        name: 'ERR_TEST',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      buffConst: {
        name: 'buff-const',
        type: {
          buffer: {
            length: 4,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      testBuff: {
        name: 'test-buff',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      counter: {
        name: 'counter',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    constants: {
      ERR_TEST: {
        isOk: false,
        value: 123n,
      },
      buffConst: Uint8Array.from([222, 173, 190, 239]),
      testBuff: 3735928559n,
      counter: 1n,
    },
    'non_fungible_tokens': [],
    'fungible_tokens': [],
    'epoch': 'Epoch21',
    'clarity_version': 'Clarity2',
    contractName: 'counter',
  },
  ftTrait: {
    'functions': {},
    'maps': {},
    'variables': {},
    constants: {},
    'non_fungible_tokens': [],
    'fungible_tokens': [],
    'epoch': 'Epoch20',
    'clarity_version': 'Clarity1',
    contractName: 'ft-trait',
  },
  pox2: {
    'functions': {
      addPoxAddrToIthRewardCycle: {
        'name': 'add-pox-addr-to-ith-reward-cycle',
        'access': 'private',
        'args': [{ 'name': 'cycle-index', 'type': 'uint128' }, {
          'name': 'params',
          'type': {
            'tuple': [
              { 'name': 'amount-ustx', 'type': 'uint128' },
              { 'name': 'first-reward-cycle', 'type': 'uint128' },
              { 'name': 'i', 'type': 'uint128' },
              { 'name': 'num-cycles', 'type': 'uint128' },
              {
                'name': 'pox-addr',
                'type': {
                  'tuple': [{
                    'name': 'hashbytes',
                    'type': { 'buffer': { 'length': 32 } },
                  }, {
                    'name': 'version',
                    'type': { 'buffer': { 'length': 1 } },
                  }],
                },
              },
              {
                'name': 'reward-set-indexes',
                'type': { 'list': { 'type': 'uint128', 'length': 12 } },
              },
              { 'name': 'stacker', 'type': { 'optional': 'principal' } },
            ],
          },
        }],
        'outputs': {
          'type': {
            'tuple': [
              { 'name': 'amount-ustx', 'type': 'uint128' },
              { 'name': 'first-reward-cycle', 'type': 'uint128' },
              { 'name': 'i', 'type': 'uint128' },
              { 'name': 'num-cycles', 'type': 'uint128' },
              {
                'name': 'pox-addr',
                'type': {
                  'tuple': [{
                    'name': 'hashbytes',
                    'type': { 'buffer': { 'length': 32 } },
                  }, {
                    'name': 'version',
                    'type': { 'buffer': { 'length': 1 } },
                  }],
                },
              },
              {
                'name': 'reward-set-indexes',
                'type': { 'list': { 'type': 'uint128', 'length': 12 } },
              },
              { 'name': 'stacker', 'type': { 'optional': 'principal' } },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<{
            'amountUstx': number | bigint;
            'firstRewardCycle': number | bigint;
            'i': number | bigint;
            'numCycles': number | bigint;
            'poxAddr': {
              'hashbytes': Uint8Array;
              'version': Uint8Array;
            };
            'rewardSetIndexes': number | bigint[];
            'stacker': string | null;
          }, 'params'>,
        ],
        {
          'amountUstx': bigint;
          'firstRewardCycle': bigint;
          'i': bigint;
          'numCycles': bigint;
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          };
          'rewardSetIndexes': bigint[];
          'stacker': string | null;
        }
      >,
      addPoxAddrToRewardCycles: {
        'name': 'add-pox-addr-to-reward-cycles',
        'access': 'private',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'first-reward-cycle', 'type': 'uint128' },
          { 'name': 'num-cycles', 'type': 'uint128' },
          { 'name': 'amount-ustx', 'type': 'uint128' },
          { 'name': 'stacker', 'type': 'principal' },
        ],
        'outputs': {
          'type': {
            'response': {
              'ok': { 'list': { 'type': 'uint128', 'length': 12 } },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
        numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        stacker: TypedAbiArg<string, 'stacker'>,
      ], Response<bigint[], bigint>>,
      addPoxPartialStacked: {
        'name': 'add-pox-partial-stacked',
        'access': 'private',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'first-reward-cycle', 'type': 'uint128' },
          { 'name': 'num-cycles', 'type': 'uint128' },
          { 'name': 'amount-ustx', 'type': 'uint128' },
        ],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
        numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
        amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
      ], boolean>,
      addPoxPartialStackedToIthCycle: {
        'name': 'add-pox-partial-stacked-to-ith-cycle',
        'access': 'private',
        'args': [{ 'name': 'cycle-index', 'type': 'uint128' }, {
          'name': 'params',
          'type': {
            'tuple': [{ 'name': 'amount-ustx', 'type': 'uint128' }, {
              'name': 'num-cycles',
              'type': 'uint128',
            }, {
              'name': 'pox-addr',
              'type': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            }, { 'name': 'reward-cycle', 'type': 'uint128' }],
          },
        }],
        'outputs': {
          'type': {
            'tuple': [{ 'name': 'amount-ustx', 'type': 'uint128' }, {
              'name': 'num-cycles',
              'type': 'uint128',
            }, {
              'name': 'pox-addr',
              'type': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            }, { 'name': 'reward-cycle', 'type': 'uint128' }],
          },
        },
      } as TypedAbiFunction<
        [
          cycleIndex: TypedAbiArg<number | bigint, 'cycleIndex'>,
          params: TypedAbiArg<{
            'amountUstx': number | bigint;
            'numCycles': number | bigint;
            'poxAddr': {
              'hashbytes': Uint8Array;
              'version': Uint8Array;
            };
            'rewardCycle': number | bigint;
          }, 'params'>,
        ],
        {
          'amountUstx': bigint;
          'numCycles': bigint;
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          };
          'rewardCycle': bigint;
        }
      >,
      appendRewardCyclePoxAddr: {
        'name': 'append-reward-cycle-pox-addr',
        'access': 'private',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'reward-cycle', 'type': 'uint128' },
          { 'name': 'amount-ustx', 'type': 'uint128' },
          { 'name': 'stacker', 'type': { 'optional': 'principal' } },
        ],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        stacker: TypedAbiArg<string | null, 'stacker'>,
      ], bigint>,
      foldUnlockRewardCycle: {
        'name': 'fold-unlock-reward-cycle',
        'access': 'private',
        'args': [{ 'name': 'set-index', 'type': 'uint128' }, {
          'name': 'data-res',
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'cycle', 'type': 'uint128' }, {
                  'name': 'first-unlocked-cycle',
                  'type': 'uint128',
                }, { 'name': 'stacker', 'type': 'principal' }],
              },
              'error': 'int128',
            },
          },
        }],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'cycle', 'type': 'uint128' }, {
                  'name': 'first-unlocked-cycle',
                  'type': 'uint128',
                }, { 'name': 'stacker', 'type': 'principal' }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          setIndex: TypedAbiArg<number | bigint, 'setIndex'>,
          dataRes: TypedAbiArg<
            Response<{
              'cycle': number | bigint;
              'firstUnlockedCycle': number | bigint;
              'stacker': string;
            }, number | bigint>,
            'dataRes'
          >,
        ],
        Response<{
          'cycle': bigint;
          'firstUnlockedCycle': bigint;
          'stacker': string;
        }, bigint>
      >,
      handleUnlock: {
        'name': 'handle-unlock',
        'access': 'private',
        'args': [{ 'name': 'user', 'type': 'principal' }, {
          'name': 'amount-locked',
          'type': 'uint128',
        }, { 'name': 'cycle-to-unlock', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<
        [
          user: TypedAbiArg<string, 'user'>,
          amountLocked: TypedAbiArg<number | bigint, 'amountLocked'>,
          cycleToUnlock: TypedAbiArg<number | bigint, 'cycleToUnlock'>,
        ],
        Response<boolean, bigint>
      >,
      increaseRewardCycleEntry: {
        'name': 'increase-reward-cycle-entry',
        'access': 'private',
        'args': [{ 'name': 'reward-cycle-index', 'type': 'uint128' }, {
          'name': 'updates',
          'type': {
            'optional': {
              'tuple': [
                { 'name': 'add-amount', 'type': 'uint128' },
                { 'name': 'first-cycle', 'type': 'uint128' },
                { 'name': 'reward-cycle', 'type': 'uint128' },
                { 'name': 'stacker', 'type': 'principal' },
              ],
            },
          },
        }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [
                { 'name': 'add-amount', 'type': 'uint128' },
                { 'name': 'first-cycle', 'type': 'uint128' },
                { 'name': 'reward-cycle', 'type': 'uint128' },
                { 'name': 'stacker', 'type': 'principal' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
          updates: TypedAbiArg<
            {
              'addAmount': number | bigint;
              'firstCycle': number | bigint;
              'rewardCycle': number | bigint;
              'stacker': string;
            } | null,
            'updates'
          >,
        ],
        {
          'addAmount': bigint;
          'firstCycle': bigint;
          'rewardCycle': bigint;
          'stacker': string;
        } | null
      >,
      innerStackAggregationCommit: {
        'name': 'inner-stack-aggregation-commit',
        'access': 'private',
        'args': [{
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }, { 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
      ], Response<bigint, bigint>>,
      allowContractCaller: {
        'name': 'allow-contract-caller',
        'access': 'public',
        'args': [{ 'name': 'caller', 'type': 'principal' }, {
          'name': 'until-burn-ht',
          'type': { 'optional': 'uint128' },
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<
        [
          caller: TypedAbiArg<string, 'caller'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
        ],
        Response<boolean, bigint>
      >,
      delegateStackExtend: {
        'name': 'delegate-stack-extend',
        'access': 'public',
        'args': [{ 'name': 'stacker', 'type': 'principal' }, {
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }, { 'name': 'extend-count', 'type': 'uint128' }],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'stacker', 'type': 'principal' }, {
                  'name': 'unlock-burn-height',
                  'type': 'uint128',
                }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
        ],
        Response<{
          'stacker': string;
          'unlockBurnHeight': bigint;
        }, bigint>
      >,
      delegateStackIncrease: {
        'name': 'delegate-stack-increase',
        'access': 'public',
        'args': [{ 'name': 'stacker', 'type': 'principal' }, {
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }, { 'name': 'increase-by', 'type': 'uint128' }],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'stacker', 'type': 'principal' }, {
                  'name': 'total-locked',
                  'type': 'uint128',
                }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
          increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>,
        ],
        Response<{
          'stacker': string;
          'totalLocked': bigint;
        }, bigint>
      >,
      delegateStackStx: {
        'name': 'delegate-stack-stx',
        'access': 'public',
        'args': [
          { 'name': 'stacker', 'type': 'principal' },
          { 'name': 'amount-ustx', 'type': 'uint128' },
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'start-burn-ht', 'type': 'uint128' },
          { 'name': 'lock-period', 'type': 'uint128' },
        ],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'lock-amount', 'type': 'uint128' }, {
                  'name': 'stacker',
                  'type': 'principal',
                }, { 'name': 'unlock-burn-height', 'type': 'uint128' }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
        ],
        Response<{
          'lockAmount': bigint;
          'stacker': string;
          'unlockBurnHeight': bigint;
        }, bigint>
      >,
      delegateStx: {
        'name': 'delegate-stx',
        'access': 'public',
        'args': [
          { 'name': 'amount-ustx', 'type': 'uint128' },
          { 'name': 'delegate-to', 'type': 'principal' },
          { 'name': 'until-burn-ht', 'type': { 'optional': 'uint128' } },
          {
            'name': 'pox-addr',
            'type': {
              'optional': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            },
          },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          delegateTo: TypedAbiArg<string, 'delegateTo'>,
          untilBurnHt: TypedAbiArg<number | bigint | null, 'untilBurnHt'>,
          poxAddr: TypedAbiArg<
            {
              'hashbytes': Uint8Array;
              'version': Uint8Array;
            } | null,
            'poxAddr'
          >,
        ],
        Response<boolean, bigint>
      >,
      disallowContractCaller: {
        'name': 'disallow-contract-caller',
        'access': 'public',
        'args': [{ 'name': 'caller', 'type': 'principal' }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<
        [caller: TypedAbiArg<string, 'caller'>],
        Response<boolean, bigint>
      >,
      rejectPox: {
        'name': 'reject-pox',
        'access': 'public',
        'args': [],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      revokeDelegateStx: {
        'name': 'revoke-delegate-stx',
        'access': 'public',
        'args': [],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setBurnchainParameters: {
        'name': 'set-burnchain-parameters',
        'access': 'public',
        'args': [
          { 'name': 'first-burn-height', 'type': 'uint128' },
          { 'name': 'prepare-cycle-length', 'type': 'uint128' },
          { 'name': 'reward-cycle-length', 'type': 'uint128' },
          { 'name': 'rejection-fraction', 'type': 'uint128' },
          { 'name': 'begin-2-1-reward-cycle', 'type': 'uint128' },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<
        [
          firstBurnHeight: TypedAbiArg<number | bigint, 'firstBurnHeight'>,
          prepareCycleLength: TypedAbiArg<
            number | bigint,
            'prepareCycleLength'
          >,
          rewardCycleLength: TypedAbiArg<number | bigint, 'rewardCycleLength'>,
          rejectionFraction: TypedAbiArg<number | bigint, 'rejectionFraction'>,
          begin21RewardCycle: TypedAbiArg<
            number | bigint,
            'begin21RewardCycle'
          >,
        ],
        Response<boolean, bigint>
      >,
      stackAggregationCommit: {
        'name': 'stack-aggregation-commit',
        'access': 'public',
        'args': [{
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }, { 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
      ], Response<boolean, bigint>>,
      stackAggregationCommitIndexed: {
        'name': 'stack-aggregation-commit-indexed',
        'access': 'public',
        'args': [{
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }, { 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
      ], Response<bigint, bigint>>,
      stackAggregationIncrease: {
        'name': 'stack-aggregation-increase',
        'access': 'public',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'reward-cycle', 'type': 'uint128' },
          { 'name': 'reward-cycle-index', 'type': 'uint128' },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        rewardCycleIndex: TypedAbiArg<number | bigint, 'rewardCycleIndex'>,
      ], Response<boolean, bigint>>,
      stackExtend: {
        'name': 'stack-extend',
        'access': 'public',
        'args': [{ 'name': 'extend-count', 'type': 'uint128' }, {
          'name': 'pox-addr',
          'type': {
            'tuple': [{
              'name': 'hashbytes',
              'type': { 'buffer': { 'length': 32 } },
            }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
          },
        }],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'stacker', 'type': 'principal' }, {
                  'name': 'unlock-burn-height',
                  'type': 'uint128',
                }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          extendCount: TypedAbiArg<number | bigint, 'extendCount'>,
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
        ],
        Response<{
          'stacker': string;
          'unlockBurnHeight': bigint;
        }, bigint>
      >,
      stackIncrease: {
        'name': 'stack-increase',
        'access': 'public',
        'args': [{ 'name': 'increase-by', 'type': 'uint128' }],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'stacker', 'type': 'principal' }, {
                  'name': 'total-locked',
                  'type': 'uint128',
                }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [increaseBy: TypedAbiArg<number | bigint, 'increaseBy'>],
        Response<{
          'stacker': string;
          'totalLocked': bigint;
        }, bigint>
      >,
      stackStx: {
        'name': 'stack-stx',
        'access': 'public',
        'args': [
          { 'name': 'amount-ustx', 'type': 'uint128' },
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'start-burn-ht', 'type': 'uint128' },
          { 'name': 'lock-period', 'type': 'uint128' },
        ],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [{ 'name': 'lock-amount', 'type': 'uint128' }, {
                  'name': 'stacker',
                  'type': 'principal',
                }, { 'name': 'unlock-burn-height', 'type': 'uint128' }],
              },
              'error': 'int128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
          startBurnHt: TypedAbiArg<number | bigint, 'startBurnHt'>,
          lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>,
        ],
        Response<{
          'lockAmount': bigint;
          'stacker': string;
          'unlockBurnHeight': bigint;
        }, bigint>
      >,
      burnHeightToRewardCycle: {
        'name': 'burn-height-to-reward-cycle',
        'access': 'read_only',
        'args': [{ 'name': 'height', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [height: TypedAbiArg<number | bigint, 'height'>],
        bigint
      >,
      canStackStx: {
        'name': 'can-stack-stx',
        'access': 'read_only',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'amount-ustx', 'type': 'uint128' },
          { 'name': 'first-reward-cycle', 'type': 'uint128' },
          { 'name': 'num-cycles', 'type': 'uint128' },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
        numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
      ], Response<boolean, bigint>>,
      checkCallerAllowed: {
        'name': 'check-caller-allowed',
        'access': 'read_only',
        'args': [],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<[], boolean>,
      checkPoxAddrHashbytes: {
        'name': 'check-pox-addr-hashbytes',
        'access': 'read_only',
        'args': [{ 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }, {
          'name': 'hashbytes',
          'type': { 'buffer': { 'length': 32 } },
        }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [
          version: TypedAbiArg<Uint8Array, 'version'>,
          hashbytes: TypedAbiArg<Uint8Array, 'hashbytes'>,
        ],
        boolean
      >,
      checkPoxAddrVersion: {
        'name': 'check-pox-addr-version',
        'access': 'read_only',
        'args': [{ 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [version: TypedAbiArg<Uint8Array, 'version'>],
        boolean
      >,
      checkPoxLockPeriod: {
        'name': 'check-pox-lock-period',
        'access': 'read_only',
        'args': [{ 'name': 'lock-period', 'type': 'uint128' }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [lockPeriod: TypedAbiArg<number | bigint, 'lockPeriod'>],
        boolean
      >,
      currentPoxRewardCycle: {
        'name': 'current-pox-reward-cycle',
        'access': 'read_only',
        'args': [],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getAllowanceContractCallers: {
        'name': 'get-allowance-contract-callers',
        'access': 'read_only',
        'args': [{ 'name': 'sender', 'type': 'principal' }, {
          'name': 'calling-contract',
          'type': 'principal',
        }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [{
                'name': 'until-burn-ht',
                'type': { 'optional': 'uint128' },
              }],
            },
          },
        },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, 'sender'>,
          callingContract: TypedAbiArg<string, 'callingContract'>,
        ],
        {
          'untilBurnHt': bigint | null;
        } | null
      >,
      getCheckDelegation: {
        'name': 'get-check-delegation',
        'access': 'read_only',
        'args': [{ 'name': 'stacker', 'type': 'principal' }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [{ 'name': 'amount-ustx', 'type': 'uint128' }, {
                'name': 'delegated-to',
                'type': 'principal',
              }, {
                'name': 'pox-addr',
                'type': {
                  'optional': {
                    'tuple': [{
                      'name': 'hashbytes',
                      'type': { 'buffer': { 'length': 32 } },
                    }, {
                      'name': 'version',
                      'type': { 'buffer': { 'length': 1 } },
                    }],
                  },
                },
              }, {
                'name': 'until-burn-ht',
                'type': { 'optional': 'uint128' },
              }],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          'amountUstx': bigint;
          'delegatedTo': string;
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          } | null;
          'untilBurnHt': bigint | null;
        } | null
      >,
      getDelegationInfo: {
        'name': 'get-delegation-info',
        'access': 'read_only',
        'args': [{ 'name': 'stacker', 'type': 'principal' }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [{ 'name': 'amount-ustx', 'type': 'uint128' }, {
                'name': 'delegated-to',
                'type': 'principal',
              }, {
                'name': 'pox-addr',
                'type': {
                  'optional': {
                    'tuple': [{
                      'name': 'hashbytes',
                      'type': { 'buffer': { 'length': 32 } },
                    }, {
                      'name': 'version',
                      'type': { 'buffer': { 'length': 1 } },
                    }],
                  },
                },
              }, {
                'name': 'until-burn-ht',
                'type': { 'optional': 'uint128' },
              }],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          'amountUstx': bigint;
          'delegatedTo': string;
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          } | null;
          'untilBurnHt': bigint | null;
        } | null
      >,
      getNumRewardSetPoxAddresses: {
        'name': 'get-num-reward-set-pox-addresses',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        bigint
      >,
      getPartialStackedByCycle: {
        'name': 'get-partial-stacked-by-cycle',
        'access': 'read_only',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'reward-cycle', 'type': 'uint128' },
          { 'name': 'sender', 'type': 'principal' },
        ],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [{ 'name': 'stacked-amount', 'type': 'uint128' }],
            },
          },
        },
      } as TypedAbiFunction<
        [
          poxAddr: TypedAbiArg<{
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          }, 'poxAddr'>,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          sender: TypedAbiArg<string, 'sender'>,
        ],
        {
          'stackedAmount': bigint;
        } | null
      >,
      getPoxInfo: {
        'name': 'get-pox-info',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': {
            'response': {
              'ok': {
                'tuple': [
                  { 'name': 'current-rejection-votes', 'type': 'uint128' },
                  { 'name': 'first-burnchain-block-height', 'type': 'uint128' },
                  { 'name': 'min-amount-ustx', 'type': 'uint128' },
                  { 'name': 'prepare-cycle-length', 'type': 'uint128' },
                  { 'name': 'rejection-fraction', 'type': 'uint128' },
                  { 'name': 'reward-cycle-id', 'type': 'uint128' },
                  { 'name': 'reward-cycle-length', 'type': 'uint128' },
                  { 'name': 'total-liquid-supply-ustx', 'type': 'uint128' },
                ],
              },
              'error': 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [],
        Response<{
          'currentRejectionVotes': bigint;
          'firstBurnchainBlockHeight': bigint;
          'minAmountUstx': bigint;
          'prepareCycleLength': bigint;
          'rejectionFraction': bigint;
          'rewardCycleId': bigint;
          'rewardCycleLength': bigint;
          'totalLiquidSupplyUstx': bigint;
        }, null>
      >,
      getPoxRejection: {
        'name': 'get-pox-rejection',
        'access': 'read_only',
        'args': [{ 'name': 'stacker', 'type': 'principal' }, {
          'name': 'reward-cycle',
          'type': 'uint128',
        }],
        'outputs': {
          'type': {
            'optional': { 'tuple': [{ 'name': 'amount', 'type': 'uint128' }] },
          },
        },
      } as TypedAbiFunction<
        [
          stacker: TypedAbiArg<string, 'stacker'>,
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
        ],
        {
          'amount': bigint;
        } | null
      >,
      getRewardSetPoxAddress: {
        'name': 'get-reward-set-pox-address',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }, {
          'name': 'index',
          'type': 'uint128',
        }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [
                {
                  'name': 'pox-addr',
                  'type': {
                    'tuple': [{
                      'name': 'hashbytes',
                      'type': { 'buffer': { 'length': 32 } },
                    }, {
                      'name': 'version',
                      'type': { 'buffer': { 'length': 1 } },
                    }],
                  },
                },
                { 'name': 'stacker', 'type': { 'optional': 'principal' } },
                { 'name': 'total-ustx', 'type': 'uint128' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [
          rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>,
          index: TypedAbiArg<number | bigint, 'index'>,
        ],
        {
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          };
          'stacker': string | null;
          'totalUstx': bigint;
        } | null
      >,
      getRewardSetSize: {
        'name': 'get-reward-set-size',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        bigint
      >,
      getStackerInfo: {
        'name': 'get-stacker-info',
        'access': 'read_only',
        'args': [{ 'name': 'stacker', 'type': 'principal' }],
        'outputs': {
          'type': {
            'optional': {
              'tuple': [{ 'name': 'first-reward-cycle', 'type': 'uint128' }, {
                'name': 'lock-period',
                'type': 'uint128',
              }, {
                'name': 'pox-addr',
                'type': {
                  'tuple': [{
                    'name': 'hashbytes',
                    'type': { 'buffer': { 'length': 32 } },
                  }, {
                    'name': 'version',
                    'type': { 'buffer': { 'length': 1 } },
                  }],
                },
              }, {
                'name': 'reward-set-indexes',
                'type': { 'list': { 'type': 'uint128', 'length': 12 } },
              }],
            },
          },
        },
      } as TypedAbiFunction<
        [stacker: TypedAbiArg<string, 'stacker'>],
        {
          'firstRewardCycle': bigint;
          'lockPeriod': bigint;
          'poxAddr': {
            'hashbytes': Uint8Array;
            'version': Uint8Array;
          };
          'rewardSetIndexes': bigint[];
        } | null
      >,
      getStackingMinimum: {
        'name': 'get-stacking-minimum',
        'access': 'read_only',
        'args': [],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalPoxRejection: {
        'name': 'get-total-pox-rejection',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        bigint
      >,
      getTotalUstxStacked: {
        'name': 'get-total-ustx-stacked',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        bigint
      >,
      isPoxActive: {
        'name': 'is-pox-active',
        'access': 'read_only',
        'args': [{ 'name': 'reward-cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [rewardCycle: TypedAbiArg<number | bigint, 'rewardCycle'>],
        boolean
      >,
      minimalCanStackStx: {
        'name': 'minimal-can-stack-stx',
        'access': 'read_only',
        'args': [
          {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          },
          { 'name': 'amount-ustx', 'type': 'uint128' },
          { 'name': 'first-reward-cycle', 'type': 'uint128' },
          { 'name': 'num-cycles', 'type': 'uint128' },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'int128' } },
        },
      } as TypedAbiFunction<[
        poxAddr: TypedAbiArg<{
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        }, 'poxAddr'>,
        amountUstx: TypedAbiArg<number | bigint, 'amountUstx'>,
        firstRewardCycle: TypedAbiArg<number | bigint, 'firstRewardCycle'>,
        numCycles: TypedAbiArg<number | bigint, 'numCycles'>,
      ], Response<boolean, bigint>>,
      nextCycleRejectionVotes: {
        'name': 'next-cycle-rejection-votes',
        'access': 'read_only',
        'args': [],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      rewardCycleToBurnHeight: {
        'name': 'reward-cycle-to-burn-height',
        'access': 'read_only',
        'args': [{ 'name': 'cycle', 'type': 'uint128' }],
        'outputs': { 'type': 'uint128' },
      } as TypedAbiFunction<
        [cycle: TypedAbiArg<number | bigint, 'cycle'>],
        bigint
      >,
    },
    'maps': {
      allowanceContractCallers: {
        'name': 'allowance-contract-callers',
        'key': {
          'tuple': [{ 'name': 'contract-caller', 'type': 'principal' }, {
            'name': 'sender',
            'type': 'principal',
          }],
        },
        'value': {
          'tuple': [{
            'name': 'until-burn-ht',
            'type': { 'optional': 'uint128' },
          }],
        },
      } as TypedAbiMap<{
        'contractCaller': string;
        'sender': string;
      }, {
        'untilBurnHt': bigint | null;
      }>,
      delegationState: {
        'name': 'delegation-state',
        'key': { 'tuple': [{ 'name': 'stacker', 'type': 'principal' }] },
        'value': {
          'tuple': [{ 'name': 'amount-ustx', 'type': 'uint128' }, {
            'name': 'delegated-to',
            'type': 'principal',
          }, {
            'name': 'pox-addr',
            'type': {
              'optional': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            },
          }, { 'name': 'until-burn-ht', 'type': { 'optional': 'uint128' } }],
        },
      } as TypedAbiMap<{
        'stacker': string;
      }, {
        'amountUstx': bigint;
        'delegatedTo': string;
        'poxAddr': {
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        } | null;
        'untilBurnHt': bigint | null;
      }>,
      loggedPartialStackedByCycle: {
        'name': 'logged-partial-stacked-by-cycle',
        'key': {
          'tuple': [
            {
              'name': 'pox-addr',
              'type': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            },
            { 'name': 'reward-cycle', 'type': 'uint128' },
            { 'name': 'sender', 'type': 'principal' },
          ],
        },
        'value': { 'tuple': [{ 'name': 'stacked-amount', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'poxAddr': {
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        };
        'rewardCycle': number | bigint;
        'sender': string;
      }, {
        'stackedAmount': bigint;
      }>,
      partialStackedByCycle: {
        'name': 'partial-stacked-by-cycle',
        'key': {
          'tuple': [
            {
              'name': 'pox-addr',
              'type': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            },
            { 'name': 'reward-cycle', 'type': 'uint128' },
            { 'name': 'sender', 'type': 'principal' },
          ],
        },
        'value': { 'tuple': [{ 'name': 'stacked-amount', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'poxAddr': {
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        };
        'rewardCycle': number | bigint;
        'sender': string;
      }, {
        'stackedAmount': bigint;
      }>,
      rewardCyclePoxAddressList: {
        'name': 'reward-cycle-pox-address-list',
        'key': {
          'tuple': [{ 'name': 'index', 'type': 'uint128' }, {
            'name': 'reward-cycle',
            'type': 'uint128',
          }],
        },
        'value': {
          'tuple': [
            {
              'name': 'pox-addr',
              'type': {
                'tuple': [{
                  'name': 'hashbytes',
                  'type': { 'buffer': { 'length': 32 } },
                }, {
                  'name': 'version',
                  'type': { 'buffer': { 'length': 1 } },
                }],
              },
            },
            { 'name': 'stacker', 'type': { 'optional': 'principal' } },
            { 'name': 'total-ustx', 'type': 'uint128' },
          ],
        },
      } as TypedAbiMap<{
        'index': number | bigint;
        'rewardCycle': number | bigint;
      }, {
        'poxAddr': {
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        };
        'stacker': string | null;
        'totalUstx': bigint;
      }>,
      rewardCyclePoxAddressListLen: {
        'name': 'reward-cycle-pox-address-list-len',
        'key': { 'tuple': [{ 'name': 'reward-cycle', 'type': 'uint128' }] },
        'value': { 'tuple': [{ 'name': 'len', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'rewardCycle': number | bigint;
      }, {
        'len': bigint;
      }>,
      rewardCycleTotalStacked: {
        'name': 'reward-cycle-total-stacked',
        'key': { 'tuple': [{ 'name': 'reward-cycle', 'type': 'uint128' }] },
        'value': { 'tuple': [{ 'name': 'total-ustx', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'rewardCycle': number | bigint;
      }, {
        'totalUstx': bigint;
      }>,
      stackingRejection: {
        'name': 'stacking-rejection',
        'key': { 'tuple': [{ 'name': 'reward-cycle', 'type': 'uint128' }] },
        'value': { 'tuple': [{ 'name': 'amount', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'rewardCycle': number | bigint;
      }, {
        'amount': bigint;
      }>,
      stackingRejectors: {
        'name': 'stacking-rejectors',
        'key': {
          'tuple': [{ 'name': 'reward-cycle', 'type': 'uint128' }, {
            'name': 'stacker',
            'type': 'principal',
          }],
        },
        'value': { 'tuple': [{ 'name': 'amount', 'type': 'uint128' }] },
      } as TypedAbiMap<{
        'rewardCycle': number | bigint;
        'stacker': string;
      }, {
        'amount': bigint;
      }>,
      stackingState: {
        'name': 'stacking-state',
        'key': { 'tuple': [{ 'name': 'stacker', 'type': 'principal' }] },
        'value': {
          'tuple': [{ 'name': 'first-reward-cycle', 'type': 'uint128' }, {
            'name': 'lock-period',
            'type': 'uint128',
          }, {
            'name': 'pox-addr',
            'type': {
              'tuple': [{
                'name': 'hashbytes',
                'type': { 'buffer': { 'length': 32 } },
              }, { 'name': 'version', 'type': { 'buffer': { 'length': 1 } } }],
            },
          }, {
            'name': 'reward-set-indexes',
            'type': { 'list': { 'type': 'uint128', 'length': 12 } },
          }],
        },
      } as TypedAbiMap<{
        'stacker': string;
      }, {
        'firstRewardCycle': bigint;
        'lockPeriod': bigint;
        'poxAddr': {
          'hashbytes': Uint8Array;
          'version': Uint8Array;
        };
        'rewardSetIndexes': bigint[];
      }>,
    },
    'variables': {
      aDDRESS_VERSION_NATIVE_P2TR: {
        name: 'ADDRESS_VERSION_NATIVE_P2TR',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WPKH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_NATIVE_P2WSH: {
        name: 'ADDRESS_VERSION_NATIVE_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2PKH: {
        name: 'ADDRESS_VERSION_P2PKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2SH: {
        name: 'ADDRESS_VERSION_P2SH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WPKH: {
        name: 'ADDRESS_VERSION_P2WPKH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      aDDRESS_VERSION_P2WSH: {
        name: 'ADDRESS_VERSION_P2WSH',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      ERR_DELEGATION_EXPIRES_DURING_LOCK: {
        name: 'ERR_DELEGATION_EXPIRES_DURING_LOCK',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_NO_REWARD_SLOT: {
        name: 'ERR_DELEGATION_NO_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_POX_ADDR_REQUIRED: {
        name: 'ERR_DELEGATION_POX_ADDR_REQUIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_TOO_MUCH_LOCKED: {
        name: 'ERR_DELEGATION_TOO_MUCH_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_DELEGATION_WRONG_REWARD_SLOT: {
        name: 'ERR_DELEGATION_WRONG_REWARD_SLOT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_INVALID_START_BURN_HEIGHT: {
        name: 'ERR_INVALID_START_BURN_HEIGHT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_ALLOWED: {
        name: 'ERR_NOT_ALLOWED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_NOT_CURRENT_STACKER: {
        name: 'ERR_NOT_CURRENT_STACKER',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_DELEGATED: {
        name: 'ERR_STACKING_ALREADY_DELEGATED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_REJECTED: {
        name: 'ERR_STACKING_ALREADY_REJECTED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_ALREADY_STACKED: {
        name: 'ERR_STACKING_ALREADY_STACKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_CORRUPTED_STATE: {
        name: 'ERR_STACKING_CORRUPTED_STATE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_EXPIRED: {
        name: 'ERR_STACKING_EXPIRED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INSUFFICIENT_FUNDS: {
        name: 'ERR_STACKING_INSUFFICIENT_FUNDS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_AMOUNT: {
        name: 'ERR_STACKING_INVALID_AMOUNT',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_LOCK_PERIOD: {
        name: 'ERR_STACKING_INVALID_LOCK_PERIOD',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_INVALID_POX_ADDRESS: {
        name: 'ERR_STACKING_INVALID_POX_ADDRESS',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_NO_SUCH_PRINCIPAL: {
        name: 'ERR_STACKING_NO_SUCH_PRINCIPAL',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_PERMISSION_DENIED: {
        name: 'ERR_STACKING_PERMISSION_DENIED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_POX_ADDRESS_IN_USE: {
        name: 'ERR_STACKING_POX_ADDRESS_IN_USE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_STX_LOCKED: {
        name: 'ERR_STACKING_STX_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_THRESHOLD_NOT_MET: {
        name: 'ERR_STACKING_THRESHOLD_NOT_MET',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACKING_UNREACHABLE: {
        name: 'ERR_STACKING_UNREACHABLE',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_EXTEND_NOT_LOCKED: {
        name: 'ERR_STACK_EXTEND_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      ERR_STACK_INCREASE_NOT_LOCKED: {
        name: 'ERR_STACK_INCREASE_NOT_LOCKED',
        type: 'int128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_ADDRESS_VERSION: {
        name: 'MAX_ADDRESS_VERSION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_20: {
        name: 'MAX_ADDRESS_VERSION_BUFF_20',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mAX_ADDRESS_VERSION_BUFF_32: {
        name: 'MAX_ADDRESS_VERSION_BUFF_32',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MAX_POX_REWARD_CYCLES: {
        name: 'MAX_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MIN_POX_REWARD_CYCLES: {
        name: 'MIN_POX_REWARD_CYCLES',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      POX_REJECTION_FRACTION: {
        name: 'POX_REJECTION_FRACTION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      PREPARE_CYCLE_LENGTH: {
        name: 'PREPARE_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      REWARD_CYCLE_LENGTH: {
        name: 'REWARD_CYCLE_LENGTH',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      sTACKING_THRESHOLD_100: {
        name: 'STACKING_THRESHOLD_100',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      sTACKING_THRESHOLD_25: {
        name: 'STACKING_THRESHOLD_25',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      configured: {
        name: 'configured',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      first21RewardCycle: {
        name: 'first-2-1-reward-cycle',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      firstBurnchainBlockHeight: {
        name: 'first-burnchain-block-height',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxPrepareCycleLength: {
        name: 'pox-prepare-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxRejectionFraction: {
        name: 'pox-rejection-fraction',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      poxRewardCycleLength: {
        name: 'pox-reward-cycle-length',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    constants: {
      aDDRESS_VERSION_NATIVE_P2TR: Uint8Array.from([6]),
      aDDRESS_VERSION_NATIVE_P2WPKH: Uint8Array.from([4]),
      aDDRESS_VERSION_NATIVE_P2WSH: Uint8Array.from([5]),
      aDDRESS_VERSION_P2PKH: Uint8Array.from([0]),
      aDDRESS_VERSION_P2SH: Uint8Array.from([1]),
      aDDRESS_VERSION_P2WPKH: Uint8Array.from([2]),
      aDDRESS_VERSION_P2WSH: Uint8Array.from([3]),
      ERR_DELEGATION_EXPIRES_DURING_LOCK: 21n,
      ERR_DELEGATION_NO_REWARD_SLOT: 28n,
      ERR_DELEGATION_POX_ADDR_REQUIRED: 23n,
      ERR_DELEGATION_TOO_MUCH_LOCKED: 22n,
      ERR_DELEGATION_WRONG_REWARD_SLOT: 29n,
      ERR_INVALID_START_BURN_HEIGHT: 24n,
      ERR_NOT_ALLOWED: 19n,
      ERR_NOT_CURRENT_STACKER: 25n,
      ERR_STACKING_ALREADY_DELEGATED: 20n,
      ERR_STACKING_ALREADY_REJECTED: 17n,
      ERR_STACKING_ALREADY_STACKED: 3n,
      ERR_STACKING_CORRUPTED_STATE: 254n,
      ERR_STACKING_EXPIRED: 5n,
      ERR_STACKING_INSUFFICIENT_FUNDS: 1n,
      ERR_STACKING_INVALID_AMOUNT: 18n,
      ERR_STACKING_INVALID_LOCK_PERIOD: 2n,
      ERR_STACKING_INVALID_POX_ADDRESS: 13n,
      ERR_STACKING_NO_SUCH_PRINCIPAL: 4n,
      ERR_STACKING_PERMISSION_DENIED: 9n,
      ERR_STACKING_POX_ADDRESS_IN_USE: 12n,
      ERR_STACKING_STX_LOCKED: 6n,
      ERR_STACKING_THRESHOLD_NOT_MET: 11n,
      ERR_STACKING_UNREACHABLE: 255n,
      ERR_STACK_EXTEND_NOT_LOCKED: 26n,
      ERR_STACK_INCREASE_NOT_LOCKED: 27n,
      MAX_ADDRESS_VERSION: 6n,
      mAX_ADDRESS_VERSION_BUFF_20: 4n,
      mAX_ADDRESS_VERSION_BUFF_32: 6n,
      MAX_POX_REWARD_CYCLES: 12n,
      MIN_POX_REWARD_CYCLES: 1n,
      POX_REJECTION_FRACTION: 25n,
      PREPARE_CYCLE_LENGTH: 100n,
      REWARD_CYCLE_LENGTH: 2100n,
      sTACKING_THRESHOLD_100: 5000n,
      sTACKING_THRESHOLD_25: 20000n,
      configured: false,
      first21RewardCycle: 0n,
      firstBurnchainBlockHeight: 0n,
      poxPrepareCycleLength: 100n,
      poxRejectionFraction: 25n,
      poxRewardCycleLength: 2100n,
    },
    'non_fungible_tokens': [],
    'fungible_tokens': [],
    'epoch': 'Epoch21',
    'clarity_version': 'Clarity2',
    contractName: 'pox2',
  },
  restrictedTokenTrait: {
    'functions': {},
    'maps': {},
    'variables': {},
    constants: {},
    'non_fungible_tokens': [],
    'fungible_tokens': [],
    'epoch': 'Epoch20',
    'clarity_version': 'Clarity1',
    contractName: 'restricted-token-trait',
  },
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
      ERR_ZERO: {
        name: 'ERR_ZERO',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
    },
    constants: {
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 400n,
      },
      ERR_ZERO: {
        isOk: false,
        value: 0n,
      },
    },
    'non_fungible_tokens': [
      {
        'name': 'names',
        'type': {
          'tuple': [
            { 'name': 'name', 'type': { 'buffer': { 'length': 48 } } },
            { 'name': 'namespace', 'type': { 'buffer': { 'length': 20 } } },
          ],
        },
      },
    ],
    'fungible_tokens': [],
    'epoch': 'Epoch20',
    'clarity_version': 'Clarity1',
    contractName: 'tester',
  },
  wrappedBitcoin: {
    'functions': {
      addPrincipalToRole: {
        'name': 'add-principal-to-role',
        'access': 'public',
        'args': [{ 'name': 'role-to-add', 'type': 'uint128' }, {
          'name': 'principal-to-add',
          'type': 'principal',
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          roleToAdd: TypedAbiArg<number | bigint, 'roleToAdd'>,
          principalToAdd: TypedAbiArg<string, 'principalToAdd'>,
        ],
        Response<boolean, bigint>
      >,
      burnTokens: {
        'name': 'burn-tokens',
        'access': 'public',
        'args': [{ 'name': 'burn-amount', 'type': 'uint128' }, {
          'name': 'burn-from',
          'type': 'principal',
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          burnAmount: TypedAbiArg<number | bigint, 'burnAmount'>,
          burnFrom: TypedAbiArg<string, 'burnFrom'>,
        ],
        Response<boolean, bigint>
      >,
      initialize: {
        'name': 'initialize',
        'access': 'public',
        'args': [
          {
            'name': 'name-to-set',
            'type': { 'string-ascii': { 'length': 32 } },
          },
          {
            'name': 'symbol-to-set',
            'type': { 'string-ascii': { 'length': 32 } },
          },
          { 'name': 'decimals-to-set', 'type': 'uint128' },
          { 'name': 'initial-owner', 'type': 'principal' },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          nameToSet: TypedAbiArg<string, 'nameToSet'>,
          symbolToSet: TypedAbiArg<string, 'symbolToSet'>,
          decimalsToSet: TypedAbiArg<number | bigint, 'decimalsToSet'>,
          initialOwner: TypedAbiArg<string, 'initialOwner'>,
        ],
        Response<boolean, bigint>
      >,
      mintTokens: {
        'name': 'mint-tokens',
        'access': 'public',
        'args': [{ 'name': 'mint-amount', 'type': 'uint128' }, {
          'name': 'mint-to',
          'type': 'principal',
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          mintAmount: TypedAbiArg<number | bigint, 'mintAmount'>,
          mintTo: TypedAbiArg<string, 'mintTo'>,
        ],
        Response<boolean, bigint>
      >,
      removePrincipalFromRole: {
        'name': 'remove-principal-from-role',
        'access': 'public',
        'args': [{ 'name': 'role-to-remove', 'type': 'uint128' }, {
          'name': 'principal-to-remove',
          'type': 'principal',
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          roleToRemove: TypedAbiArg<number | bigint, 'roleToRemove'>,
          principalToRemove: TypedAbiArg<string, 'principalToRemove'>,
        ],
        Response<boolean, bigint>
      >,
      revokeTokens: {
        'name': 'revoke-tokens',
        'access': 'public',
        'args': [{ 'name': 'revoke-amount', 'type': 'uint128' }, {
          'name': 'revoke-from',
          'type': 'principal',
        }, { 'name': 'revoke-to', 'type': 'principal' }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          revokeAmount: TypedAbiArg<number | bigint, 'revokeAmount'>,
          revokeFrom: TypedAbiArg<string, 'revokeFrom'>,
          revokeTo: TypedAbiArg<string, 'revokeTo'>,
        ],
        Response<boolean, bigint>
      >,
      setTokenUri: {
        'name': 'set-token-uri',
        'access': 'public',
        'args': [{
          'name': 'updated-uri',
          'type': { 'string-utf8': { 'length': 256 } },
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [updatedUri: TypedAbiArg<string, 'updatedUri'>],
        Response<boolean, bigint>
      >,
      transfer: {
        'name': 'transfer',
        'access': 'public',
        'args': [
          { 'name': 'amount', 'type': 'uint128' },
          { 'name': 'sender', 'type': 'principal' },
          { 'name': 'recipient', 'type': 'principal' },
          {
            'name': 'memo',
            'type': { 'optional': { 'buffer': { 'length': 34 } } },
          },
        ],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, 'amount'>,
          sender: TypedAbiArg<string, 'sender'>,
          recipient: TypedAbiArg<string, 'recipient'>,
          memo: TypedAbiArg<Uint8Array | null, 'memo'>,
        ],
        Response<boolean, bigint>
      >,
      updateBlacklisted: {
        'name': 'update-blacklisted',
        'access': 'public',
        'args': [{ 'name': 'principal-to-update', 'type': 'principal' }, {
          'name': 'set-blacklisted',
          'type': 'bool',
        }],
        'outputs': {
          'type': { 'response': { 'ok': 'bool', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          principalToUpdate: TypedAbiArg<string, 'principalToUpdate'>,
          setBlacklisted: TypedAbiArg<boolean, 'setBlacklisted'>,
        ],
        Response<boolean, bigint>
      >,
      detectTransferRestriction: {
        'name': 'detect-transfer-restriction',
        'access': 'read_only',
        'args': [{ 'name': 'amount', 'type': 'uint128' }, {
          'name': 'sender',
          'type': 'principal',
        }, { 'name': 'recipient', 'type': 'principal' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'uint128' } },
        },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, 'amount'>,
          sender: TypedAbiArg<string, 'sender'>,
          recipient: TypedAbiArg<string, 'recipient'>,
        ],
        Response<bigint, bigint>
      >,
      getBalance: {
        'name': 'get-balance',
        'access': 'read_only',
        'args': [{ 'name': 'owner', 'type': 'principal' }],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<
        [owner: TypedAbiArg<string, 'owner'>],
        Response<bigint, null>
      >,
      getDecimals: {
        'name': 'get-decimals',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        'name': 'get-name',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': {
            'response': {
              'ok': { 'string-ascii': { 'length': 32 } },
              'error': 'none',
            },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        'name': 'get-symbol',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': {
            'response': {
              'ok': { 'string-ascii': { 'length': 32 } },
              'error': 'none',
            },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        'name': 'get-token-uri',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': {
            'response': {
              'ok': { 'optional': { 'string-utf8': { 'length': 256 } } },
              'error': 'none',
            },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        'name': 'get-total-supply',
        'access': 'read_only',
        'args': [],
        'outputs': {
          'type': { 'response': { 'ok': 'uint128', 'error': 'none' } },
        },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      hasRole: {
        'name': 'has-role',
        'access': 'read_only',
        'args': [{ 'name': 'role-to-check', 'type': 'uint128' }, {
          'name': 'principal-to-check',
          'type': 'principal',
        }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [
          roleToCheck: TypedAbiArg<number | bigint, 'roleToCheck'>,
          principalToCheck: TypedAbiArg<string, 'principalToCheck'>,
        ],
        boolean
      >,
      isBlacklisted: {
        'name': 'is-blacklisted',
        'access': 'read_only',
        'args': [{ 'name': 'principal-to-check', 'type': 'principal' }],
        'outputs': { 'type': 'bool' },
      } as TypedAbiFunction<
        [principalToCheck: TypedAbiArg<string, 'principalToCheck'>],
        boolean
      >,
      messageForRestriction: {
        'name': 'message-for-restriction',
        'access': 'read_only',
        'args': [{ 'name': 'restriction-code', 'type': 'uint128' }],
        'outputs': {
          'type': {
            'response': {
              'ok': { 'string-ascii': { 'length': 70 } },
              'error': 'none',
            },
          },
        },
      } as TypedAbiFunction<
        [restrictionCode: TypedAbiArg<number | bigint, 'restrictionCode'>],
        Response<string, null>
      >,
    },
    'maps': {
      blacklist: {
        'name': 'blacklist',
        'key': { 'tuple': [{ 'name': 'account', 'type': 'principal' }] },
        'value': { 'tuple': [{ 'name': 'blacklisted', 'type': 'bool' }] },
      } as TypedAbiMap<{
        'account': string;
      }, {
        'blacklisted': boolean;
      }>,
      roles: {
        'name': 'roles',
        'key': {
          'tuple': [{ 'name': 'account', 'type': 'principal' }, {
            'name': 'role',
            'type': 'uint128',
          }],
        },
        'value': { 'tuple': [{ 'name': 'allowed', 'type': 'bool' }] },
      } as TypedAbiMap<{
        'account': string;
        'role': number | bigint;
      }, {
        'allowed': boolean;
      }>,
    },
    'variables': {
      BLACKLISTER_ROLE: {
        name: 'BLACKLISTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      BURNER_ROLE: {
        name: 'BURNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MINTER_ROLE: {
        name: 'MINTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      OWNER_ROLE: {
        name: 'OWNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      PERMISSION_DENIED_ERROR: {
        name: 'PERMISSION_DENIED_ERROR',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      RESTRICTION_BLACKLIST: {
        name: 'RESTRICTION_BLACKLIST',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      RESTRICTION_NONE: {
        name: 'RESTRICTION_NONE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      REVOKER_ROLE: {
        name: 'REVOKER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      deployerPrincipal: {
        name: 'deployer-principal',
        type: 'principal',
        access: 'variable',
      } as TypedAbiVariable<string>,
      isInitialized: {
        name: 'is-initialized',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      tokenDecimals: {
        name: 'token-decimals',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      tokenName: {
        name: 'token-name',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      tokenSymbol: {
        name: 'token-symbol',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      uri: {
        name: 'uri',
        type: {
          'string-utf8': {
            length: 256,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
    },
    constants: {
      BLACKLISTER_ROLE: 4n,
      BURNER_ROLE: 2n,
      MINTER_ROLE: 1n,
      OWNER_ROLE: 0n,
      PERMISSION_DENIED_ERROR: 403n,
      RESTRICTION_BLACKLIST: 5n,
      RESTRICTION_NONE: 0n,
      REVOKER_ROLE: 3n,
      deployerPrincipal: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
      isInitialized: false,
      tokenDecimals: 0n,
      tokenName: '',
      tokenSymbol: '',
      uri: '',
    },
    'non_fungible_tokens': [],
    'fungible_tokens': [{ 'name': 'wrapped-bitcoin' }],
    'epoch': 'Epoch20',
    'clarity_version': 'Clarity1',
    contractName: 'Wrapped-Bitcoin',
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

export const identifiers = {
  'counter': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter',
  'ftTrait': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
  'pox2': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pox2',
  'restrictedTokenTrait':
    'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
  'tester': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tester',
  'wrappedBitcoin': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
} as const;

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;
