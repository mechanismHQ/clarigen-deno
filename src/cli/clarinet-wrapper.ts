import { dirname } from '../deps.ts';
import { log } from './logger.ts';
import { SessionWithVariables } from '../session.ts';
import { spawn } from './spawn.ts';
import type { Config } from './config.ts';
import { VERSION } from './version.ts';

// const SCRIPT_PATH = `https://deno.land/x/clarigen@${VERSION}/src/cli/print.ts`;
const SCRIPT_PATH =
  `https://raw.githubusercontent.com/mechanismHQ/clarigen-deno/${VERSION}/src/cli/print.ts`;

export const PRINT_LABEL = 'CLARIGEN SESSION: ';

export function parseSessionFromStdout(stdout: string) {
  const sessionLine = stdout.split('\n').find((l) => l.startsWith(PRINT_LABEL));
  if (!sessionLine) throw new Error('Could not locate session.');
  const sessionJSON = sessionLine.slice(PRINT_LABEL.length);
  const session: SessionWithVariables = JSON.parse(sessionJSON);
  return session;
}

export async function runClarinet(config: Config) {
  const cwd = dirname(config.clarinetFile());
  const cmd = [
    'clarinet',
    'run',
    SCRIPT_PATH,
    '--allow-write',
    '--allow-wallets',
  ];

  const result = await spawn(cmd, cwd);

  if (result.status.success) {
    try {
      return parseSessionFromStdout(result.stdout);
    } catch (_) {
      if (result.stderr) {
        log.error(`Error parsing session (stderr): ${result.stderr}`);
      }
      log.warning(`Error parsing session (stdout): ${result.stdout}`);
    }
  } else {
    log.error(`Error running clarinet. STDOUT: \n${result.stdout}`);
  }
  const err = result.stderr || result.stdout;

  throw new Error(`Error running \`${cmd.join(' ')}\`:\n${err}`);
}
