import { Clarinet } from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { transformArgsToCV } from "./encoder.ts";
import { ClarityAbiFunction, TypedAbiFunction } from "./types.ts";

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

export type AllContracts = {
  [contractName: string]: {
    functions: ContractFunctions;
    contractName: string;
    [key: string]: any;
  };
};

export type ContractCallFunction<Args extends any[], R> = (
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

type UnknownContractCallFunction = ContractCallFunction<unknown[], unknown>;

export function contractsFactory<T extends AllContracts>(
  contracts: T,
): ContractsToContractCalls<T> {
  const result = {} as Record<
    keyof T,
    Record<string, UnknownContractCallFunction>
  >;
  Object.keys(contracts).forEach((contractName) => {
    result[contractName as keyof typeof contracts] = {} as Record<
      string,
      UnknownContractCallFunction
    >;
    const contract = contracts[contractName];
    Object.keys(contracts[contractName].functions).forEach((fnName) => {
      const fn = (..._args: any[]) => {
        const foundFunction = contract.functions[fnName];
        const args = transformArgsToCV(foundFunction, _args);
        return {
          contract: contract.contractName,
          fn: foundFunction,
          args,
        };
      };
      result[contractName][fnName] = fn;
    });
  });
  return result as ContractsToContractCalls<T>;
}
