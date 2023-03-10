import { Command } from '../cli-deps.ts';
import { cwdRelative, fileExists } from '../cli-utils.ts';
import { CONFIG_FILE, configFilePath } from '../config.ts';
import { log } from '../logger.ts';
import { tomlInit } from '../files/init-config.ts';

export const initCommand = new Command()
  .description('Initialize a Clarigen config file')
  .action(async () => {
    const path = configFilePath();
    const baseFile = tomlInit;

    if (await fileExists(path)) {
      const overwrite = confirm(`${CONFIG_FILE} already exists. Overwrite?`);
      if (overwrite !== true) return;
    }

    await Deno.writeTextFile(path, baseFile);
    log.info(`Generated a config file at ${cwdRelative(path)}`);
  });
