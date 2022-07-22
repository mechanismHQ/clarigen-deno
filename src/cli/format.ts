import { Config, OutputType } from './config.ts';
import { spawn } from './spawn.ts';
import { log } from './logger.ts';

export async function runDenoFmt(files: string[]) {
  const cmd = ['deno', 'fmt', ...files];
  // log.debug(`Running \`deno fmt ${files.join(' ')}\``);
  try {
    const result = await spawn(cmd, Deno.cwd());
    if (result.status.success) {
      // console.debug('Formatted', files);
    } else {
      log.warning(`Deno fmt error: ${result.stderr}`);
    }
  } catch (error) {
    log.warning(`Deno fmt error: ${(error as Error).message}`);
  }
}

export async function denoFmt(config: Config) {
  const file = config.outputResolve(OutputType.Deno);
  if (file === null) return;
  await runDenoFmt([file]);
}

export async function afterESM(config: Config) {
  const hook = config.esm?.after;
  if (!hook) return;
  log.debug('Running esm.after script: %j', hook);

  try {
    const result = await spawn(hook);

    if (!result.status.success) {
      log.warning(`Error in ESM after hook:

ran \`${hook}\`

Exit code: ${result.status.code}

Stderr: ${result.stderr}

Stdout: ${result.stdout}
`);
    }
  } catch (error) {
    log.warning(`ESM after hook error: ${(error as Error).message}`);
  }
}
