import { getSession } from '../src/session.ts';
import { ClarinetChain } from '../src/clarinet-deps.ts';

// Deno.bench("Mining empty blocks")
//
[10, 100, 1000].forEach((count) => {
  const session = getSession();
  const chain = new ClarinetChain(session.session_id);
  const start = new Date().getTime();
  chain.mineEmptyBlock(count);
  const diff = new Date().getTime() - start;
  console.log(count, start, diff);
  console.log(`${count} took ${(diff / 1000).toFixed(3)}s`);
});
