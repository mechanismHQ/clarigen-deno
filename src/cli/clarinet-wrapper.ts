import { dirname, resolve } from '../deps.ts';
import { log } from './logger.ts';
import { Session } from '../session.ts';
import { spawn } from './spawn.ts';
import type { Config } from './config.ts';

const SCRIPT_PATH = 'print.ts';

export const PRINT_LABEL = 'CLARIGEN SESSION: ';

export async function runClarinet(config: Config) {
  const __dirname = new URL('.', import.meta.url).pathname;
  const scriptPath = resolve(__dirname, SCRIPT_PATH);
  const cwd = dirname(config.clarinetFile());
  const cmd = [
    'clarinet',
    'run',
    scriptPath,
    '--allow-write',
    '--allow-wallets',
  ];

  const result = await spawn(cmd, cwd);

  if (result.status.success) {
    try {
      const sessionLine = result.stdout.split('\n').find((l) =>
        l.startsWith(PRINT_LABEL)
      );
      if (!sessionLine) throw new Error('Could not locate session.');
      const sessionJSON = sessionLine.slice(PRINT_LABEL.length);
      const session: Session = JSON.parse(sessionJSON);
      return session;
    } catch (_) {
      log.warning(`Error parsing session: ${result.stdout}`);
    }
  }
  const err = result.stderr || result.stdout;
  throw new Error(`Error running 'clarinet run':\n${err}`);
}
