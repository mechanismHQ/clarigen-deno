export async function spawn(cmd: string[] | string) {
  const _cmd = typeof cmd === 'string' ? cmd.split(' ') : cmd;
  const process = Deno.run({
    cmd: _cmd,
    stderr: 'piped',
    stdout: 'piped',
  });

  const [status, stdoutBytes, stderrBytes] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);

  const decoder = new TextDecoder();
  const stdout = decoder.decode(stdoutBytes);
  const stderr = decoder.decode(stderrBytes);

  return {
    status,
    stdout,
    stderr,
  };
}
