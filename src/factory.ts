import { transformArgsToCV } from './encoder.ts';
import {
  AllContracts,
  ContractFactory,
  ContractFunctions,
  FnToContractCall,
  FullContract,
  FunctionsToContractCalls,
} from './factory-types.ts';
import { TypedAbi } from './types.ts';

export interface Account {
  address: string;
  balance: number;
}
export type Accounts = Readonly<{
  deployer: Account;
  [name: string]: Account;
}>;

export type Simnet<C extends AllContracts, A extends Accounts> = Readonly<{
  contracts: C;
  accounts: A;
}>;

export function contractFactory<T extends TypedAbi>(
  abi: T,
  identifier: string,
) {
  const full = { ...abi } as FullContract<T>;
  full.identifier = identifier;
  return {
    ...functionsFactory(abi.functions, identifier),
    ...full,
  };
}

export function functionsFactory<T extends ContractFunctions>(
  functions: T,
  contractName: string,
): FunctionsToContractCalls<T> {
  return Object.fromEntries(
    Object.entries(functions).map(([fnName, foundFunction]) => {
      const fn: FnToContractCall<typeof foundFunction> = (
        ..._args: unknown[] | [Record<string, unknown>]
      ) => {
        const args = transformArgsToCV(foundFunction, _args);
        return {
          contract: contractName,
          fn: foundFunction,
          args,
        };
      };
      return [fnName, fn];
    }),
  ) as FunctionsToContractCalls<T>;
}

export function contractsFactory<C extends AllContracts, A extends Accounts>(
  simnet: Simnet<C, A>,
): ContractFactory<C> {
  const { accounts, contracts } = simnet;
  const deployer = accounts.deployer.address;
  return Object.fromEntries(
    Object.entries(contracts).map(([contractName, contract]) => {
      const identifier = `${deployer}.${contract.contractName}`;
      return [contractName, contractFactory(contract, identifier)];
    }),
  ) as ContractFactory<C>;
}
