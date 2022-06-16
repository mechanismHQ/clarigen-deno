import {
  Account,
  Block,
  Chain,
  Clarinet,
  ReadOnlyFn,
  Tx,
  TxReceipt,
  types,
} from "https://deno.land/x/clarinet@v0.28.0/index.ts";
import { cvToValue } from "./encoder.ts";
import { ContractCallTyped } from "./factory.ts";
import {
  ClarityAbiFunction,
  Response,
  ResponseErr,
  ResponseOk,
} from "./types.ts";

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export type ExpectType = true | false | undefined;

export interface TxCall<
  R,
  E extends ExpectType = undefined,
> extends Tx {
  expectOk: E;
  fn: ClarityAbiFunction;
  _r?: R;
}

export type TxCallOk<R> = TxCall<R, true>;
export type TxCallErr<R> = TxCall<R, false>;

export function tx<A, R>(
  payload: ContractCallTyped<A, R>,
  sender: string,
): TxCall<R> {
  const { args, contract, fn } = payload;
  const method = fn.name;
  const _tx = Tx.contractCall(contract, method, args, sender);
  return {
    ..._tx,
    fn,
  } as TxCall<R>;
}

export function txOk<R>(
  payload: ContractCallTyped<unknown, R>,
  sender: string,
): TxCall<R, true> {
  const _tx = tx(payload, sender);
  return {
    ..._tx,
    expectOk: true,
  } as TxCallOk<R>;
}

export function txErr<R>(
  payload: ContractCallTyped<unknown, R>,
  sender: string,
): TxCall<R, false> {
  const _tx = tx(payload, sender);
  return {
    ..._tx,
    expectOk: false,
  } as TxCallErr<R>;
}

type RoFnArgs = Parameters<Chain["callReadOnlyFn"]>;

export type TypedReadOnlyFn<R> = ReadOnlyFn & {
  value: R;
};

export function _ro<R>(
  payload: ContractCallTyped<unknown, R>,
  sender: string,
): RoFnArgs {
  const { contract, fn, args } = payload;
  return [
    contract,
    fn.name,
    args,
    sender,
  ];
}

export function ro<R>(
  chain: Chain,
  payload: ContractCallTyped<unknown, R>,
  sender: string,
): TypedReadOnlyFn<R> {
  const args = _ro(payload, sender);
  const receipt = chain.callReadOnlyFn(...args);
  const value = cvToValue(receipt.result, payload.fn.outputs.type);
  return {
    ...receipt,
    value,
  };
}

// Minings blocks

// export type TxValueType<P> = P extends TxCallOk<infer R> ? OkType<R>
//   : P extends TxCallErr<infer R> ? ErrType<R>
//   : P extends TxCall<infer R> ? R
//   : never;
export type TxValueType<P> = P extends TxCall<infer R, infer X>
  ? (X extends true ? OkType<R>
    : X extends false ? ErrType<R>
    : R)
  : never;

type TxCalls<R extends Response<unknown, unknown>> =
  (TxCall<R> | TxCallOk<R> | TxCallErr<R>)[];

export type ReceiptValues<T extends Readonly<unknown[]>> = {
  readonly [I in keyof T]: TxValueType<T[I]>;
};

type Receipt<T> = TxReceipt & {
  value: TxValueType<T>;
};

export type Receipts<T extends readonly unknown[]> = {
  -readonly [I in keyof T]: Receipt<T[I]>;
  // readonly [I in keyof T]: TxReceipt & {
  //   value: TxValueType<T[I]>;
  // };
};

export type TypedBlock<T extends readonly unknown[]> =
  & Omit<Block, "receipts">
  & {
    receipts: Readonly<Receipts<T>>;
  };

type UnknownTx = TxCall<unknown, ExpectType>;

function validateResponse<T extends UnknownTx>(
  receipt: TxReceipt,
  txCall: T,
): TxValueType<T> {
  const value = cvToValue(receipt.result, txCall.fn.outputs.type);
  if (("isOk" in value) && (typeof txCall.expectOk !== "undefined")) {
    const response = value as Response<unknown, unknown>;
    const inner = response.value;
    if (txCall.expectOk && !response.isOk) {
      throw new Error(
        `Tx result failed. Expected OK, received ERR ${inner}. Method: ${txCall.fn.name}.`,
      );
    }
    if (txCall.expectOk === false && response.isOk) {
      throw new Error(
        `Tx result failed. Expected ERR, received OK ${inner}. Method: ${txCall.fn.name}.`,
      );
    }
    return inner as TxValueType<T>;
  }
  return value as TxValueType<T>;
}

export function mineBlock<Txs extends UnknownTx[]>(
  chain: Chain,
  ...txs: Txs
): TypedBlock<Txs> {
  const block = chain.mineBlock(txs);

  const typedReceipts = block.receipts.map((r, index) => {
    const txCall = txs[index];
    const value = validateResponse(r, txCall);

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

export type Values<T extends UnknownTx[]> = {
  [K in keyof T]: TxValueType<T[K]>;
};

export function getValues<T extends UnknownTx[]>(
  chain: Chain,
  ...txs: T
): Values<T> {
  const block = chain.mineBlock(txs);
  const values = txs.map((tx, index) => {
    const value = cvToValue(block.receipts[index].result, tx.fn.outputs.type);
    return value;
  }) as Values<T>;
  return values;
}
