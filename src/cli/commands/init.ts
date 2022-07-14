import { resolve } from '../../deps.ts';
import { Command } from '../cli-deps.ts';
import { cwdRelative, fileExists } from '../utils.ts';
import { CONFIG_FILE, configFilePath } from '../config.ts';
import { log } from '../logger.ts';

async function getBaseFile() {
  const __dirname = new URL('.', import.meta.url).pathname;
  const path = resolve(__dirname, '../files/init-config.toml');
  const contents = await Deno.readTextFile(path);
  return contents;
}

export const initCommand = new Command()
  .description('Initialize a Clarigen config file')
  .action(async () => {
    const path = configFilePath();
    const baseFile = await getBaseFile();

    if (await fileExists(path)) {
      const overwrite = confirm(`${CONFIG_FILE} already exists. Overwrite?`);
      if (overwrite !== true) return;
    }

    await Deno.writeTextFile(path, baseFile);
    log.info(`Generated a config file at ${cwdRelative(path)}`);
  });
