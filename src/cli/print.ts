import { getSession } from '../session.ts';

export const PRINT_LABEL = 'CLARIGEN SESSION: ';

function printSession() {
  const result = getSession();

  console.log([PRINT_LABEL, JSON.stringify(result)].join(''));
}

if (import.meta.main) {
  printSession();
}
