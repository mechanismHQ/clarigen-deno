import { defaultCommand } from './default.ts';
import { initCommand } from './init.ts';

const baseCommand = defaultCommand
  .command('init', initCommand);

if (import.meta.main) {
  await baseCommand.parse(Deno.args);
}
