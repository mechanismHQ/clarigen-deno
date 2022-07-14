import { Config, configFilePath } from './config.ts';
import { generate } from './generate.ts';
import { colors, dirname, join } from '../deps.ts';
import { log } from './logger.ts';
import { cwdRelative } from './utils.ts';

const runDelay = 3000;
let lastRun = new Date().getTime();

export function shouldRun(_event: Deno.FsEvent) {
  const isDelayed = new Date().getTime() - lastRun > runDelay;
  lastRun = new Date().getTime();
  return isDelayed;
}

export function logFsEvent(event: Deno.FsEvent) {
  const path = cwdRelative(event.paths[0]);
  const msg = `Generating files from event: ${
    colors.italic.magenta(event.kind)
  } ${colors.bold.green(path)}`;
  log.info(msg);
}

export async function watch() {
  const config = await Config.load();
  const clarinetConf = config.clarinetFile();
  const paths = [
    join(dirname(clarinetConf), 'contracts/'),
    configFilePath(),
    clarinetConf,
  ];
  log.debug('Starting watch based on paths: %j', paths.map(cwdRelative));
  const watcher = Deno.watchFs(paths);
  for await (const event of watcher) {
    if (shouldRun(event)) {
      logFsEvent(event);
      const start = new Date().getTime();
      await generate();
      const diff = new Date().getTime() - start;
      log.debug(colors.black('Done in %.3fs'), diff / 1000);
    }
  }
}
