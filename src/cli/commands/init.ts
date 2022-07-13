import { Command } from 'https://deno.land/x/cliffy@v0.24.2/command/mod.ts';
import {
  dirname,
  join,
  resolve,
} from 'https://deno.land/std@0.144.0/path/mod.ts';
import { cwdResolve, fileExists } from '../utils.ts';
import {
  CONFIG_FILE,
  configFilePath,
  defaultConfigFile,
  saveConfig,
} from '../config.ts';

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
  });
