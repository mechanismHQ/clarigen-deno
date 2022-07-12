import { Tx } from 'https://deno.land/x/clarinet@v0.28.0/index.ts';
import { ContractCallTyped } from './factory.ts';
import { ClarityAbiFunction } from './types.ts';

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

export type GetExpect<T> = T extends TxCall<unknown, infer E> ? E : undefined;

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
