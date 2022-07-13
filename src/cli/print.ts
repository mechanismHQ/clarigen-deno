import { getSession } from './session.ts';

function printSession() {
  const result = getSession();

  console.log(JSON.stringify(result));
}

if (import.meta.main) {
  printSession();
}
