import { assertEquals } from '../src/deps.ts';
import { accounts, simnet } from '../artifacts/clarigen/index.ts';
import { Chain } from '../src/index.ts';
import { describe, it } from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { contracts } from './helper.ts';

// addr by compiled accounts
const _alice = accounts.wallet_1.address;
const { wrappedBitcoin } = contracts;

describe('requirement test', () => {
  const { chain: _chain } = Chain.fromSimnet(simnet);

  it('has the right identifier', () => {
    const { identifier } = wrappedBitcoin;

    assertEquals(
      identifier,
      'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
    );
  });
});
