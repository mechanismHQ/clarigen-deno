import { pureProxy, Contract } from '@clarigen/core';
import type { TesterContract } from './types';
import { TesterInterface } from './abi';
export type { TesterContract } from './types';

export function testerContract(contractAddress: string, contractName: string) {
  return pureProxy<TesterContract>({
    abi: TesterInterface,
    contractAddress,
    contractName,
  });
}

export const testerInfo: Contract<TesterContract> = {
  contract: testerContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/tester.clar',
  name: 'tester',
  abi: TesterInterface,
};
