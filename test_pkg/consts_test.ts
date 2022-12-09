import { simnet } from '../artifacts/clarigen/index.ts';
import { contractsFactory, hexToBytes } from '../mod.ts';
import { assertEquals } from '../src/deps.ts';

const deployed = contractsFactory(simnet);

const counter = deployed.counter.constants;
const tester = deployed.tester.constants;

Deno.test({
  name: 'constants and variables are set correctly',
  fn() {
    assertEquals(counter.counter, 1n);
    assertEquals(counter.ERR_TEST.value, 123n);
    assertEquals(counter.buffConst, hexToBytes('deadbeef'));
    assertEquals(counter.testBuff, 3735928559n);

    assertEquals(tester.ERR_UNAUTHORIZED.value, 400n);
  },
});
