import { transformArgsToCV } from "./encoder.ts";
import { ClarityAbiFunction, TypedAbi, TypedAbiFunction } from "./types.ts";

export interface ContractCallTyped<Args, R> {
  _r?: R;
  _a?: Args;
  contract: string;
  fn: ClarityAbiFunction;
  args: string[];
}

export type ContractFunctions = {
  [key: string]: TypedAbiFunction<unknown[], unknown>;
};

export type AllContracts = Record<string, TypedAbi>;

export type ContractCallFunction<Args extends unknown[], R> = (
  ...args: Args
) => ContractCallTyped<Args, R>;

export type FnToContractCall<T> = T extends TypedAbiFunction<infer Arg, infer R>
  ? ContractCallFunction<Arg, R>
  : never;

export type FunctionsToContractCalls<T> = T extends ContractFunctions ? {
  [key in keyof T]: FnToContractCall<T[key]>;
}
  : never;

export type ContractsToContractCalls<T> = T extends AllContracts ? {
  [key in keyof T]: FunctionsToContractCalls<T[key]["functions"]>;
}
  : never;

export type FullContract<T> = T extends TypedAbi
  ? FunctionsToContractCalls<T["functions"]> & T & { identifier: string }
  : never;

export type ContractFactory<T extends AllContracts> = {
  [key in keyof T]: FullContract<T[key]>;
};

type UnknownContractCallFunction = ContractCallFunction<unknown[], unknown>;

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
    ...functionsFactory(abi.functions, abi.contractName),
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
        ..._args: unknown[]
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