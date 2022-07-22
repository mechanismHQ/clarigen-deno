import { runClarinet } from '../clarinet-wrapper.ts';
import { Command } from '../cli-deps.ts';
import { Config } from '../config.ts';
import { generateDocs } from '../files/docs.ts';

export const docsCommand = new Command()
  .name('docs')
  .description('Generate markdown docs for your contracts')
  .action(async () => {
    const config = await Config.load();
    const session = await runClarinet(config);
    await generateDocs({ session, config });
  });
