// deno-lint-ignore-file
import {
  Account,
  Chain,
  Clarinet,
  Tx,
  types,
} from 'https://deno.land/x/clarinet@v0.28.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { accounts, contracts } from '../demo-types/single.ts';
import {
  ClarityAbiFunction,
  ContractCallTyped,
  contractsFactory,
  ErrType,
  ExpectType,
  FunctionsToContractCalls,
  OkType,
  Receipts,
  ReceiptValues,
  // ReceiptValues,
  Response,
  tx,
  TxCall,
  TxCallErr,
  TxCallOk,
  txErr,
  txOk,
  TxValueType,
} from '../src/index.ts';
import { simnet } from '../artifacts/clarigen/deno/index.ts';

const { tester } = contractsFactory(simnet);

const payload = tester.square(1);
// console.log("payload", payload);

const ok = txOk(tester.retError(false), 'asdf');
const okN = txOk(tester.num(1), '');
const errN = txErr(tester.retError(true), '');

async function boolOk(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    return resolve(true);
  });
}
async function boolNum(): Promise<number> {
  return new Promise(async (resolve, reject) => {
    return resolve(1);
  });
}
const myPromises = [boolOk(), boolNum()];
// type Pr1 = AllType<typeof myPromises>;

const results = await Promise.all([boolOk(), boolNum()]);

const payloads = [ok, okN, errN];
// type AllType<T extends readonly unknown[]> = {
//   [P in keyof T]: Awaited<T[P]>;
// };
// type Rs4 = AllType<[Promise<boolean>, Promise<string>]>;
// type Rs3 = AllType<Readonly<typeof payloads>>;
// all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
type Rs2<T extends readonly TxCall<unknown, ExpectType>[]> = {
  [K in keyof T]: TxValueType<T[K]>;
};
type P2 = Rs2<typeof payloads>;
type R1 = TxValueType<typeof ok>;
// type GetType<T> = T extends TxCallOk<infer R> ? OkType<R> : never;
type GetType<T> = T extends TxCallOk<infer R> ? OkType<R>
  : // : T extends TxCallErr<infer R> ? ErrType<R>
  // : T extends TxCall<infer R, any> ? R
  never;
type T3 = GetType<typeof ok>;
type isOk<T> = T extends TxCallOk<Response<unknown, unknown>> ? true : false;
type R3 = isOk<typeof ok>;
type GetOk<T> = T extends TxCall<infer R, any> ? OkType<R> : never;
type R4 = GetOk<typeof ok>;

type GetR<T> = T extends TxCall<infer R, any> ? R : never;

type Rs = ReceiptValues<typeof payloads>;

// type Rec1 = Receipts<typeof payloads>;
type R6 = GetR<typeof ok>;
type R7 = OkType<R6>;
type Tx2 = TxCallOk<GetR<typeof ok>>;
type VT1 = TxValueType<Tx2>;
type MyTx = TxCall<MyResp, true>;
type R2 = TxValueType<MyTx>;

type MyResp = Response<boolean, bigint>;
type MyOk = OkType<MyResp>;
type MyErr = ErrType<MyResp>;

// type C = FunctionsToContractCalls<typeof contracts['tester']['functions']>;

type AccountKeys = keyof typeof accounts;

type ArgsMap = {
  [name: string]: any;
};

// type ArgsArr = any[];
type Arg<T, N extends string> = { _t?: T; name: N };
type ArgsArr<T, N extends string> = Arg<T, N>[];

type ArgsTuple<T extends ArgsArr<unknown, string>> = {
  [K in keyof T]: T[K] extends Arg<infer A, string> ? A : never;
};

type ArgsRecordUnion<T extends Arg<unknown, string>> = T extends
  Arg<infer A, infer N> ? {
  [K in T as N]: A;
}
  : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends
  (k: infer I) => void ? I
  : never;
export type Compact<T> = { [K in keyof T]: T[K] };

type ArgsRecord<T extends ArgsArr<unknown, string>> = Compact<
  UnionToIntersection<ArgsRecordUnion<T[number]>>
>;

type ArgsType<T extends ArgsArr<unknown, string>> =
  | ArgsRecord<T>
  | ArgsTuple<T>;

type MyArgs2 = ArgsType<MyArgs>;

type MyArgs = [option: Arg<number, 'option'>, name: Arg<string, 'name'>];
type MyArgsTup = ArgsTuple<MyArgs>;
type MyArgsUnion = ArgsRecordUnion<MyArgs[number]>;
// type MyArgsRec = Compact<UnionToIntersection<MyArgsUnion>>;
type MyArgsRec = ArgsRecord<MyArgs>;

// type Args = ArgsMap | ArgsArr;
export type TypedAbiFunction<T extends any[] | [Record<string, any>], R> =
  & ClarityAbiFunction
  & {
    _t?: T;
    _r?: R;
  };

// export type ContractCallFnOpts<Args extends Record<string, unknown>> = (
//   args: Args,
// ) => ContractCallTyped<Args, R>;

export type ContractCallFunction<
  Args extends unknown[] | [Record<string, any>],
  R,
> = (
  ...args: Args
) => ContractCallTyped<Args, R>;

export type FnToContractCall<T> = T extends TypedAbiFunction<infer Arg, infer R>
  ? ContractCallFunction<Arg, R>
  : never;
