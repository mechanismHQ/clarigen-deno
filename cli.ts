import { defaultCommand } from './src/cli/commands/default.ts';
import { initCommand } from './src/cli/commands/init.ts';
import { sessionInfoCommand } from "./src/cli/commands/session-info.ts";
import { DenoLandProvider, UpgradeCommand } from './src/deps.ts';

const baseCommand = defaultCommand
  .command('init', initCommand)
  .command('session-info', sessionInfoCommand)
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
