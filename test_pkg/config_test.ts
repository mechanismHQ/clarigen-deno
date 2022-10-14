import { Config, OutputType } from '../src/cli/config.ts';
import { cwdRelative } from '../src/cli/cli-utils.ts';
import { assert, assertEquals } from '../src/deps.ts';

Deno.test({
  name: 'Testing config',
  async fn(t) {
    const config = await Config.load();

    await t.step('Resolving output files', () => {
      config.configFile.docs = { output: 'docs' };
      const output = config.outputResolve(OutputType.Docs, 'file.md')!;
      assert(output.endsWith('docs/file.md'));
      assertEquals(cwdRelative(output), 'docs/file.md');
    });
  },
});
