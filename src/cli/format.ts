import { Config, OutputType } from './config.ts';
import { spawn } from './spawn.ts';

export async function denoFmt(config: Config) {
  const file = config.outputResolve(OutputType.Deno);
  if (file === null) return;

  const cmd = ['deno', 'fmt', file];
  const result = await spawn(cmd);

  if (result.status.success) {
    // console.debug('Formatted', file);
  } else {
    console.warn('[Clarigen]: Deno fmt error:', result.stderr);
  }
}

export async function afterESM(config: Config) {
  const hook = config.esm()?.after;
  if (!hook) return;

  const result = await spawn(hook);

  if (!result.status.success) {
    console.warn(`[Clarigen]: Error in 'afterESM' hook:

ran \`${hook}\`

Exit code: ${result.status.code}

Stderr: ${result.stderr}

Stdout: ${result.stdout}
`);
  }
}
