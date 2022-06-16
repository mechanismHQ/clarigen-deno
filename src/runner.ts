import {
  Account,
  Block,
  Chain as _Chain,
  Clarinet,
  ReadOnlyFn,
  Tx,
  TxReceipt,
  types,
} from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { cvToValue } from "./encoder.ts";
import {
  AllContracts,
  ContractCallTyped,
  contractsFactory,
} from "./factory.ts";
import { ExpectType, TxCall } from "./tx.ts";
import { ClarityAbiFunction, ErrType, OkType, Response } from "./types.ts";

type Call<R> = ContractCallTyped<unknown, R>;

export type TypedReadOnlyFn<R> = ReadOnlyFn & {
  value: R;
};

export type TxValueType<P> = P extends TxCall<infer R, infer X>
  ? (X extends true ? OkType<R>
    : X extends false ? ErrType<R>
    : R)
  : never;

export type ReceiptValues<T extends Readonly<unknown[]>> = {
  readonly [I in keyof T]: TxValueType<T[I]>;
};

type Receipt<T> = TxReceipt & {
  value: TxValueType<T>;
};

export type Receipts<T extends readonly unknown[]> = {
  -readonly [I in keyof T]: Receipt<T[I]>;
};

export type TypedBlock<T extends readonly unknown[]> =
  & Omit<Block, "receipts">
  & {
    receipts: Readonly<Receipts<T>>;
  };

type UnknownTx = TxCall<unknown, ExpectType>;

function validateResponse<T>(
  result: string,
  fn: ClarityAbiFunction,
  expectOk?: boolean,
): T {
  const value = cvToValue(result, fn.outputs.type);
  if (("isOk" in value) && (typeof expectOk !== "undefined")) {
    const response = value as Response<unknown, unknown>;
    const inner = response.value;
    if (expectOk && !response.isOk) {
      throw new Error(
        `Tx result failed. Expected OK, received ERR ${inner}. Method: ${fn.name}.`,
      );
    }
    if (expectOk === false && response.isOk) {
      throw new Error(
        `Tx result failed. Expected ERR, received OK ${inner}. Method: ${fn.name}.`,
      );
    }
    return inner as T;
  }
  return value;
}

export class Chain {
  public chain: _Chain;
  public deployer: string;

  constructor(chain: _Chain, accounts: Map<unknown, Account>) {
    this.chain = chain;
    this.deployer = accounts.get("deployer")!.address;
  }

  ro<R>(payload: Call<R>, sender?: string): TypedReadOnlyFn<R> {
    const _sender = sender || this.deployer;
    const receipt = this.chain.callReadOnlyFn(
      payload.contract,
      payload.fn.name,
      payload.args,
      _sender,
    );
    const value = cvToValue(receipt.result, payload.fn.outputs.type);
    return {
      ...receipt,
      value,
    };
  }

  rov<R>(payload: Call<R>, sender?: string): R {
    const receipt = this.ro(payload, sender);
    return receipt.value;
  }

  rovOk<R>(payload: Call<R>, sender?: string): OkType<R> {
    const receipt = this.ro(payload, sender);
    return validateResponse<OkType<R>>(receipt.result, payload.fn, true);
  }

  rovErr<R>(payload: Call<R>, sender?: string): ErrType<R> {
    const receipt = this.ro(payload, sender);
    return validateResponse<ErrType<R>>(receipt.result, payload.fn, false);
  }

  mineBlock<Txs extends UnknownTx[]>(
    ...txs: Txs
  ): TypedBlock<Txs> {
    const block = this.chain.mineBlock(txs);

    const typedReceipts = block.receipts.map((r, index) => {
      const txCall = txs[index];
      const value = validateResponse(r.result, txCall.fn, txCall.expectOk);

      return {
        ...r,
        value,
      };
    }) as Receipts<Txs>;
    return {
      ...block,
      receipts: typedReceipts,
    };
  }
}

type TestFunction<K> = (
  chain: Chain,
  accounts: Map<K, Account>,
) => void | Promise<void>;

interface UnitTestOptions<K> {
  name: string;
  only?: true;
  ignore?: true;
  // beforeContractsDeployment?: BeforeHookFunction;
  fn: TestFunction<K>;
}

export function factory<T extends AllContracts, A extends Record<string, any>>(
  { contracts }: { contracts: T; accounts: A },
) {
  const transformed = contractsFactory(contracts);

  const test = (options: UnitTestOptions<keyof A>) => {
    const { fn, ...rest } = options;
    const callback = (
      _chain: _Chain,
      accounts: Map<keyof A | "deployer", Account>,
    ) => {
      const chain = new Chain(_chain, accounts);
      fn(chain, accounts);
    };
    return Clarinet.test({
      ...rest,
      fn: callback,
    });
  };

  return {
    contracts: transformed,
    test,
  };
}
