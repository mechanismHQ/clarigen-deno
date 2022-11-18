import { getLevelByName, Kia } from '../../deps.ts';
import { Command } from '../cli-deps.ts';
import { VERSION } from '../version.ts';
import { log, makeSpinner } from '../logger.ts';
import { generate } from '../generate.ts';
import { watch } from '../watch.ts';

type ActionArgs = Parameters<Parameters<typeof defaultCommand['action']>[0]>;

type Options = ActionArgs[0];

export async function defaultAction(opts: Options) {
  log.debug(`Starting default command with options: %j`, opts);
  if (opts.watch) {
    let spinner: Kia | undefined;
    if (log.level > getLevelByName('DEBUG')) {
      spinner = makeSpinner('Generating types');
      spinner.start();
    }
    await generate();
    if (spinner?.isSpinning()) {
      spinner.succeed('Watching for file changes');
    }
    await watch();
  } else {
    await generate();
  }
}

export const defaultCommand = new Command()
  .globalOption('-q, --quiet [quiet]', 'Suppress any warnings')
  .globalOption('--verbose [verbose]', 'Include more diagnostic logging', {
    action: ({ verbose, quiet }) => {
      if (quiet) log.level = getLevelByName('ERROR');
      if (verbose) log.level = getLevelByName('DEBUG');
    },
    conflicts: ['quiet'],
  })
  .option('-w, --watch [watch]', 'Watch contract files and run on file changes')
  .name('clarigen')
  .description('Generate types for your Clarity contracts')
  .version(VERSION)
  .meta('deno', Deno.version.deno)
  .meta('v8', Deno.version.v8)
  .meta('typescript', Deno.version.typescript)
  .action(defaultAction);
