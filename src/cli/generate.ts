import { runClarinet } from './clarinet-wrapper.ts';
import { generateDenoFile } from './files/deno.ts';
import { generateBaseFile } from './files/base.ts';
import { Config, OutputType } from './config.ts';
import { generateESMFile } from './files/esm.ts';
import { afterESM, denoFmt } from './format.ts';
import { log } from './logger.ts';

export async function generate() {
  const config = await Config.load();
  const session = await runClarinet(config);
  const singleFile = generateBaseFile(session);
  if (config.supports(OutputType.Deno)) {
    const denoFile = generateDenoFile(session, singleFile);
    await config.writeOutput(OutputType.Deno, denoFile);
    await denoFmt(config);
  }
  if (config.supports(OutputType.ESM)) {
    const esmFile = await generateESMFile({
      baseFile: singleFile,
      session,
      config,
    });
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
