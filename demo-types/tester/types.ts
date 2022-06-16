import { Response, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface TesterContract {
  num: (n: number | bigint) => ContractCalls.Public<bigint, null>;
  retError: (withErr: boolean) => ContractCalls.Public<boolean, bigint>;
  getTup: () => ContractCalls.ReadOnly<{
  "a": bigint;
  "b": boolean;
  "c": {
  "d": string
    }
    }>;
  square: (n: number | bigint) => ContractCalls.ReadOnly<bigint>;
}
