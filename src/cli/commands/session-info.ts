import { Command } from '../cli-deps.ts';
import { runClarinet } from '../clarinet-wrapper.ts';
import { serialize } from '../files/base.ts';
import { log } from '../logger.ts';
import { Config } from '../config.ts';

export const sessionInfoCommand = new Command()
  .description('Log info about this project\'s Clarinet session')
  .action(async () => {
    log.debug('Starting command');
    const config = await Config.load();
    const session = await runClarinet(config);
    const fmt = serialize(session);
    log.info(`Session: ${fmt}`);
  });
