import { getSession } from './session.ts';
import {
  Block,
  ClarinetChain,
  ClarinetChain as _Chain,
  ReadOnlyFn,
  TxReceipt,
} from './clarinet-deps.ts';
import { cvToValue } from './encoder.ts';
import { Account, Accounts, contractsFactory, Simnet } from './factory.ts';
import { AllContracts, ContractCallTyped } from './factory-types.ts';
import { ExpectType, tx, TxCall, txErr, txOk } from './tx.ts';
import { ClarityAbiFunction, ErrType, OkType, Response } from './types.ts';

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
  & Omit<Block, 'receipts'>
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
  if (('isOk' in value) && (typeof expectOk !== 'undefined')) {
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

type ValOf<A extends Accounts, K extends keyof A> = A[K];

type AddressesOf<
  A extends Accounts,
  Keys extends (keyof A)[],
> = {
  [K in keyof Keys]: A[Keys[K]]['address'];
};

export class AccountMap<A extends Accounts> extends Map {
  public a: A;
  constructor(accounts: A) {
    super();
    this.a = accounts;
  }

  get<K extends keyof A>(key: K): ValOf<A, K> {
    return this.a[key];
  }

  addr<K extends keyof A>(key: K): ValOf<A, K>['address'] {
    return this.a[key].address;
  }

  addresses<Keys extends (keyof A)[]>(
    ...keys: Keys
  ): AddressesOf<A, Keys> {
    const vals = keys.map((k) => this.a[k].address) as AddressesOf<
      A,
      Keys
    >;
    return vals;
  }
}

export class Chain {
  // Inner Clarinet chain instance
  public chain: _Chain;
  public deployer: string;

  constructor(chain: _Chain, accounts: Map<unknown, Account>) {
    this.chain = chain;
    this.deployer = accounts.get('deployer')!.address;
  }

  static fromSimnet<T extends AllContracts, A extends Accounts>(
    simnet: Simnet<T, A>,
  ) {
    const contracts = contractsFactory(simnet);
    const session = getSession();
    const subChain = new ClarinetChain(session.session_id);
    const accounts = new AccountMap(simnet.accounts);
    const chain = new this(subChain, accounts);
    return {
      chain,
      contracts,
      accounts,
    };
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

  rovOk<Ok, R extends Response<Ok, any>>(
    payload: Call<R>,
    sender?: string,
  ): OkType<R> {
    const receipt = this.ro(payload, sender);
    return validateResponse<OkType<R>>(receipt.result, payload.fn, true);
  }

  rovErr<Err, R extends Response<any, Err>>(
    payload: Call<R>,
    sender?: string,
  ): ErrType<R> {
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

  mine<Txs extends UnknownTx[]>(
    ...txs: Txs
  ): Readonly<Receipts<Txs>> {
    const block = this.mineBlock(...txs) as TypedBlock<Txs>;
    return block.receipts;
  }

  mineOne<T extends UnknownTx>(
    tx: T,
  ): Receipt<T> {
    const [receipt] = this.mine(tx);
    return receipt;
  }

  tx<A, R>(
    payload: ContractCallTyped<A, R>,
    sender: string,
  ): Receipt<TxCall<R>> {
    return this.mineOne(tx(payload, sender));
  }

  txOk<A, R>(
    payload: ContractCallTyped<A, R>,
    sender: string,
  ): Receipt<TxCall<R, true>> {
    return this.mineOne(txOk(payload, sender));
  }

  txErr<A, R>(
    payload: ContractCallTyped<A, R>,
    sender: string,
  ): Receipt<TxCall<R, false>> {
    return this.mineOne(txErr(payload, sender));
  }

  // sub-chain accessors

  public get sessionId() {
    return this.chain.sessionId;
  }

  public get blockHeight() {
    return this.chain.blockHeight;
  }

  mineEmptyBlock(count: number | bigint = 1) {
    return this.chain.mineEmptyBlock(Number(count));
  }

  mineEmptyBlockUntil(height: number | bigint) {
    return this.chain.mineEmptyBlockUntil(Number(height));
  }

  getAssetMaps() {
    return this.chain.getAssetsMaps();
  }
}
