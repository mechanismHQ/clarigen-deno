import { defaultCommand } from './default.ts';
import { initCommand } from './init.ts';
import { DenoLandProvider, UpgradeCommand } from '../../deps.ts';

const baseCommand = defaultCommand
  .command('init', initCommand)
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'cli/command/clarigen.ts',
      args: ['-qfAn'],
      provider: [
        new DenoLandProvider({ name: 'clarigen' }),
      ],
    }),
  );

if (import.meta.main) {
  await baseCommand.parse(Deno.args);
}
