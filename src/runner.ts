import { Clarinet, ClarinetChain as _Chain } from './clarinet-deps.ts';
import { Account, Accounts, contractsFactory, Simnet } from './factory.ts';
import { AllContracts } from './factory-types.ts';
import { AccountMap, Chain } from './chain.ts';

type TestFunction<A extends Accounts> = (
  chain: Chain,
  accounts: AccountMap<A>,
) => void | Promise<void>;

interface UnitTestOptions<A extends Accounts> {
  name: string;
  only?: true;
  ignore?: true;
  // beforeContractsDeployment?: BeforeHookFunction;
  fn: TestFunction<A>;
}

export function factory<T extends AllContracts, A extends Accounts>(
  simnet: Simnet<T, A>,
) {
  const transformed = contractsFactory(simnet);

  const test = (options: UnitTestOptions<A>) => {
    const { fn, ...rest } = options;
    const callback = (
      _chain: _Chain,
      accounts: Map<keyof A, Account>,
    ) => {
      const chain = new Chain(_chain, accounts);
      const accountMap = new AccountMap(simnet.accounts);
      fn(chain, accountMap);
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
