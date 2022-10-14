import { getSession } from '../session.ts';
import { PRINT_LABEL } from './clarinet-wrapper.ts';

function printSession() {
  const result = getSession();

  console.log([PRINT_LABEL, JSON.stringify(result)].join(''));
}

printSession();
