import { runClarinet } from '../src/cli/clarinet-wrapper.ts';
import { assert } from '../src/deps.ts';
import { Config } from '../src/cli/config.ts';

Deno.test({
  name: 'can parse session correctly',
  async fn() {
    const session = await runClarinet(await Config.load());

    const contract = session.contracts.find((c) => {
      return c.contract_id.includes('tester');
    });
    assert(typeof contract !== 'undefined');
  },
});
