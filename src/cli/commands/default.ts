import { getLevelByName } from '../../deps.ts';
import { Command } from '../cli-deps.ts';
import { runClarinet } from '../clarinet-wrapper.ts';
import { generateDenoFile } from '../files/deno.ts';
import { generateBaseFile } from '../files/base.ts';
import { Config, OutputType } from '../config.ts';
import { generateESMFile } from '../files/esm.ts';
import { afterESM, denoFmt } from '../format.ts';
import { VERSION } from '../version.ts';
import { log } from '../logger.ts';

type ActionArgs = Parameters<Parameters<typeof defaultCommand['action']>[0]>;

type Options = ActionArgs[0];

export async function defaultAction(opts: Options) {
  log.debug(`Starting default command with options: %j`, opts);
  const [session, config] = await Promise.all([
    runClarinet(),
    Config.load(),
  ]);
  const singleFile = generateBaseFile(session);
  if (config.supports(OutputType.Deno)) {
    const denoFile = generateDenoFile(session, singleFile);
    await config.writeOutput(OutputType.Deno, denoFile);
    await denoFmt(config);
  }
  if (config.supports(OutputType.ESM)) {
    const esmFile = await generateESMFile(singleFile);
    await config.writeOutput(OutputType.ESM, esmFile);
    await afterESM(config);
  }
  if (
    !config.supports(OutputType.ESM) && !config.supports(OutputType.Deno)
  ) {
    log.warning(
      '[Clarigen] no config for ESM or Deno outputs. Not outputting any generated types.',
    );
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
  .name('clarigen')
  .description('Generate types for your Clarity contracts')
  .version(VERSION)
  .meta('deno', Deno.version.deno)
  .meta('v8', Deno.version.v8)
  .meta('typescript', Deno.version.typescript)
  .action(defaultAction);
