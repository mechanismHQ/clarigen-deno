import { Config, OutputType } from './config.ts';
import { spawn } from './spawn.ts';
import { log } from './logger.ts';

export async function denoFmt(config: Config) {
  const file = config.outputResolve(OutputType.Deno);
  if (file === null) return;

  const cmd = ['deno', 'fmt', file];
  try {
    const result = await spawn(cmd);
    if (result.status.success) {
      // console.debug('Formatted', file);
    } else {
      log.warning(`Deno fmt error: ${result.stderr}`);
    }
  } catch (error) {
    log.warning(`Deno fmt error: ${(error as Error).message}`);
  }
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
